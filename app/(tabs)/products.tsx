import { useAppDispatch } from '@/hooks/useAppDispatch';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { filterByAction, getProductByBarcodeActopn, getStocksAction, loadProducts, searchForProductsAction } from '../(redux)/productsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useRouter } from 'expo-router';
import ProductCreation from '../../components/productCreation';
import { replaceIp } from '../helpers/replaceIp';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CameraScanner from '@/components/CameraScanner';

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showScanner, setShowScanner] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, isLoadind } = useSelector((state: RootState) => state.products);
  const { stoks } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(getStocksAction());
  }, [dispatch]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {   
       
    dispatch(getProductByBarcodeActopn(data));
    router.push(`/details/productDetails`);
    setShowScanner(false)
   
  };

  const handelSearch = (searchQuery:string)=>{
   
          dispatch(searchForProductsAction(searchQuery))


  };

  const handelSort = (key:string)=>{
    dispatch(filterByAction(key))
  }

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
      <Text style={styles.title}>Available Products</Text>

      <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setIsModalVisible(true)}
            >
              <MaterialCommunityIcons name="new-box" size={40} color="#FF9900" />
        {/* <Text style={styles.addButtonText}>+ Add New Product</Text> */}
      </TouchableOpacity>
      <ProductCreation visible={isModalVisible} onClose={() => setIsModalVisible(false)} stoks={stoks} />
       
      <View style={styles.filterContainer}>
      <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)} >
         <Ionicons name="barcode-outline" size={24} color="#FF9900" />
      </TouchableOpacity>
        <TextInput
          style={styles.searchBar} 
          placeholder="Search movies and series" 
          placeholderTextColor="#999" 
          onChangeText={(text) => handelSearch(text)}
        />     
         </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => handelSort('Quantity')}><Text style={styles.filterText}>Quantity</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText} onPress={()=>handelSort('Price')}>Price</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText} onPress={()=>handelSort('type')}>type</Text></TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.navigate(`/details/productDetails?productData=${JSON.stringify(item)}`)}>
              <Image source={{ uri: replaceIp(item.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}
                    style={styles.productImage} /> 
               <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${parseFloat(item.price).toFixed(3)}</Text>
              <Text style={[ item.stocks?.length > 0 ? styles.productInStock : styles.productOutOfStock]}>
                {item.stocks?.length > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </TouchableOpacity>
          
        )}
       
      />

{showScanner && (
        <CameraScanner showScanner={showScanner} setShowScanner={setShowScanner} handleBarCodeScanned={handleBarCodeScanned}/>
      )}
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
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9900',
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
  scanButton: {
    padding: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
   boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#FF9900",
    marginRight: 10,
    marginLeft: 10,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  cameraview: {
    flex: 1,
  },
  cameraoverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
  },
  
  flipButton: {
    padding: 10,
    backgroundColor: "#FF9900",
    borderRadius: 10,
  },  
  flipText: {
    color: "#fff",
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerMarker: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#FF9900",
  },

  closeScannerButton: {
    position: "absolute",
    top: 20,
    right: 20,
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
});

export default Products;
