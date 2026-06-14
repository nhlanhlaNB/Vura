import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { RideProvider } from './src/context/RideContext';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import UserTabNavigator from './src/navigation/UserTabNavigator';
import DriverTabNavigator from './src/navigation/DriverTabNavigator';
import RideBookingScreen from './src/screens/RideBookingScreen';
import RideTrackingScreen from './src/screens/RideTrackingScreen';
import RideChatScreen from './src/screens/RideChatScreen';
import RideReceiptScreen from './src/screens/RideReceiptScreen';
import DriverVerificationScreen from './src/screens/driver/DriverVerificationScreen';

const Stack = createStackNavigator();

LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".',
  'props.pointerEvents is deprecated. Use style.pointerEvents',
]);

function RootNavigator() {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : user?.userType === 'driver' ? (
        <>
          <Stack.Screen name="DriverHome" component={DriverTabNavigator} />
          <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
          <Stack.Screen name="RideChat" component={RideChatScreen} />
          <Stack.Screen name="RideReceipt" component={RideReceiptScreen} />
          <Stack.Screen name="DriverVerification" component={DriverVerificationScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="UserHome" component={UserTabNavigator} />
          <Stack.Screen name="RideBooking" component={RideBookingScreen} />
          <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
          <Stack.Screen name="RideChat" component={RideChatScreen} />
          <Stack.Screen name="RideReceipt" component={RideReceiptScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <RideProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </RideProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
