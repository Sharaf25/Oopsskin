# cPanel Deployment Guide for oopsskin

This guide will help you deploy your Next.js application to cPanel hosting.

## Prerequisites

- cPanel hosting account with File Manager or FTP access
- Node.js installed on your local machine
- Your domain configured in cPanel

## Step 1: Build Your Application

Run the following command in your project directory:

```bash
npm run build
```

This will create an `out` folder with your static website files.

## Step 2: Prepare Files for Upload

After building, you'll have an `out` folder containing:
- HTML files
- CSS files
- JavaScript files
- Images and other assets
- `_next` folder with optimized assets

## Step 3: Upload to cPanel

### Option A: Using File Manager

1. Log in to your cPanel account
2. Open **File Manager**
3. Navigate to `public_html` (or your domain's root directory)
4. Delete any existing files in the directory (or backup first)
5. Upload all contents from the `out` folder to `public_html`
6. Make sure to upload the `.htaccess` file from the `public` folder as well

### Option B: Using FTP

1. Connect to your cPanel via FTP (using FileZilla, WinSCP, etc.)
2. Navigate to `public_html`
3. Upload all contents from the `out` folder
4. Upload the `.htaccess` file from the `public` folder

## Step 4: Verify .htaccess

Make sure the `.htaccess` file is in your `public_html` directory with the following content:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1.html [L]
```

## Step 5: Configure Domain (if needed)

1. In cPanel, go to **Domains** or **Addon Domains**
2. Make sure your domain points to the correct directory
3. Wait for DNS propagation (if you just added the domain)

## File Structure After Upload

```
public_html/
├── .htaccess
├── index.html
├── 404.html
├── favicon.ico
├── _next/
│   ├── static/
│   └── ...
├── img/
└── other static files
```

## Important Notes

### 1. Image Optimization
Since cPanel doesn't support Next.js Image optimization, we've set `images.unoptimized: true` in the config.

### 2. API Routes
Static export doesn't support API routes. If you need backend functionality, consider:
- Using external APIs
- Setting up a separate Node.js server
- Using serverless functions (Vercel, Netlify, etc.)

### 3. Server-Side Rendering (SSR)
cPanel hosting doesn't support SSR. The app is exported as static HTML.

### 4. Dynamic Routes
Dynamic routes will be pre-rendered at build time.

## Troubleshooting

### Issue: 404 Errors on Page Refresh
**Solution**: Make sure `.htaccess` file is properly uploaded and mod_rewrite is enabled.

### Issue: Styles Not Loading
**Solution**: Check that all files in the `_next` folder are uploaded correctly.

### Issue: Images Not Showing
**Solution**: Verify that the `img` folder and all image files are uploaded.

### Issue: Blank Page
**Solution**: 
1. Check browser console for errors
2. Verify all JavaScript files in `_next/static/chunks/` are uploaded
3. Check file permissions (should be 644 for files, 755 for folders)

## Quick Deploy Script

Create a `deploy.sh` file in your project root:

```bash
#!/bin/bash

# Build the project
npm run build

# Copy .htaccess to out folder
cp public/.htaccess out/

echo "Build complete! Upload the 'out' folder contents to your cPanel public_html directory."
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Automated Deployment (Advanced)

If your cPanel supports it, you can use FTP deployment:

1. Install FTP deployment package:
```bash
npm install --save-dev ftp-deploy
```

2. Create `deploy.js`:
```javascript
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
    user: "your-ftp-username",
    password: "your-ftp-password",
    host: "ftp.yourdomain.com",
    port: 21,
    localRoot: __dirname + "/out",
    remoteRoot: "/public_html/",
    include: ["*", "**/*"],
    deleteRemote: false,
    forcePasv: true
};

ftpDeploy.deploy(config)
    .then(res => console.log('Deployment finished'))
    .catch(err => console.log(err));
```

3. Add to package.json:
```json
"scripts": {
    "deploy": "npm run build && node deploy.js"
}
```

## Support

If you encounter issues:
1. Check cPanel error logs
2. Verify file permissions
3. Contact your hosting provider for server configuration issues
4. Ensure mod_rewrite is enabled on your server

## Update Process

To update your site:
1. Make changes to your code
2. Run `npm run build`
3. Upload the new files from the `out` folder
4. Clear browser cache to see changes

---

**Your app is now ready for cPanel deployment!** 🚀
