# 🔧 Fix Google OAuth Error: redirect_uri_mismatch

## ❌ The Error You're Seeing

```
Error 400: redirect_uri_mismatch
```

This means the redirect URI in Google Cloud Console doesn't match what your app is using.

---

## ✅ How to Fix (2 minutes)

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Make sure you're in the **WordWiz** project (top left dropdown)

### Step 2: Go to Credentials
1. Click the menu (☰) → **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID (should be named "WordWiz Local" or similar)
3. Click on it to edit

### Step 3: Add the Correct Redirect URI

In the **Authorized redirect URIs** section, you need to add:

```
http://localhost:3000/api/auth/callback/google
```

**IMPORTANT:** Make sure it's EXACTLY this:
- ✅ `http://localhost:3000/api/auth/callback/google`
- ❌ NOT `http://localhost:3000/api/auth/callback/google/`  (no trailing slash)
- ❌ NOT `https://localhost:3000/api/auth/callback/google` (http, not https)

### Step 4: Save
1. Click **"SAVE"** at the bottom
2. Wait a few seconds for Google to update

### Step 5: Test Again
1. Go back to: http://localhost:3000/auth/login
2. Click "Sign in with Google"
3. ✅ Should work now!

---

## 📸 What It Should Look Like

In Google Cloud Console, under **Authorized redirect URIs**, you should see:

```
http://localhost:3000/api/auth/callback/google
```

---

## 🆘 Still Not Working?

### Check These:

1. **Correct Project?**
   - Make sure you're editing the right OAuth client
   - Check the Client ID matches your `.env.local`

2. **Exact URI?**
   - No extra spaces
   - No trailing slash
   - `http` not `https`
   - Port `:3000` included

3. **Saved?**
   - Click SAVE button
   - Wait 10-30 seconds for Google to update

4. **Clear Browser Cache**
   - Try in incognito/private window
   - Or clear browser cache

---

## ✅ After Fixing

Once you add the redirect URI and save:

1. Go to http://localhost:3000/auth/login
2. Click "Sign in with Google"
3. Google consent screen appears
4. Select your account
5. ✅ Redirects back to your app
6. ✅ Creates user account
7. ✅ Redirects to /verify-email

---

**Let me know once you've added the redirect URI and I'll help you test it!**
