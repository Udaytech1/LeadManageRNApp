import { StyleSheet } from 'react-native';

export const locationMapScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
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
