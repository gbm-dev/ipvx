#!/bin/bash

# Create main project directory
mkdir -p ip-utils

# Change to the project directory
cd ip-utils

# Create src directory and its subdirectories
mkdir -p src/core src/ipv4

# Create test directory and its subdirectories
mkdir -p tests/core tests/ipv4

# Create source files
touch src/types.ts
touch src/core/operations.ts
touch src/core/constants.ts
touch src/ipv4/validation.ts
touch src/ipv4/conversion.ts
touch src/ipv4/subnet.ts
touch src/ipv4/arithmetic.ts
touch src/ipv4/utils.ts
touch src/index.ts

# Create test files
touch tests/core/operations.test.ts
touch tests/ipv4/validation.test.ts
touch tests/ipv4/conversion.test.ts
touch tests/ipv4/subnet.test.ts
touch tests/ipv4/arithmetic.test.ts
touch tests/ipv4/utils.test.ts

# Create root project files
touch package.json
touch tsconfig.json
touch README.md

echo "Project structure created successfully!"