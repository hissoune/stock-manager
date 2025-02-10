import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';

interface Product {
    id: number;
    name: string;
    quantity: number;
}

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const {isAuthenticated} =useSelector((state:RootState) => state.auth);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Products in Stock </Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Home;
