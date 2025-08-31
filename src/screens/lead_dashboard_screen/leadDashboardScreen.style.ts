import { StyleSheet } from 'react-native';

export const leadDashBoardScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
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
