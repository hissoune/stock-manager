import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from './(redux)/store';

const LandingPage = () => {
      const router = useRouter();
  
      const {isAuthenticated,isLoading}= useSelector((state: RootState) =>state.auth)
  
    console.log(isAuthenticated);
    
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)'); 
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/35/2a/0b/352a0bd393efeaff4693c0e3e855326a.jpg' }} 
      style={styles.background}
    >
        <View style={styles.container}>
          <Text style={styles.title}>Gestionnaire de Stock</Text>
          <Text style={styles.description}>
            Optimisez la gestion de votre stock avec une application intuitive, rapide et sécurisée.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.navigate("/auth/login")}>
            <Icon name="log-in" type="feather" color="#fff" size={20} />
            <Text style={styles.buttonText}>Connexion</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  description: { fontSize: 16, color: '#ddd', textAlign: 'center', marginBottom: 20 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, marginLeft: 10 },
});

export default LandingPage;
