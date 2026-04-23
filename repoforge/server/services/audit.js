// audit.js — deterministic GitHub health scoring, no AI dependency

async function runAudit(repoData, gh) {
  // ── 1. Gather GitHub data ─────────────────────────────────────────────────

  let has_readme = false;
  let readme_words = 0;
  let readme_preview = '';
  const contents = await gh.listRootFiles(repoData.owner, repoData.repo);
  const rootFilesLower = contents.map(f => f.toLowerCase());

  const readmeName = contents.find(f => f.toLowerCase() === 'readme.md');
  if (readmeName) {
    const readmeContent = await gh.getFileContent(repoData.owner, repoData.repo, readmeName);
    if (readmeContent) {
      readme_words = readmeContent.split(/\s+/).filter(Boolean).length;
      has_readme = readme_words > 100;
      readme_preview = readmeContent.substring(0, 80).replace(/\n/g, ' ');
    }
  }

  const workflows = await gh.listWorkflows(repoData.owner, repoData.repo);
  const has_cicd = workflows.length > 0;
  const workflow_names = workflows.join(', ') || 'none';

  let branch_protection = false;
  let protection_rules = 'none';
  try {
    const protection = await gh.getBranchProtection(repoData.owner, repoData.repo, 'main');
    if (protection) {
      branch_protection = true;
      protection_rules = JSON.stringify({
        reviews: !!protection.required_pull_request_reviews,
        status_checks: !!protection.required_status_checks
      });
    }
  } catch (e) { /* 404 = no protection */ }

  const details = await gh.getRepoDetails(repoData.owner, repoData.repo);
  const has_license = !!(details.license && details.license.key !== 'other');
  const license_type = details.license ? details.license.name : 'None';
  const has_description = !!details.description;
  const description = details.description || '';
  const topics = (details.topics || []);
  const has_topics = topics.length >= 2;
  const topics_list = topics.join(', ') || 'none';
  const last_pushed = details.pushed_at || details.updated_at;
  const stars = details.stargazers_count || 0;
  const forks = details.forks_count || 0;
  const open_issues = details.open_issues_count || 0;
  const is_fork = !!details.fork;
  const visibility = details.private ? 'private' : 'public';

  const has_contributing = rootFilesLower.includes('contributing.md');
  const has_security = rootFilesLower.includes('security.md');

  let issue_templates = [];
  let has_pr_template = false;
  try {
    const githubDir = await gh._request(`/repos/${repoData.owner}/${repoData.repo}/contents/.github`);
    if (githubDir && Array.isArray(githubDir)) {
      has_pr_template = githubDir.some(f => f.name.toLowerCase() === 'pull_request_template.md');
      const issueDir = githubDir.find(f => f.name === 'ISSUE_TEMPLATE');
      if (issueDir && issueDir.type === 'dir') {
        const iTiles = await gh._request(`/repos/${repoData.owner}/${repoData.repo}/contents/.github/ISSUE_TEMPLATE`);
        issue_templates = iTiles.map(f => f.name);
      }
    }
  } catch (e) { /* no .github dir */ }
  const has_issue_templates = issue_templates.length > 0;

  // ── 2. Build scored checks ────────────────────────────────────────────────

  const checks = [
    {
      name: "README",
      category: "Documentation",
      icon: "📄",
      passed: has_readme,
      points_earned: has_readme ? 10 : 0,
      points_possible: 10,
      status: has_readme ? "passed" : (rootFilesLower.includes('readme.md') ? "warning" : "failed"),
      insight: has_readme
        ? `README found with ${readme_words} words — good baseline documentation.`
        : rootFilesLower.includes('readme.md')
          ? `README exists but has only ${readme_words} words — too short to be useful. Visitors will have no idea how to use this project.`
          : "No README means contributors and users have zero context about what this project does or how to use it.",
      fix: has_readme ? null : "Create README.md with project description, installation steps, usage examples, and contributing guidelines."
    },
    {
      name: "CI/CD Pipeline",
      category: "Automation",
      icon: "⚙️",
      passed: has_cicd,
      points_earned: has_cicd ? 20 : 0,
      points_possible: 20,
      status: has_cicd ? "passed" : "failed",
      insight: has_cicd
        ? `Automated workflows active: ${workflow_names}`
        : "No automated testing means every merge is a gamble — bugs reach production undetected.",
      fix: has_cicd ? null : "Add a GitHub Actions workflow in .github/workflows/ci.yml to run tests and linting on every push."
    },
    {
      name: "Branch Protection",
      category: "Security",
      icon: "🛡️",
      passed: branch_protection,
      points_earned: branch_protection ? 15 : 0,
      points_possible: 15,
      status: branch_protection ? "passed" : "failed",
      insight: branch_protection
        ? `Branch protection active: ${protection_rules}`
        : "Anyone with write access can push directly to main, bypassing code review entirely.",
      fix: branch_protection ? null : "Enable branch protection on main: require at least 1 PR review and passing status checks before merging."
    },
    {
      name: "License",
      category: "Legal",
      icon: "⚖️",
      passed: has_license,
      points_earned: has_license ? 10 : 0,
      points_possible: 10,
      status: has_license ? "passed" : "failed",
      insight: has_license
        ? `Licensed under ${license_type}.`
        : "Without a license, this code is legally unusable by anyone — all rights reserved by default under copyright law.",
      fix: has_license ? null : "Add a LICENSE file. For open-source use MIT or Apache 2.0. For proprietary use, consult legal."
    },
    {
      name: "Issue Templates",
      category: "Collaboration",
      icon: "🐛",
      passed: has_issue_templates,
      points_earned: has_issue_templates ? 10 : 0,
      points_possible: 10,
      status: has_issue_templates ? "passed" : "warning",
      insight: has_issue_templates
        ? `${issue_templates.length} issue template(s) configured.`
        : "Without issue templates, bug reports are inconsistent and missing critical details, slowing down resolution.",
      fix: has_issue_templates ? null : "Create .github/ISSUE_TEMPLATE/bug_report.yml and feature_request.yml to standardize incoming issues."
    },
    {
      name: "PR Template",
      category: "Collaboration",
      icon: "🔀",
      passed: has_pr_template,
      points_earned: has_pr_template ? 10 : 0,
      points_possible: 10,
      status: has_pr_template ? "passed" : "warning",
      insight: has_pr_template
        ? "Pull request template is in place."
        : "No PR template means reviewers lack context on what changed, why it changed, and how to test it.",
      fix: has_pr_template ? null : "Create .github/pull_request_template.md with sections: Summary, Changes, Testing, Screenshots."
    },
    {
      name: "Description",
      category: "Discoverability",
      icon: "🏷️",
      passed: has_description,
      points_earned: has_description ? 5 : 0,
      points_possible: 5,
      status: has_description ? "passed" : "warning",
      insight: has_description
        ? `Description: "${description.substring(0, 80)}${description.length > 80 ? '…' : ''}"`
        : "Missing description makes this repo invisible in GitHub search and gives visitors zero first impression.",
      fix: has_description ? null : "Add a short one-line description in GitHub repo Settings > About."
    },
    {
      name: "Topics & Tags",
      category: "Discoverability",
      icon: "🔖",
      passed: has_topics,
      points_earned: has_topics ? 5 : 0,
      points_possible: 5,
      status: has_topics ? "passed" : "warning",
      insight: has_topics
        ? `Topics: ${topics_list}`
        : "No topics means this repo does not appear in any GitHub topic searches, killing organic discovery.",
      fix: has_topics ? null : "Add at least 2 relevant topics in GitHub repo Settings > Topics (e.g. language, framework, purpose)."
    },
    {
      name: "CONTRIBUTING.md",
      category: "Community",
      icon: "🤝",
      passed: has_contributing,
      points_earned: has_contributing ? 10 : 0,
      points_possible: 10,
      status: has_contributing ? "passed" : "warning",
      insight: has_contributing
        ? "Contributing guidelines are present."
        : "Without contribution guidelines, new contributors do not know where to start, how to submit PRs, or what the code standards are.",
      fix: has_contributing ? null : "Create CONTRIBUTING.md with setup instructions, coding standards, PR process, and how to report bugs."
    },
    {
      name: "SECURITY.md",
      category: "Security",
      icon: "🔒",
      passed: has_security,
      points_earned: has_security ? 5 : 0,
      points_possible: 5,
      status: has_security ? "passed" : "warning",
      insight: has_security
        ? "Security policy is documented."
        : "No security policy means researchers who find vulnerabilities have no responsible disclosure channel.",
      fix: has_security ? null : "Create SECURITY.md with a supported versions table and instructions on how to report a vulnerability privately."
    }
  ];

  // ── 3. Calculate score & grade ────────────────────────────────────────────

  const score = checks.reduce((acc, c) => acc + c.points_earned, 0);
  let grade, grade_label;
  if (score >= 90)      { grade = 'A'; grade_label = 'Excellent'; }
  else if (score >= 75) { grade = 'B'; grade_label = 'Good'; }
  else if (score >= 50) { grade = 'C'; grade_label = 'Fair'; }
  else if (score >= 25) { grade = 'D'; grade_label = 'Poor'; }
  else                  { grade = 'F'; grade_label = 'Critical'; }

  // ── 4. Rich narrative fields ──────────────────────────────────────────────

  const failedChecks = checks.filter(c => !c.passed);
  const passedCount  = checks.filter(c => c.passed).length;

  const hero_lines = {
    A: `${repoData.name} is production-grade — a model repo others should benchmark against.`,
    B: `Solid structure but a few gaps could bite hard if left unaddressed.`,
    C: `Workable, but this repo has visible cracks that erode trust and velocity.`,
    D: `High-risk codebase — missing safeguards that most teams take for granted.`,
    F: `This repo is flying blind — no CI, no protection, no safety net.`
  };

  const score_contexts = {
    A: `Scores in the top 5% of all public repositories audited by RepoForge.`,
    B: `Better than ~70% of public repos — strong but not quite gold standard.`,
    C: `Average. Most hobby projects land here. A few targeted fixes move you up fast.`,
    D: `Below average. Only ~20% of repos score lower — time to act.`,
    F: `Bottom 10%. Serious gaps that block collaboration and invite security risk.`
  };

  const badge_texts = {
    A: 'Production Ready',
    B: 'Almost There',
    C: 'Needs Attention',
    D: 'High Risk',
    F: 'Critical Gaps'
  };

  const badge_colors = {
    A: 'green', B: 'yellow', C: 'orange', D: 'orange', F: 'red'
  };

  // Top 3 priorities — highest-impact failed checks first
  const sortedFailed = [...failedChecks].sort((a, b) => b.points_possible - a.points_possible);
  const top_priorities = sortedFailed.slice(0, 3).map((c, i) => ({
    rank: i + 1,
    action: c.fix,
    impact: `+${c.points_possible} points`,
    effort: c.points_possible >= 15 ? 'Medium' : c.points_possible >= 10 ? 'Low' : 'Low'
  }));

  const quick_win = sortedFailed
    .filter(c => c.points_possible <= 5)
    .map(c => c.fix)[0]
    || (sortedFailed[0] ? sortedFailed[0].fix : 'All checks passed!');

  const biggest_risk_check = failedChecks.find(c => c.category === 'Security')
    || failedChecks.find(c => c.category === 'Automation')
    || sortedFailed[0];

  const biggest_risk = biggest_risk_check
    ? `${biggest_risk_check.name}: ${biggest_risk_check.insight}`
    : 'No critical risks detected.';

  // Category scores
  const categoryScores = {};
  for (const c of checks) {
    if (!categoryScores[c.category]) categoryScores[c.category] = 0;
    categoryScores[c.category] += c.points_earned;
  }

  // Issues list for DB (failed + warning checks)
  const issues = failedChecks.map(c => ({
    id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...c
  }));

  // Passed checks for UI
  const passed = checks
    .filter(c => c.passed)
    .map(c => ({ id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), ...c }));

  return {
    // Summary fields
    score,
    grade,
    grade_label,
    summary: `${repoData.name} scored ${score}/100 (Grade ${grade}). ${passedCount}/${checks.length} checks passed.`,
    hero_line: hero_lines[grade],
    score_context: score_contexts[grade],
    badge_text: badge_texts[grade],
    badge_color: badge_colors[grade],
    quick_win,
    biggest_risk,
    // Structured data
    checks,
    issues,
    passed,
    passedChecks: passedCount,
    top_priorities,
    category_scores: categoryScores,
    // Repo metadata
    repo: repoData.fullName || `${repoData.owner}/${repoData.repo}`,
    stars,
    forks,
    open_issues,
    last_pushed,
    visibility
  };
}

module.exports = { runAudit };
