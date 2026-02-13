# Deployment Guide: Health Insight Hub

This guide covers deploying the Health Insight Hub application with:
- **Frontend**: Vercel
- **Backend**: Render (with PostgreSQL database)

## Prerequisites

- GitHub account with the project repository pushed
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Render account (sign up at [render.com](https://render.com))

---

## Part 1: Deploy Backend to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/supravat011/Health-Insight`
4. Configure the service:
   - **Name**: `health-insight-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name**: `health-insight-db`
   - **Database**: `health_insight`
   - **User**: `health_insight_user`
   - **Region**: Same as your web service
   - **Plan**: Free
3. Click **"Create Database"**
4. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 3: Configure Environment Variables

In your web service settings, add these environment variables:

| Key | Value |
|-----|-------|
| `FLASK_ENV` | `production` |
| `SECRET_KEY` | Generate a random string (use a password generator) |
| `JWT_SECRET_KEY` | Generate another random string |
| `JWT_ACCESS_TOKEN_EXPIRES` | `3600` |
| `DATABASE_URL` | Paste the Internal Database URL from Step 2 |
| `CORS_ORIGINS` | `https://your-app.vercel.app` (update after Vercel deployment) |

> [!TIP]
> To generate secure random keys, you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Once deployed, copy your backend URL: `https://health-insight-backend.onrender.com`

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see a JSON response indicating the API is running.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `supravat011/Health-Insight`
4. Vercel will auto-detect it's a Vite project

### Step 2: Configure Build Settings

Vercel should auto-configure, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variable

Before deploying, add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

Replace `your-backend-url` with your actual Render backend URL from Part 1, Step 4.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Once deployed, copy your frontend URL: `https://your-app.vercel.app`

---

## Part 3: Update CORS Configuration

Now that you have your Vercel URL, update the backend CORS settings:

1. Go back to Render Dashboard
2. Open your `health-insight-backend` service
3. Go to **Environment** tab
4. Update `CORS_ORIGINS` to: `https://your-app.vercel.app`
5. Save changes (this will trigger a redeploy)

---

## Part 4: Initialize Database

Your database needs to be initialized with tables. You have two options:

### Option A: Use Flask Shell (Recommended)

1. In Render Dashboard, go to your web service
2. Click **"Shell"** tab
3. Run these commands:
```bash
python
from app import create_app, db
app = create_app('production')
with app.app_context():
    db.create_all()
exit()
```

### Option B: Add Initialization to Startup

This is already handled if your `app/__init__.py` has `db.create_all()` in the create_app function.

---

## Verification Checklist

After deployment, verify everything works:

- [ ] Backend health check responds: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can navigate to signup page
- [ ] Can create a new account (tests database write)
- [ ] Can login (tests authentication)
- [ ] Can access dashboard (tests protected routes)
- [ ] No CORS errors in browser console

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails with "Module not found"
- **Solution**: Ensure all dependencies are in `requirements.txt`

**Problem**: Database connection errors
- **Solution**: Verify `DATABASE_URL` is set correctly and uses the Internal Database URL

**Problem**: CORS errors
- **Solution**: Ensure `CORS_ORIGINS` includes your Vercel URL (with https://)

### Frontend Issues

**Problem**: API calls fail with network error
- **Solution**: Verify `VITE_API_URL` is set correctly in Vercel environment variables

**Problem**: 404 on page refresh
- **Solution**: Ensure `vercel.json` is in the root directory with proper rewrites

**Problem**: Environment variable not working
- **Solution**: Redeploy after adding environment variables (they're only applied at build time)

---

## Post-Deployment Notes

### Free Tier Limitations

**Render Free Tier**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime

**Vercel Free Tier**:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS

### Monitoring

**Render**:
- View logs in Dashboard → Your Service → Logs
- Monitor resource usage in Metrics tab

**Vercel**:
- View deployment logs in Dashboard → Your Project → Deployments
- Monitor analytics in Analytics tab

### Updating Your Application

Both platforms auto-deploy when you push to the `main` branch:

1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Render and Vercel will automatically rebuild and deploy

---

## Environment Variables Reference

### Frontend (.env)

```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render Environment Variables)

```bash
FLASK_ENV=production
SECRET_KEY=<random-secret-key>
JWT_SECRET_KEY=<random-jwt-secret>
JWT_ACCESS_TOKEN_EXPIRES=3600
DATABASE_URL=<postgresql-connection-string>
CORS_ORIGINS=https://your-app.vercel.app
```

---

## Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Render Documentation**: https://render.com/docs
- **Flask Deployment**: https://flask.palletsprojects.com/en/latest/deploying/

Your application is now live and ready to use! 🎉
