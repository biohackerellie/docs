# Bash scripts and commands
Useful scripts and commands I use all the time
## Docker

### Delete unused files

```bash 
sudo docker system prune -f
```



### Docker Container CI Script
This is a script used for Continuous Inegration builds, like this site, using GH repos. The script checks for discrepencies between the repository on the host server running the site and the remote GH repo, and if there are updates it pulls them locally. Then it builds a new image based on those updates, stops the previously running container, and starts a new container with the updated image. Since the new image is built before the script is told to shutdown the container, if there are any errors in the updated code, the script will fail and your app should continue running as expected. 
```bash
#!/bin/bash

#we make 2 variables at the start, this allows this script to be easier to copy and paste for different containers with less retyping
CONTAINER_NAME=<container_name>
IMAGE_NAME=<image_name>

# Change to the directory containing the Git repository
cd path/to/app

# Check for updates
git fetch

# Compare local and remote branches to check for changes
if ! git diff --quiet HEAD @{u}; then
    # Pull changes if there are any
    git pull && \

    # Rebuild the image from Dockerfile
    docker build -t $IMAGE_NAME:latest . && \
    # Stop docker container if its running
    if docker container inspect $CONTAINER_NAME >/dev/null 2>&1; then
        echo "$CONTAINER_NAME is running, shutting down" && \
        docker container stop $CONTAINER_NAME
    fi
    # Deletes old container
    docker system prune -f && \
    # Restart container with new image
    docker run --rm --name $CONTAINER_NAME -p 3000:3000 -d $IMAGE_NAME:latest

else
    echo "No changes. Exiting."
fi
```