const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../.env' }); // Adjust path as needed

const supabaseUrl = 'https://bhmudmvmhvzcybsqbqbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJobXVkbXZtaHZ6Y3lic3FicWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MzAwOSwiZXhwIjoyMDkyMDE5MDA5fQ.ozxzfu3KlU2hg86ZjHswjPTmS0LAHERgU06SixXgZU0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@repoforge.io',
    password: 'password123',
    email_confirm: true,
    user_metadata: { full_name: 'RepoForge Admin' }
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully:', data.user.email);
  }
}

createUser();
