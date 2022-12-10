#!/bin/bash
echo "Building FreeExecutor..."

echo "Running Task Webpack..."
npx webpack-cli

echo "Running Task UglifyJS"
npx uglifyjs --compress --mangle --output dist/FreeExecutor.js -- dist/FreeExecutor.js

echo "Done!"