import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Field = {
  label: string;
  value: string;
  confidence: number; // Mock confidence
};

const initialFields: Field[] = [
  { label: 'Name', value: '', confidence: 0 },
  { label: 'ID Number', value: '', confidence: 0 },
  { label: 'DOB', value: '', confidence: 0 },
];

export default function OCRScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [loading, setLoading] = useState(false);

  const handleImage = async (fromCamera: boolean) => {
    setLoading(true);
    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo', quality: 1 })
      : await launchImageLibrary({ mediaType: 'photo', quality: 1 });

    if (result.assets && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
      const textBlocks = await TextRecognition.recognize(result.assets[0].uri);
      // Simple parsing logic (customize as needed)
      const mockConfidence = () => Math.floor(Math.random() * 40) + 60; // 60-100%
      setFields([
        { label: 'Name', value: textBlocks[0] || '', confidence: mockConfidence() },
        { label: 'ID Number', value: textBlocks[1] || '', confidence: mockConfidence() },
        { label: 'DOB', value: textBlocks[2] || '', confidence: mockConfidence() },
      ]);
    }
    setLoading(false);
  };

  const handleFieldChange = (idx: number, value: string) => {
    const updated = [...fields];
    updated[idx].value = value;
    setFields(updated);
  };

  const handleSave = async () => {
    try {
      const data = {
        imageUri,
        fields,
        savedAt: new Date().toISOString(),
      };
      // Save to local DB (append to 'ocr_records' array)
      const existing = await AsyncStorage.getItem('ocr_records');
      const records = existing ? JSON.parse(existing) : [];
      records.push(data);
      await AsyncStorage.setItem('ocr_records', JSON.stringify(records));
      alert('Data saved locally!');
    } catch (e) {
      alert('Failed to save data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCR Capture & Validation</Text>
      <View style={styles.buttonRow}>
        <Button title="Capture Image" onPress={() => handleImage(true)} />
        <Button title="Upload Image" onPress={() => handleImage(false)} />
      </View>
      {loading && <ActivityIndicator size="large" />}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {fields.map((field, idx) => (
        <View key={field.label} style={styles.fieldRow}>
          <Text style={styles.label}>{field.label}:</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={val => handleFieldChange(idx, val)}
            placeholder={`Enter ${field.label}`}
          />
          <Text style={styles.confidence}>Confidence: {field.confidence}%</Text>
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  image: { width: '100%', height: 200, marginBottom: 16, borderRadius: 8 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 80 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginRight: 8 },
  confidence: { width: 110, color: '#888' },
});