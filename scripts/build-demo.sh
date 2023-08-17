#!/bin/bash

DEMO_DIR="demo"
SDK_DIR="../dist"

cd "$DEMO_DIR" || exit

# Remove the old bundle
if [ -f demo.zip ]; then
  rm demo.zip
fi

# Find the latest build
latest_sdk=$(find "$SDK_DIR"/wortal-core.js | head -n 1)
if [ -z "$latest_sdk" ]; then
  echo "No wortal-core.js file found in $SDK_DIR"
  exit 1
fi

# Copy the latest build into the demo directory
cp "$latest_sdk" .

zip -r demo.zip ./*
