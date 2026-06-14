import React, { createContext, useContext, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { GoogleMap, LoadScript, Marker as GoogleMarker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@env';

export const GoogleMapsLoadContext = createContext({ isLoaded: false });

const defaultCenter = { lat: 37.78825, lng: -122.4324 };

const toPixelValue = (value) => {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	return value;
};

const toMapContainerStyle = (style) => {
	const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style || {};

	return {
		width: toPixelValue(flattenedStyle.width) || '100%',
		height: toPixelValue(flattenedStyle.height) || '100%',
		position: flattenedStyle.position,
		top: toPixelValue(flattenedStyle.top),
		right: toPixelValue(flattenedStyle.right),
		bottom: toPixelValue(flattenedStyle.bottom),
		left: toPixelValue(flattenedStyle.left),
		margin: flattenedStyle.margin,
		marginTop: flattenedStyle.marginTop,
		marginRight: flattenedStyle.marginRight,
		marginBottom: flattenedStyle.marginBottom,
		marginLeft: flattenedStyle.marginLeft,
	};
};

const getZoomFromRegion = (region) => {
	if (!region?.latitudeDelta) {
		return 13;
	}

	const ratio = 360 / region.latitudeDelta;
	const zoom = Math.round(Math.log2(ratio));
	return Math.max(2, Math.min(20, zoom));
};

const DebugPanel = ({ keyValue, isPlaceholderKey, hasValidFormat, isLoaded, loadError }) => {
	const showDebug = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

	if (!showDebug) {
		return null;
	}

	const keyLength = keyValue ? keyValue.length : 0;

	return (
		<View
			style={{
				position: 'absolute',
				top: 10,
				left: 10,
				zIndex: 9999,
				backgroundColor: '#fff',
				padding: 8,
				borderRadius: 6,
				borderWidth: 1,
				borderColor: '#ddd',
			}}
		>
			<Text style={{ fontSize: 12, fontWeight: '600' }}>Google Maps Debug</Text>
			<Text style={{ fontSize: 12 }}>keyPresent: {keyValue ? 'yes' : 'no'}</Text>
			<Text style={{ fontSize: 12 }}>keyLength: {keyLength}</Text>
			<Text style={{ fontSize: 12 }}>placeholderKey: {isPlaceholderKey ? 'yes' : 'no'}</Text>
			<Text style={{ fontSize: 12 }}>keyFormatValid: {hasValidFormat ? 'yes' : 'no'}</Text>
			<Text style={{ fontSize: 12 }}>scriptLoaded: {isLoaded ? 'yes' : 'no'}</Text>
			<Text style={{ fontSize: 12 }}>loadError: {loadError ? 'yes' : 'no'}</Text>
		</View>
	);
};

const MapView = ({ style, region, children }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [loadError, setLoadError] = useState(null);

	const center = useMemo(() => ({
		lat: region?.latitude ?? defaultCenter.lat,
		lng: region?.longitude ?? defaultCenter.lng,
	}), [region]);

	const zoom = useMemo(() => getZoomFromRegion(region), [region]);
	const mapContainerStyle = useMemo(() => toMapContainerStyle(style), [style]);
	const trimmedKey = GOOGLE_MAPS_API_KEY?.trim?.() || '';
	const isPlaceholderKey = /your_google_maps_api_key_here|YOUR_GOOGLE_MAPS_API_KEY/i.test(trimmedKey);
	const hasValidFormat = /^AIza[0-9A-Za-z\-_]{35}$/.test(trimmedKey);

	if (!trimmedKey || isPlaceholderKey) {
		return (
			<View style={style}>
				<DebugPanel
					keyValue={trimmedKey}
					isPlaceholderKey={isPlaceholderKey}
					hasValidFormat={hasValidFormat}
					isLoaded={isLoaded}
					loadError={loadError}
				/>
				<Text>Google Maps key is missing or still using a placeholder value.</Text>
				{children}
			</View>
		);
	}

	if (!hasValidFormat) {
		return (
			<View style={style}>
				<DebugPanel
					keyValue={trimmedKey}
					isPlaceholderKey={isPlaceholderKey}
					hasValidFormat={hasValidFormat}
					isLoaded={isLoaded}
					loadError={loadError}
				/>
				<Text>Google Maps API key format looks invalid.</Text>
				<Text>Use a Browser key that starts with AIza and replace GOOGLE_MAPS_API_KEY in .env.</Text>
				{children}
			</View>
		);
	}

	if (loadError) {
		const loadErrorText = String(loadError?.message || loadError || '');
		const isApiNotActivated = /ApiNotActivatedMapError/i.test(loadErrorText);
		const isAuthOrBilling = /InvalidKeyMapError|RefererNotAllowedMapError|BillingNotEnabledMapError/i.test(loadErrorText);

		return (
			<View style={style}>
				<DebugPanel
					keyValue={trimmedKey}
					isPlaceholderKey={isPlaceholderKey}
					hasValidFormat={hasValidFormat}
					isLoaded={isLoaded}
					loadError={loadError}
				/>
				<Text>Google Maps failed to load.</Text>
				{isApiNotActivated ? (
					<Text>Enable Maps JavaScript API for this key in Google Cloud Console.</Text>
				) : isAuthOrBilling ? (
					<Text>Check API key restrictions, billing status, and localhost referrer permissions.</Text>
				) : (
					<Text>Check key validity, billing, Maps JavaScript API, and localhost referrer restrictions.</Text>
				)}
				{children}
			</View>
		);
	}

	return (
		<View style={style}>
			<DebugPanel
				keyValue={trimmedKey}
				isPlaceholderKey={isPlaceholderKey}
				hasValidFormat={hasValidFormat}
				isLoaded={isLoaded}
				loadError={loadError}
			/>
			<LoadScript
				googleMapsApiKey={trimmedKey}
				onLoad={() => setIsLoaded(true)}
				onError={(error) => setLoadError(error)}
				onUnmount={() => setIsLoaded(false)}
			>
				<GoogleMapsLoadContext.Provider value={{ isLoaded }}>
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
						center={center}
						zoom={zoom}
						options={{
							fullscreenControl: false,
							streetViewControl: false,
							mapTypeControl: false,
						}}
					>
						{children}
					</GoogleMap>
				</GoogleMapsLoadContext.Provider>
			</LoadScript>
		</View>
	);
};

const Marker = ({ coordinate, title, pinColor }) => {
	const { isLoaded } = useContext(GoogleMapsLoadContext);

	if (!coordinate || !isLoaded) {
		return null;
	}

	const icon = pinColor && window.google
		? {
			path: window.google.maps.SymbolPath.CIRCLE,
			scale: 8,
			fillColor: pinColor,
			fillOpacity: 1,
			strokeColor: '#fff',
			strokeWeight: 2,
		}
		: undefined;

	return (
		<GoogleMarker
			position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
			title={title}
			icon={icon}
		/>
	);
};

const PROVIDER_GOOGLE = undefined;

export { Marker, PROVIDER_GOOGLE };
export default MapView;