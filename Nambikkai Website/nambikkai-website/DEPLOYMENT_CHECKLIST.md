# Deployment Checklist

## ✅ Pre-Deployment

- [ ] Code is working locally (frontend + backend)
- [ ] All changes committed to Git
- [ ] Pushed to GitHub repository
- [ ] MongoDB Atlas database is accessible
- [ ] MongoDB IP whitelist includes `0.0.0.0/0`

## ✅ Backend Deployment (Render)

- [ ] Created Web Service on Render
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `nambikkai-website/backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added Environment Variables:
  - [ ] PORT = 5001
  - [ ] MONGODB_URI = (your connection string)
  - [ ] JWT_SECRET = nambikkai_secret_key_2025
  - [ ] NODE_ENV = production
  - [ ] FRONTEND_URL = (will add after frontend deployment)
- [ ] Deployment successful (check logs)
- [ ] Noted backend URL: `____________________________`

## ✅ Frontend Deployment (Render)

- [ ] Updated `frontend/.env` with backend URL
- [ ] Pushed changes to GitHub
- [ ] Created Static Site on Render
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `nambikkai-website/frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `build`
- [ ] Added Environment Variables:
  - [ ] REACT_APP_API_URL = (backend URL)/api
- [ ] Deployment successful (check logs)
- [ ] Noted frontend URL: `____________________________`

## ✅ Post-Deployment Configuration

- [ ] Updated backend FRONTEND_URL with actual frontend URL
- [ ] Redeployed backend service
- [ ] Both services showing "Live" status

## ✅ Testing

- [ ] Backend health check working: `/api/health`
- [ ] Frontend loads correctly
- [ ] User can sign up
- [ ] User can login
- [ ] Admin can login
- [ ] Admin can add products
- [ ] Products display on homepage
- [ ] Add to cart works
- [ ] Checkout/orders work

## ✅ Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Render)
- [ ] Set up monitoring/alerts
- [ ] Database backup configured
- [ ] Documentation updated

## 📝 Deployment URLs

**Frontend:** https://_____________________________.onrender.com
**Backend:** https://_____________________________.onrender.com
**Custom Domain:** https://_____________________________ (if applicable)

## 🚨 Common Issues & Solutions

**CORS Error:**
- Check FRONTEND_URL in backend matches actual frontend URL
- Check CORS settings in `server.js`

**API Not Found:**
- Verify REACT_APP_API_URL includes `/api` at the end
- Check setupProxy.js configuration

**MongoDB Connection Failed:**
- Verify IP whitelist includes `0.0.0.0/0`
- Check MONGODB_URI is correct
- Ensure MongoDB cluster is not paused

**Images Not Loading:**
- Use external storage (Cloudinary, AWS S3)
- Or store in GitHub repo `/public/Images/`

**Slow First Load:**
- Expected on free tier (service sleeps after 15 min)
- Consider upgrading to paid tier for 24/7 uptime

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Status:** ✅ Live / ⏳ In Progress / ❌ Issues
