# Required Environment Variables

Add these environment variables to your `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Resend Email Service
RESEND_API_KEY=your_resend_api_key
```

## How to Get These Values

### 1. MongoDB URI
- Already configured in your app
- Keep your existing value

### 2. NextAuth Secret
- Already configured in your app
- Keep your existing value

### 3. Google OAuth Credentials

**Step 1:** Go to [Google Cloud Console](https://console.cloud.google.com/)

**Step 2:** Create a new project or select existing

**Step 3:** Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click "Enable"

**Step 4:** Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- Application type: "Web application"
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- For production, add: `https://yourdomain.com/api/auth/callback/google`

**Step 5:** Copy credentials
- Copy "Client ID" → `GOOGLE_CLIENT_ID`
- Copy "Client secret" → `GOOGLE_CLIENT_SECRET`

### 4. Resend API Key

**Step 1:** Go to [Resend](https://resend.com/)

**Step 2:** Sign up or log in

**Step 3:** Create API Key
- Go to "API Keys" in dashboard
- Click "Create API Key"
- Give it a name (e.g., "WordWiz Development")
- Copy the API key → `RESEND_API_KEY`

**Step 4:** Verify Domain (for production)
- Go to "Domains" in dashboard
- Add your domain
- Follow DNS verification steps
- Update email sender in `lib/email/verification.ts` from `onboarding@resend.dev` to `noreply@yourdomain.com`

## Testing in Development

For development, you can use Resend's test mode:
- Emails will be sent to your Resend dashboard
- No actual emails will be delivered
- Perfect for testing the flow

## Next Steps

1. Add these variables to `.env.local`
2. Restart your development server
3. Test Google OAuth login
4. Test email verification flow
