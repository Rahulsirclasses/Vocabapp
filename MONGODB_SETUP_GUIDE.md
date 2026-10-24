
# ☁️ How to Setup MongoDB Atlas (Cloud Database)

Your local database (`mongodb://localhost...`) **cannot work** on Netlify because Netlify is on the internet and your computer is private.

You must create a **FREE** cloud database.

## 1. Create a Free Cluster
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up (it's free, no credit card needed).
3.  Create a **"Shared"** Cluster (Free tier).
4.  Choose **AWS** and a region near you (e.g., Mumbai `ap-south-1`).
5.  Click **Create Cluster**.

## 2. Create a Database User
1.  Go to **Database Access** (on the left sidebar).
2.  Click **Autofill Password** (Copy this password! You will need it).
3.  Enter a username (e.g., `admin`).
4.  Click **Add User**.
    *   *Note: Special characters in passwords must be URL encoded later.*

## 3. Allow Network Access (CRITICAL)
1.  Go to **Network Access** (on the left sidebar).
2.  Click **Add IP Address**.
3.  Click **"Allow Access from Anywhere"** (0.0.0.0/0).
4.  Click **Confirm**.
    *   *If you do not do this, Netlify will crash.*

## 4. Get Connection String
1.  Go to **Database** (on the left sidebar).
2.  Click **Connect**.
3.  Choose **"Drivers"**.
4.  Copy the connection string. It looks like:
    `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

## 5. Update Netlify
1.  Replace `<password>` with your actual password.
2.  Go to **Netlify** -> **Site configuration** -> **Environment variables**.
3.  Edit `MONGODB_URI` and paste your **new cloud connection string**.
4.  **Re-deploy** your site.
