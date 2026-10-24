
# Deployment Guide: WordWiz on Netlify

## 1. Prerequisites
- A [Netlify](https://www.netlify.com/) account.
- A GitHub repository with this code pushed to it.
- Your MongoDB connection string (from MongoDB Atlas).
- Your Google OAuth credentials.
- Your NextAuth secret.

## 2. Netlify Setup

1.  **Log in to Netlify** and click **"Add new site"** -> **"Import an existing project"**.
2.  Choose **GitHub** and select your repository (`word-wiz-vocabulary-app`).
3.  **Build Settings**:
    *   **Base directory**: (leave empty)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
    *   (Netlify should auto-detect that it is a Next.js project).

## 3. Environment Variables (CRITICAL)

You **MUST** add the following environment variables in the Netlify Dashboard under **Site configuration > Environment variables**.

| Variable Key | Value Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB connection string (e.g., `mongodb+srv://...`) |
| `NEXTAUTH_URL` | Your Netlify URL (e.g., `https://your-app.netlify.app`) |
| `NEXTAUTH_SECRET` | A long random string (generate one with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

> **IMPORTANT:** Do NOT check the "Same as local" box if you are using `.env.local`. You must manually execute the copy-paste of these values.

## 4. Google OAuth Update
After deployment, go to your [Google Cloud Console](https://console.cloud.google.com/):
1.  Go to **APIs & Services > Credentials**.
2.  Edit your OAuth 2.0 Client ID.
3.  Add your Netlify URL to **Authorized JavaScript origins**: `https://your-app.netlify.app`
4.  Add the callback path to **Authorized redirect URIs**: `https://your-app.netlify.app/api/auth/callback/google`

## 5. Security & Protection
- **Headers**: We have configured `next.config.mjs` to include security headers like HSTS and X-Frame-Options to prevent clickjacking.
- **Environment**: Sensitive keys are server-side only. `NEXT_PUBLIC_` is NOT used for secrets.
- **Middleware**: Routes are protected by authentication middleware.
