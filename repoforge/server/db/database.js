const { createClient } = require('@supabase/supabase-js');

// Supabase initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('SUPABASE_URL and SUPABASE_SERVICE_KEY are missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * DB object containing all methods mapped to Supabase
 */
const db = {
  users: {
    findById: async (id) => {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },
    findByGithubId: async (githubId) => {
      const { data, error } = await supabase.from('users').select('*').eq('github_id', githubId).single();
      if (error) return null;
      return data;
    },
    findByEmail: async (email) => {
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
      if (error) return null;
      return data;
    },
    upsert: async (userData) => {
      const { id, githubId, login, name, avatarUrl, email, accessToken, github_connected } = userData;
      
      const payload = {
        github_id: githubId,
        login,
        name,
        avatar_url: avatarUrl,
        email,
        access_token: accessToken,
        github_connected: github_connected ?? !!githubId,
        updated_at: new Date().toISOString()
      };

      if (id) payload.id = id;

      // Remove undefined values to avoid Supabase errors if columns are NOT NULL but have defaults
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const { data, error } = await supabase.from('users').upsert(payload, { 
        onConflict: id ? 'id' : 'github_id' 
      }).select().single();
      
      if (error) {
        console.error('Database Upsert Error:', error);
        throw error;
      }
      return data;
    },
    updateGithubToken: async (userId, token) => {
      const { data, error } = await supabase.from('users')
        .update({ 
          github_token: token,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)
        .select().single();
      if (error) throw error;
      return data;
    }
  },

  repos: {
    findByOwnerId: async (ownerId) => {
      const { data, error } = await supabase.from('repos')
        .select('*')
        .eq('owner_id', ownerId)
        .order('last_audit_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    findById: async (id) => {
      const { data, error } = await supabase.from('repos').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },
    findByFullName: async (fullName) => {
      const { data, error } = await supabase.from('repos').select('*').eq('full_name', fullName).single();
      if (error) return null;
      return data;
    },
    upsert: async (repoData) => {
      const { github_id, name, full_name, is_private, stack, health_score, owner_id } = repoData;
      const { data, error } = await supabase.from('repos').upsert({
        github_id,
        name,
        full_name,
        is_private: is_private ? true : false,
        stack,
        health_score,
        owner_id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'github_id' }).select().single();

      if (error) throw error;
      return data;
    },
    updateScore: async (id, score) => {
      const { data, error } = await supabase.from('repos')
        .update({ 
          health_score: score, 
          last_audit_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select().single();
      if (error) throw error;
      return data;
    }
  },

  auditRuns: {
    create: async (data) => {
      const { repoId, userId, score, issues, passedChecks, summary } = data;
      const { data: run, error } = await supabase.from('audit_runs').insert({
        repo_id: repoId,
        user_id: userId,
        score,
        issues: Array.isArray(issues) ? issues : [],
        passed_checks: Array.isArray(passedChecks) ? passedChecks : [],
        summary
      }).select().single();

      if (error) throw error;
      return run;
    },
    findLatestByRepoId: async (repoId) => {
      const { data, error } = await supabase.from('audit_runs')
        .select('*')
        .eq('repo_id', repoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) return null;
      return data;
    },
    findByRepoId: async (repoId, limit = 10) => {
      const { data, error } = await supabase.from('audit_runs')
        .select('*')
        .eq('repo_id', repoId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    findAllByUserId: async (userId, limit = 50) => {
      const { data, error } = await supabase.from('audit_runs')
        .select(`
          *,
          repo:repos(name, full_name, stack)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    }
  },

  presets: {
    findByOwnerId: async (ownerId) => {
      const { data, error } = await supabase.from('presets')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    findById: async (id) => {
      const { data, error } = await supabase.from('presets').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },
    create: async (data) => {
      const { name, orgName, ownerId, config } = data;
      const { data: preset, error } = await supabase.from('presets').insert({
        name,
        org_name: orgName,
        owner_id: ownerId,
        config: typeof config === 'string' ? JSON.parse(config) : config
      }).select().single();

      if (error) throw error;
      return preset;
    },
    update: async (id, data) => {
      const { name, config } = data;
      const { data: preset, error } = await supabase.from('presets')
        .update({ 
          name, 
          config: typeof config === 'string' ? JSON.parse(config) : config,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select().single();
      if (error) throw error;
      return preset;
    },
    delete: async (id) => {
      const { error } = await supabase.from('presets').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    },
    incrementApplied: async (id) => {
      const { data: current } = await supabase.from('presets').select('applied_count').eq('id', id).single();
      const { data, error } = await supabase.from('presets')
        .update({ applied_count: (current?.applied_count || 0) + 1 })
        .eq('id', id)
        .select().single();
      if (error) throw error;
      return data;
    }
  }
};

module.exports = db;
