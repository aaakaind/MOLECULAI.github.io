# Testing Vercel Deployment Locally

## Prerequisites

```bash
npm install -g vercel
```

## Testing Serverless Functions Locally

### Option 1: Using Vercel Dev (Recommended)

```bash
# Install dependencies
npm install

# Start Vercel development server
vercel dev
```

This starts a local server at `http://localhost:3000` that simulates the Vercel environment.

### Option 2: Test Individual API Routes

You can test individual API routes using Node.js:

```bash
# Test health endpoint
node -e "
const handler = require('./api/health.js').default;
const req = { method: 'GET' };
const res = {
  status: (code) => ({ json: (data) => console.log(JSON.stringify({ status: code, data }, null, 2)) })
};
handler(req, res);
"
```

### Option 3: Using cURL after Deployment

Once deployed to Vercel, test the endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Get molecules
curl https://your-app.vercel.app/api/molecules

# Get specific molecule
curl https://your-app.vercel.app/api/molecules?id=water

# Register user
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## Running Existing Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Verifying the Deployment

### 1. Check vercel.json Configuration

The `vercel.json` file should exist and contain proper routing configuration.

### 2. Verify API Routes

All API routes should be in the `/api` directory:
- `/api/health.js` - Health check
- `/api/molecules.js` - Molecule data
- `/api/login.js` - User login
- `/api/register.js` - User registration
- `/api/visualizations.js` - Saved visualizations

### 3. Test Static Files

Static files should be served from the `/public` directory:
- `http://localhost:3000/` - Main page
- `http://localhost:3000/css/styles.css` - Styles
- `http://localhost:3000/js/app.js` - JavaScript

### 4. Check Environment Variables

Ensure `JWT_SECRET` is set:
- Local: Create a `.env` file with `JWT_SECRET=your-secret-key`
- Vercel: Set in Project Settings → Environment Variables

## Common Issues

### Issue: "Cannot find module"

**Solution**: Ensure all dependencies are installed:
```bash
npm install
```

### Issue: CORS errors

**Solution**: CORS is configured in the API routes. If you still see errors, check that you're making requests to the correct domain.

### Issue: JWT_SECRET not set

**Solution**: 
- Local: Copy `.env.example` to `.env` and set `JWT_SECRET`
- Vercel: Add environment variable in dashboard

## Deployment Checklist

Before deploying to Vercel:

- [ ] All tests pass (`npm test`)
- [ ] `vercel.json` is present and valid
- [ ] `.vercelignore` excludes unnecessary files
- [ ] `.env.example` documents all required variables
- [ ] API routes are in `/api` directory
- [ ] Static files are in `/public` directory
- [ ] `JWT_SECRET` is ready to be set in Vercel dashboard
- [ ] README.md has deployment instructions

After deploying to Vercel:

- [ ] Set `JWT_SECRET` environment variable
- [ ] Test health endpoint: `/api/health`
- [ ] Test molecules endpoint: `/api/molecules`
- [ ] Test authentication: register and login
- [ ] Verify static site loads correctly
- [ ] Check browser console for errors
- [ ] Test on mobile device

## Performance Testing

```bash
# Test response time
time curl https://your-app.vercel.app/api/health

# Load testing (requires Apache Bench)
ab -n 100 -c 10 https://your-app.vercel.app/api/molecules
```

## Monitoring

Once deployed, monitor your application:

1. **Vercel Dashboard**: View deployment logs and analytics
2. **Browser DevTools**: Check for console errors and network issues
3. **Lighthouse**: Run performance and accessibility audits

## Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Main Deployment Guide](DEPLOYMENT.md)
