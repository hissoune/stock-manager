import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadProduct, updateQuantity } from '../(redux)/productsSlice';


const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { productData } = useLocalSearchParams();
  const productObject = productData ? JSON.parse(decodeURIComponent(productData as string)) : null;
  const { product, isLoadind } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!product || product.id !== productObject.id) {
      dispatch(loadProduct(productObject));
    }
  }, [dispatch]);

  const handelUpdateQuantity = (type: 'add' | 'remove', stokId: number) => {
    dispatch(updateQuantity({ type,productId:product?.id, stokId:stokId }));
  };

  if (isLoadind) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.productName}>{product.name}</Text>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productType}>{product.type}</Text>

        <Text style={styles.stockTitle}>Stock Availability:</Text>
        {product.stocks.length > 0 ? (
          product.stocks.map((stock, index) => (
            <View key={index} style={styles.stockItem}>
              <Text style={styles.stockLocation}>{stock.name}</Text>
              <Text style={styles.stockLocation}>{stock.localisation.city}</Text>
             
              {/* <MapContainer style={styles.map}>
                <TileLayer
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker
                  position={[
                    stock.localisation.latitude,
                    stock.localisation.longitude,
                  ]}
                >
                  <Popup>{stock.name}</Popup>
                </Marker>
              </MapContainer> */}

              <View style={styles.stockControl}>
                <TouchableOpacity style={styles.arrowDownButton} onPress={() => handelUpdateQuantity('remove', stock.id)}>
                  <AntDesign name="arrowdown" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.stockQuantity}>{stock.quantity}</Text>
                <TouchableOpacity style={styles.arrowUpButton} onPress={() => handelUpdateQuantity('add', stock.id)}>
                  <AntDesign name="arrowup" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 25,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  productPrice: {
    fontSize: 24,
    color: '#28a745',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productType: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  stockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9900',
    textAlign: 'center',
    marginTop: 20,
  },
  stockItem: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  stockLocation: {
    fontSize: 16,
    color: '#856404',
    marginVertical: 4,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  stockQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
    textAlign: 'center',
  },
  outOfStock: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 15,
  },
  arrowDownButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  arrowUpButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 15,
  },
});

export default ProductDetails;