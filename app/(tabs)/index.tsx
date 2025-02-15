import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../(redux)/store';
import { logoutAction } from '../(redux)/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useRouter } from 'expo-router';
import { loadStatistics } from '../(redux)/statisticsSlice';
import { useFocusEffect } from '@react-navigation/native';



const StatisticsScreen: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { statistics ,isLoadind} = useSelector((state: RootState) => state.stats);
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
            dispatch(loadStatistics());
    
          return () => {
            console.log('Cleanup on unfocus'); 
          };
        }, [dispatch])
      );
    

   

    const handleLogout = () => {
        dispatch(logoutAction());
            router.navigate("/auth/login");
       }
    

    if (isLoadind) {
        return (
            <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }
    if (!statistics) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>No data available</Text>
            </View>
        )
    }

    return (
        <ScrollView >
            <Text style={styles.title}>📊 Inventory Statistics {isAuthenticated?"here":""}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Products:</Text>
                <Text style={styles.value}>{statistics.totalProducts}</Text>
            </View>

            <View style={[styles.card, styles.warning]}>
                <Text style={styles.label}>Out of Stock:</Text>
                <Text style={styles.value}>{statistics.outOfStock}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Total Stock Value:</Text>
                <Text style={styles.value}>${statistics.totalStockValue}</Text>
            </View>

            <Text style={styles.subTitle}>🔥 Most Added Products:</Text>
            {statistics?.mostAddedProducts.length > 0 ? (
                statistics.mostAddedProducts.map((product, index) => (
                    <Text key={index} style={styles.listItem}>• {product.productName}</Text>
                ))
            ) : (
                <Text style={styles.emptyText}>No data available</Text>
            )}

            <Text style={styles.subTitle}>❌ Most Removed Products:</Text>
            {statistics?.mostRemovedProducts.length > 0 ? (
                statistics.mostRemovedProducts.map((product, index) => (
                    <Text key={index} style={styles.listItem}>• {product.productName}</Text>
                ))
            ) : (
                <Text style={styles.emptyText}>No data available</Text>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#343a40',
    },
    card: {
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    warning: {
        backgroundColor: '#ffdddd',
    },
    label: {
        fontSize: 18,
        color: '#495057',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212529',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        color: '#495057',
    },
    listItem: {
        fontSize: 16,
        color: '#6c757d',
    },
    emptyText: {
        fontSize: 16,
        color: '#adb5bd',
    },
    logoutButton: {
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: '#dc3545',
        alignItems: 'center',
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: '#6c757d',
    },
});

export default StatisticsScreen;
