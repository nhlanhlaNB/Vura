# 🚗 Vura - Uber Clone App

## ⚠️ IMPORTANT: This is a MOBILE app 

This app uses **native features** that don't work on web:
- React Native Maps
- GPS/Location services
- Real-time tracking with sockets

## 🚀 How to Run

### Option 1: Run on Android (Recommended)

1. **Install Android Studio** and set up an Android emulator
2. **Start the emulator** 
3. Run the app:
```bash
npm run android
```

### Option 2: Run on iOS (Mac only)

1. **Install Xcode** 
2. Run the app:
```bash
npm run ios
```

### Option 3: Use Expo Go on Your Phone

1. **Install Expo Go** app from Play Store/App Store
2. **Start the development server:**
```bash
npm start
```
3. **Scan the QR code** with Expo Go app
4. The app will open on your phone

## 🔧 Setup Required

### 1. Google Maps API Key

Update `.env` file with your actual API key:
```env
GOOGLE_MAPS_API_KEY=your_actual_key_here
```

### 2. Backend Server

The app expects a backend API running at:
```
http://localhost:3000/api
```

You'll need to:
- Set up a backend server with user authentication
- Implement ride booking endpoints
- Set up Socket.io for real-time tracking

## 📋 Environment Variables

Create/update `.env` file:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_key
API_BASE_URL=http://your-backend-url/api
SOCKET_URL=http://your-socket-server-url
```

## 🛠️ Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## ⚠️ Web Platform

Running on web requires:
- Replacing react-native-maps with a web alternative
- Mocking location services
- Significant code refactoring

**Not recommended for this type of app.**

## 📱 Recommended Development Setup

1. **Use Android Studio** emulator for development
2. **Or use Expo Go** on your physical phone
3. **Backend server** must be accessible from your device

## 🐛 Common Issues

### "expo-location" errors
- Make sure you ran `npm install`
- Restart the development server

### Maps not showing
- Check your Google Maps API key
- Ensure the API has the required permissions enabled

### Can't connect to backend
- Make sure backend server is running
- Update API_BASE_URL in .env
- Use your computer's local IP address (not localhost) when testing on phone
