#!/bin/bash
echo "Building FreeExecutor"

# Check Dependencies (Node/NPX Only)
echo ""
echo "Running Task: Check Dependencies"
if ! [ -x "$(command -v node)" ]; then
  echo 'Fatal: NodeJS is not installed' >&2
  exit 1
fi

if ! [ -x "$(command -v npx)" ]; then
  echo 'Fatal: npx is not installed' >&2
  exit 1
fi
echo "All core dependencies are installed."

# Webpack (Merge all modules)
echo ""
echo "Running Task: Webpack..."
npx webpack-cli

# UglifyJS (Minify Built Part)
echo "Running Task: Minify (UglifyJS)..."
npx uglifyjs --compress --mangle --output dist/FreeExecutor.js -- dist/FreeExecutor.js

echo ""
echo "Done!"