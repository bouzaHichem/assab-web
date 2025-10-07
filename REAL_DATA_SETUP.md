# Real Data Integration Setup Guide

This guide will help you configure real Google Analytics data and email leads from `info@assabenggroup.com` in your admin dashboard.

## 🚀 Overview

The system now supports:
- **Real Google Analytics data** instead of mock data
- **Email leads from `info@assabenggroup.com`** instead of mock leads
- **Database persistence** for leads management
- **Automatic email parsing** with intelligent categorization

## 📊 Google Analytics Setup

### 1. Create Google Analytics Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **Google Analytics Reporting API**
4. Go to **IAM & Admin > Service Accounts**
5. Click **Create Service Account**
6. Give it a name like "Analytics Service Account"
7. Click **Create and Continue**
8. Skip role assignment for now, click **Continue**
9. Click **Create Key** → **JSON**
10. Download the JSON file

### 2. Configure Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Admin > Property > Property Access Management**
4. Click **+** to add the service account email
5. Give it **Viewer** permissions
6. Note your **Property ID** (format: 123456789)

### 3. Update Environment Variables

Add these to your `.env` file:

```bash
# Google Analytics
GA_PROPERTY_ID="YOUR_PROPERTY_ID"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project-id.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
GOOGLE_PROJECT_ID="your-project-id"
```

**Important**: Replace `\n` with actual line breaks in the private key, or escape them as `\\n`.

## 📧 Email Integration Setup

### 1. Email Account Configuration

For Gmail/Google Workspace accounts:

1. Enable **2-Factor Authentication** on the email account
2. Generate an **App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail", Device: "Other"
   - Copy the generated 16-character password

### 2. Update Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration for Leads
EMAIL_HOST="imap.gmail.com"
EMAIL_PORT="993"
EMAIL_USER="info@assabenggroup.com"
EMAIL_PASSWORD="YOUR_16_CHARACTER_APP_PASSWORD"
EMAIL_SECURE="true"
```

### 3. For Other Email Providers

**Microsoft Exchange/Outlook:**
```bash
EMAIL_HOST="outlook.office365.com"
EMAIL_PORT="993"
```

**cPanel/Generic IMAP:**
```bash
EMAIL_HOST="mail.yourhost.com"
EMAIL_PORT="993"
```

## 🗄️ Database Setup

The database schema has been updated to support email leads. Run the migration:

```bash
npx prisma migrate deploy
```

## 🔧 Features

### Analytics Dashboard
- **Real traffic data** from Google Analytics
- **Device breakdown** (Desktop, Mobile, Tablet)
- **Traffic sources** (Direct, Google Search, Social Media, etc.)
- **Top pages** with view counts
- **Geographic data** showing visitor countries
- **Performance insights** and recommendations

### Leads Management
- **Automatic email parsing** from info@assabenggroup.com
- **Intelligent categorization**:
  - **Priority**: Detected from keywords (urgent, ASAP, large project, etc.)
  - **Source**: Website forms, direct email, referrals
  - **Tags**: Automatically assigned based on content (telecom, energy, quote, etc.)
- **Lead lifecycle** management (New → Contacted → Qualified → Converted → Closed)
- **Notes and follow-ups** with timestamps
- **Database persistence** for reliable data storage

## 📋 Email Lead Processing

The system automatically:

1. **Connects to your email** via IMAP
2. **Scans recent emails** (last 30 days)
3. **Filters out system emails** (newsletters, notifications, etc.)
4. **Extracts structured data**:
   - Sender name and email
   - Company information (if mentioned)
   - Phone numbers
   - Subject and message content
5. **Categorizes leads** based on content analysis
6. **Stores in database** for persistent management
7. **Syncs with admin interface** for real-time viewing

## 🛡️ Security Considerations

- **App passwords** are safer than main account passwords
- **Service account keys** should be kept secure
- **Environment variables** are not committed to version control
- **Database** stores processed data securely
- **API endpoints** are protected by authentication

## 🚦 Testing

1. **Analytics**: Visit `/admin/analytics` to see real data
2. **Leads**: Visit `/admin/leads` to see email leads
3. **Check logs** in the browser console for any errors
4. **Verify data** is updating correctly

## 🔍 Troubleshooting

### Google Analytics Issues
- **"No data"**: Check if GA_PROPERTY_ID is correct
- **"Unauthorized"**: Verify service account has property access
- **"Invalid credentials"**: Check private key format

### Email Issues
- **"Authentication failed"**: Verify app password
- **"Connection timeout"**: Check EMAIL_HOST and EMAIL_PORT
- **"No leads found"**: Ensure emails exist in the last 30 days

### General Issues
- **"Internal Server Error"**: Check browser console and server logs
- **Database errors**: Ensure migrations are applied
- **Slow loading**: Email fetching may take 10-30 seconds initially

## 📈 Data Flow

```
Email Server (IMAP) → Email Parser → Database → API → Admin Dashboard
Google Analytics API → Analytics Service → API → Admin Dashboard
```

## 🎯 Next Steps

Once configured, the system will:
- Automatically fetch new email leads every time you visit the leads page
- Display real-time analytics data
- Store all leads in the database for historical tracking
- Provide intelligent insights and categorization

The admin panel is now fully functional with real data integration!