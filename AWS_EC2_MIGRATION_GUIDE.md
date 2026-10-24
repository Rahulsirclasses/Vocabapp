
# ☁️ AWS EC2 Migration Guide (Secure Setup)

This guide explains how to move your **App** and your **Local Database** (Data) to an AWS EC2 server securely.

## 🚨 Prerequisites
*   An AWS Account.
*   A domain name (optional but recommended for HTTPS/SSL).
*   **Git Bash** (or terminal) on your local computer.

---

## Phase 1: Export Your Local Data (The "Backup")

1.  **Open Terminal** in your project folder.
2.  Run this command to "dump" your local database into a folder:
    ```bash
    mongodump --uri="mongodb://localhost:27017/word-wiz" --out=./backup
    ```
    *(Note: If `mongodump` is not found, you need to install MongoDB Database Tools).*
3.  You will now see a `backup/word-wiz` folder. This contains your `users`, `vocab`, etc.
4.  Zip it up for easier transfer:
    (Windows: Right-click `backup` folder -> Send to -> Compressed (zipped) folder -> name it `backup.zip`).

---

## Phase 2: Setup AWS EC2 Server

1.  **Launch Instance**:
    *   OS: **Ubuntu Server 22.04 LTS** (Recommended).
    *   Instance Type: **t2.micro** (Free tier eligible) or **t3.small** (Better performance).
    *   **Key Pair**: Create a new key pair (`myserver-key.pem`). **Download and keep it safe!**
2.  **Security Group (Firewall)**:
    *   Allow **SSH** (Port 22) -> Source: **My IP** (For security).
    *   Allow **HTTP** (Port 80) -> Source: **Anywhere** (0.0.0.0/0).
    *   Allow **HTTPS** (Port 443) -> Source: **Anywhere** (0.0.0.0/0).
    *   **DO NOT OPEN PORT 27017 (MongoDB) to the world!** (Keep it blocked).

---

## Phase 3: Connect & Install Dependencies

1.  **Connect via SSH**:
    ```bash
    ssh -i "path/to/myserver-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
    ```
2.  **Update Server**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
3.  **Install Node.js (v20)**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    ```
4.  **Install MongoDB (Generic Ubuntu Steps)**:
    *   Import public key:
        ```bash
        curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
        ```
    *   Create list file:
        ```bash
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        ```
    *   Install:
        ```bash
        sudo apt update
        sudo apt install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
        ```

---

## Phase 4: Secure MongoDB & Import Data

1.  **Upload Backup**:
    *   Open a **new local terminal** (not the SSH one).
    *   Copy the zip file to the server:
        ```bash
        # (Replace YOUR_EC2_PUBLIC_IP with actual IP)
        scp -i "path/to/myserver-key.pem" backup.zip ubuntu@YOUR_EC2_PUBLIC_IP:~/
        ```
2.  **Import on Server**:
    *   Back in your **SSH terminal**:
        ```bash
        sudo apt install unzip
        unzip backup.zip
        mongorestore --uri="mongodb://localhost:27017" backup/
        ```
    *(Your data is now in the cloud database!)*

3.  **Secure MongoDB (CRITICAL)**:
    *   Enter Mongo Shell: `mongosh`
    *   Switch to admin: `use admin`
    *   Create Admin User:
        ```javascript
        db.createUser({
          user: "myAdmin",
          pwd: "STRONG_PASSWORD_HERE", // Change this!
          roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
        })
        ```
    *   Exit: `exit`
    *   **Enable Auth**: Edit config `sudo nano /etc/mongod.conf`.
        *   Find `#security:` -> Uncomment and change to:
            ```yaml
            security:
              authorization: enabled
            ```
    *   Restart Mongo: `sudo systemctl restart mongod`.

---

## Phase 5: Deploy App

1.  **Clone Repo**:
    ```bash
    git clone https://github.com/Rahulsirclasses/word-wiz-app_vocab.git
    cd word-wiz-app_vocab
    npm install
    ```
2.  **Setup Env**:
    ```bash
    nano .env.local
    ```
    *   Paste your variables.
    *   **Important**: `MONGODB_URI` should now be:
        `mongodb://myAdmin:STRONG_PASSWORD_HERE@localhost:27017/word-wiz?authSource=admin`
3.  **Build**:
    ```bash
    npm run build
    ```
4.  **Start with PM2 (Process Manager)**:
    ```bash
    sudo npm install -g pm2
    pm2 start npm --name "word-wiz" -- start
    pm2 save
    pm2 startup
    ```

---

## Phase 6: Setup Nginx (Reverse Proxy) & SSL

1.  **Install Nginx**:
    ```bash
    sudo apt install nginx -y
    ```
2.  **Configure Nginx**:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
    *   Replace `location /` block with:
        ```nginx
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        ```
    *   Test & Restart: `sudo nginx -t && sudo systemctl restart nginx`

**🎉 Done! Your app is now running securely on AWS with your local data imported.**
