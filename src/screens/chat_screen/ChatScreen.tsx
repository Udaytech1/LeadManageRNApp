import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

type Message = {
  type: 'user' | 'bot';
  text: string;
  leads?: Lead[];
};

const mockApi = async (query: string): Promise<Lead[]> => {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 800));
  // Return mock data
  return [
    { name: 'Alice Johnson', location: 'Mumbai', matchScore: 92 },
    { name: 'Bob Singh', location: 'Delhi', matchScore: 78 },
    { name: 'Carol Verma', location: 'Bangalore', matchScore: 85 },
  ];
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Call mock API
    const leads = await mockApi(input);
    const botMsg: Message = {
      type: 'bot',
      text: 'Here are some leads:',
      leads,
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'user') {
      return (
        <View style={styles.userMsg}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
      );
    }
    return (
      <View style={styles.botMsg}>
        <Text style={styles.botText}>{item.text}</Text>
        {item.leads && item.leads.map((lead, idx) => (
          <View
            key={idx}
            style={[
              styles.leadCard,
              lead.matchScore > 80 && styles.highlightCard,
            ]}
          >
            <Text style={styles.leadName}>{lead.name}</Text>
            <Text style={styles.leadLoc}>{lead.location}</Text>
            <Text style={styles.leadScore}>Match Score: {lead.matchScore}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your query..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userText: { color: '#222' },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  botText: { color: '#333', marginBottom: 6 },
  leadCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  highlightCard: {
    borderColor: '#2e8b57',
    backgroundColor: '#e6ffe6',
  },
  leadName: { fontWeight: 'bold', fontSize: 16 },
  leadLoc: { color: '#555', marginBottom: 2 },
  leadScore: { color: '#2e8b57', fontWeight: 'bold' },
});