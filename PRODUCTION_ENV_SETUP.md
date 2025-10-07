# Production Environment Variables Setup

## Required Environment Variables for Vercel Deployment

### 1. Database (PostgreSQL)
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```
**Action Required:** Set up a PostgreSQL database on:
- [Neon](https://neon.tech) (Recommended - free tier available)
- [Supabase](https://supabase.com) (Free tier available)  
- [PlanetScale](https://planetscale.com)
- [Railway](https://railway.app)

### 2. NextAuth Configuration
```bash
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="your-32-character-secret-here"
```
**Action Required:** 
- Replace `your-vercel-domain` with your actual Vercel domain
- Generate a secret: `openssl rand -base64 32`

### 3. Google Analytics API
```bash
GOOGLE_ANALYTICS_PROPERTY_ID="your-ga4-property-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
GOOGLE_PROJECT_ID="your-google-cloud-project-id"
```
**Action Required:** Follow the Google Analytics setup in `REAL_DATA_SETUP.md`

### 4. Email Integration
```bash
IMAP_HOST="imap.gmail.com"
IMAP_PORT="993"
IMAP_USER="info@assabenggroup.com"
IMAP_PASSWORD="your-app-password"
IMAP_SECURE="true"
```
**Action Required:** Set up App Password for the email account

## Deployment Checklist

### Before Deployment:
- [ ] Database is created and accessible
- [ ] All environment variables are ready
- [ ] Google Analytics API is configured
- [ ] Email app password is generated

### After Deployment:
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Seed initial data: `npm run seed`
- [ ] Test admin login at: `https://your-domain.vercel.app/admin`
- [ ] Verify Analytics page loads real data
- [ ] Verify Leads page fetches email data

## Quick Setup Commands

After deployment, run these in Vercel Functions (or locally pointing to production DB):

```bash
# Deploy migrations
npx prisma migrate deploy

# Seed initial data
npm run seed

# Generate Prisma client (if needed)
npx prisma generate
```

## Production Domain

Once deployed, your admin panel will be available at:
- **Main Site:** `https://your-domain.vercel.app`
- **Admin Panel:** `https://your-domain.vercel.app/admin`
- **Admin Login:** admin@assab.com / your-password

## Custom Domain (Optional)

To use a custom domain:
1. Go to Vercel Project Settings > Domains
2. Add your domain (e.g., `www.assabenggroup.com`)
3. Configure DNS as instructed by Vercel
4. Update `NEXTAUTH_URL` to your custom domain