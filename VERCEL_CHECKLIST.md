# Vercel Deployment Checklist - VitalScan Health

This checklist ensures a clean and optimized production deployment on the Vercel platform.

## 1. Environment Variables (Critical)
Ensure the following variables are set in the Vercel Project Settings:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
- [ ] `OPENAI_API_KEY`: Your OpenAI API key for the AI Copilot.

## 2. Supabase Configuration
- [ ] **Auth Redirects**: Ensure `https://<your-vercel-domain>.vercel.app` is added to the "Redirect URLs" in your Supabase Auth settings.
- [ ] **RLS Policies**: Verify that Row Level Security is enabled and correctly configured for all tables in `supabase/schema.sql`.

## 3. Camera & Security
- [ ] **HTTPS**: Vercel handles this automatically. Ensure no logic forces `http`.
- [ ] **Permissions**: The `useCamera` hook is already optimized for secure contexts.

## 4. Build Settings
- [ ] **Framework Preset**: Next.js (Automatic).
- [ ] **Build Command**: `npm run build`.
- [ ] **Output Directory**: `.next` (Default).
- [ ] **Install Command**: `npm install`.

## 5. Performance Optimization
- [ ] **Image Optimization**: `next.config.mjs` is configured to allow Supabase storage domains.
- [ ] **Edge Runtime**: API routes (like `/api/chat`) are configured for the Edge runtime for lower latency.
- [ ] **Hydration**: Hydration mismatches in `CopilotPage` and `BackgroundEffects` have been resolved.

## 6. Post-Deployment Verification
- [ ] Test the camera scan on a mobile device (requires HTTPS).
- [ ] Verify AI Copilot chat functionality.
- [ ] Check Supabase data persistence after a successful scan.
