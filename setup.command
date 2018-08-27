#!/usr/bin/env bash

SCRIPT_PATH=$(dirname "$0")

# Create a duplicate of each photo, and then minify them
if [[ "$OSTYPE" == "darwin"* && -x "$(command -v sips)" ]]; then
  # sips is available
  # low res version of image
  python $SCRIPT_PATH/tools/duplicate.py min
  sips -Z 640 $SCRIPT_PATH/photos/**/*.min.jpeg &>/dev/null
  sips -Z 640 $SCRIPT_PATH/photos/**/*.min.png &>/dev/null
  sips -Z 640 $SCRIPT_PATH/photos/**/*.min.jpg &>/dev/null

  # placeholder image for lazy loading
  python $SCRIPT_PATH/tools/duplicate.py placeholder
  sips -Z 32 $SCRIPT_PATH/photos/**/*.placeholder.jpeg &>/dev/null
  sips -Z 32 $SCRIPT_PATH/photos/**/*.placeholder.png &>/dev/null
  sips -Z 32 $SCRIPT_PATH/photos/**/*.placeholder.jpg &>/dev/null
fi

python $SCRIPT_PATH/tools/setup.py
