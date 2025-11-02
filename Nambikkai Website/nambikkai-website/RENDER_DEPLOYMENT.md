# Render Deployment Guide for Nambikkai Backend

## Step-by-Step Deployment to Render

### 1. Prepare Your Repository
- Make sure all changes are committed:
  ```
  git add .
  git commit -m "Setup MongoDB Atlas and Render deployment"
  git push origin master
  ```

### 2. Create Render Service

**Step 1:** Go to https://render.com
- Sign up with GitHub
- Click "New +" → "Web Service"
- Select "Build and deploy from a Git repository"
- Connect your GitHub repository (Webtech-Nambikkai)
- Select the repository and authorize

**Step 2:** Configure Web Service
- **Name:** `nambikkai-backend`
- **Environment:** `Node`
- **Region:** `Ohio (US)` or closest to your users
- **Branch:** `master`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free` (for testing)

**Step 3:** Add Environment Variables
Click "Environment" and add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://epsibamiriam03_db_user:8wdoIF5pnBUB5VAV@cluster0.d4vucth.mongodb.net/nambikkai?retryWrites=true&w=majority` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `nambikkai_secret_key_2025` |
| `FRONTEND_URL` | `https://your-frontend-render-url.onrender.com` |

**Step 4:** Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- You'll get a URL like: `https://nambikkai-backend.onrender.com`

### 3. Verify Deployment
Test your API:
```
GET https://nambikkai-backend.onrender.com/api/health
```

Should return: `{"message":"Server is running"}`

### 4. Important Notes

⚠️ **Free Tier Limitations:**
- Spins down after 15 minutes of inactivity
- Takes 50 seconds to wake up
- For production, upgrade to paid plan

✅ **Production Checklist:**
- [ ] Change JWT_SECRET to something secure
- [ ] Update FRONTEND_URL to actual frontend domain
- [ ] Upgrade to paid tier for 24/7 uptime
- [ ] Monitor logs regularly
- [ ] Set up backups for MongoDB

### 5. Troubleshooting

**Issue:** "503 Service Unavailable"
- Check logs in Render dashboard
- Verify MONGODB_URI is correct
- Ensure MongoDB Atlas allows Render IP (already configured as 0.0.0.0/0)

**Issue:** CORS Errors
- Check FRONTEND_URL in .env matches your frontend domain
- Verify frontend makes requests to correct backend URL

**Issue:** MongoDB Connection Timeout
- Verify network access in MongoDB Atlas is set to 0.0.0.0/0
- Check that database user credentials are correct
