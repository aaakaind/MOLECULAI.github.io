# Deployment Guide for MOLECULAI

This guide covers deploying MOLECULAI to various platforms for optimal performance and ease of use.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [GitHub Pages (Static Only)](#github-pages-static-only)
- [Cloudflare Pages](#cloudflare-pages)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform for MOLECULAI because it provides:
- ✅ Automatic HTTPS and CDN
- ✅ Serverless API functions (no server management needed)
- ✅ Zero-config deployment from GitHub
- ✅ Preview deployments for pull requests
- ✅ Easy environment variable management
- ✅ Free tier suitable for this project

### Quick Deploy to Vercel

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaakaind/MOLECULAI.github.io)

#### Option 2: Manual Deploy

1. **Install Vercel CLI** (optional, for local testing)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

4. **Configure Environment Variables** (in Vercel Dashboard)
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `JWT_SECRET` with a secure random string
   - Optionally add `NODE_ENV=production`

5. **Your site is live!**
   - Vercel will provide a URL like `moleculai-xyz.vercel.app`
   - You can add a custom domain in the project settings

### Local Development with Vercel

Test the Vercel deployment locally:

```bash
# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Run Vercel development server
vercel dev
```

This starts a local server that simulates the Vercel environment, including serverless functions.

### Configuration

The repository includes `vercel.json` which configures:
- API routes under `/api/*`
- Static file serving from `/public`
- Security headers
- CORS settings

### Features Enabled on Vercel
- ✅ Full molecular visualization
- ✅ User authentication (register/login)
- ✅ Save and load visualizations
- ✅ All API endpoints
- ✅ Real-time molecule data

### ⚠️ Important Limitations

**Demo Authentication System:**
The current implementation uses in-memory storage for user accounts and visualizations. This means:
- User accounts and saved data do NOT persist across serverless function cold starts
- Data will be lost when the function scales down or restarts
- This is intended for DEMO and TESTING purposes only

**For Production Use:**
To enable persistent data storage, you need to integrate a database:
- **PostgreSQL** - Recommended for relational data
- **MongoDB** - Good for document storage
- **Redis** - Fast key-value store
- **Vercel KV** - Built-in key-value storage

See [Database Integration Guide](#database-integration) below for details.

---

## GitHub Pages (Static Only)

GitHub Pages is already configured for static deployment. This option:
- ✅ Free hosting
- ✅ Automatic deployment from main branch
- ✅ Good for showcasing visualizations
- ❌ No backend features (auth, saving)

### Already Configured

The repository has a GitHub Actions workflow (`.github/workflows/static.yml`) that automatically deploys to GitHub Pages when you push to the `main` branch.

### Access Your Site

After pushing to `main`, your site will be available at:
```
https://aaakaind.github.io/MOLECULAI.github.io/
```

### Limitations

- No user authentication
- Cannot save visualizations
- Uses embedded molecule data only
- Read-only experience

---

## Cloudflare Pages

Cloudflare Pages is another excellent option with similar features to Vercel.

### Deploy to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages"

2. **Connect Your Repository**
   - Click "Create a project"
   - Connect your GitHub account
   - Select the `MOLECULAI.github.io` repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Build output directory: public
   Root directory: (leave empty)
   ```

4. **Environment Variables**
   - Add `JWT_SECRET` with a secure value
   - Add `NODE_ENV=production`

5. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your site

### Cloudflare Functions

For API routes, you'll need to create Cloudflare Functions:
- Move files from `/api` to `/functions`
- Adjust the code format for Cloudflare Workers

**Note**: The current setup is optimized for Vercel. Cloudflare Pages would require some refactoring of the API routes.

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key-min-32-chars` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (local development only) | `3000` |

### Generating a Secure JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

⚠️ **Security Note**: Never commit your `.env` file or expose your `JWT_SECRET` publicly.

---

## Troubleshooting

### Common Issues

#### 1. "JWT_SECRET must be set in production"

**Solution**: Add the `JWT_SECRET` environment variable in your deployment platform's settings.

#### 2. API routes return 404

**Solution**: 
- Verify `vercel.json` is present and correct
- Check that API files are in the `/api` directory
- Ensure you've redeployed after adding API files

#### 3. CORS errors

**Solution**: The API routes include CORS headers. If you still see errors:
- Check that you're accessing the API from the same domain
- Verify browser console for specific CORS error messages
- Update the `Access-Control-Allow-Origin` header if needed

#### 4. "Cannot find module 'molecules-server.js'"

**Solution**: Ensure the `mcp-server` directory is included in your deployment:
- Check `.vercelignore` doesn't exclude it
- Verify the module path is correct
- Ensure all dependencies are installed

#### 5. Molecules not loading

**Solution**:
- For static deployment (GitHub Pages): Molecules are embedded in `molecules-data.js`
- For full-stack deployment (Vercel): Check API endpoints are working
- Verify `config.js` has the correct `USE_EMBEDDED_DATA` setting

### Testing Your Deployment

#### Test Health Endpoint
```bash
curl https://your-deployment-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T...",
  "environment": "vercel-serverless"
}
```

#### Test Molecules Endpoint
```bash
curl https://your-deployment-url.vercel.app/api/molecules
```

Should return an array of molecule objects.

---

## Database Integration

The demo deployment uses in-memory storage which does not persist in serverless environments. For production use with persistent data, integrate a database.

### Option 1: Vercel Postgres (Easiest)

Vercel provides built-in PostgreSQL databases:

1. **Go to your Vercel project dashboard**
2. **Navigate to Storage tab**
3. **Click "Create Database" → Postgres**
4. **Connect to your project**

Vercel automatically adds environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

5. **Update API routes** to use PostgreSQL instead of Map storage

Example using `pg` library:
```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

// Replace Map with database queries
const users = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
```

### Option 2: Vercel KV (Redis)

For simple key-value storage:

1. **Go to your Vercel project dashboard**
2. **Navigate to Storage tab**
3. **Click "Create Database" → KV (Redis)**
4. **Install Vercel KV SDK:**
   ```bash
   npm install @vercel/kv
   ```

5. **Update API routes:**
   ```javascript
   import { kv } from '@vercel/kv';
   
   // Store user
   await kv.set(`user:${username}`, userData);
   
   // Retrieve user
   const user = await kv.get(`user:${username}`);
   ```

### Option 3: External Database

Connect to any external database:

**PostgreSQL (Supabase, Neon, Railway):**
```bash
# Add to Vercel environment variables
POSTGRES_URL=postgresql://user:password@host:5432/database
```

**MongoDB (MongoDB Atlas):**
```bash
# Add to Vercel environment variables
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

**Redis (Upstash, Redis Cloud):**
```bash
# Add to Vercel environment variables
REDIS_URL=redis://default:password@host:port
```

### Migration Steps

1. **Choose a database** from options above
2. **Create database schema** for users, visualizations
3. **Update API routes** to replace Map with database calls
4. **Add database connection string** to Vercel environment variables
5. **Test thoroughly** before production use
6. **Add error handling** for database connection issues

### Database Schema Example

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visualizations table
CREATE TABLE visualizations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  molecule_id VARCHAR(255) NOT NULL,
  settings JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Performance Tips

1. **Use CDN**: Both Vercel and Cloudflare provide automatic CDN distribution
2. **Enable Caching**: Static assets are automatically cached
3. **Optimize Images**: Compress any images in the `/public` directory
4. **Monitor Usage**: Check your platform's analytics dashboard

---

## Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/aaakaind/MOLECULAI.github.io/issues)
2. Review the [main README](../README.md)
3. Open a new issue with:
   - Deployment platform
   - Error messages
   - Steps to reproduce

---

## Deployment Comparison

| Feature | Vercel | GitHub Pages | Cloudflare Pages |
|---------|--------|--------------|------------------|
| Static hosting | ✅ | ✅ | ✅ |
| Serverless functions | ✅ | ❌ | ✅ (with setup) |
| Auto HTTPS | ✅ | ✅ | ✅ |
| Custom domains | ✅ | ✅ | ✅ |
| GitHub integration | ✅ | ✅ | ✅ |
| Preview deployments | ✅ | ❌ | ✅ |
| Free tier | ✅ Generous | ✅ | ✅ Generous |
| Setup complexity | ⭐ Easy | ⭐ Easy | ⭐⭐ Medium |
| Best for | **Full-stack** | Static demo | Full-stack |

**Recommendation**: Use **Vercel** for the best out-of-the-box experience with this codebase.
