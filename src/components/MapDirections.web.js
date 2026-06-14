import React, { useContext, useEffect, useState } from 'react';
import { Polyline } from '@react-google-maps/api';
import { GoogleMapsLoadContext } from './MapComponents.web';

export default function MapDirections({
  origin,
  destination,
  onReady,
  strokeColor = '#000',
  strokeWidth = 3,
}) {
  const { isLoaded } = useContext(GoogleMapsLoadContext);
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (!isLoaded || !origin || !destination || !window.google) {
      setPath([]);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: {
          lat: origin.latitude,
          lng: origin.longitude,
        },
        destination: {
          lat: destination.latitude,
          lng: destination.longitude,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status !== window.google.maps.DirectionsStatus.OK || !result?.routes?.length) {
          setPath([]);
          return;
        }

        const route = result.routes[0];
        const coordinates = route.overview_path.map((point) => ({
          lat: point.lat(),
          lng: point.lng(),
        }));

        setPath(coordinates);

        const distanceMeters = route.legs.reduce(
          (sum, leg) => sum + (leg.distance?.value || 0),
          0,
        );
        const durationSeconds = route.legs.reduce(
          (sum, leg) => sum + (leg.duration?.value || 0),
          0,
        );

        onReady?.({
          distance: distanceMeters / 1000,
          duration: durationSeconds / 60,
          coordinates,
        });
      },
    );
  }, [isLoaded, origin, destination, onReady]);

  if (!path.length) {
    return null;
  }

  return (
    <Polyline
      path={path}
      options={{
        strokeColor,
        strokeWeight: strokeWidth,
      }}
    />
  );
}