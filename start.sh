#!/bin/bash

echo "Starting migrations"

npm run migrate

echo "Starting service"

node ./build/src/main.js
