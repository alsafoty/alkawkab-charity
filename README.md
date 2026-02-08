# جمعية الكوكب الدري الخيرية

# Al-Kawkab Al-Durri Charity Association

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/alkawkab-charity/deploys)

## 📖 Project Overview

A comprehensive web-based management system for Al-Kawkab Al-Durri Charity Association, designed to streamline the process of managing beneficiaries, families, and assistance programs. Built with Vue.js 3 and optimized for search engines with full Arabic language support.

### 🌟 Key Features

- **Person Management**: Complete CRUD operations for individual beneficiary records, including personal details, family relationships, and status (orphans, widows)
- **Family Management**: Organize individuals into family units with detailed family structures and member relationships
- **Assistance Management**: Track and record various forms of assistance provided to individuals and families
- **Admin Dashboard**: Secure authentication system for managing all operations
- **SEO Optimized**: Fully optimized for Google and other search engines with Arabic content support
- **Mobile Responsive**: Works seamlessly across all devices

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Router**: Vue Router 4 with hash-based routing
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: Bootstrap Icons
- **HTTP Client**: Axios
- **Notifications**: AlertifyJS
- **Build Tool**: Vue CLI 5
- **Deployment**: Netlify (optimized)

## 📦 Installation & Setup

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Local Development Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/alkawkab-charity.git
    cd alkawkab-charity
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Run Development Server**:

    ```bash
    npm run serve
    ```

    The application will be available at `http://localhost:8080/`

4.  **Build for Production**:

    ```bash
    npm run build
    ```

    This generates optimized static files in the `dist/` directory.

## 🌐 Deployment to Netlify

### Quick Deploy

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy** (choose one method):

   **Option A: Git Integration (Recommended)**

   - Push your code to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify Dashboard
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on every push

   **Option B: Netlify CLI**

   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

   **Option C: Drag & Drop**

   - Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

3. **Post-Deployment** (Important!):
   - Update domain URLs in `public/index.html`, `public/sitemap.xml`, `public/robots.txt`
   - Add social media preview image: `public/images/og-image.jpg`
   - Add logo: `public/images/logo.png`
   - Add favicon files
   - Rebuild and redeploy

📖 **Full deployment guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📝 Available Scripts

### Development

```bash
npm run serve          # Start development server with hot-reload
```

### Production

```bash
npm run build          # Build optimized production files
npm run postbuild      # Runs automatically after build
```

## 📁 Project Structure

```
alkawkab-charity/
├── public/
│   ├── index.html              # Main HTML with SEO meta tags
│   ├── robots.txt              # Search engine crawl directives
│   ├── sitemap.xml             # XML sitemap for SEO
│   ├── _redirects              # Netlify SPA routing
│   └── images/                 # Static images and logos
├── src/
│   ├── App.vue                 # Root component
│   ├── main.js                 # Application entry point
│   ├── assets/                 # Fonts and global styles
│   ├── components/             # Reusable components
│   ├── plugins/                # Plugin configurations (AlertifyJS)
│   ├── router/                 # Vue Router with dynamic meta tags
│   └── views/                  # Page components
│       ├── general/            # Public pages (Home, About, Contact)
│       ├── admin/              # Admin dashboard
│       ├── person/             # Person management
│       ├── family/             # Family management
│       ├── assistance/         # Assistance tracking
│       ├── members/            # Member management
│       └── files/              # File management
├── netlify.toml                # Netlify configuration
├── vue.config.js               # Vue CLI configuration
├── package.json                # Dependencies and scripts
├── SEO_GUIDE.md               # Complete SEO guide
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── SEO_CHECKLIST.md           # Implementation checklist
└── QUICK_REFERENCE.md         # Quick commands reference
```

## 🔌 API Integration

This application is designed to interact with a backend API. The following endpoints are expected:

### Person Endpoints

- `GET /api/persons` - List all persons
- `GET /api/persons/{id}` - Get person details
- `POST /api/persons` - Create new person
- `PUT /api/persons/{id}` - Update person
- `DELETE /api/persons/{id}` - Delete person

### Family Endpoints

- `GET /api/families` - List all families
- `GET /api/families/{id}` - Get family details with members
- `POST /api/families` - Create new family
- `PUT /api/families/{id}` - Update family
- `DELETE /api/families/{id}` - Delete family

### Assistance Endpoints

- `GET /api/assistance` - List all assistance records
- `GET /api/assistance/{id}` - Get assistance details
- `POST /api/assistance` - Create assistance record
- `PUT /api/assistance/{id}` - Update assistance record
- `DELETE /api/assistance/{id}` - Delete assistance record

## ⚙️ Configuration

### Environment Variables

Create a `.env` file for API configuration:

```env
VUE_APP_API_URL=https://your-api-domain.com
VUE_APP_GA_ID=G-XXXXXXXXXX
```

### Vue Configuration

See [vue.config.js](vue.config.js) for build optimization settings.

For more Vue CLI options, refer to the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

## 🔒 Authentication

The application uses localStorage-based authentication. Admin routes are protected and require login through the `/admin` page.

Protected routes include:

- Person management
- Family management
- Assistance management
- Member management
- File center

## 🌍 Internationalization

The application is built with full Arabic language support:

- RTL (Right-to-Left) layout
- Arabic UI text
- Arabic meta tags for SEO
- Arabic content optimization

## 📈 SEO & Performance

### Current Optimizations

- ⚡ Code splitting and lazy loading
- 🗜️ Production build optimization
- 📦 Vendor chunk separation
- 🔒 Security headers configured
- 💾 Static asset caching
- 🚀 CDN delivery via Netlify
- 📱 Mobile-responsive design

### Expected Performance

- PageSpeed Score: 90+
- Mobile-Friendly: Yes
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Al-Kawkab Al-Durri Charity Association.

## 📞 Support & Contact

For support or inquiries about Al-Kawkab Al-Durri Charity Association, please visit the contact page or reach out through official channels.

## 🎯 Next Steps

After setting up the project:

1. ✅ Complete deployment to Netlify
2. ✅ Update domain URLs in SEO files
3. ✅ Add social media images
4. ✅ Submit sitemap to Google Search Console
5. ✅ Set up Google Analytics
6. ✅ Configure custom domain (if applicable)

---

**Built with ❤️ for charitable work** | **Last Updated:** February 8, 2026
