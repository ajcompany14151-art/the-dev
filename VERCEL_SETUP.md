# Vercel Environment Variables Setup

⚠️ **IMPORTANT**: Add these environment variables to your Vercel project settings:

## How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard: https://vercel.com/
2. Navigate to: **Settings** → **Environment Variables**
3. Add each variable below (use for **Production**, **Preview**, and **Development**)

## Required Environment Variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_zFJvr3yIH7gS@ep-curly-butterfly-adfsnznz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

OPENAI_API_KEY=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

OPENAI_API_BASE=https://openrouter.ai/api/v1

OPENAI_FREE2_MODEL=x-ai/grok-4.1-fast:free

E2B_API_KEY=e2b_52f46b382273fc8e1b3a757127e53eb68f5362e9

INNGEST_EVENT_KEY=v66v_NIlHvpaBFYiC7zsHQimYugQxrwgSQF8wB_mCe6A6vDs1Z-kxJ-8-Q2D6xSskYyI19hQ0xmF12WBCmnycQ

INNGEST_SIGNING_KEY=signkey-prod-a2f516a6ef31fc94e9a2283717c3dd203e1ec3578740748f799d9203cc9c2f33
```

## After Adding Variables:

1. **Redeploy** your application from Vercel dashboard
2. OR trigger a new deployment by pushing to your repository

## Verify Database Schema:

The database has been reset and synced with the correct schema. If you need to verify:

```bash
npx prisma db push
```

## Testing the Deployment:

After redeployment, the following endpoints should work:
- ✅ Homepage: `/`
- ✅ Projects list: API calls to `/api/trpc/projects.getMany`
- ✅ Create project: API calls to `/api/trpc/projects.create`
- ✅ AI generation: Background jobs via Inngest

## Common Issues:

### 500 Error on API calls
- **Cause**: Environment variables not set in Vercel
- **Fix**: Add all variables above and redeploy

### Database Connection Error
- **Cause**: DATABASE_URL not set or incorrect
- **Fix**: Verify the DATABASE_URL in Vercel matches exactly

### AI Generation Not Working
- **Cause**: Missing OPENAI_API_KEY or Inngest keys
- **Fix**: Verify all API keys are set correctly in Vercel

## Current Status:
- ✅ Code deployed successfully
- ✅ Build completed without errors
- ✅ Database schema synced
- ⚠️ **Action Required**: Add environment variables in Vercel

Once environment variables are added, everything should work perfectly! 🚀
