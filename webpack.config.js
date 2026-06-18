const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons'],
      },
    },
    argv
  );

  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    buffer: false,
  };

  // Stub out native-only modules on web
  const webStubsDir = path.resolve(__dirname, 'src', 'web-stubs');

  // Add aliases for React Native modules that don't work on web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    'react-native-maps': path.join(webStubsDir, 'react-native-maps.js'),
    'react-native-maps-directions': path.join(webStubsDir, 'react-native-maps.js'),
  };

  return config;
};
