import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';

const leads = [
  { name: 'Alice Johnson', location: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bob Singh', location: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Carol Verma', location: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Priya Sharma', location: 'Pune', lat: 18.5204, lng: 73.8567 },
];

function getDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula
  const toRad = x => (x * Math.PI) / 180;
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

export default function LocationMapScreen() {
  const [location, setLocation] = useState(null);
  const [nearestLead, setNearestLead] = useState(null);
  const timerRef = useRef(null);

  const fetchLocation = () => {
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
      }
    );
  };

  useEffect(() => {
    fetchLocation();
    timerRef.current = setInterval(fetchLocation, 120000); // every 2 min
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (location) {
      let minDist = Infinity;
      let nearest = null;
      leads.forEach(lead => {
        const dist = getDistance(location.latitude, location.longitude, lead.lat, lead.lng);
        if (dist < minDist) {
          minDist = dist;
          nearest = lead;
        }
      });
      setNearestLead(nearest);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location & Nearest Lead</Text>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
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
        <View style={styles.leadCard}>
          <Text style={styles.leadTitle}>Nearest Lead:</Text>
          <Text style={styles.leadName}>{nearestLead.name}</Text>
          <Text style={styles.leadLoc}>{nearestLead.location}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  map: { width: '100%', height: 350 },
  leadCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e6ffe6',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  leadTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  leadName: { fontSize: 18, fontWeight: 'bold' },
  leadLoc: { fontSize: 16, color: '#555' },
});