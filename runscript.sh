#!/bin/bash

docker build -t lasertag-backend .
# Start your containers with docker-compose
docker-compose up -d

# Wait for all containers to be healthy (customize as needed)
docker-compose ps | grep ' Up ' | wc -l | while read -r count; do
  if [ "$count" -lt $(docker-compose ps | grep ' Up ' | wc -l) ]; then
    sleep 1
  else
    break
  fi
done

# Run your post-startup commands here
echo "All containers are up and running. Running post-startup commands..."

