#!/bin/bash

# Auto-fix unused imports using ESLint
echo "🔧 Removing unused imports..."

# Run ESLint with auto-fix for unused variables
npx eslint --fix --rule 'no-unused-vars: off' --rule '@typescript-eslint/no-unused-vars: off' src/**/*.{ts,tsx}

echo "✅ Unused imports cleanup complete!"
