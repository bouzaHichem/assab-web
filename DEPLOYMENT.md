# ASSAB Website Deployment Guide

This guide will help you deploy the ASSAB website and admin panel to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Option 2: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

## 📋 Pre-deployment Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Required for production
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-strong-secret-key"
DATABASE_URL="your-production-database-url"

# Optional: Google Analytics
GA_PROPERTY_ID="your-ga-property-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="your-google-service-account-private-key"
GOOGLE_PROJECT_ID="your-google-project-id"

# Optional: Email leads
EMAIL_USER="info@assabenggroup.com"
EMAIL_PASSWORD="your-app-password"
```

### 2. Database Setup

For production, you'll need a PostgreSQL database. Update your `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

## 🌐 Deployment Instructions

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Complete ASSAB website with admin panel"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Set up Database**:
   - Use Vercel Postgres or any PostgreSQL provider
   - Run migrations: `npx prisma migrate deploy`
   - Seed database: `npx tsx scripts/seed.ts`

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Set up production database**:
   ```bash
   npx prisma migrate deploy
   npx tsx scripts/seed.ts
   npx tsx scripts/seed-timeline.ts
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

## 🔐 Admin Panel Access

After deployment:

1. **Login URL**: `https://your-domain.com/admin/login`
2. **Default Credentials**:
   - Email: `admin@assab.com`
   - Password: `admin123`
   - **⚠️ Change these immediately after first login**

## 🛠 Admin Features

- **Content Management**: Edit website content, timeline, menus
- **Services Management**: Manage company services and offerings
- **Media Management**: Upload and organize website media
- **Analytics Dashboard**: View real Google Analytics data
- **Leads Management**: Manage email leads from info@assabenggroup.com
- **User Management**: Manage admin users and permissions

## 📱 Website Features

- **Responsive Design**: Mobile-first, works on all devices
- **Multi-language Support**: English, French, Arabic (ready)
- **SEO Optimized**: Meta tags, sitemap, structured data
- **Performance**: Optimized images, lazy loading, caching
- **Accessibility**: WCAG compliant, screen reader friendly

## 🔧 Post-Deployment Configuration

### Google Analytics Setup (Optional)
1. Create Google Analytics 4 property
2. Set up service account in Google Cloud Console
3. Add credentials to environment variables

### Email Integration Setup (Optional)
1. Set up app password for info@assabenggroup.com
2. Configure IMAP settings in environment variables
3. Test email leads functionality

### Custom Domain Setup
1. Configure DNS settings
2. Update NEXTAUTH_URL environment variable
3. Set up SSL certificate (automatic on Vercel/Netlify)

## 📞 Support

For deployment issues or questions:
- Check the logs in your deployment platform
- Verify environment variables are set correctly
- Ensure database is properly migrated

## 🎉 You're Live!

Once deployed, your ASSAB website will be live with:
- ✅ Public website showcasing your company
- ✅ Complete admin panel for content management
- ✅ Real analytics and leads integration
- ✅ Professional, scalable architecture

Your website is now ready to represent ASSAB's telecommunications and energy solutions globally! 🌍