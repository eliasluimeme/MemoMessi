const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
    const targetEmail = 'eliasakry@gmail.com';

    // 1. Find user by email
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
    if (fetchError) throw fetchError;

    const user = users.find(u => u.email === targetEmail);
    if (!user) {
        console.error('User not found:', targetEmail);
        return;
    }

    console.log('Updating user metadata for:', targetEmail, user.id);

    // 2. Update user metadata
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, role: 'ADMIN' } }
    );

    if (updateError) throw updateError;

    console.log('User metadata updated successfully!');
}

main().catch(console.error);
