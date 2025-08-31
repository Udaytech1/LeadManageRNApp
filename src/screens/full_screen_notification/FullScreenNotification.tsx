import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { fullScreenNotificationStyles } from './fullScreenNotification.style';

export type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

type FullScreenNotificationProps = {
  lead: Lead | null;
  onAccept: () => void;
  onReject: () => void;
};

const FullScreenNotification: React.FC<FullScreenNotificationProps> = ({
  lead,
  onAccept,
  onReject,
}) => {
  if (!lead) return null;
  return (
    <View style={fullScreenNotificationStyles.overlay}>
      <View style={fullScreenNotificationStyles.card}>
        <Text style={fullScreenNotificationStyles.title}>
          New Lead Notification
        </Text>
        <Text style={fullScreenNotificationStyles.label}>
          Name:{' '}
          <Text style={fullScreenNotificationStyles.value}>{lead.name}</Text>
        </Text>
        <Text style={fullScreenNotificationStyles.label}>
          Location:{' '}
          <Text style={fullScreenNotificationStyles.value}>
            {lead.location}
          </Text>
        </Text>
        <Text style={fullScreenNotificationStyles.label}>
          Match Score:{' '}
          <Text style={fullScreenNotificationStyles.value}>
            {lead.matchScore}%
          </Text>
        </Text>
        <View style={fullScreenNotificationStyles.buttonRow}>
          <Button title="Accept" onPress={onAccept} color="#2e8b57" />
          <Button title="Reject" onPress={onReject} color="#b22222" />
        </View>
      </View>
    </View>
  );
};

export default FullScreenNotification;
