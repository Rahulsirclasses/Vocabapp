# 🚀 Get Your API Credentials - Step by Step

Follow these steps to get your app fully functional!

---

## 📍 Step 1: Get Google OAuth Credentials (5 minutes)

### 1.1 Go to Google Cloud Console
**Open this link:** https://console.cloud.google.com/

### 1.2 Create a New Project
1. Click **"Select a project"** (top left, near Google Cloud logo)
2. Click **"NEW PROJECT"** (top right)
3. Enter project name: **WordWiz**
4. Click **"CREATE"**
5. Wait for project to be created (notification will appear)
6. Click **"SELECT PROJECT"** in the notification

### 1.3 Configure OAuth Consent Screen
1. In the left menu, go to: **APIs & Services** → **OAuth consent screen**
2. Select **"External"** user type
3. Click **"CREATE"**
4. Fill in the form:
   - **App name:** WordWiz
   - **User support email:** (select your email from dropdown)
   - **Developer contact information:** (enter your email)
5. Click **"SAVE AND CONTINUE"**
6. On "Scopes" page, click **"SAVE AND CONTINUE"** (skip this)
7. On "Test users" page:
   - Click **"+ ADD USERS"**
   - Enter your email address
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**
8. Review summary, click **"BACK TO DASHBOARD"**

### 1.4 Create OAuth Credentials
1. In the left menu, go to: **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** (top)
3. Select **"OAuth client ID"**
4. If prompted to configure consent screen, you already did it - click **"CREATE"** again
5. Fill in the form:
   - **Application type:** Web application
   - **Name:** WordWiz Local Dev
   - **Authorized redirect URIs:**
     - Click **"+ ADD URI"**
     - Enter: `http://localhost:3000/api/auth/callback/google`
     - Press Enter
6. Click **"CREATE"**

### 1.5 Copy Your Credentials
A popup will appear with your credentials:

1. **Copy the "Client ID"** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - Keep this safe, you'll paste it in `.env.local`

2. **Copy the "Client secret"** (looks like: `GOCSPX-abc123xyz`)
   - Keep this safe too

3. Click **"OK"** to close the popup

✅ **Google OAuth credentials obtained!**

---

## 📍 Step 2: Get Resend API Key (3 minutes)

### 2.1 Go to Resend
**Open this link:** https://resend.com/

### 2.2 Sign Up / Login
1. Click **"Sign Up"** (or "Login" if you have an account)
2. Sign up with your email or GitHub
3. Verify your email if needed

### 2.3 Create API Key
1. After login, you'll be in the dashboard
2. In the left menu, click **"API Keys"**
3. Click **"+ Create API Key"** (top right)
4. Fill in:
   - **Name:** WordWiz Development
   - **Permission:** Full Access (default)
5. Click **"Create"**

### 2.4 Copy Your API Key
1. **Copy the API key** (starts with `re_` - looks like: `re_123abc456def`)
   - ⚠️ **IMPORTANT:** You can only see this once! Copy it now!
   - Keep this safe

2. Click **"Done"**

✅ **Resend API key obtained!**

---

## 📍 Step 3: Update .env.local

Now let's add your credentials to the app:

1. Open the file: `c:\Users\ADMIN\Desktop\aa\v0-word-wiz-vocabulary-app\.env.local`

2. Replace these three lines:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. With your actual credentials:
   ```env
   GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
   RESEND_API_KEY=re_123abc456def
   ```

4. **Save the file**

---

## 📍 Step 4: Restart the Server

1. In your terminal (where `npm run dev` is running):
   - Press **Ctrl+C** to stop the server
   
2. Start it again:
   ```bash
   npm run dev
   ```

3. Wait for: `✓ Ready in X.Xs`

---

## ✅ Step 5: Test Everything!

### Test Google OAuth:
1. Go to: http://localhost:3000/auth/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. Approve the consent
5. ✅ Should redirect to `/verify-email`

### Test Email Verification:
1. On the `/verify-email` page
2. Click **"Resend Verification Email"**
3. Go to: https://resend.com/emails
4. You'll see the verification email there
5. Click the verification link
6. ✅ Should verify and redirect to `/learn`

---

## 🆘 If You Get Stuck

**Google OAuth not working?**
- Make sure redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Check you added your email as a test user
- Verify credentials are copied correctly (no extra spaces)

**Email not sending?**
- Check Resend API key starts with `re_`
- Make sure you have "Full Access" permission
- In development, emails appear in Resend dashboard, not your inbox

**Need help?**
- Let me know which step you're on
- Share any error messages you see

---

## 📝 Quick Checklist

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth credentials
- [ ] Copied Client ID and Client Secret
- [ ] Signed up for Resend
- [ ] Created Resend API key
- [ ] Copied API key
- [ ] Updated `.env.local` with all 3 credentials
- [ ] Saved `.env.local`
- [ ] Restarted server (Ctrl+C then npm run dev)
- [ ] Tested Google OAuth login
- [ ] Tested email verification

---

**Ready to start? Let me know when you have the credentials and I'll help you update the `.env.local` file!** 🚀
