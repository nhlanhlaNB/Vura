# Getting Started with UberClone

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Directions API
4. Create credentials (API Key)
5. Update `.env` file with your API key
6. Update `app.json` with your API keys (iOS and Android)

### 3. Start the Development Server

```bash
npm start
```

### 4. Run on Device/Emulator

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

**For Web:**
```bash
npm run web
```

## Testing the App

### Login Credentials

**Rider Account:**
- Email: `rider@test.com`
- Password: `password123`

**Driver Account:**
- Email: `driver@test.com`
- Password: `password123`

### Features to Test

#### As a Rider:
1. Login with rider credentials
2. View your location on the map
3. Tap "Where to?" to book a ride
4. Enter pickup and destination
5. Select ride type
6. Book the ride
7. Track driver location
8. View ride history
9. Rate completed rides

#### As a Driver:
1. Login with driver credentials
2. Toggle online status
3. Accept incoming ride requests
4. Navigate to pickup location
5. Start the ride
6. Complete the ride
7. View earnings
8. Check trip statistics

## Common Issues

### Maps not displaying
- Ensure Google Maps API key is configured correctly
- Check that billing is enabled in Google Cloud Console
- Verify the API key has no restrictions that block your app

### Location permission denied
- Go to device settings
- Enable location permissions for the app
- Try restarting the app

### App won't start
```bash
# Clear cache and restart
npm start --clear
```

### Dependencies issues
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## Next Steps

1. **Set up Backend Server**: This app requires a backend server for production use
2. **Configure Socket.io**: Set up real-time communication server
3. **Add Payment Gateway**: Integrate Stripe or PayPal
4. **Enable Push Notifications**: Set up Firebase Cloud Messaging
5. **Deploy to App Stores**: Follow deployment guides for iOS and Android

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the code comments for specific functionality
- Test with the provided mock data before connecting to a real backend

## Development Tips

- Use Expo Go app for quick testing on physical devices
- Enable hot reload for faster development
- Check console logs for debugging
- Use React DevTools for component inspection

Happy Coding! 🚀
