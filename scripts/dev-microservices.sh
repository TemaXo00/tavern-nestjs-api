#!/bin/bash

SERVICE_SCOPE='example'
DATETIME=$(date +"%Y.%m.%d_%H-%M")
SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
  echo "Service name not specified"
  echo "Usage: ./scripts/dev-microservices.sh <service-name>"
  echo "Example: ./scripts/dev-microservices.sh auth"
  exit 1
fi

echo "Building ${SERVICE_NAME} service..."
echo "Build date: ${DATETIME}"
echo "Registry: ${REGISTRY}"

docker build -f docker-files/Service.Dockerfile \
  --build-arg SERVICE_NAME="${SERVICE_NAME}" \
  -t "${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME}" \
  -t "${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev" \
  ./app

if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "Image: ${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME}"
  echo "Dev latest: ${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev"
else
  echo "Build failed!"
  exit 1
fi

docker push "${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME}"
docker push "${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev"

if [ $? -eq 0 ]; then
  echo "Push successful!"
  echo "Image: ${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME} Pushed!"
  echo "Dev latest: ${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev Pushed!"
else
  echo "Push failed!"
  exit 1
fi