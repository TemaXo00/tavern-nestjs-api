#!/bin/bash

SERVICE_SCOPE='tavern'
DATETIME=$(date +"%Y.%m.%d_%H-%M")

echo "Building Gateway service..."
echo "Build date: ${DATETIME}"

docker build -f docker-files/Gateway.Dockerfile \
  -t "temaxo00/${SERVICE_SCOPE}-api-gateway:${DATETIME}" \
  -t "temaxo00/${SERVICE_SCOPE}-api-gateway:dev" \
  ./app

docker push "temaxo00/${SERVICE_SCOPE}-api-gateway:${DATETIME}"
docker push "temaxo00/${SERVICE_SCOPE}-api-gateway:dev"