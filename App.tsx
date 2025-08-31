/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Image } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import OCRScreen from './src/screens/orc_screen/OCRScreen';
import ChatScreen from './src/screens/chat_screen/ChatScreen';
import LeadDetailsScreen from './src/screens/lead_detail_screen/LeadDetailsScreen';
import FullScreenNotification from './src/screens/full_screen_notification/FullScreenNotification';
import LocationMapScreen from './src/screens/location_map_screen/LocationMapScreen';
import LeadDashboardScreen from './src/screens/lead_dashboard_screen/LeadDashboardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Types for lead and notification
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

function MainTabs({
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
              source={require('./assets/icons/credit_score.png')}
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
              source={require('./assets/icons/chat_icon.png')}
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
              source={require('./assets/icons/location_icon.png')}
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
              source={require('./assets/icons/dashboard_icon.png')}
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
              source={require('./assets/icons/notification_icon.png')}
              style={{ width: size ?? 24, height: size ?? 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Props for MainScreens
type MainScreensProps = {
  navigation: StackNavigationProp<any>;
};

function MainScreens({ navigation }: MainScreensProps) {
  const [notification, setNotification] = useState<Lead | null>(null);
  const [declinedLeads, setDeclinedLeads] = useState<Lead[]>([]);

  // Simulate push notification
  const mockLead: Lead = {
    name: 'Priya Sharma',
    location: 'Pune',
    matchScore: 88,
  };

  const triggerNotification = () => {
    setNotification(mockLead);
  };

  const handleAccept = () => {
    setNotification(null);
    navigation.navigate('LeadDetails', { lead: notification });
  };

  const handleReject = () => {
    setDeclinedLeads(prev => [...prev, notification!]);
    setNotification(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <MainTabs
        triggerNotification={triggerNotification}
        notification={notification}
        handleAccept={handleAccept}
        handleReject={handleReject}
        declinedLeads={declinedLeads}
      />
    </SafeAreaView>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreens} />
          <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
