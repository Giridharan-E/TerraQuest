# TerraQuest Frontend - Commands Guide

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend server running (see `../backend/SETUP.md`)

## Installation

### Option 1: Using npm (with legacy peer deps to fix dependency conflict)

```bash
cd frontend
npm install --legacy-peer-deps
```

### Option 2: Using yarn (recommended - project uses yarn)

```bash
cd frontend
yarn install
```

### Option 3: Fix dependency conflict manually

If you prefer to fix the `date-fns` version conflict:

1. Edit `package.json` and change:
   ```json
   "date-fns": "^4.1.0"
   ```
   to:
   ```json
   "date-fns": "^3.6.0"
   ```

2. Then install:
   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Important:** 
- The backend URL should match where your backend server is running
- Default backend port is `5000`
- Restart the frontend dev server after changing `.env`

## Available Commands

### Development

```bash
# Start development server
npm start
# or
yarn start
```

This will:
- Start the React app on `http://localhost:3000`
- Enable hot-reloading (auto-refresh on file changes)
- Open browser automatically

### Production Build

```bash
# Create production build
npm run build
# or
yarn build
```

This will:
- Create optimized production build in `build/` folder
- Minify and optimize all assets
- Ready for deployment

### Testing

```bash
# Run tests
npm test
# or
yarn test
```

## Quick Start Guide

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Configure environment:**
   ```bash
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:5000" > .env
   ```

3. **Start backend server** (in a separate terminal):
   ```bash
   cd ../backend
   npm install
   npm start
   ```

4. **Start frontend server:**
   ```bash
   cd frontend
   npm start
   ```

5. **Open browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Troubleshooting

### Dependency Conflict Error

If you see the `date-fns` version conflict error:

**Solution 1 (Quick):**
```bash
npm install --legacy-peer-deps
```

**Solution 2 (Recommended):**
1. Edit `package.json`
2. Change `"date-fns": "^4.1.0"` to `"date-fns": "^3.6.0"`
3. Run `npm install`

### Backend Connection Errors

1. Check backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Verify `.env` file has correct `REACT_APP_BACKEND_URL`

3. Check CORS settings in backend (should allow `http://localhost:3000`)

### Port Already in Use

If port 3000 is already in use:

1. Kill the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

2. Or use a different port:
   ```bash
   PORT=3001 npm start
   ```

### Build Fails

If `npm run build` fails:

1. Clear cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

2. Check for TypeScript/ESLint errors
3. Ensure all environment variables are set

## Development Workflow

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev  # or npm start
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Browser:**
   - Open http://localhost:3000
   - Changes auto-reload

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilities
│   └── App.js       # Main app component
├── package.json     # Dependencies
└── .env             # Environment variables (create this)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:5000` |

**Note:** All React environment variables must start with `REACT_APP_`

## Package Manager

This project uses **yarn** as specified in `package.json`. However, npm commands work as well.

To use yarn:
```bash
yarn install
yarn start
yarn build
yarn test
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build/` folder with optimized files.

### Deploy Options

1. **Firebase Hosting:**
   ```bash
   npm install -g firebase-tools
   firebase init hosting
   firebase deploy
   ```

2. **Netlify:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

## Additional Notes

- The frontend uses **Craco** (Create React App Configuration Override) for custom webpack configuration
- Tailwind CSS is configured for styling
- React Router is used for navigation
- Axios is used for API calls
- All API calls are made to `${REACT_APP_BACKEND_URL}/api`

