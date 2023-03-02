#!/bin/bash

# Change to the directory containing the Git repository
cd /apps/docs

# Check for updates
git remote update

# Compare local and remote branches to check for changes
if [ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]; then
    # Pull changes if there are any
    git pull && \
    #stop docker container
    docker stop docs && \
    #deletes the container
    docker system prune -f && \
    #rebuild the image from Dockerfile
    docker build -t docs:latest . && \
    #Restart container with new image
    docker run --rm --name docs -p 3000:3000 -d docs:latest
fi
