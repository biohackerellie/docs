# Set up using Docker

## With Docker Compose (Recommended)

### 1. **Create the Docker Compose File**

```yaml
version: '3'

services:
  server:
    image: biohackerellie/bunmail
    container_name: BunEmailServer
    restart: unless-stopped
    ports:
      - '6969:6969'
    environment:
      API_KEY: ${API_KEY}
      GMAIL_USER: ${GMAIL_USER}
      GMAIL_PASSWORD: ${GMAIL_PASSWORD}
      ALLOWED_DOMAINS: ${ALLOWED_DOMAINS}
      # --- For Oauth2 ---
      OAUTH: ${OAUTH}
      CLIENT_ID: ${CLIENT_ID}
      CLIENT_SECRET: ${CLIENT_SECRET}
      REFRESH_TOKEN: ${REFRESH_TOKEN} #Optional
      ACCESS_TOKEN: ${ACCESS_TOKEN} #Optional
```

### 2. Edit Environment Variables

- Option A: Create a `.env` file based on the provided `env.example` and fill in your own values. Keep the .env file in the same directory as the docker-compose.yml file.
- Option B: You can also directly edit the docker-compose.yml file if you'd rather:

```yaml
environment:
  API_KEY: Your-API-Key-Here
  GMAIL_USER: Your-Email-Here
  GMAIL_PASSWORD: Your-Password-Here
  ALLOWED_DOMAINS: Domain1,Domain2,Domain3 # or '*' for all domains
	OUATH: 'true' or 'false' # Default is false
  ### others as needed. See docs for configuring email providers
```

### 3. Run Docker Compose

```bash
sudo docker compose up -d
```

That's it! Your server will be up and running at `http://localhost:6969`.

## Docker Run Command

You can also use the following docker run command instead of using docker compose:

```bash
docker run -p 6969:6969 \
-e API_KEY=Your-API-Key-Here \
-e GMAIL_USER=Your-Email-Here \
-e GMAIL_PASSWORD=Your-Password-Here \
-e ALLOWED_DOMAINS=Domain1,Domain2,Domain3 # or '*' for all domains \
 # --- Outh2 env variables if needed ---
biohackerellie/bunmail
```
