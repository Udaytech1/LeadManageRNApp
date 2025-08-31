import { StyleSheet } from 'react-native';

export const ocrScreenStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  image: { width: '100%', height: 200, marginBottom: 16, borderRadius: 8 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 80 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  confidence: { width: 110, color: '#888' },
});
