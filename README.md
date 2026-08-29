# HYPEX Control Center

This rebuild turns the HYPEX landing page into a database-backed website with an Admin Panel.

## What you can control
Hero, About, Vision, Mission, values, live statistics, tokenomics, ecosystem cards, roadmap, Telegram, X, contract address and footer.

## Setup
1. Create a free Supabase project.
2. Open Supabase SQL Editor and run `schema.sql`.
3. In Supabase Authentication, create your admin user with email/password.
4. Open `config.js` and paste your Supabase Project URL and anon/public key.
5. Deploy this folder to Netlify.
6. Open `/admin.html` to sign in and manage the site.

Security note: the anon key is designed to be public. The database policies only allow authenticated users to update content. For a production project, restrict admin access further by checking a specific admin role/email in a database policy.
