import React, { useEffect, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Logo from "../assets/arrow.png"
export const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position?.coords?.heading,
                };
                resolve(cords);
            },
            (error) => {
                console.error('Error getting location:', error);
                reject(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 10000,
            }
        );
    });

const Tracker = () => {
    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs access to your location to track the polygon path.',
                            buttonPositive: 'OK',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (error) {
                    console.error('Error requesting location permission:', error);
                    Alert.alert('Permission Error', 'Failed to request location permission.');
                    return false;
                }
            }
            return true;
        };

        const fetchAndUpdateLocation = async () => {
            try {
                const location = await getCurrentLocation();
                setPolygonCoordinates((prevCoords) => [...prevCoords, location]);
                setCurrentRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                });
            } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert('Location Error', 'Using the last known location.');
                setCurrentRegion((prevRegion) => prevRegion || {
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                });
            }
        };

        fetchAndUpdateLocation();
        requestLocationPermission()

        // Update location every 10 minutes
        const locationInterval = setInterval(() => {
            fetchAndUpdateLocation();
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        return () => clearInterval(locationInterval);
    }, []);

    const renderArrowMarkers = (coordinates) => {
        const arrowMarkers = [];
        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const midpoint = {
                latitude: (start.latitude + end.latitude) / 2,
                longitude: (start.longitude + end.longitude) / 2,
            };
            arrowMarkers.push(
                <Marker
                    key={`arrow-${i}`}
                    coordinate={midpoint}
                    anchor={{ x: 0.5, y: 0.5 }}
                    image={Logo}
                />
            );
        }
        return arrowMarkers;
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={
                    currentRegion || {
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }
                }
                onRegionChangeComplete={(region) => setCurrentRegion(region)}
            >
                {polygonCoordinates.length > 1 && (
                    <Polygon
                        coordinates={polygonCoordinates}
                        strokeColor="red"
                        fillColor="rgba(255, 0, 0, 0.1)"
                        strokeWidth={3}
                    />
                )}
                {renderArrowMarkers(polygonCoordinates)}
            </MapView>
        </View>
    );
};

export default Tracker;

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    map: {
        flex: 1,
    },
});
