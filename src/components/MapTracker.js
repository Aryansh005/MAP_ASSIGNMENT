import React, { useState, useEffect } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform, Alert, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Test = () => {
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });
    const [currentLocation, setCurrentLocation] = useState(null);
    const [pathCoordinates, setPathCoordinates] = useState([]);
    const [initialLocation, setInitialLocation] = useState(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs access to your location to show your position on the map.',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                        return false;
                    }
                } catch (err) {
                    console.warn(err);
                    return false;
                }
            }
            return true;
        };

        const fetchLocation = async () => {
            const permissionGranted = await requestLocationPermission();
            if (!permissionGranted) return;

            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newRegion = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    };

                    setCurrentLocation({ latitude, longitude });
                    setPathCoordinates((prev) => [...prev, { latitude, longitude }]);
                    setRegion(newRegion);

                    if (!initialLocation) {
                        setInitialLocation({ latitude, longitude });
                    }
                },
                (error) => {
                    console.error('Error fetching location:', error);
                    Alert.alert('Error', 'Unable to fetch location. Please try again.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                }
            );
        };

        // Fetch location every 10 minutes (600,000 milliseconds)
        const intervalId = setInterval(() => {
            fetchLocation();
        }, 600000);

        // Fetch the initial location immediately
        fetchLocation();

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [initialLocation]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(region) => setRegion(region)}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {/* Marker for Initial Location with Arrow Image */}
                {initialLocation && (
                    <Marker coordinate={initialLocation}>
                        <Image
                            source={require('../assets/arrow.png')} // Custom arrow image for the initial location
                            style={styles.markerImage}
                        />
                    </Marker>
                )}

                {/* Polyline for Path */}
                {pathCoordinates.length > 1 && (
                    <Polyline
                        coordinates={pathCoordinates} // Dynamic path coordinates
                        strokeColor="#FF0000" // Red color for the path
                        strokeWidth={3}
                    />
                )}

                {/* Marker for Current Location */}
                {currentLocation && (
                    <Marker coordinate={currentLocation}>
                        <View style={styles.markerContainer}>
                            <Image
                                source={require('../assets/arrow.png')} // Optional: Replace with another image if needed
                                style={[styles.markerImage]} // Style for current marker
                            />
                        </View>
                    </Marker>
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerImage: {
        width: 50, // Customize the width
        height: 50, // Customize the height
        resizeMode: 'contain', // Ensure the image scales properly
    },
});

export default Test;
