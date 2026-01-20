# Vercel Deployment Guide

## ✅ Repository Setup Complete

Your code has been pushed to GitHub: https://github.com/YukiTheProgrammer/Cascade-Geomatics-Mine-Demo.git

## Important: LAS Files Hosting

The LAS files (`crxmine_combined_classifications.las`, `crxmine_filled.las`, `crxmine_filled_cropped.las`) are **NOT in the git repository** because they exceed GitHub's file size limits (one file is 821 MB).

### Option 1: Host LAS Files on Vercel Blob Storage (Recommended)

1. **Upload LAS files to Vercel Blob Storage:**
   - Go to your Vercel project → Storage → Create Blob Store
   - Upload the 3 LAS files
   - Get the public URLs

2. **Update the app to use CDN URLs:**
   - Edit `app/src/pages/LiveTerrain.tsx`
   - Change `lasFilePath` from `/data/crxmine_combined_classifications.las` to the Vercel Blob URL

### Option 2: Host on External CDN

Upload LAS files to:
- AWS S3 + CloudFront
- Cloudflare R2
- Azure Blob Storage
- Any CDN service

Then update the `lasFilePath` in `LiveTerrain.tsx` to use the CDN URLs.

### Option 3: Use Vercel's File System (Temporary)

For quick testing, you can:
1. Manually upload LAS files via Vercel dashboard
2. Or use Vercel CLI to upload files

## Deploy to Vercel - Step by Step

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Select **"Cascade-Geomatics-Mine-Demo"** from your GitHub repos

### Step 2: Configure Build Settings

On the "Configure Project" screen, set:

- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `app` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables

If you have any environment variables, add them here. Otherwise, skip this step.

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

### Step 5: Fix SPA Routing (Critical!)

After first deployment:

1. Go to your project → **Settings → Routing**
2. Click **"Add Rewrite"**
3. Add this rewrite rule:
   - **Source**: `/(.*)`
   - **Destination**: `/index.html`
4. Save and redeploy

This ensures React Router works correctly when users refresh the page or navigate directly to routes.

## Post-Deployment Checklist

- [ ] App loads at the Vercel URL
- [ ] Quick Overview page displays correctly
- [ ] Navigation works (Quick Overview ↔ Live Terrain)
- [ ] LAS files are accessible (if hosted on CDN)
- [ ] Point cloud renders in Live Terrain view
- [ ] All annotations work (Data, Towers, Tracking tabs)
- [ ] No console errors

## Troubleshooting

### Build Fails: "Cannot find module 'custom-pointcloud-renderer'"
- ✅ Already fixed - renderer is bundled in `app/lib/custom-pointcloud-renderer/`

### Point Cloud Doesn't Load
- Check browser console for errors
- Verify LAS file URLs are correct
- Ensure LAS files are publicly accessible

### 404 on Page Refresh
- Add the SPA rewrite rule (Step 5 above)

### Large Bundle Size Warning
- This is normal - the point cloud renderer is large
- Consider code splitting if needed later

## Next Steps

1. **Deploy to Vercel** using the steps above
2. **Host LAS files** on Vercel Blob or external CDN
3. **Update `lasFilePath`** in `LiveTerrain.tsx` to use CDN URLs
4. **Test** all functionality on the deployed site

Your app is ready to deploy! 🚀
