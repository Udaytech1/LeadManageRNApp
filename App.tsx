import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import LeadDetailsScreen from './src/screens/lead_detail_screen/LeadDetailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { MainTabs } from './src/navigation/BottomTab';

type Lead = {
  name: string;
  location: string;
  matchScore: number;
};

const Stack = createStackNavigator();

type MainScreensProps = {
  navigation: StackNavigationProp<any>;
};

function MainScreens({ navigation }: MainScreensProps) {
  const [notification, setNotification] = useState<Lead | null>(null);
  const [declinedLeads, setDeclinedLeads] = useState<Lead[]>([]);

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
