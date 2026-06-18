import React from 'react';
import { View, Text } from 'react-native';

// Web stub for react-native-maps
const MapView = React.forwardRef(({ style, children, ...props }, ref) => (
  <View ref={ref} style={[{ backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center', minHeight: 200 }, style]}>
    <Text style={{ color: '#999', fontSize: 14 }}>Map (available on mobile)</Text>
    {children}
  </View>
));

MapView.displayName = 'MapView';

const Marker = ({ children }) => <>{children}</>;
const Polyline = () => null;
const Circle = () => null;
const Callout = ({ children }) => <>{children}</>;
const PROVIDER_GOOGLE = 'google';

// MapViewDirections stub
const MapViewDirections = () => null;

export default MapView;
export { Marker, Polyline, Circle, Callout, PROVIDER_GOOGLE, MapViewDirections };
