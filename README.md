# YouTube Clone with Firebase & Redux

A modern YouTube clone built with React, Firebase Authentication, Redux Toolkit, and YouTube Data API v3.

## 🚀 Features

- **Authentication**: Google OAuth login/logout via Firebase
- **Personalized Homepage**: Different content for logged-in vs anonymous users
- **Video Playback**: Full video player with YouTube integration
- **Search Functionality**: Search videos using YouTube API
- **Infinite Scroll**: Load more videos as you scroll
- **Responsive Design**: Works on desktop and mobile
- **Profile Dropdown**: User profile management

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Firebase Integration](#firebase-integration)
- [Redux Toolkit Setup](#redux-toolkit-setup)
- [Data Flow Examples](#data-flow-examples)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Start

```bash
# Clone repository
git clone <your-repo-url>
cd youtube-clone

# Install dependencies
npm install

# Set up environment variables (see Environment Setup)
cp .env.example .env

# Start development server
npm start
```

## 🏗️ Architecture Overview

```
Frontend (React) ↔ Redux Store ↔ Firebase Services ↔ YouTube API
     ↑                ↑              ↑                 ↑
   UI Components    State Mgmt    Authentication    Video Data
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation with auth
│   ├── ProfileDropdown.js  # User profile menu
│   ├── Card.js         # Video card component
│   └── LoginEffectHandler.js  # Auth state monitor
├── pages/              # Main page components
│   ├── Home.js         # Homepage with videos
│   ├── Watch.js        # Video player page
│   └── Search.js       # Search results page
├── features/           # Redux slices
│   ├── auth/
│   │   └── authSlice.js    # Authentication state
│   └── youtube/
│       └── youtubeSlice.js # App state
├── store/              # Redux store setup
│   └── reducers/
│       └── getHomePageVideos.js  # Async thunks
├── utils/              # Utility functions
│   ├── authUtils.js    # Firebase auth helpers
│   └── parseData.js    # Data formatting
└── firebase/
    └── firebase.js     # Firebase configuration
```

## 🔥 Firebase Integration

### Services Used

- **Firebase Authentication**: Google OAuth
- **Google Auth Provider**: YouTube API access tokens

### Configuration

```javascript
// src/firebase/firebase.js
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### Authentication Flow

```
User Login → Firebase OAuth → Store in Redux → Personalized API calls
```

## 🏪 Redux Toolkit Setup

### Store Structure

```
Redux Store
├── auth (slice)          # User authentication state
│   ├── user              # Firebase user object
│   ├── accessToken       # OAuth token for YouTube API
│   ├── isAuthenticated   # Boolean auth status
│   └── loading/error     # UI states
└── youtube (slice)       # YouTube app state
    ├── videos            # Homepage videos array
    ├── currentVideo      # Currently playing video
    ├── searchResults     # Search results
    ├── nextPageToken     # Pagination token
    └── sidebarCollapsed  # UI state
```

### Key Slices

#### Auth Slice

```javascript
// features/auth/authSlice.js
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      // Reset all auth state
    },
  },
});
```

#### YouTube Slice

```javascript
// features/youtube/youtubeSlice.js
const youtubeSlice = createSlice({
  name: "youtube",
  initialState: {
    videos: [],
    currentVideo: null,
    searchResults: [],
    nextPageToken: null,
    sidebarCollapsed: false,
  },
  reducers: {
    clearVideos: (state) => {
      state.videos = [];
    },
  },
  extraReducers: (builder) => {
    // Handle async thunks
    builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
      state.videos = action.payload.parsedData;
    });
  },
});
```

### Async Thunks

```javascript
// store/reducers/getHomePageVideos.js
export const getHomePageVideos = createAsyncThunk(
  "youtube/App/homePageVideos",
  async (isNext, { getState }) => {
    const { auth } = getState();

    if (auth.isAuthenticated) {
      // Get personalized content using auth.accessToken
      return await getPersonalizedVideos(auth.accessToken);
    } else {
      // Get popular videos
      return await getPopularVideos();
    }
  }
);
```

## 🔄 Data Flow Examples

### User Login Flow

```
1. User clicks login
   ↓
2. Firebase handles Google OAuth
   ↓
3. Success → dispatch(loginSuccess({ user, accessToken }))
   ↓
4. LoginEffectHandler detects auth change
   ↓
5. Automatically refreshes homepage with personalized content
   ↓
