# Contact Form Production Setup

## Issue Identified
The contact form is not working in production due to missing API URL configuration.

## Root Cause
- The frontend uses `process.env.NEXT_PUBLIC_AXIOS_USER_URL` environment variable
- This variable is not configured for production deployment
- The fallback URL only works for localhost development

## Solution Applied

### 1. Updated API Configuration
Modified `frontend/src/utils/common-axios.js` to handle production environment:
```javascript
baseURL:
  process.env.NEXT_PUBLIC_AXIOS_USER_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:5000/api/common"
    : "/api/common"),
```

### 2. Environment Variable Setup
Create the appropriate environment file for your deployment:

#### For Development (.env.local):
```
NEXT_PUBLIC_AXIOS_USER_URL=http://localhost:5000/api/common
```

#### For Production (.env.production):
```
NEXT_PUBLIC_AXIOS_USER_URL=https://your-backend-domain.com/api/common
```

## Deployment Options

### Option 1: Same Origin Deployment
If frontend and backend are served from the same domain:
- No environment variable needed
- The fallback `/api/common` will work automatically

### Option 2: Cross-Origin Deployment
If frontend and backend are on different domains:
- Set `NEXT_PUBLIC_AXIOS_USER_URL` to your backend API URL
- Ensure backend CORS allows your frontend domain

### Option 3: Vercel Deployment
For Vercel deployment with separate backend:
```
NEXT_PUBLIC_AXIOS_USER_URL=https://your-backend.vercel.app/api/common
```

## Backend Configuration
Ensure your backend `.env` has:
```
NODE_ENV=PRODUCTION
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
```

## Testing
After deployment:
1. Check browser network tab for API calls
2. Verify CORS headers in backend response
3. Test contact form submission
4. Check backend logs for email configuration

## Email Configuration
The backend also requires email configuration for notifications:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OWNER_EMAIL=notifications@your-domain.com
```
