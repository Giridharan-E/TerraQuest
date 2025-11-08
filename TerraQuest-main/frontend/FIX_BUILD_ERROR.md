# Fix Build Error - ajv Module Not Found

## Problem
Error: `Cannot find module 'ajv/dist/compile/codegen'`

This is caused by a version mismatch between `ajv` and `ajv-keywords` dependencies used by webpack/react-scripts.

## Solution

### Step 1: Clean Install

```bash
# Remove node_modules and lock files
rm -rf node_modules
rm -rf yarn.lock
# Or on Windows PowerShell:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force yarn.lock
```

### Step 2: Reinstall Dependencies

**Using Yarn (Recommended):**
```bash
yarn install
```

**Using npm:**
```bash
npm install --legacy-peer-deps
```

### Step 3: Verify Installation

```bash
# Check if ajv is installed
yarn list ajv
# or
npm list ajv
```

### Step 4: Try Build Again

```bash
yarn build
# or
npm run build
```

## What Was Fixed

1. Added `ajv@^8.12.0` to `devDependencies`
2. Added `resolutions` field for yarn to force `ajv@^8.12.0` version
3. This ensures all packages use a compatible version of `ajv`

## Alternative Solution (If Above Doesn't Work)

If the issue persists, try forcing a specific version:

```bash
# Install ajv explicitly
yarn add -D ajv@8.12.0
# or
npm install --save-dev ajv@8.12.0 --legacy-peer-deps

# Then reinstall all dependencies
yarn install --force
# or
npm install --legacy-peer-deps
```

## For npm Users (Alternative)

If using npm instead of yarn, add this to `package.json`:

```json
"overrides": {
  "ajv": "^8.12.0"
}
```

Then run:
```bash
npm install --legacy-peer-deps
```

## Why This Happens

- `react-scripts@5.0.1` uses webpack which depends on `ajv-keywords`
- `ajv-keywords` requires `ajv` with specific internal modules
- Version mismatches can cause missing module errors
- Adding explicit `ajv` version ensures compatibility

## Verification

After fixing, the build should complete successfully:
```bash
yarn build
```

You should see:
```
Creating an optimized production build...
Compiled successfully!
```

