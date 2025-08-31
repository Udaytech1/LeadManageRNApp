import { StyleSheet } from "react-native";

export const fullScreenNotificationStyles = StyleSheet.create({
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