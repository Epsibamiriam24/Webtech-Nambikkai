# Nambikkai Website - Render Deployment Guide

## 🚀 Complete Deployment Steps

### Prerequisites
- GitHub repository with your code
- Render account (free tier works)
- MongoDB Atlas account (free tier works)

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

1. **Ensure your backend has these files:**
   - ✅ `package.json` with all dependencies
   - ✅ `server.js` as the entry point
   - ✅ `.gitignore` (node_modules, .env should be ignored)

2. **Push your code to GitHub** (if not already done)

### Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:

   ```
   Name: nambikkai-backend
   Region: Choose closest to your users
   Branch: master (or main)
   Root Directory: nambikkai-website/backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   PORT = 5001
   MONGODB_URI = mongodb+srv://epsibamiriam03_db_user:8wdoIF5pnBUB5VAV@cluster0.d4vucth.mongodb.net/nambikkai?retryWrites=true&w=majority&ssl=true&authSource=admin
   JWT_SECRET = nambikkai_secret_key_2025
   NODE_ENV = production
   FRONTEND_URL = https://your-frontend-app.onrender.com
   ```

6. Click **"Create Web Service"**

7. **Save your backend URL** (will be something like):
   ```
   https://nambikkai-backend.onrender.com
   ```

---

## Part 2: Frontend Deployment on Render

### Step 1: Update Frontend Configuration

1. **Update `.env` file** in frontend folder:
   ```env
   REACT_APP_API_URL=https://nambikkai-backend.onrender.com/api
   ```

2. **Push changes to GitHub**

### Step 2: Deploy Frontend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the frontend service:

   ```
   Name: nambikkai-frontend
   Branch: master (or main)
   Root Directory: nambikkai-website/frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

5. **Add Environment Variables**:
   ```
   REACT_APP_API_URL = https://nambikkai-backend.onrender.com/api
   ```

6. Click **"Create Static Site"**

7. **Your website URL** will be:
   ```
   https://nambikkai-frontend.onrender.com
   ```

---

## Part 3: Update Backend with Frontend URL

1. Go back to your **backend service** on Render
2. Go to **Environment** tab
3. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL = https://nambikkai-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Your backend will automatically redeploy

---

## Part 4: Configure Custom Domain (Optional)

### If you have a custom domain (e.g., nambikkai.com):

1. **For Frontend:**
   - Go to your frontend service → **Settings** → **Custom Domain**
   - Add your domain: `www.nambikkai.com` or `nambikkai.com`
   - Add CNAME record in your domain provider:
     ```
     CNAME: www → nambikkai-frontend.onrender.com
     ```

2. **For Backend API:**
   - Go to your backend service → **Settings** → **Custom Domain**
   - Add subdomain: `api.nambikkai.com`
   - Add CNAME record:
     ```
     CNAME: api → nambikkai-backend.onrender.com
     ```

3. **Update Environment Variables:**
   - Frontend: `REACT_APP_API_URL=https://api.nambikkai.com/api`
   - Backend: `FRONTEND_URL=https://www.nambikkai.com`

---

## Part 5: Verify Deployment

### Test your deployed application:

1. **Backend Health Check:**
   ```
   https://nambikkai-backend.onrender.com/api/health
   ```
   Should return: `{"message":"Server is running"}`

2. **Frontend Access:**
   ```
   https://nambikkai-frontend.onrender.com
   ```
   Should show your Nambikkai website

3. **Test Authentication:**
   - Login as user
   - Login as admin
   - Add products
   - Place orders

---

## 🔧 Troubleshooting

### Issue: CORS errors
**Solution:** Make sure `FRONTEND_URL` in backend matches your actual frontend URL

### Issue: API calls failing
**Solution:** Check that `REACT_APP_API_URL` in frontend includes `/api` at the end

### Issue: MongoDB connection failed
**Solution:** 
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for all IPs)
- Verify MONGODB_URI is correct in backend environment variables

### Issue: Images not loading
**Solution:** Render's free tier doesn't persist uploads. Consider using:
- Cloudinary for image storage
- AWS S3
- Or store images in your GitHub repo under `/public/Images/`

---

## 📊 Important Notes

1. **Free Tier Limitations:**
   - Backend services sleep after 15 min of inactivity
   - First request after sleep takes ~30 seconds
   - 750 hours/month free (shared across all services)

2. **Automatic Deploys:**
   - Render auto-deploys when you push to GitHub
   - Set up branch auto-deploy in Settings

3. **Logs & Monitoring:**
   - View logs in Render Dashboard → Your Service → Logs
   - Monitor for errors and performance

4. **Database Backups:**
   - Set up MongoDB Atlas backups
   - Export data regularly

---

## 🎯 Quick Reference

### Your Deployed URLs:
```
Frontend: https://nambikkai-frontend.onrender.com
Backend:  https://nambikkai-backend.onrender.com
API:      https://nambikkai-backend.onrender.com/api
```

### Environment Variables Summary:

**Backend:**
- PORT = 5001
- MONGODB_URI = (your MongoDB Atlas connection string)
- JWT_SECRET = nambikkai_secret_key_2025
- NODE_ENV = production
- FRONTEND_URL = (your frontend URL)

**Frontend:**
- REACT_APP_API_URL = (your backend URL)/api

---

## 🔄 Updating Your Deployment

When you make changes:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin master
   ```

2. **Render auto-deploys** - check deployment status in dashboard

3. **Manual deploy** (if needed):
   - Go to service → Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Authentication working (login/signup)
- [ ] Admin panel accessible
- [ ] Products loading correctly
- [ ] Cart functionality working
- [ ] Order placement working

---

**Congratulations! Your Nambikkai website is now live! 🎉**

For support: Check Render docs at https://render.com/docs
