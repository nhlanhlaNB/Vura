const appJson = require('./app.json');

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID || '';

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    ios: {
      ...appJson.expo.ios,
      config: {
        ...(appJson.expo.ios?.config || {}),
        googleMapsApiKey,
      },
    },
    android: {
      ...appJson.expo.android,
      config: {
        ...(appJson.expo.android?.config || {}),
        googleMaps: {
          ...(appJson.expo.android?.config?.googleMaps || {}),
          apiKey: googleMapsApiKey,
        },
      },
    },
    plugins: [
      ...(appJson.expo.plugins || []).filter(
        (p) => (Array.isArray(p) ? p[0] : p) !== '@react-native-google-signin/google-signin'
      ),
      ...(googleIosClientId &&
        googleIosClientId.startsWith('com.googleusercontent.apps') &&
        !googleIosClientId.includes('123456789') &&
        !googleIosClientId.includes('abcdefgh')
        ? [
            [
              '@react-native-google-signin/google-signin',
              {
                iosUrlScheme: googleIosClientId.split('.').reverse().join('.'),
              },
            ],
          ]
        : []),
    ],
    extra: {
      ...(appJson.expo.extra || {}),
      googleMapsApiKey,
    },
  },
};
