import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function LeadDetailsScreen({ route, navigation }) {
  const { lead } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Details</Text>
      <Text style={styles.label}>Name: <Text style={styles.value}>{lead.name}</Text></Text>
      <Text style={styles.label}>Location: <Text style={styles.value}>{lead.location}</Text></Text>
      <Text style={styles.label}>Match Score: <Text style={styles.value}>{lead.matchScore}%</Text></Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 18, marginBottom: 12 },
  value: { fontWeight: 'bold' },
});