# GitHub Pages Deployment Guide

This guide will help you deploy your Bladder Buddy app to GitHub Pages.

## Prerequisites

- A GitHub account
- Your repository already connected to GitHub (✅ Already done!)

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/jokerr27/bladder-buddy`
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions` (not "Deploy from a branch")
5. Click **Save**

## Step 2: Commit and Push Your Changes

The GitHub Actions workflow has been set up. Now you need to commit and push your changes:

```bash
# Add all changes
git add .

# Commit the changes
git commit -m "Add GitHub Pages deployment configuration"

# Push to GitHub
git push origin main
```

## Step 3: Monitor the Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You should see a workflow run called "Deploy to GitHub Pages"
4. Wait for it to complete (usually takes 2-3 minutes)
5. Once it's done, you'll see a green checkmark

## Step 4: Access Your Site

After the deployment completes:

1. Go back to **Settings** → **Pages**
2. You'll see a message: "Your site is live at..."
3. Your site URL will be: `https://jokerr27.github.io/bladder-buddy/`

## Automatic Deployments

Every time you push to the `main` branch, GitHub Actions will automatically:
- Build your app
- Deploy it to GitHub Pages

## Troubleshooting

### If the site shows a 404 error:
- Wait a few minutes after the first deployment (GitHub Pages can take up to 10 minutes to propagate)
- Make sure the workflow completed successfully in the Actions tab
- Check that GitHub Pages is set to use "GitHub Actions" as the source

### If routes don't work:
- The base path is configured in `vite.config.ts` as `/bladder-buddy/`
- If you want to deploy to a custom domain or root path, update the `base` in `vite.config.ts`

### If you want to use a custom domain:
1. Add a `CNAME` file in the `public` folder with your domain name
2. Update your DNS settings to point to GitHub Pages
3. Update the base path in `vite.config.ts` to `/` instead of `/bladder-buddy/`

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist folder will contain your built files
# You can then manually upload the contents to GitHub Pages
```

But the GitHub Actions workflow is recommended as it's automatic!

