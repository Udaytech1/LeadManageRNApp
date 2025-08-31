import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import Geolocation, { GeoCoordinates } from 'react-native-geolocation-service';
import { leadDashBoardScreenStyles } from './leadDashboardScreen.style';

type Lead = {
  name: string;
  location: string;
  lat: number;
  lng: number;
  matchScore: number;
  distance?: number;
};
const leads: Lead[] = [
  { name: 'Alice Johnson', location: 'Lucknow', lat: 26.8467, lng: 80.9462, matchScore: 92 },
  { name: 'Bob Singh', location: 'Delhi', lat: 28.6139, lng: 77.2090, matchScore: 78 },
  { name: 'Carol Verma', location: 'Bangalore', lat: 12.9716, lng: 77.5946, matchScore: 85 },
  { name: 'Priya Sharma', location: 'Pune', lat: 18.5204, lng: 73.8567, matchScore: 88 },
  { name: 'Ravi Patel', location: 'Ahmedabad', lat: 23.0225, lng: 72.5714, matchScore: 65 },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
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

const LeadDashboardScreen: React.FC = () => {
  const [userLoc, setUserLoc] = useState<GeoCoordinates | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'score'>('distance');
  const [filterScore, setFilterScore] = useState<boolean>(false);
  const [leadList, setLeadList] = useState<Lead[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => setUserLoc(pos.coords),
      err => setUserLoc({ latitude: 19.0760, longitude: 72.8777 } as GeoCoordinates), // fallback: Mumbai
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!userLoc) return;
    let leadsWithDist: Lead[] = leads.map(lead => ({
      ...lead,
      distance: getDistance(userLoc.latitude, userLoc.longitude, lead.lat, lead.lng),
    }));
    if (filterScore) {
      leadsWithDist = leadsWithDist.filter(l => l.matchScore > 70);
    }
    if (sortBy === 'distance') {
      leadsWithDist.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    } else {
      leadsWithDist.sort((a, b) => b.matchScore - a.matchScore);
    }
    setLeadList(leadsWithDist);
  }, [userLoc, sortBy, filterScore]);

  const bestMatch: Lead | null =
    leadList.length > 0
      ? leadList.reduce((best, lead) =>
          lead.matchScore > best.matchScore ||
          (lead.matchScore === best.matchScore && (lead.distance ?? Infinity) < (best.distance ?? Infinity))
            ? lead
            : best
        )
      : null;

  const renderItem = ({ item }: ListRenderItemInfo<Lead>) => (
    <TouchableOpacity
      style={[
        leadDashBoardScreenStyles.leadCard,
        bestMatch && item.name === bestMatch.name && leadDashBoardScreenStyles.bestMatch,
      ]}
      activeOpacity={0.8}
    >
      <Text style={leadDashBoardScreenStyles.leadName}>{item.name}</Text>
      <Text style={leadDashBoardScreenStyles.leadLoc}>{item.location}</Text>
      <Text style={leadDashBoardScreenStyles.leadDist}>
        Distance: {item.distance !== undefined ? item.distance.toFixed(1) : '--'} km
      </Text>
      <Text style={leadDashBoardScreenStyles.leadScore}>
        Match Score: {item.matchScore}%
      </Text>
      {bestMatch && item.name === bestMatch.name && (
        <Text style={leadDashBoardScreenStyles.bestMatchLabel}>Best Match</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={leadDashBoardScreenStyles.container}>
      <Text style={leadDashBoardScreenStyles.title}>Lead Allocation Dashboard</Text>
      <View style={leadDashBoardScreenStyles.controls}>
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
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>No leads found.</Text>}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
};

export default LeadDashboardScreen;