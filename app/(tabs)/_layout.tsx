import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { replaceIp } from '../helpers/replaceIp';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { warehouseman } = useSelector((state: RootState) => state.auth);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      
       <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color}  />,
        
          
        }}
      />
        <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Image source={{ uri: replaceIp(warehouseman?.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}  style={styles.profileImage} />,
        
          
        }}
      />
      
        <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <MaterialIcons name="production-quantity-limits" size={24} color={color} />,
        }}
      />
      

    
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF9900', 
    marginBottom: 10,
},
})