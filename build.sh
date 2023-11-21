docker build ./server/ --file ./server/Dockerfile --tag ghcr.io/celidur/polynoel-server-ghcr:lastest
docker push ghcr.io/celidur/polynoel-server-ghcr:lastest
docker build ./site-web/ --file ./site-web/Dockerfile --tag ghcr.io/celidur/polynoel-client-ghcr:lastest
docker push ghcr.io/celidur/polynoel-client-ghcr:lastest
