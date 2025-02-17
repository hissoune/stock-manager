import React, { useCallback } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image 
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { logoutAction } from '../(redux)/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useRouter } from 'expo-router';
import { loadStatistics } from '../(redux)/statisticsSlice';
import { useFocusEffect } from '@react-navigation/native';
import { replaceIp } from '../helpers/replaceIp';

const StatisticsScreen: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { statistics, isLoadind } = useSelector((state: RootState) => state.stats);

    useFocusEffect(
        useCallback(() => {
            dispatch(loadStatistics());
        }, [dispatch])
    );

   

    if (isLoadind) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9900" />
                <Text style={styles.loadingText}>Loading Statistics...</Text>
            </View>
        );
    }

    if (!statistics) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.noDataText}>No data available</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.hero}>
            <Text style={styles.heroTitle}>Inventory Insights</Text>

                <Image 
                    source={{ uri: 'https://i.pinimg.com/736x/65/8f/db/658fdb1bf5e78986f3b6f9c4633e4363.jpg' }}
                    style={styles.heroImage}
                />
                <Text style={styles.heroText}>
                    Track your stock, optimize your inventory, and make data-driven decisions.
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{statistics.totalProducts}</Text>
                    <Text style={styles.statLabel}>Total Products</Text>
                </View>
                <View style={[styles.statCard, styles.highlightCard]}>
                    <Text style={styles.statValue}>{statistics.outOfStock}</Text>
                    <Text style={styles.statLabel}>Out of Stock</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{statistics.totalStockValue}</Text>
                    <Text style={styles.statLabel}>Total Stock Value</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔥 Most Added Product</Text>
                {statistics.mostAddedProducts.length > 0 ? (
                    <View style={styles.featuredCard}>
                    <Text style={styles.featuredTitle}>{statistics.mostAddedProducts[0].productName}</Text>
                    <Image source={{ uri: replaceIp(statistics.mostAddedProducts[0].product.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}                               style={styles.productImage} /> 
                    <Text style={styles.featuredCount}>
                         Added at: {statistics.mostAddedProducts[0].lastAddedAt.toLocaleString().split('T')}
                    </Text>
                    <Text style={styles.featuredCount}>
                         Added: {statistics.mostAddedProducts[0].addedCount} times
                    </Text>
                </View>
                ) : (
                    <Text style={styles.emptyText}>No data available</Text>
                )}
                <TouchableOpacity onPress={()=>router.push(`/details/MostRemovedOrAdded?type='added'`)}>
                    <Text style={styles.seeAll}>See All ({statistics.mostAddedProducts.length})</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚨 Vanishing Fast! ❌</Text>
            {statistics.mostRemovedProducts.length > 0 ? (
                    <View style={styles.featuredCard}>
                        <Text style={styles.featuredTitle}>{statistics.mostRemovedProducts[0].productName}</Text>
                        <Image source={{ uri: replaceIp(statistics.mostRemovedProducts[0].product.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}
                                            style={styles.productImage} /> 
                        <Text style={styles.featuredCount}>
                             removed at: {statistics.mostRemovedProducts[0].lastRemovedAt.toLocaleString().split('T')}
                        </Text>
                        <Text style={styles.featuredCount}>
                             Removed: {statistics.mostRemovedProducts[0].removedCount} times
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No data available</Text>
                )}
                <TouchableOpacity onPress={()=>router.push(`/details/MostRemovedOrAdded?type=removed`)}>
                    <Text style={styles.seeAll}>See All ({statistics.mostRemovedProducts.length})</Text>
                </TouchableOpacity>
            </View>

           
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFAF2',
    },
    loadingText: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFAF2',
        paddingVertical: 20,
        alignItems: 'center',
        paddingTop:100,
    },
    hero: {
        width: '90%',
        alignItems: 'center',
        marginBottom: 30,

    },
    heroImage: {
        width: '100%',
        height: 180,
        borderRadius: 15,
        marginVertical:20,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
      },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF9900',
        marginTop: 10,
        marginBottom:20,
    },
    heroText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#FF9900',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    highlightCard: {
        backgroundColor: '#FFE5CC',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF9900',
    },
    statLabel: {
        fontSize: 16,
        color: '#444',
    },
    section: {
        width: '90%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign:'center'
    },
    featuredCard: {
        flex:1,
        alignContent:'center',
        alignItems:'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#FF9900',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    featuredCount: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    seeAll: {
        fontSize: 16,
        color: '#FF9900',
        marginTop: 10,
        textAlign: 'right',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#FF9900',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StatisticsScreen;
