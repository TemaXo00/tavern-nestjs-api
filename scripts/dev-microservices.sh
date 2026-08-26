#!/bin/bash

SERVICE_SCOPE='tavern'
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
  -t "temaxo00/${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME}" \
  -t "temaxo00/${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev" \
  ./app

docker push "temaxo00/${SERVICE_SCOPE}-api-${SERVICE_NAME}:${DATETIME}"
docker push "temaxo00/${SERVICE_SCOPE}-api-${SERVICE_NAME}:dev"