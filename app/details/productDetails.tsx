import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
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
import { displayEditedByAction, loadProduct, updateQuantity } from '../(redux)/productsSlice';
import MyMap from '@/components/GeoMap';


const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { productData } = useLocalSearchParams();
  const productObject = productData ? JSON.parse(decodeURIComponent(productData as string)) : null;
  const { product, isLoadind } = useSelector((state: RootState) => state.products);
  const { lastEditer } = useSelector((state: RootState) => state.products);
    const { warehouseman } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!product || product.id !== productObject.id) {
      dispatch(loadProduct(productObject));
      if (product?.id) {
        dispatch(displayEditedByAction(product.id));
      }
    }
  }, [dispatch]);

  const handelUpdateQuantity = (type: 'add' | 'remove', stokId: number) => {
    dispatch(updateQuantity({ type,productId:product?.id, stokId:stokId ,warehousemanId:parseInt(warehouseman?.id as string)}));
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
        <Text style={styles.productPrice}>${parseFloat(product.price).toFixed(3)}</Text>
        <Text style={styles.productType}>{product.type}</Text>

        <View style={styles.editorContainer}>
        <Image source={{ uri: lastEditer?.image || "https://i.pinimg.com/736x/8e/4e/c8/8e4ec81bac67ae771b557e76eae29a95.jpg" }} style={styles.editorImage} />
        <View style={styles.editorInfo}>
            <Text style={styles.editorName}>{lastEditer?.name || "Unknown Editor"}</Text>
            <Text style={styles.editorLabel}>Last Updated :  {product?.editedBy[0]?.at.toLocaleString()}</Text>
        </View>
        <Image source={{ uri:"https://via.placeholder.com/100" }} style={styles.brandBackground} />
        </View>


        <Text style={styles.stockTitle}>Stock Availability:</Text>
        {product.stocks.length > 0 ? (
          product.stocks.map((stock, index) => (
            <View key={index} style={styles.stockItem}>
              <Text style={styles.stockLocation}>{stock.name}</Text>
             
             <MyMap latitude={stock.localisation.latitude} longitude={stock.localisation.longitude} />

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
    padding: 25,
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
    width: 330,
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
    borderRadius: 32,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
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
  editorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 30,
    position: "relative",
    overflow: "hidden",
  },
  editorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  editorInfo: {
    flex: 1,
  },
  editorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editorLabel: {
    fontSize: 14,
    color: "#888",
  },
  brandBackground: {
    position: "absolute",
    right: -30,
    bottom: -10,
    width: 100,
    height: 100,
    opacity: 0.1,
  },
  
});

export default ProductDetails;