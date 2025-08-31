import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { chatScreenStyles } from './chatScreen.style';

// Lead type
export type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

// Message type
type Message = {
  type: 'user' | 'bot';
  text: string;
  leads?: Lead[];
};

// Mock API returns Promise<Lead[]>
const mockApi = async (query: string): Promise<Lead[]> => {
  await new Promise(res => setTimeout(res as any, 800));
  return [
    { name: 'Alice Johnson', location: 'Mumbai', matchScore: 92 },
    { name: 'Bob Singh', location: 'Delhi', matchScore: 78 },
    { name: 'Carol Verma', location: 'Bangalore', matchScore: 85 },
  ];
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;
    const userMsg: Message = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const leads = await mockApi(input);
    const botMsg: Message = {
      type: 'bot',
      text: 'Here are some leads:',
      leads,
    };
    setMessages(prev => [...prev, botMsg]);
  };

  const renderMessage = ({ item }: ListRenderItemInfo<Message>) => {
    if (item.type === 'user') {
      return (
        <View style={chatScreenStyles.userMsg}>
          <Text style={chatScreenStyles.userText}>{item.text}</Text>
        </View>
      );
    }
    return (
      <View style={chatScreenStyles.botMsg}>
        <Text style={chatScreenStyles.botText}>{item.text}</Text>
        {item.leads && item.leads.map((lead, idx) => (
          <View
            key={idx}
            style={[
              chatScreenStyles.leadCard,
              lead.matchScore > 80 && chatScreenStyles.highlightCard,
            ]}
          >
            <Text style={chatScreenStyles.leadName}>{lead.name}</Text>
            <Text style={chatScreenStyles.leadLoc}>{lead.location}</Text>
            <Text style={chatScreenStyles.leadScore}>Match Score: {lead.matchScore}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={chatScreenStyles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={chatScreenStyles.inputRow}>
        <TextInput
          style={chatScreenStyles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your query..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;