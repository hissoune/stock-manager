import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../(redux)/store';
import { logoutAction } from '../(redux)/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useRouter } from 'expo-router';

interface Statistics {
    totalProducts: number;
    outOfStock: number;
    totalStockValue: number;
    mostAddedProducts: string[];
    mostRemovedProducts: string[];
}

const StatisticsScreen: React.FC = () => {
    const router = useRouter();
    const [stats, setStats] = useState<Statistics | null>(null);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`,
                    {method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                    }
                }
                );
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();

    }, []);

   

    const handleLogout = () => {
        dispatch(logoutAction());
            router.navigate("/auth/login");
       }
    

    if (!stats) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 Inventory Statistics {isAuthenticated?"here":""}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Products:</Text>
                <Text style={styles.value}>{stats.totalProducts}</Text>
            </View>

            <View style={[styles.card, styles.warning]}>
                <Text style={styles.label}>Out of Stock:</Text>
                <Text style={styles.value}>{stats.outOfStock}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Total Stock Value:</Text>
                <Text style={styles.value}>${stats.totalStockValue}</Text>
            </View>

            <Text style={styles.subTitle}>🔥 Most Added Products:</Text>
            {stats?.mostAddedProducts.length > 0 ? (
                stats.mostAddedProducts.map((product, index) => (
                    <Text key={index} style={styles.listItem}>• {product}</Text>
                ))
            ) : (
                <Text style={styles.emptyText}>No data available</Text>
            )}

            <Text style={styles.subTitle}>❌ Most Removed Products:</Text>
            {stats?.mostRemovedProducts.length > 0 ? (
                stats.mostRemovedProducts.map((product, index) => (
                    <Text key={index} style={styles.listItem}>• {product}</Text>
                ))
            ) : (
                <Text style={styles.emptyText}>No data available</Text>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </View>
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
