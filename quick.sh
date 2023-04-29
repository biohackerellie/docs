#!/bin/bash

git pull && docker build -t docks:latest . && docker run --rm --name docs -p 3000:3000 -d docs:latest && docker system prune -f
