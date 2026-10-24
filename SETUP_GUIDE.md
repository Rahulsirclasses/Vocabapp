# 🚀 Quick Setup Guide

## ✅ What's Already Done

1. ✅ **Migration Complete** - All users have auth fields
2. ✅ **Environment File Updated** - Placeholders added to `.env.local`
3. ✅ **App Running** - Server at http://localhost:3000

---

## 🔑 Get Your Credentials (5-10 minutes)

### Step 1: Google OAuth Credentials

1. **Go to:** https://console.cloud.google.com/
2. **Create/Select Project:**
   - Click "Select a project" → "New Project"
   - Name it "WordWiz" → Create

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → Create
   - Fill in:
     - App name: WordWiz
     - User support email: your email
     - Developer contact: your email
   - Save and Continue (skip scopes)
   - Add test users: your email
   - Save

5. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "WordWiz Local"
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"

6. **Copy Credentials:**
   - Copy "Client ID" → Replace `your_google_client_id_here` in `.env.local`
   - Copy "Client secret" → Replace `your_google_client_secret_here` in `.env.local`

---

### Step 2: Resend API Key

1. **Go to:** https://resend.com/
2. **Sign Up/Login** (free account)
3. **Create API Key:**
   - Go to "API Keys" in dashboard
   - Click "Create API Key"
   - Name: "WordWiz Development"
   - Permission: "Full Access"
   - Click "Create"

4. **Copy API Key:**
   - Copy the key (starts with `re_`)
   - Replace `your_resend_api_key_here` in `.env.local`

---

## 📝 Update .env.local

Open `.env.local` and replace the placeholders:

```env
# Replace these three values:
GOOGLE_CLIENT_ID=your_actual_client_id_from_google
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google
RESEND_API_KEY=re_your_actual_resend_api_key
```

---

## 🔄 Restart Server

After adding credentials:

```bash
# Stop the server (Ctrl+C in terminal)
# Start again:
npm run dev
```

---

## 🧪 Test It Out

### Test 1: Email/Password Login
1. Go to http://localhost:3000/auth/login
2. Login with existing credentials
3. ✅ Should work (no credentials needed)

### Test 2: Google OAuth
1. Go to http://localhost:3000/auth/login
2. Click "Sign in with Google"
3. Select your Google account
4. ✅ Should create account and redirect to /verify-email

### Test 3: Email Verification
1. After Google login, you're at /verify-email
2. Click "Resend Verification Email"
3. Go to https://resend.com/emails (in dev mode)
4. See the verification email
5. Click the link
6. ✅ Should verify and redirect to /learn

### Test 4: Admin Panel
1. Manually set your user role to "admin" in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Go to http://localhost:3000/admin
3. ✅ Should see user management panel

---

## 🎯 What Works Right Now (Without Credentials)

- ✅ Email/password authentication
- ✅ All learning features
- ✅ Quiz system
- ✅ Stats tracking
- ✅ Middleware authorization
- ✅ User migration complete

## 🔐 What Needs Credentials

- ⏳ Google OAuth login
- ⏳ Email verification emails

---

## 💡 Tips

### Development Mode (Resend)
- Emails appear in Resend dashboard, not your inbox
- Perfect for testing
- No domain verification needed

### Production Mode
- Verify your domain in Resend
- Update sender email in `lib/email/verification.ts`
- Add production redirect URI to Google Console

### Testing Email Verification
- Use your own email as test user in Google Console
- Check Resend dashboard for verification emails
- Tokens expire in 15 minutes

---

## 🆘 Troubleshooting

### "Google OAuth not working"
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env.local`
- Verify redirect URI: `http://localhost:3000/api/auth/callback/google`
- Restart server after adding credentials

### "Email not sending"
- Check RESEND_API_KEY in `.env.local`
- Check Resend dashboard for emails (dev mode)
- Verify API key has "Full Access" permission

### "Can't access admin panel"
- Manually set role to "admin" in MongoDB
- Check middleware isn't blocking you
- Verify you're logged in

---

## ✅ You're All Set!

Once you add the credentials and restart:
- Google OAuth will work
- Email verification will work
- Admin panel will work
- Full authentication system active!

**Total setup time: ~10 minutes**
