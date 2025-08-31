import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const leads = [
  { name: 'Alice Johnson', location: 'Mumbai', lat: 19.0760, lng: 72.8777, matchScore: 92 },
  { name: 'Bob Singh', location: 'Delhi', lat: 28.6139, lng: 77.2090, matchScore: 78 },
  { name: 'Carol Verma', location: 'Bangalore', lat: 12.9716, lng: 77.5946, matchScore: 85 },
  { name: 'Priya Sharma', location: 'Pune', lat: 18.5204, lng: 73.8567, matchScore: 88 },
  { name: 'Ravi Patel', location: 'Ahmedabad', lat: 23.0225, lng: 72.5714, matchScore: 65 },
];

function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;
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

export default function LeadDashboardScreen() {
  const [userLoc, setUserLoc] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filterScore, setFilterScore] = useState(false);
  const [leadList, setLeadList] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => setUserLoc(pos.coords),
      err => setUserLoc({ latitude: 19.0760, longitude: 72.8777 }), // fallback: Mumbai
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!userLoc) return;
    let leadsWithDist = leads.map(lead => ({
      ...lead,
      distance: getDistance(userLoc.latitude, userLoc.longitude, lead.lat, lead.lng),
    }));
    if (filterScore) {
      leadsWithDist = leadsWithDist.filter(l => l.matchScore > 70);
    }
    if (sortBy === 'distance') {
      leadsWithDist.sort((a, b) => a.distance - b.distance);
    } else {
      leadsWithDist.sort((a, b) => b.matchScore - a.matchScore);
    }
    setLeadList(leadsWithDist);
  }, [userLoc, sortBy, filterScore]);

  // Best match: highest score, then closest
  const bestMatch =
    leadList.length > 0
      ? leadList.reduce((best, lead) =>
          lead.matchScore > best.matchScore ||
          (lead.matchScore === best.matchScore && lead.distance < best.distance)
            ? lead
            : best
        )
      : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Allocation Dashboard</Text>
      <View style={styles.controls}>
        <Button
          title={`Sort by: ${sortBy === 'distance' ? 'Distance' : 'Score'}`}
          onPress={() => setSortBy(sortBy === 'distance' ? 'score' : 'distance')}
        />
        <View style={{ width: 12 }} />
        <Button
          title={filterScore ? 'Show All' : 'Filter Score > 70%'}
          onPress={() => setFilterScore(f => !f)}
        />
      </View>
      <FlatList
        data={leadList}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.leadCard,
              bestMatch && item.name === bestMatch.name && styles.bestMatch,
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.leadName}>{item.name}</Text>
            <Text style={styles.leadLoc}>{item.location}</Text>
            <Text style={styles.leadDist}>
              Distance: {item.distance ? item.distance.toFixed(1) : '--'} km
            </Text>
            <Text style={styles.leadScore}>
              Match Score: {item.matchScore}%
            </Text>
            {bestMatch && item.name === bestMatch.name && (
              <Text style={styles.bestMatchLabel}>Best Match</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No leads found.</Text>}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  leadCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bestMatch: {
    borderColor: '#2e8b57',
    backgroundColor: '#e6ffe6',
    shadowColor: '#2e8b57',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  bestMatchLabel: {
    marginTop: 8,
    color: '#2e8b57',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  leadName: { fontWeight: 'bold', fontSize: 18 },
  leadLoc: { color: '#555', marginBottom: 2 },
  leadDist: { color: '#333', marginBottom: 2 },
  leadScore: { color: '#2e8b57', fontWeight: 'bold' },
});