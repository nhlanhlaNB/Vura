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
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: googleIosClientId
            ? googleIosClientId.split('.').reverse().join('.')
            : '',
        },
      ],
    ],
    extra: {
      ...(appJson.expo.extra || {}),
      googleMapsApiKey,
    },
  },
};
