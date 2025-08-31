import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ocrScreenStyles } from './ocrScreen.style';

type Field = {
  label: string;
  value: string;
  confidence: number;
};

type OCRRecord = {
  imageUri: string | null;
  fields: Field[];
  savedAt: string;
};

const initialFields: Field[] = [
  { label: 'Name', value: '', confidence: 0 },
  { label: 'ID Number', value: '', confidence: 0 },
  { label: 'DOB', value: '', confidence: 0 },
];

const OCRScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImage = async (fromCamera: boolean): Promise<void> => {
    setLoading(true);
    let result: ImagePickerResponse;
    if (fromCamera) {
      result = await launchCamera({ mediaType: 'photo', quality: 1 });
    } else {
      result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    }

    const asset: Asset | undefined = result.assets && result.assets[0];
    if (asset?.uri) {
      setImageUri(asset.uri);
      const textBlocks: string[] = await TextRecognition.recognize(asset.uri);
      // Combine all text lines
      const fullText = textBlocks.join(' ');

      // Regex for common DOB formats (dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd etc.)
      const dobRegex =
        /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/;
      const dobMatch = fullText.match(dobRegex);

      // Simple parsing logic (customize as needed)
      const mockConfidence = (): number => Math.floor(Math.random() * 40) + 60; // 60-100%
      setFields([
        {
          label: 'Name',
          value: textBlocks[0] || '',
          confidence: mockConfidence(),
        },
        {
          label: 'ID Number',
          value: textBlocks[1] || '',
          confidence: mockConfidence(),
        },
        {
          label: 'DOB',
          value: dobMatch ? dobMatch[0] : '',
          confidence: mockConfidence(),
        },
      ]);
    }
    setLoading(false);
  };

  const handleFieldChange = (idx: number, value: string): void => {
    const updated = [...fields];
    updated[idx].value = value;
    setFields(updated);
  };

  const handleSave = async (): Promise<void> => {
    try {
      const data: OCRRecord = {
        imageUri,
        fields,
        savedAt: new Date().toISOString(),
      };
      // Save to local DB (append to 'ocr_records' array)
      const existing = await AsyncStorage.getItem('ocr_records');
      const records: OCRRecord[] = existing ? JSON.parse(existing) : [];
      records.push(data);
      await AsyncStorage.setItem('ocr_records', JSON.stringify(records));
      alert('Data saved locally!');
    } catch (e) {
      alert('Failed to save data.');
    }
  };

  return (
    <View style={ocrScreenStyles.container}>
      <Text style={ocrScreenStyles.title}>OCR Capture & Validation</Text>
      <View style={ocrScreenStyles.buttonRow}>
        <Button title="Capture Image" onPress={() => handleImage(true)} />
        <Button title="Upload Image" onPress={() => handleImage(false)} />
      </View>
      {loading && <ActivityIndicator size="large" />}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={ocrScreenStyles.image} />
      )}
      {fields.map((field, idx) => (
        <View key={field.label} style={ocrScreenStyles.fieldRow}>
          <Text style={ocrScreenStyles.label}>{field.label}:</Text>
          <TextInput
            style={ocrScreenStyles.input}
            value={field.value}
            onChangeText={val => handleFieldChange(idx, val)}
            placeholder={`Enter ${field.label}`}
          />
          <Text style={ocrScreenStyles.confidence}>
            Confidence: {field.confidence}%
          </Text>
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default OCRScreen;
