#!/bin/bash
CONTAINER_NAME=docs
IMAGE_NAME=docs
# Change to the directory containing the Git repository
cd /apps/docs

# Check for updates
git remote update

# Compare local and remote branches to check for changes
if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
    # Pull changes if there are any
    git pull && \
    #stop docker container
    if docker container inspect $CONTAINER_NAME >/dev/null 2>&1; then
        echo "$CONTAINER_NAME is running, shutting down" && \
        docker container stop $CONAINER_NAME \
    fi
    docker stop $CONAINER_NAME && \
    #rebuild the image from Dockerfile
    docker build -t $IMAGE_NAME:latest . && \
    #Restart container with new image
    docker run --rm --name $CONAINER_NAME -p 3000:3000 -d $IMAGE_NAME:latest
    #deletes old container
    docker system prune -f && \
    
else
    echo "fuck you"
fi

