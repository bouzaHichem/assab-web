# ASSAB - Telecom & Energy Solutions Website

![ASSAB Logo](https://via.placeholder.com/150x75?text=ASSAB)

A modern, full-featured corporate website with complete admin panel for ASSAB - a leading telecommunications and energy solutions provider.

## 🌟 Features

### 🌐 Public Website
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Multi-language Ready**: Support for English, French, and Arabic
- **SEO Optimized**: Meta tags, structured data, and sitemap
- **Performance Optimized**: Image optimization, lazy loading, and caching
- **Accessibility**: WCAG compliant with screen reader support

### 🛠 Admin Panel
- **Content Management**: Edit all website content, timeline, and menus
- **Services Management**: Manage company services and offerings
- **Media Management**: Upload and organize website assets
- **Real Analytics**: Google Analytics integration with live data
- **Leads Management**: Email integration with info@assabenggroup.com
- **User Management**: Role-based access control (Admin, Editor, Viewer)

### 📊 Business Features
- **Timeline Management**: Showcase company milestones and journey
- **Service Catalog**: Detailed services with features and pricing
- **Project Portfolio**: Showcase completed projects and case studies
- **Contact Management**: Lead capture and management system
- **Analytics Dashboard**: Website performance insights

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd assab-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   npm run db:seed-timeline
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login
   - Default Admin: `admin@assab.com` / `admin123`

## 🏗 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: Headless UI, Heroicons
- **Analytics**: Google Analytics 4
- **Email**: IMAP integration
- **Deployment**: Vercel, Netlify compatible

## 📁 Project Structure

```
assab-web/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   └── (public)/          # Public website pages
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   └── ui/               # Shared UI components
│   ├── lib/                  # Utilities and configurations
│   ├── styles/               # Global styles
│   └── types/                # TypeScript type definitions
├── prisma/                   # Database schema and migrations
├── scripts/                  # Database seeding scripts
├── public/                   # Static assets
└── docs/                     # Documentation files
```

## 🌍 Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Set up production database**:
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run db:seed-timeline
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔐 Admin Panel

### Default Access
- **URL**: `/admin/login`
- **Email**: `admin@assab.com`
- **Password**: `admin123`
- **⚠️ Change these credentials after first login**

### Admin Features
- **Dashboard**: Overview of website metrics and quick actions
- **Content Management**: Edit all website sections and content
- **Timeline Management**: Manage company milestones and history
- **Services Management**: Add/edit company services and offerings
- **Media Management**: Upload and organize images and files
- **Menu Management**: Configure website navigation
- **Analytics**: View real Google Analytics data
- **Leads Management**: Handle inquiries from contact forms and email
- **User Management**: Manage admin users and permissions

## 📧 Email Integration

The system can automatically import and manage leads from your business email:

- Configure IMAP settings for `info@assabenggroup.com`
- Automatic lead parsing and categorization
- Priority assignment based on content analysis
- Tag assignment (telecom, energy, consulting, etc.)
- Integration with the admin panel for lead management

## 📈 Analytics Integration

Connect with Google Analytics 4 for real-time insights:

- Website traffic and user behavior
- Page performance metrics
- Geographic data and demographics
- Device and browser analytics
- Custom event tracking

## 🌍 Multi-language Support

Ready for international markets with built-in i18n:

- **English**: Primary language
- **French**: Secondary language  
- **Arabic**: RTL support included
- Easy content translation through admin panel
- SEO-friendly URL structure

## 🛡 Security Features

- **Authentication**: Secure session management
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted passwords and secure headers
- **Input Validation**: XSS and injection protection
- **Rate Limiting**: API protection against abuse

## 📝 Content Management

Easily manage all website content:

- **Homepage**: Hero section, features, testimonials
- **About Page**: Company story, mission, vision, values
- **Services**: Detailed service descriptions and pricing
- **Projects**: Portfolio and case studies
- **Timeline**: Company milestones and achievements
- **Contact**: Contact information and forms

## 🎨 Customization

The website is built with customization in mind:

- **Theming**: Easily change colors, fonts, and styling
- **Components**: Modular, reusable components
- **Content**: Admin-editable content without code changes
- **Layout**: Flexible layout system with Tailwind CSS
- **Extensions**: Easy to add new features and functionality

## 📞 Support & Documentation

- **Admin Guides**: [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)
- **Quick Start**: [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)
- **Real Data Setup**: [REAL_DATA_SETUP.md](./REAL_DATA_SETUP.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved to ASSAB.

## 📧 Contact

For support or inquiries:
- **Website**: [assabenggroup.com](https://assabenggroup.com)
- **Email**: info@assabenggroup.com
- **Admin Panel**: [your-domain.com/admin](https://your-domain.com/admin)

---

**Built with ❤️ for ASSAB - Powering the Future of Connectivity & Energy**