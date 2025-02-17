import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadProducts } from '../(redux)/productsSlice';
import { styles } from '../(tabs)/products';
import { replaceIp } from '../helpers/replaceIp';
import { stok } from '@/constants/types';
import { FontAwesome } from '@expo/vector-icons';

const MostRemovedOrAdded = () => {

    const {type}=useLocalSearchParams();
    console.log(type);

    const [products , setProducts]= useState<any>([])
    const { statistics, isLoadind } = useSelector((state: RootState) => state.stats);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(()=>{
        if (type == 'removed') {
            setProducts(statistics?.mostRemovedProducts)
        } else {
            setProducts(statistics?.mostAddedProducts)
        }
    },[type])

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(loadProducts())
          .then(() => {
            setRefreshing(false);
          })
          .catch(() => setRefreshing(false));
    };

    if (isLoadind) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF9900" />
                <Text style={styles.loadingText}>Loading Products...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: true, title: `${type == 'removed' ? 'Most Removed Products' : 'Most Added Products'}` }} />

            <FlatList
                data={products || []}
                keyExtractor={(item, index) => (item?.product ? item.product.id.toString() : index.toString())}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.card, localStyles.cardHover]} 
                        onPress={() => router.navigate(`/details/productDetails?productData=${JSON.stringify(item.product)}`)}>
                        <Image source={{ uri: replaceIp(item.product.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}
                            style={styles.productImage} />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{item.product.name}</Text>
                            <Text style={styles.productPrice}>${parseFloat(item.product.price).toFixed(3)}</Text>
                            <Text style={[item.product.stocks && item.product.stocks.reduce((sum:number, stock:stok) => sum + (stock.quantity || 0), 0) > 0 ? item.product.stocks.reduce((sum:number, stock:stok) => sum + (stock.quantity || 0), 0) > 100 ? styles.productInStock : styles.productweekStock : styles.productOutOfStock]}>
                                {item.product.stocks && item.product.stocks.reduce((sum:number, stock:stok) => sum + (stock.quantity || 0), 0) > 0 ? item.product.stocks.reduce((sum:number, stock:stok) => sum + (stock.quantity || 0), 0) > 100 ? 'In Stock' : 'Weak Stock' : 'Out of Stock'}
                            </Text>
                            {item.product.solde < 100 &&(
                                <View style={localStyles.soldContainer}>
                                <FontAwesome name="fire" size={20} color="#FF4500" />
                                <Text style={localStyles.soldText}>Hot! {item.product.solde+ " $$" || 0} Sold - Get Yours Now!</Text>
                            </View>
                            )
                            
                            }
                            
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    soldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    soldText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: '#FF4500',
        fontSize: 14,
    },
    cardHover: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default MostRemovedOrAdded;
