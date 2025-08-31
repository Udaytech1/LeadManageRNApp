import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import MapView, { Marker, Region } from 'react-native-maps';
import { locationMapScreenStyles } from './locationMapScreen.style';

type Lead = {
  name: string;
  location: string;
  lat: number;
  lng: number;
};

const leads: Lead[] = [
  { name: 'Alice Johnson', location: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Bob Singh', location: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Carol Verma', location: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Priya Sharma', location: 'Pune', lat: 18.5204, lng: 73.8567 },
];

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LocationMapScreen: React.FC = () => {
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [nearestLead, setNearestLead] = useState<Lead | null>(null);
  const timerRef = useRef<any | null>(null);

  const fetchLocation = (): void => {
    Geolocation.getCurrentPosition(
      pos => {
        setLocation(pos.coords);
      },
      err => {
        console.warn(err);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  useEffect(() => {
    fetchLocation();
    timerRef.current = setInterval(fetchLocation, 120000); // every 2 min
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (location) {
      let minDist = Infinity;
      let nearest: Lead | null = null;
      leads.forEach(lead => {
        const dist = getDistance(
          location.latitude,
          location.longitude,
          lead.lat,
          lead.lng,
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = lead;
        }
      });
      setNearestLead(nearest);
    }
  }, [location]);

  const mapRegion: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }
    : undefined;

  return (
    <View style={locationMapScreenStyles.container}>
      <Text style={locationMapScreenStyles.title}>
        Your Location & Nearest Lead
      </Text>
      {location && mapRegion ? (
        <MapView style={locationMapScreenStyles.map} region={mapRegion}>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You"
            pinColor="blue"
          />
          {nearestLead && (
            <Marker
              coordinate={{
                latitude: nearestLead.lat,
                longitude: nearestLead.lng,
              }}
              title={nearestLead.name}
              description={nearestLead.location}
              pinColor="green"
            />
          )}
        </MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
      {nearestLead && (
        <View style={locationMapScreenStyles.leadCard}>
          <Text style={locationMapScreenStyles.leadTitle}>Nearest Lead:</Text>
          <Text style={locationMapScreenStyles.leadName}>
            {nearestLead.name}
          </Text>
          <Text style={locationMapScreenStyles.leadLoc}>
            {nearestLead.location}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LocationMapScreen;
