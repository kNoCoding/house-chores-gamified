import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';
import { ProfileProvider } from './src/context/ProfileContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
