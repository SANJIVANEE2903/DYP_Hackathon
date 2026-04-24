// One-time script to create admin user in Supabase Auth
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createAdmin() {
  const email = 'admin@repoforge.io';
  const password = 'Admin@1234';

  // Create user in Supabase Auth (service role can skip email confirmation)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the email
    user_metadata: { full_name: 'RepoForge Admin' }
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('User already exists! Updating password...');
      // Find existing user and update
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find(u => u.email === email);
      if (existing) {
        const { error: updateErr } = await supabase.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true
        });
        if (updateErr) {
          console.error('Failed to update:', updateErr.message);
        } else {
          console.log('\n✅ Password updated successfully!');
          console.log(`   Email:    ${email}`);
          console.log(`   Password: ${password}`);
        }
      }
    } else {
      console.error('Error:', error.message);
    }
  } else {
    console.log('\n✅ Admin user created successfully!');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   User ID:  ${data.user.id}`);

    // Also create in our users table
    const { error: dbError } = await supabase.from('users').upsert({
      id: data.user.id,
      email,
      name: 'RepoForge Admin',
      github_connected: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (dbError) {
      console.log('   Note: Could not add to users table:', dbError.message);
    } else {
      console.log('   Added to users table ✓');
    }
  }

  process.exit(0);
}

createAdmin();
