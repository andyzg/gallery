#!/usr/bin/env bash

# Create a duplicate of each photo, and then minify them
if [[ "$OSTYPE" == "darwin"* && -x "$(command -v sips)" ]]; then
  # sips is available, duplicate all of the images first
  python tools/duplicate.py
  sips -Z 640 photos/**/*.min.jpeg &>/dev/null
  sips -Z 640 photos/**/*.min.png &>/dev/null
  sips -Z 640 photos/**/*.min.jpg &>/dev/null
fi

python tools/setup.py
