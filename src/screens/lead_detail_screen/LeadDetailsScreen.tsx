import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { leadDetailScreenStyles } from './leadDetailScreen.style';

// Define Lead type
type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

// Define navigation params for this screen
type RootStackParamList = {
  LeadDetails: { lead: Lead };
};

type Props = StackScreenProps<RootStackParamList, 'LeadDetails'>;

const LeadDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { lead } = route.params;

  return (
    <View style={leadDetailScreenStyles.container}>
      <Text style={leadDetailScreenStyles.title}>Lead Details</Text>
      <Text style={leadDetailScreenStyles.label}>
        Name: <Text style={leadDetailScreenStyles.value}>{lead.name}</Text>
      </Text>
      <Text style={leadDetailScreenStyles.label}>
        Location:{' '}
        <Text style={leadDetailScreenStyles.value}>{lead.location}</Text>
      </Text>
      <Text style={leadDetailScreenStyles.label}>
        Match Score:{' '}
        <Text style={leadDetailScreenStyles.value}>{lead.matchScore}%</Text>
      </Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default LeadDetailsScreen;
