# Production Deployment Guide

## ✅ Changes Made
- **Authentication Removed**: All Clerk authentication has been removed
- **API Keys Configured**: OpenRouter, E2B, Inngest, and Database configured
- **Model Updated**: Using `x-ai/grok-4.1-fast:free` via OpenRouter
- **Code Pushed**: All changes pushed to `ajcompany14151-art/the-dev` repository

## 🔐 Environment Variables (Add to Production)

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_zFJvr3yIH7gS@ep-curly-butterfly-adfsnznz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# OpenRouter API (for AI generation)
OPENAI_API_KEY="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"
OPENAI_API_BASE="https://openrouter.ai/api/v1"
OPENAI_FREE2_MODEL="x-ai/grok-4.1-fast:free"

# E2B (for sandbox execution)
E2B_API_KEY="e2b_52f46b382273fc8e1b3a757127e53eb68f5362e9"

# Inngest (for background jobs)
INNGEST_EVENT_KEY="v66v_NIlHvpaBFYiC7zsHQimYugQxrwgSQF8wB_mCe6A6vDs1Z-kxJ-8-Q2D6xSskYyI19hQ0xmF12WBCmnycQ"
INNGEST_SIGNING_KEY="signkey-prod-a2f516a6ef31fc94e9a2283717c3dd203e1ec3578740748f799d9203cc9c2f33"
```

## 🚀 Deployment Steps

### 1. **Vercel Deployment** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. **Environment Variables**
Add all the above environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway/Render**: Add in dashboard

### 3. **Database Setup**
The Neon PostgreSQL database is already configured. If you need to update the schema:
```bash
npx prisma db push
```

### 4. **Build Command**
```bash
npm run build
```

### 5. **Start Command**
```bash
npm start
```

## 📋 Important Notes

1. **No Authentication**: Users can access the app directly without login
2. **Usage Tracking**: All users share the "anonymous" user quota (1000 points per 30 days)
3. **AI Models Available**:
   - Free: `x-ai/grok-4.1-fast:free` (default)
   - Pro models disabled (authentication removed)

4. **Database**: Using existing Neon database with current schema

## 🔧 Post-Deployment

1. Test the application at your deployment URL
2. Try creating a project with a prompt
3. Verify AI generation works
4. Check if sandboxes are created properly via E2B

## 🐛 Troubleshooting

### If AI generation fails:
- Check OpenRouter API key is valid
- Verify the model name `x-ai/grok-4.1-fast:free` is available
- Check Inngest dashboard for job status

### If sandbox preview doesn't work:
- Verify E2B API key
- Check E2B sandbox timeout settings
- Ensure proper environment variables in production

### Database connection issues:
- Verify DATABASE_URL is correct
- Check Neon database is active
- Run `npx prisma db push` if schema is outdated

## 📞 Support
Repository: https://github.com/ajcompany14151-art/the-dev
Original: https://github.com/vedantxn/nextly
