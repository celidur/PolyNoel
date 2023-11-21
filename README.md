# PolyNoel
[website](https://polynoel.com)

## Deploy
exemple of docker-compose.yml file:
```
version: '3.3'
services:
  client-polynoel:
    container_name: client-polynoel
    hostname: client-polynoel
    image: "ghcr.io/celidur/polynoel-client-ghcr:lastest"
    environment:
      NODE_ENV: production
    ports:
      - 4242:4242
  server-polynoel:
    container_name: server-polynoel
    hostname: server-polynoel
    image: "ghcr.io/celidur/polynoel-server-ghcr:lastest"
    ports:
      - 6969:6969
```
use docker-compose to deploy the project
```
docker-compose up -d
```
