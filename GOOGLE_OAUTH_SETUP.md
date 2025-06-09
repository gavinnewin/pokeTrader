# Google OAuth Setup Guide for PokeTrader

## Prerequisites
- Google Account
- Google Cloud Console access

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Name your project (e.g., "PokeTrader")

### 2. Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: PokeTrader
     - User support email: your email
     - Developer contact: your email
   - Add scopes: email, profile, openid
   - Add test users if in development

### 4. Create OAuth Client ID
1. Application type: "Web application"
2. Name: "PokeTrader Web Client"
3. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. Authorized redirect URIs (not needed for Google Sign-In JavaScript SDK)
5. Click "Create"

### 5. Copy Your Client ID
After creation, you'll get:
- Client ID: `YOUR_CLIENT_ID.apps.googleusercontent.com`
- Client Secret: (keep this secure, though not needed for frontend)

### 6. Update Your Code

#### Frontend (src/main.jsx):
```javascript
const GOOGLE_CLIENT_ID = "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com";
```

#### Backend (.env file):
```
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
```

### 7. Install Dependencies

Frontend:
```bash
npm install @react-oauth/google
```

Backend:
```bash
cd backend
npm install google-auth-library
```

## Testing

1. Make sure your backend is running with the GOOGLE_CLIENT_ID environment variable
2. Start your React app
3. Navigate to the login page
4. Click the "Sign in with Google" button
5. Complete the Google authentication flow

## Security Notes

- Never commit your Client ID to public repositories (use environment variables)
- The Client Secret should never be exposed to the frontend
- Always verify Google tokens on the backend
- Use HTTPS in production

## Troubleshooting

**"popup_closed_by_user" error:**
- User closed the popup before completing authentication
- This is normal behavior

**"idpiframe_initialization_failed" error:**
- Check that cookies are enabled
- Ensure you're not blocking third-party cookies
- Try in an incognito window

**Invalid Client ID error:**
- Double-check your Client ID is correct
- Ensure the domain is authorized in Google Console
- Wait a few minutes after creating credentials (propagation delay)

## Production Deployment

When deploying to production:
1. Add your production domain to Authorized JavaScript origins
2. Update the GOOGLE_CLIENT_ID in your production environment
3. Ensure HTTPS is enabled (required by Google)
4. Update OAuth consent screen with production information 