#!/bin/bash

SERVICE_SCOPE='example'
DATETIME=$(date +"%Y.%m.%d_%H-%M")

echo "Building Gateway service..."
echo "Build date: ${DATETIME}"

docker build -f docker-files/Gateway.Dockerfile \
  -t "${SERVICE_SCOPE}-api-gateway:${DATETIME}" \
  -t "${SERVICE_SCOPE}-api-gateway:dev" \
  ./app

if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "Image: ${SERVICE_SCOPE}-api-gateway:${DATETIME}"
  echo "Dev latest: ${SERVICE_SCOPE}-api-gateway:dev"
else
  echo "Build failed!"
  exit 1
fi

docker push "${SERVICE_SCOPE}-api-gateway:${DATETIME}"
docker push "${SERVICE_SCOPE}-api-gateway:dev"

if [ $? -eq 0 ]; then
  echo "Push successful!"
  echo "Image: ${SERVICE_SCOPE}-api-gateway:${DATETIME} Pushed!"
  echo "Dev latest: ${SERVICE_SCOPE}-api-gateway:dev Pushed!"
else
  echo "Push failed!"
  exit 1
fi