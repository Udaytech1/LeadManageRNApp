
import React from 'react';
import { View, Text, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OCRScreen from '../screens/orc_screen/OCRScreen';
import ChatScreen from '../screens/chat_screen/ChatScreen';
import LocationMapScreen from '../screens/location_map_screen/LocationMapScreen';
import LeadDashboardScreen from '../screens/lead_dashboard_screen/LeadDashboardScreen';
import FullScreenNotification from '../screens/full_screen_notification/FullScreenNotification';

type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

type MainTabsProps = {
  triggerNotification: () => void;
  notification: Lead | null;
  handleAccept: () => void;
  handleReject: () => void;
  declinedLeads: Lead[];
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function MainTabs({
  triggerNotification,
  notification,
  handleAccept,
  handleReject,
  declinedLeads,
}: MainTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2e8b57',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="OCR"
        component={OCRScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Image
              source={require('../../assets/icons/credit_score.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Image
              source={require('../../assets/icons/chat_icon.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LocationMap"
        component={LocationMapScreen}
        options={{
          title: 'Location',
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Image
              source={require('../../assets/icons/location_icon.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LeadDashboard"
        component={LeadDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Image
              source={require('../../assets/icons/dashboard_icon.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        children={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tap below to simulate notification</Text>
            <Text
              style={{
                margin: 16,
                padding: 12,
                backgroundColor: '#2e8b57',
                color: '#fff',
                borderRadius: 8,
                textAlign: 'center',
              }}
              onPress={triggerNotification}
            >
              Simulate Notification
            </Text>
            {notification && (
              <FullScreenNotification
                lead={notification}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            )}
            {declinedLeads.length > 0 && (
              <View style={{ padding: 12 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Declined Leads:</Text>
                {declinedLeads.map((lead, idx) => (
                  <Text key={idx}>{lead.name} ({lead.location})</Text>
                ))}
              </View>
            )}
          </View>
        )}
        options={{
          title: 'Notification',
          tabBarIcon: ({ color, size }: { color: string; size?: number }) => (
            <Image
              source={require('../../assets/icons/notification_icon.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}