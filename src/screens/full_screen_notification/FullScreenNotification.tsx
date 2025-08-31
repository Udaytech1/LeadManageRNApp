import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function FullScreenNotification({ lead, onAccept, onReject }) {
  if (!lead) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>New Lead Notification</Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{lead.name}</Text></Text>
        <Text style={styles.label}>Location: <Text style={styles.value}>{lead.location}</Text></Text>
        <Text style={styles.label}>Match Score: <Text style={styles.value}>{lead.matchScore}%</Text></Text>
        <View style={styles.buttonRow}>
          <Button title="Accept" onPress={onAccept} color="#2e8b57" />
          <Button title="Reject" onPress={onReject} color="#b22222" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 99,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: '80%',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 18 },
  label: { fontSize: 18, marginBottom: 10 },
  value: { fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', marginTop: 24, gap: 16 },
});