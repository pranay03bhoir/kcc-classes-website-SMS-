# Contact Form Production Setup

## Issue Identified
The contact form is not working in production due to missing API URL configuration and cross-origin issues.

## Root Cause
- The frontend uses `process.env.NEXT_PUBLIC_AXIOS_USER_URL` environment variable
- This variable was not configured for production deployment
- The fallback URL was trying to use same-origin `/api/common` but backend is on different domain
- Frontend domain: `https://www.kccclasses.in`
- Backend domain: `https://kcc-classes-website-sms.onrender.com`

## Solution Applied

### 1. Updated All API Configurations
Modified all axios configuration files to use Render backend URL for production:

- `common-axios.js`: Contact form, public API endpoints
- `axios.js`: Admin endpoints  
- `student-axios.js`: Student endpoints
- `teacher-axios.js`: Teacher endpoints

All now use:
```javascript
baseURL:
  process.env.NEXT_PUBLIC_AXIOS_USER_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:5000/api/common"
    : "https://kcc-classes-website-sms.onrender.com/api/common"),
```

### 2. Cross-Origin Configuration
The frontend will now automatically:
- Use `http://localhost:5000/api/*` for localhost development
- Use `https://kcc-classes-website-sms.onrender.com/api/*` for production

## Backend CORS Requirements

Ensure your backend `.env` has:
```env
NODE_ENV=PRODUCTION
FRONTEND_URL=https://www.kccclasses.in
PORT=5000
```

## Troubleshooting

### 401 Unauthorized Errors
The `/auth/check` endpoint returning 401 is **normal** for unauthenticated users. This error in the console doesn't indicate a problem with the contact form.

### Contact Form Testing
To test the contact form:
1. Open browser DevTools → Network tab
2. Fill out and submit the contact form
3. Look for `POST /api/common/contact` request
4. Check if it returns 201 status (success)

### CORS Issues
If you see CORS errors:
1. Check backend logs for CORS configuration
2. Verify `FRONTEND_URL` environment variable is set correctly
3. Ensure the backend is running in production mode

### Email Configuration
The backend requires email configuration for notifications:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OWNER_EMAIL=notifications@your-domain.com
```

## Environment Variables (Optional)
If you need to override the automatic URL detection:

#### For Development (.env.local):
```env
NEXT_PUBLIC_AXIOS_USER_URL=http://localhost:5000/api/common
NEXT_PUBLIC_AXIOS_ADMIN_URL=http://localhost:5000/api/admin
NEXT_PUBLIC_AXIOS_STUDENT_URL=http://localhost:5000/api/student
NEXT_PUBLIC_AXIOS_TEACHER_URL=http://localhost:5000/api/teacher
```

#### For Production (.env.production):
```env
NEXT_PUBLIC_AXIOS_USER_URL=https://kcc-classes-website-sms.onrender.com/api/common
NEXT_PUBLIC_AXIOS_ADMIN_URL=https://kcc-classes-website-sms.onrender.com/api/admin
NEXT_PUBLIC_AXIOS_STUDENT_URL=https://kcc-classes-website-sms.onrender.com/api/student
NEXT_PUBLIC_AXIOS_TEACHER_URL=https://kcc-classes-website-sms.onrender.com/api/teacher
```

## Next Steps
1. Deploy the updated frontend code
2. Verify backend CORS configuration
3. Test contact form submission
4. Check email delivery functionality
