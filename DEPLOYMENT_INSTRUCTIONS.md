# Deployment Instructions - VitalScan Health (Netlify to Vercel Migration)

This project has been fully migrated from Netlify to Vercel. Follow these steps for a clean production launch.

## Step 1: Prepare the Codebase
The following cleanup and optimizations have already been performed:
- Removed `netlify.toml` and `.netlify` directory.
- Removed Netlify-specific dependencies (`@netlify/plugin-nextjs`, `netlify-cli`).
- Updated `package.json` with React 19 and Next.js 15 optimizations.
- Created an optimized `next.config.mjs`.
- Fixed hydration issues in AI Copilot.

## Step 2: Connect to Vercel
1. Push the current changes to your Git repository (GitHub/GitLab/Bitbucket).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"New Project"** and import your repository.
4. Vercel will automatically detect Next.js.

## Step 3: Configure Environment Variables
During the import process, or in **Project Settings > Environment Variables**, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

Refer to `.env.example` for the required format.

## Step 4: Update Supabase Auth
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Navigate to **Authentication > URL Configuration**.
3. Add your Vercel deployment URL (e.g., `https://vital-scan-health.vercel.app`) to the **Redirect URLs**.

## Step 5: Deploy
1. Click **Deploy** in Vercel.
2. Once the build completes, visit your production URL.
3. Test the **Camera Scan** feature (ensure you are accessing via `https://`).

## Step 6: Verify Production Stability
- Run `npm run type-check` locally to ensure zero TypeScript errors before pushing.
- Monitor the **Vercel Analytics** and **Logs** for any runtime issues.
