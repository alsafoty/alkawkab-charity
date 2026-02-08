# 🎯 SEO Deployment Steps for Netlify

## Quick Deployment Guide

### 1. Pre-Deployment Actions

**A. Update Domain References:**
After you get your Netlify domain, replace `alkawkab-charity.netlify.app` in:
- `public/index.html` (lines with og:url, twitter:url, canonical, JSON-LD)
- `public/sitemap.xml`
- `public/robots.txt`

**B. Add Required Images:**
Create these files in `public/images/`:
- `og-image.jpg` (1200x630px) - For social media previews
- `logo.png` - Your charity logo

**C. Add Favicon Files to `public/`:**
- `favicon.ico`
- `apple-touch-icon.png` (180x180px)
- `favicon-32x32.png` (32x32px)
- `favicon-16x16.png` (16x16px)

### 2. Deploy to Netlify

**Option A: Connect Git Repository (Recommended)**
```bash
# 1. Initialize git if not done
git init
git add .
git commit -m "Initial commit with SEO optimization"

# 2. Push to GitHub/GitLab/Bitbucket
git remote add origin <your-repo-url>
git push -u origin main

# 3. In Netlify Dashboard:
- Click "Add new site" → "Import an existing project"
- Connect to your Git provider
- Select your repository
- Build settings:
  - Build command: npm run build
  - Publish directory: dist
- Click "Deploy site"
```

**Option B: Manual Deploy**
```bash
# 1. Build the project
npm run build

# 2. Drag and drop the 'dist' folder to Netlify dashboard
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. Post-Deployment Actions (Critical!)

**A. Update Your Domain URLs:**
```bash
# Get your Netlify URL (e.g., https://your-site.netlify.app)
# Then update these files:
```
1. [public/index.html](public/index.html) - Replace all instances of domain
2. [public/sitemap.xml](public/sitemap.xml) - Update all <loc> tags
3. [public/robots.txt](public/robots.txt) - Update Sitemap URL

**B. Redeploy After Updates:**
```bash
npm run build
# Then deploy again
```

### 4. Submit to Search Engines

**Google Search Console:**
1. Visit: https://search.google.com/search-console
2. Add property with your Netlify URL
3. Verify via HTML file method or meta tag
4. Submit sitemap: `https://your-domain/sitemap.xml`

**Bing Webmaster Tools:**
1. Visit: https://www.bing.com/webmasters
2. Add and verify your site
3. Submit sitemap

### 5. Set Up Analytics

**Google Analytics 4:**
```html
<!-- Add to public/index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 6. Verify SEO Implementation

**Run These Tests:**
- [ ] Google PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- [ ] Rich Results Test: https://search.google.com/test/rich-results
- [ ] Robots.txt Tester in Search Console
- [ ] Social Media Preview:
  - Facebook: https://developers.facebook.com/tools/debug/
  - Twitter: https://cards-dev.twitter.com/validator

### 7. Custom Domain (Optional)

**If you have a custom domain:**
```
1. In Netlify: Domain settings → Add custom domain
2. Update DNS records at your registrar:
   - Add A record or CNAME record as instructed
3. Enable HTTPS (automatic in Netlify)
4. Update all URLs in your files with new domain
5. Redeploy
```

### 8. Monitoring Setup

**Weekly Tasks:**
- Check Google Search Console for errors
- Monitor traffic in Analytics
- Review Core Web Vitals

**Monthly Tasks:**
- Update sitemap dates if content changed
- Check for broken links
- Review and update content

### 9. Performance Optimization

**After First Deploy:**
```bash
# Run Lighthouse audit in Chrome DevTools
# Address any issues:
# - Image optimization
# - Lazy loading
# - Code splitting (already configured)
```

### 10. Content Strategy

**To Improve Rankings:**
1. Add blog/news section with regular updates
2. Create detailed "About" page
3. Add success stories and testimonials
4. Include FAQ section
5. Regular social media updates with links back to site

## 🚨 Common Issues & Solutions

**Issue: 404 errors on page refresh**
- ✅ Already fixed with `_redirects` file and `netlify.toml`

**Issue: Slow load times**
- Optimize images (use WebP format)
- Already have: Code splitting, caching headers

**Issue: Not indexed by Google**
- Submit sitemap in Search Console
- Check robots.txt isn't blocking
- Ensure pages have unique titles/descriptions

**Issue: Poor mobile experience**
- Already have: Responsive meta tags
- Test on real devices
- Check touch target sizes

## 📞 Need Help?

- Netlify Docs: https://docs.netlify.com/
- Google Search Central: https://developers.google.com/search
- Vue.js SEO Guide: https://vuejs.org/guide/scaling-up/ssr.html

---

**Status:** ✅ SEO Configuration Complete
**Last Updated:** February 8, 2026
**Next Action:** Deploy to Netlify and update domain URLs
