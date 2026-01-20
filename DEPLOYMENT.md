# Deployment Guide for Lovable.dev

## Prerequisites

Before deploying to lovable.dev, you need to resolve the `custom-pointcloud-renderer` dependency issue.

## Step 1: Handle Custom Pointcloud Renderer Dependency

The app currently uses `custom-pointcloud-renderer` via npm link, which won't work in production. Choose one of these options:

### Option A: Publish to NPM (Recommended)

1. Navigate to the Custom Pointcloud Renderer directory:
   ```powershell
   cd "C:\Users\nafiz\Documents\Cascade Dynamics\Custom Pointcloud Renderer"
   ```

2. Build the renderer library:
   ```powershell
   npm run build:lib
   ```

3. Publish to npm (you'll need an npm account):
   ```powershell
   npm login
   npm publish --access public  # or --access restricted for private
   ```

4. Update `app/package.json` to use the published package:
   ```json
   {
     "dependencies": {
       "custom-pointcloud-renderer": "^1.0.0"
     }
   }
   ```

5. Remove the npm link:
   ```powershell
   cd "C:\Users\nafiz\Documents\Cascade Dynamics\Mine Demo\app"
   npm unlink custom-pointcloud-renderer
   npm install
   ```

### Option B: Use Git URL (Alternative)

If you don't want to publish to npm, you can reference it via Git:

1. Push the Custom Pointcloud Renderer to a Git repository (GitHub, GitLab, etc.)

2. Update `app/package.json`:
   ```json
   {
     "dependencies": {
       "custom-pointcloud-renderer": "git+https://github.com/yourusername/custom-pointcloud-renderer.git"
     }
   }
   ```

3. Remove the npm link and install:
   ```powershell
   cd app
   npm unlink custom-pointcloud-renderer
   npm install
   ```

### Option C: Bundle Renderer Locally (Not Recommended)

Copy the renderer source into your app, but this increases bundle size and maintenance burden.

## Step 2: Prepare Build Configuration

1. Ensure your `vite.config.ts` is production-ready. Remove or conditionally apply development-only settings:

   ```typescript
   // Remove or conditionally apply these for production:
   // preserveSymlinks: true,
   // server.fs.allow
   ```

2. Create a production build:
   ```powershell
   cd app
   npm run build
   ```

3. Test the build locally:
   ```powershell
   npm run preview
   ```

## Step 3: Deploy to Lovable.dev

### Method 1: Via Lovable.dev Dashboard

1. **Sign in** to [lovable.dev](https://lovable.dev)

2. **Create a new project** or select existing project

3. **Connect your Git repository** (if using Git):
   - Go to project settings
   - Connect your GitHub/GitLab repository
   - Lovable will auto-detect your Vite app

4. **Configure build settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node Version**: 18.x or 20.x (check your `.nvmrc` or `package.json` engines)

5. **Set Environment Variables** (if needed):
   - Go to Environment Variables section
   - Add any `VITE_*` prefixed variables your app needs

6. **Deploy**:
   - Click "Deploy" or "Publish" button
   - Lovable will build and deploy your app

### Method 2: Via Command Line (if Lovable CLI exists)

```powershell
# Install Lovable CLI (if available)
npm install -g @lovable/cli

# Login
lovable login

# Deploy
cd app
lovable deploy
```

## Step 4: Verify Deployment

1. Check the deployment URL provided by Lovable
2. Test all features:
   - Quick Overview page loads
   - Live Terrain page loads
   - Point cloud renders correctly
   - Annotations work
   - Navigation works

## Step 5: Handle Static Assets

Ensure your LAS files are in the `public/data` directory so they're copied to `dist/data` during build:

```
app/
  public/
    data/
      crxmine_combined_classifications.las
      crxmine_filled_cropped.las
      crxmine_filled.las
```

These will be available at `/data/filename.las` in production.

## Troubleshooting

### Build Fails: Cannot find module 'custom-pointcloud-renderer'
- Ensure you've published/configured the renderer package (Step 1)
- Remove `node_modules` and `package-lock.json`, then `npm install`

### Point Cloud Doesn't Load
- Check browser console for errors
- Verify LAS files are in `public/data` directory
- Check that the renderer is properly bundled

### Performance Issues
- Ensure optimizer is enabled in production
- Check bundle size - consider code splitting if needed

## Additional Notes

- **LAS Files**: Large LAS files may need to be hosted separately (CDN) if Lovable has file size limits
- **Environment Variables**: Any API keys or config should use `VITE_` prefix
- **Base Path**: If deploying to a subdirectory, update `vite.config.ts` base path

## Post-Deployment

1. Update `CLAUDE.md` with deployment information
2. Document any environment-specific configurations
3. Set up monitoring/analytics if needed
