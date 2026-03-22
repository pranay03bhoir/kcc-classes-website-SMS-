# Production Deployment Troubleshooting Guide

## Issue: Contact Form Not Working in Production

### Symptoms
- Form gets stuck in "sending..." state
- No response from backend API
- Works locally but not in production

### Common Causes & Solutions

#### 1. Backend Deployment Issues
**Check if backend is actually running:**
```bash
curl https://kcc-classes-website-sms.onrender.com/api/common/auth/check
```

**If backend is down:**
- Check Render dashboard for deployment status
- Look for build errors or crashes
- Check environment variables in Render

#### 2. CORS Issues
**Symptoms:** CORS policy errors in browser console
**Solution:** Backend CORS should allow `https://www.kccclasses.in`

#### 3. Network Connectivity
**Symptoms:** Timeout or network errors
**Solution:** 
- Check if firewall blocking requests
- Verify SSL certificates
- Test from different networks

#### 4. Environment Variables
**Backend .env should have:**
```env
NODE_ENV=PRODUCTION
FRONTEND_URL=https://www.kccclasses.in
CROSS_SITE=true
```

#### 5. Render Specific Issues
Render free tier has limitations:
- **Cold starts**: First request may timeout (15-30 seconds)
- **Inactivity**: Backend sleeps after 15 minutes
- **Memory limits**: May cause crashes under load

### Debugging Steps

1. **Test Backend Directly:**
   ```bash
   curl -X POST https://kcc-classes-website-sms.onrender.com/api/common/contact \
   -H "Content-Type: application/json" \
   -d '{"fullName":"Test","email":"test@test.com","phone":"1234567890","subject":"Other","grade":"Class 10","message":"Test message","consent":true}'
   ```

2. **Check Browser Console:**
   - Open DevTools → Network tab
   - Submit form and watch for `/api/common/contact` request
   - Check status code and response time

3. **Monitor Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for errors during form submission

### Fallback Solution Implemented

The contact form now includes:
1. **Connectivity test button** to verify API reachability
2. **Email fallback** when API fails
3. **Better error messages** for debugging
4. **15-second timeout** to prevent hanging

### If Still Not Working

**Option 1: Use Email Fallback**
- Users can click "Open Email Client" when server fails
- Emails go directly to `kccclasses.kcc@gmail.com`

**Option 2: Switch to Same-Origin Deployment**
- Host frontend and backend on same domain
- Eliminates CORS issues entirely

**Option 3: Upgrade Render Plan**
- Paid plans eliminate cold starts
- Better performance and reliability

### Immediate Actions

1. Deploy the updated frontend with debugging tools
2. Test the "Test Connection" button
3. Check browser console for detailed error messages
4. Monitor Render logs during form submission
