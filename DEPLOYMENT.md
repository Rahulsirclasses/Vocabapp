# Deployment Guide

This guide outlines the steps to deploy the **Word Wiz Vocabulary App** to a live environment. We recommend **Vercel** as it provides the best support for Next.js applications.

## Prerequisites

- **GitHub Account**: Your project code should be pushed to a repository.
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
- **MongoDB Database**: 
    - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
    - Get the connection string.
- **Google OAuth Credentials**:
    - Create a new project in [Google Cloud Console](https://console.cloud.google.com/).
    - configure the OAuth consent screen.
    - Create credentials (Client ID and Secret).
- **Resend API Key**:
    - Sign up at [resend.com](https://resend.com).
    - Generate an API Key.

## Environment Variables

Set these in your Vercel Project Settings:

- `MONGODB_URI`: Connection string to your production MongoDB.
- `NEXTAUTH_URL`: The URL of your deployed app (e.g., `https://your-app.vercel.app`).
- `NEXTAUTH_SECRET`: A random string (generate with `openssl rand -base64 32`).
- `GOOGLE_CLIENT_ID`: From Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
- `RESEND_API_KEY`: From Resend dashboard.

## Deployment Steps

1. **Push Code**: Commit and push your code to GitHub.
2. **Import Project**: In Vercel, import your repository.
3. **Configure**: Add the environment variables listed above.
4. **Deploy**: Click Deploy.
