# Deployment Guide - GitHub Pages

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `Physical-AI-Humanoid-Robotics-Textbook`
3. Description: `Comprehensive educational textbook on Physical AI, Humanoid Robotics, and ROS 2`
4. Set to **Public** (required for GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```powershell
cd "C:\Users\HP\Desktop\Physical-AI-Humanoid-Robotics-Textbook"
git remote add origin https://github.com/HafsaRahman05/physical-ai-humanoid-textbook.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

## Step 4: Enable GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will:
- Automatically build the Docusaurus site when you push to `main`
- Deploy to the `gh-pages` branch
- Your site will be available at: `https://hafsarahman05.github.io/physical-ai-humanoid-textbook/`

## Step 5: Verify Deployment

After pushing:
1. Go to **Actions** tab in your repository
2. You should see a workflow run "Deploy to GitHub Pages"
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, visit: `https://hafsarahman05.github.io/physical-ai-humanoid-textbook/`

## Manual Deployment (Alternative)

If GitHub Actions doesn't work, you can deploy manually:

```powershell
npm run build
npm run deploy
```

This uses Docusaurus's built-in deployment command.

## Build Time and Resource Requirements

- **Expected Build Time**: 2-5 minutes under normal conditions
- **Deployment Time**: Additional 1-2 minutes after successful build
- **Total Deployment Time**: Typically 3-7 minutes from push to live site
- **Resource Requirements**: 
  - Node.js 20+ (as specified in package.json engines)
  - Sufficient disk space for node_modules and build output
  - GitHub Actions provides 2-core runners with 7GB RAM (sufficient for Docusaurus builds)

## Deployment Process

The automated deployment process:
1. **Trigger**: Push to `main` or `master` branch
2. **Build**: Docusaurus site is built using `npm run build`
3. **Deploy**: Built files are pushed to `gh-pages` branch
4. **Publish**: GitHub Pages serves the site from `gh-pages` branch
5. **Status**: Deployment status is visible in GitHub Actions tab

## Troubleshooting

- **404 Error**: Wait a few minutes after deployment - GitHub Pages can take 5-10 minutes to update
- **Build Fails**: Check the Actions tab for error messages
- **Wrong URL**: Verify the `baseUrl` in `docusaurus.config.ts` matches your repository name
- **Deployment Not Triggering**: Ensure GitHub Actions is enabled in repository settings
- **Previous Version Still Showing**: GitHub Pages may cache content; wait 5-10 minutes or clear browser cache
- **Build Timeout**: If build takes longer than 10 minutes, check for large files or dependencies

## Rollback Procedure

If a deployment introduces issues:
1. Go to the repository's **Actions** tab
2. Find the last successful deployment
3. Re-run that workflow to restore the previous version
4. Alternatively, manually revert the commit that caused the issue

## Edge Cases and Failure Handling

### GitHub Pages Service Outage
- If GitHub Pages experiences an outage, the site will be temporarily unavailable
- No action needed - GitHub will restore service automatically
- Monitor GitHub Status page: https://www.githubstatus.com/

### Repository Unavailability During Deployment
- If the repository is temporarily unavailable, the deployment will fail
- The previous version remains accessible (deployment only happens on success)
- Retry the deployment once the repository is available again

### Deployment Interruption
- If a workflow is cancelled or interrupted, the previous deployment remains active
- GitHub Actions automatically handles workflow cancellation
- No manual intervention needed - the site continues serving the last successful deployment

### Very Large Content Updates
- Large content updates may take longer to build (up to 10 minutes)
- If build exceeds GitHub Actions timeout, consider splitting large updates into smaller commits
- Monitor build time in the Actions tab

