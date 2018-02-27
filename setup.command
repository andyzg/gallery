#!/usr/bin/env bash

# Create a duplicate of each photo, and then minify them
if [[ "$OSTYPE" == "darwin"* && -x "$(command -v sips)" ]]; then
  # sips is available
  # low res version of image
  python tools/duplicate.py min
  sips -Z 640 photos/**/*.min.jpeg &>/dev/null
  sips -Z 640 photos/**/*.min.png &>/dev/null
  sips -Z 640 photos/**/*.min.jpg &>/dev/null

  # placeholder image for lazy loading
  python tools/duplicate.py placeholder
  sips -Z 32 photos/**/*.placeholder.jpeg &>/dev/null
  sips -Z 32 photos/**/*.placeholder.png &>/dev/null
  sips -Z 32 photos/**/*.placeholder.jpg &>/dev/null
fi

python tools/setup.py