6. UI updates with user-specific videos
```

### Homepage Video Loading

```
1. Home component mounts
   ↓
2. dispatch(getHomePageVideos(false))
   ↓
3. Thunk checks if user is authenticated
   ↓
4. Makes appropriate API calls (personalized vs popular)
   ↓
5. Updates Redux state with videos
   ↓
6. Components re-render with new content
```

### Infinite Scroll

```
1. User scrolls to bottom
   ↓
2. dispatch(getHomePageVideos(true)) // Load next page
   ↓
3. Uses nextPageToken for pagination
   ↓
4. Appends new videos to existing array
   ↓
5. UI shows additional content
```

## 🔧 Environment Setup

### Required Environment Variables

```bash
# .env file
REACT_APP_YOUTUBE_DATA_API_KEY=your_youtube_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Getting API Keys

#### YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict key to YouTube Data API v3

#### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project
3. Enable Authentication → Google provider
4. Get config from Project Settings

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] All environment variables set in deployment platform
- [ ] Production domain added to Firebase Authorized Domains
- [ ] Production domain added to Google Cloud OAuth settings
- [ ] Build process completes without errors

### Firebase Configuration for Production

1. **Firebase Console** → Authentication → Settings → Authorized Domains

   - Add your production domain (e.g., `yourapp.netlify.app`)

2. **Google Cloud Console** → Credentials → OAuth 2.0 Client
   - Add production domain to Authorized JavaScript Origins

### Deployment Commands

```bash
# Build for production
npm run build

# Deploy to Netlify (drag & drop build folder)
# OR
npm run deploy  # if using gh-pages

# Deploy to Vercel
vercel
```

## 🔍 Troubleshooting

### Common Issues

#### "Auth not working in production"

**Solution**: Check Firebase Authorized Domains and Google Cloud OAuth settings

#### "Environment variables not loading"

**Solution**: Verify variables are set in deployment platform, not just local .env

#### "Profile dropdown behind video cards"

**Solution**: Check z-index values and stacking context

#### "Videos not refreshing after login"

**Solution**: Ensure LoginEffectHandler is imported in App.js

### Debug Tools

```javascript
// Temporary debug component
const DebugConfig = () => {
  const showDebug =
    new URLSearchParams(window.location.search).get("debug") === "true";
  if (!showDebug) return null;

  return (
    <div>
      Current Domain: {window.location.origin}
      Has API Key: {!!process.env.REACT_APP_FIREBASE_API_KEY}
      Auth Domain: {process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}
    </div>
  );
};
```

Add `?debug=true` to your production URL to see debug info.

## 🎯 Key Benefits of This Architecture

### 1. **Separation of Concerns**

- Firebase: Authentication & tokens
- Redux: State management
- Components: UI rendering
- Thunks: API logic

### 2. **Centralized State**

- Single source of truth
- Predictable updates
- Easy debugging

### 3. **Reactive UI**

- Auto re-render on state changes
- Consistent loading states
- Seamless auth transitions

### 4. **Scalable**

- Easy to add features
- Uniform async handling
- Maintainable codebase

## 📚 How Components Connect

### Reading State

```javascript
// In any component
const videos = useAppSelector((state) => state.youtube.videos);
const user = useAppSelector((state) => state.auth.user);
```

### Updating State

```javascript
// In any component
const dispatch = useAppDispatch();

// Sync actions
dispatch(logout());
dispatch(clearVideos());

// Async thunks
dispatch(getHomePageVideos(false));
```

### Monitoring Auth Changes

```javascript
// LoginEffectHandler.js - monitors auth state
useEffect(() => {
  if (isAuthenticated) {
    dispatch(clearVideos());
    dispatch(getHomePageVideos(false));
  }
}, [isAuthenticated]);
```

## 🔗 Key Integration Points

The magic happens when:

1. **Firebase** authenticates users and provides OAuth tokens
2. **Redux slices** store user data and app state
3. **Async thunks** use auth tokens for personalized API calls
4. **Components** subscribe to state and update UI automatically
5. **Effect handlers** monitor state changes and trigger actions

This creates a seamless, reactive experience where logging in immediately personalizes the entire application!

---

## 📝 Notes

- Keep this README updated as you add features
- Use Redux DevTools for debugging state changes
- Monitor Firebase usage quotas
- Test auth flow thoroughly before deployment

**Happy Coding! 🚀**
