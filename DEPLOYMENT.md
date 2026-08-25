# Deployment Plan — Bo Bo Yan Zaw Portfolio

Two options covered:

1. [Ubuntu VPS (self-hosted)](#1-ubuntu-vps-deployment)
2. [Vercel (serverless)](#2-vercel-deployment)

---

## 1. Ubuntu VPS Deployment

Stack: **Ubuntu 22.04+ · Nginx · PM2 · MySQL · Node 20+**

### 1.1 Server preparation

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx mysql-server
sudo npm i -g pm2
```

### 1.2 MySQL database

```bash
sudo mysql_secure_installation

sudo mysql
```

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.3 Get the code

```bash
cd /var/www
git clone https://github.com/BoBoYanZawDev/<your-repo>.git portfolio
cd portfolio
```

### 1.4 Environment

```bash
nano .env
```

```env
DATABASE_URL="mysql://portfolio:STRONG_PASSWORD_HERE@localhost:3306/portfolio"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="very-strong-password"
AUTH_SECRET="long-random-string-openssl-rand-hex-32"
TELEGRAM_BOT_TOKEN="123456:ABC..."
TELEGRAM_CHAT_ID="123456789"
```

### 1.5 Install, migrate, build

```bash
npm ci
npx prisma migrate deploy   # or: npx prisma db push
npm run db:seed             # optional demo projects
npm run build
```

### 1.6 Run with PM2

```bash
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup                 # follow printed instruction
```

> Prefer Supervisor? `/etc/supervisor/conf.d/portfolio.conf`:
> ```ini
> [program:portfolio]
> directory=/var/www/portfolio
> command=npm start
> autostart=true
> autorestart=true
> user=www-data
> environment=NODE_ENV=production
> stdout_logfile=/var/log/portfolio.log
> ```

### 1.7 Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 1.8 SSL (free, auto-renew)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 1.9 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 1.10 Updates (after every code change)

```bash
cd /var/www/portfolio
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 restart portfolio
```

---

## 2. Vercel Deployment

> Vercel has no built-in MySQL — use a hosted MySQL (PlanetScale, Aiven, TiDB Cloud,
> Railway, or your own VPS exposed over SSL).

### 2.1 Push to GitHub

```bash
git remote add origin https://github.com/BoBoYanZawDev/<your-repo>.git
git push -u origin main
```

### 2.2 Prepare the database

1. Create a MySQL database (e.g. [Aiven free tier](https://aiven.io) or PlanetScale).
2. Copy the connection string (must include `?sslaccept=strict` or similar SSL param).
3. From your machine, push the schema once:

```bash
DATABASE_URL="mysql://user:pass@host:3306/portfolio?sslaccept=strict" npx prisma migrate deploy
```

### 2.3 Import project on Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add **Environment Variables** (Production + Preview):

| Key                  | Value                                  |
| -------------------- | -------------------------------------- |
| `DATABASE_URL`       | hosted MySQL connection string         |
| `ADMIN_EMAIL`        | your admin login email                 |
| `ADMIN_PASSWORD`     | strong admin password                  |
| `AUTH_SECRET`        | `openssl rand -hex 32` output          |
| `TELEGRAM_BOT_TOKEN` | bot token (optional)                   |
| `TELEGRAM_CHAT_ID`   | chat id (optional)                     |

4. **Deploy**.

> `prisma generate` runs automatically — it is part of the install lifecycle
> of `@prisma/client`. First build takes ~1–2 min.

### 2.4 Custom domain

Vercel Dashboard → Project → **Settings → Domains** → add `yourdomain.com`
→ point DNS `A 76.76.21.21` or `CNAME cname.vercel-dns.com` per instructions.
HTTPS is automatic.

### 2.5 Notes & limits

- Contact form + admin panel work as serverless functions (default region
  `iad1` — pick a region close to your DB to cut latency).
- `next start`/PM2 are **not** used on Vercel — no server to manage.
- Free (Hobby) plan: non-commercial use, 100 GB bandwidth/month.
- Every `git push` to `main` auto-deploys; PRs get preview URLs.

---

## Checklist before going live

- [ ] `ADMIN_PASSWORD` changed from default
- [ ] `AUTH_SECRET` is a fresh random string
- [ ] MySQL user has a strong password (not root)
- [ ] Telegram bot token/chat id set (contact form notifications)
- [ ] `https://yourdomain.com/admin/login` loads and login works
- [ ] Contact form test message arrives in Telegram + admin panel
- [ ] Resume download button works (`/BoBoYanZaw_Resume.pdf`)
