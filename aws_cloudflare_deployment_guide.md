# TDA-Web Deployment Guide (AWS + Cloudflare)

This guide provides the complete, step-by-step process to deploy your TDA Skills application with the **Frontend on Cloudflare Pages** and the **Backend (Go, Postgres, Redis) on AWS EC2**.

---

## Phase 1: AWS Backend Setup (EC2, Postgres, Redis, Go)

### 1. Launch AWS EC2 Instance
1. Login to AWS Console -> **EC2** -> **Launch Instances**.
2. **OS:** Select **Ubuntu 22.04 LTS** (easier for standard packages).
3. **Instance Type:** `t3.small` or `t3.medium` (recommended for Go + DB + Redis).
4. **Key Pair:** Create a new key pair (`.pem`) and download it to SSH into the server.
5. **Network Settings (Security Groups):** 
   - Allow **SSH (Port 22)** from your IP.
   - Allow **HTTP (Port 80)** from Anywhere.
   - Allow **HTTPS (Port 443)** from Anywhere.
6. **Storage:** Allocate at least 20GB of gp3 storage.
7. Click **Launch Instance** and allocate an **Elastic IP** to this instance so the IP never changes.

### 2. Install Server Dependencies
SSH into your AWS instance using your terminal:
```bash
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

Run the following commands to install Postgres, Redis, Go, and Nginx:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y postgresql postgresql-contrib redis-server nginx git curl

# Install Go
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile
```

### 3. Setup PostgreSQL & Redis
Create the database and user to match your backend `.env`:
```bash
sudo -u postgres psql
```
Inside the SQL prompt:
```sql
CREATE DATABASE tdaskills;
CREATE USER tdaskills WITH ENCRYPTED PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE tdaskills TO tdaskills;
\q
```
*Redis will run automatically in the background on port 6379.*

### 4. Deploy Go Backend
Clone your code to the server and build it:
```bash
git clone https://github.com/your-username/TDA-Web.git
cd TDA-Web/backend

# Create your production .env file
nano .env 
# (Paste your database credentials, JWT secrets, Stripe keys, etc.)

# Build the Go server
go build -o server cmd/server/main.go
```

### 5. Create a Systemd Service (Keep backend running forever)
Create a service file:
```bash
sudo nano /etc/systemd/system/tdaskills.service
```
Paste this configuration (adjust paths if necessary):
```ini
[Unit]
Description=TDA Skills Go API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/TDA-Web/backend
ExecStart=/home/ubuntu/TDA-Web/backend/server
Restart=always

[Install]
WantedBy=multi-user.target
```
Start and enable the service:
```bash
sudo systemctl enable tdaskills
sudo systemctl start tdaskills
```

### 6. Setup Nginx & SSL (API Domain)
We need Nginx to route traffic to your Go app and handle HTTPS (e.g., `api.tdaskills.co.uk`).
```bash
sudo nano /etc/nginx/sites-available/api.tdaskills.co.uk
```
Paste this config:
```nginx
server {
    listen 80;
    server_name api.tdaskills.co.uk; # Replace with your API subdomain

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/api.tdaskills.co.uk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d api.tdaskills.co.uk
```

---

## Phase 2: Next.js Frontend Preparation

Cloudflare Pages uses Edge Workers, which requires specific Next.js configuration.

1. On your local machine, open the frontend folder and install the Cloudflare adapter:
```bash
cd frontend
npm install -D @cloudflare/next-on-pages
```
2. Update your `package.json` build script in the frontend:
```json
"scripts": {
  "build": "npx @cloudflare/next-on-pages"
}
```
3. Ensure your frontend `.env` has the correct production API URL (e.g., `NEXT_PUBLIC_API_URL=https://api.tdaskills.co.uk/api/v1`).
4. Commit and push all these changes to your GitHub repository.

---

## Phase 3: Cloudflare Pages Deployment

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your GitHub repository (`TDA-Web`).
4. In the **Set up builds and deployments** section:
   - **Framework preset:** `Next.js`
   - **Build command:** `npm run build`
   - **Build output directory:** `.vercel/output/static`
   - **Root directory:** `/frontend`
5. Click **Environment variables (advanced)** and add:
   - `NEXT_PUBLIC_API_URL` = `https://api.tdaskills.co.uk/api/v1`
   - *(Add any other NEXT_PUBLIC variables you have)*
6. Click **Save and Deploy**. Cloudflare will now build and host your Next.js application globally.

---

## Phase 4: Cloudflare DNS Setup

Finally, link everything together using your domain (e.g., `tdaskills.co.uk`):

1. Go to the **DNS** tab in your Cloudflare dashboard.
2. **For the Backend:** Add an `A` record. Name: `api`, IPv4 Address: `YOUR_AWS_ELASTIC_IP`. Ensure Proxy Status is `Proxied (Orange Cloud)`.
3. **For the Frontend:** Cloudflare Pages will automatically ask you to setup a custom domain. Go to your Pages project -> **Custom Domains** -> **Set up a custom domain** -> enter `tdaskills.co.uk`. Cloudflare will automatically configure the CNAME records for your root domain.

### Done! 🚀
- Your website is live and globally distributed on Cloudflare Edge: `https://tdaskills.co.uk`
- Your API is securely running on AWS: `https://api.tdaskills.co.uk`
