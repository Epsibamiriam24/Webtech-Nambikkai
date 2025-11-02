# Render Deployment Configuration

## Quick Setup Summary

### Backend Service Configuration
```yaml
Service Type: Web Service
Name: nambikkai-backend
Root Directory: nambikkai-website/backend
Build Command: npm install
Start Command: npm start
```

**Environment Variables:**
```
PORT=5001
MONGODB_URI=mongodb+srv://epsibamiriam03_db_user:8wdoIF5pnBUB5VAV@cluster0.d4vucth.mongodb.net/nambikkai?retryWrites=true&w=majority&ssl=true&authSource=admin
JWT_SECRET=nambikkai_secret_key_2025
NODE_ENV=production
FRONTEND_URL=https://YOUR-FRONTEND-URL.onrender.com
```

---

### Frontend Service Configuration
```yaml
Service Type: Static Site
Name: nambikkai-frontend
Root Directory: nambikkai-website/frontend
Build Command: npm install && npm run build
Publish Directory: build
```

**Environment Variables:**
```
REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

---

## After Deployment

1. **Get your backend URL** from Render (e.g., https://nambikkai-backend.onrender.com)
2. **Update frontend** `.env` with backend URL
3. **Get your frontend URL** from Render (e.g., https://nambikkai-frontend.onrender.com)
4. **Update backend** `FRONTEND_URL` environment variable with frontend URL
5. **Redeploy both** services

---

## MongoDB Atlas Setup

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
3. This allows Render servers to connect

---

## Testing Your Deployed App

1. **Backend Health:** `https://your-backend.onrender.com/api/health`
2. **Frontend:** `https://your-frontend.onrender.com`
3. **Login & Test:** Try login, admin access, add products

---

## Important Notes

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Auto-deploys when you push to GitHub
- Check logs in Render dashboard for errors

---

## Need Custom Domain?

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Add custom domain in Render settings
3. Update DNS records (CNAME)
4. SSL certificate is automatic (free)
