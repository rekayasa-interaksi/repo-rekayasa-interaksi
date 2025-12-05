#!/bin/bash

# Generate build args string from GitHub Environment Variables
BUILD_ARGS=""

# Get all environment variables
for var in $(env | cut -d= -f1); do
  if [ -n "${!var}" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg $var=${!var}"
  fi
done

echo "$BUILD_ARGS" 