# ⚡ TRENT POWER

Personal weekly Paris event curation. What should I do this week near Jourdain, 20th?

Live data via Anthropic API + web search. Scored, curated, integrity-checked.

---

## Quick start (any method)

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY=sk-ant-xxxxx

# 3. Build the frontend
npm run build

# 4. Run
node server.js
```

Open `http://localhost:3000`. Done.

---

## Deploy on your own server

### Option 1: Plain Node.js on any VPS

SSH into your server (Ubuntu, Debian, etc.):

```bash
# Install Node.js 20+ if not already installed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Copy the project to your server
cd /opt
# scp the zip from your machine, or git clone, etc.
unzip trent-power-deploy.zip
cd trent-power

# Install, build, configure
npm install
cp .env.example .env
nano .env    # add your ANTHROPIC_API_KEY

npm run build

# Test it
node server.js
# should print: TRENT POWER running on http://localhost:3000
```

To keep it running permanently, use the included systemd service:

```bash
# Copy service file
sudo cp trent-power.service /etc/systemd/system/

# Edit paths/user if needed
sudo nano /etc/systemd/system/trent-power.service

# Start it
sudo systemctl daemon-reload
sudo systemctl enable trent-power
sudo systemctl start trent-power

# Check status
sudo systemctl status trent-power
sudo journalctl -u trent-power -f    # live logs
```

### Option 2: Docker

```bash
# Build the image
docker build -t trent-power .

# Run it
docker run -d \
  --name trent-power \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-xxxxx \
  --restart unless-stopped \
  trent-power
```

Or with docker-compose, create a `docker-compose.yml`:

```yaml
services:
  trent-power:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=sk-ant-xxxxx
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Option 3: Behind Nginx (HTTPS + custom domain)

Run the Node server on port 3000, put Nginx in front for HTTPS:

```nginx
# /etc/nginx/sites-available/trent-power
server {
    listen 80;
    server_name trent.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/trent-power /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Add HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d trent.yourdomain.com
```

### Option 4: Behind Caddy (even simpler HTTPS)

```
# Caddyfile
trent.yourdomain.com {
    reverse_proxy localhost:3000
}
```

```bash
caddy start
```

Caddy handles HTTPS certificates automatically.

### Option 5: Raspberry Pi or home server

Same as Option 1. Node.js runs fine on ARM:

```bash
# On Raspberry Pi OS
sudo apt install nodejs npm
# then same steps as Option 1
```

### Option 6: Vercel (managed, no server needed)

```bash
npm i -g vercel
vercel
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

---

## How it works

```
Browser  -->  /api/search (your server)  -->  Anthropic API + web search
                                                       |
                                              searches Shotgun, DICE, RA,
                                              Time Out, venue sites, etc.
                                                       |
                                              structured JSON
                                                       |
                                              scored + integrity-checked
```

1. User taps refresh (or "search paris this week" on first load)
2. Frontend sends 8 search queries to /api/search
3. Server calls Anthropic API with web search tool
4. Claude searches the web, returns structured event JSON
5. Frontend deduplicates, matches against 30+ curated venues, scores, checks integrity
6. Events displayed by distance tier (walk / short metro / long metro)

## Project structure

```
trent-power/
  server.js              standalone Node.js server (static files + API proxy)
  api/
    search.js            Vercel serverless function (only for Vercel deploys)
  src/
    App.jsx              the entire app
    main.jsx             React entry point
  index.html             HTML shell
  package.json
  vite.config.js
  vercel.json            Vercel config (only for Vercel deploys)
  Dockerfile             Docker deployment
  trent-power.service    systemd service file for Linux servers
  .env.example           copy to .env, add your key
  README.md
```

## Cost

At about 8 API calls per refresh with web search:
- Roughly $0.15-0.30 per refresh
- Once or twice a week = about $2-3/month
- Server: free if you already have one, or $4-6/month for a basic VPS

## Security

Your Anthropic API key stays on the server in .env — never sent to the browser. The server proxies all API calls so the key stays private.

---

*This app is for one person.*
