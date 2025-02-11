import { useAppDispatch } from '@/hooks/useAppDispatch';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { loadProducts } from '../(redux)/productsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useRouter } from 'expo-router';

const Products = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, isLoadind } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

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
      <Text style={styles.title}>Available Products</Text>

      <TouchableOpacity style={styles.addButton} >
        <Text style={styles.addButtonText}>+ Add New Product</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Quantity</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Price</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Latest</Text></TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.navigate(`/details/productDetails?productData=${JSON.stringify(item)}`)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <Text style={[ item.stocks.length > 0 ? styles.productInStock : styles.productOutOfStock]}>
                {item.stocks.length > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9900',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FF9900',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9900',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#28a745',
    marginTop: 5,
  },
  productOutOfStock: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 5,
  },
  productInStock: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 5,
  },
});

export default Products;
