import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    const user = session?.user;

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoId } = body;

    if (!repoId) {
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
    }

    // 1. Get the repository details
    const { data: repoData, error: repoError } = await supabase
      .from('repositories')
      .select('name, org')
      .eq('id', repoId)
      .single();

    if (repoError || !repoData) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    const repoFullName = `${repoData.org}/${repoData.name}`;

    // 2. Securely fetch the GitHub token
    let githubToken = session?.provider_token;

    if (!githubToken) {
      const { data: presetData } = await supabase
        .from('presets')
        .select('settings')
        .eq('user_id', user.id)
        .eq('name', 'github_token')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (presetData?.settings?.token) {
        githubToken = presetData.settings.token;
      }
    }

    if (!githubToken) {
      return NextResponse.json({ 
        error: 'GitHub token not found. Please log in with GitHub again or configure a PAT in the Settings page.' 
      }, { status: 400 });
    }

    // 3. Perform real GitHub Health Checks
    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoForge-Audit'
    };

    const issues = [];
    const passedChecks = [];
    let score = 100;

    // 3a. Fetch basic repo details
    const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers });
    
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return NextResponse.json({ error: 'Repository not found on GitHub or token lacks access.' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch repository from GitHub.' }, { status: 500 });
    }

    const ghRepo = await repoRes.json();

    if (ghRepo.has_issues) {
      passedChecks.push('Issue tracking enabled');
    } else {
      score -= 10;
      issues.push({
        id: 'issues_disabled',
        title: 'Issue tracking disabled',
        description: 'Enabling issues allows the community to report bugs and suggest features.',
        severity: 'medium',
        fixable: false,
      });
    }

    if (ghRepo.license) {
      passedChecks.push(`License: ${ghRepo.license.name}`);
    } else {
      score -= 20;
      issues.push({
        id: 'no_license',
        title: 'Missing License',
        description: 'A repository without a license restricts how people can use your code.',
        severity: 'high',
        fixable: true,
      });
    }

    if (ghRepo.description) {
      passedChecks.push('Repository has a description');
    } else {
      score -= 10;
      issues.push({
        id: 'no_description',
        title: 'Missing Description',
        description: 'A good description helps people understand your project at a glance.',
        severity: 'low',
        fixable: false,
      });
    }

    // 3b. Check for README.md
    const readmeRes = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, { headers });
    if (readmeRes.ok) {
      passedChecks.push('README.md exists');
    } else {
      score -= 20;
      issues.push({
        id: 'no_readme',
        title: 'Missing README.md',
        description: 'Every repository should have a README explaining how to use it.',
        severity: 'high',
        fixable: true,
      });
    }

    // 3c. Check for SECURITY.md
    const secRes = await fetch(`https://api.github.com/repos/${repoFullName}/contents/SECURITY.md`, { headers });
    if (secRes.ok) {
      passedChecks.push('SECURITY.md exists');
    } else {
      score -= 15;
      issues.push({
        id: 'no_security',
        title: 'No SECURITY.md',
        description: 'Missing a security disclosure policy.',
        severity: 'medium',
        fixable: true,
      });
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));
    
    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    const auditResult = {
      score,
      grade,
      summary: `Completed GitHub API health analysis on ${repoFullName}. Found ${issues.length} issues.`,
      issues,
      passedChecks,
    };

    // 4. Save to Database
    const { data: insertedRun, error: insertError } = await supabase
      .from('audit_runs')
      .insert({
        repo_id: repoId,
        score,
        results: auditResult,
        status: 'completed',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save audit run', insertError);
      return NextResponse.json({ error: 'Failed to save audit results' }, { status: 500 });
    }

    // Update repository overall score
    await supabase
      .from('repositories')
      .update({ score, updated_at: new Date().toISOString() })
      .eq('id', repoId);

    return NextResponse.json({ results: auditResult });

  } catch (err: any) {
    console.error('Audit API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
