import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearStoksAction, displayEditedByAction, getStocksAction, loadProduct, updateInputQuantityAction, updateQuantity } from '../(redux)/productsSlice';
import MyMap from '@/components/GeoMap';
import { replaceIp } from '../helpers/replaceIp';
import ProductUpdate from '@/components/productUpdate';
import { loadStatistics } from '../(redux)/statisticsSlice';
import ExportPDFButton from '@/components/productPdf';


const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { productData } = useLocalSearchParams();
  const productObject = productData ? JSON.parse(decodeURIComponent(productData as string)) : null;
  const { product, isLoadind } = useSelector((state: RootState) => state.products);
  const { lastEditer } = useSelector((state: RootState) => state.products);
  const { warehouseman } = useSelector((state: RootState) => state.auth);
  const { stoks } = useSelector((state: RootState) => state.products);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [quantityErr,setQuantityErr]= useState("")
  useEffect(() => {
    if (!product || product.id !== productObject?.id) {
      dispatch(loadProduct(productObject));
       dispatch(getStocksAction());
      if (product?.id) {
        dispatch(displayEditedByAction(product.id));
      }
    }
  }, [dispatch]);
  useEffect(() => {
    const initialQuantities:any = {};
    product?.stocks.forEach(stock => {
      initialQuantities[stock.id] = 0;
    });
    setQuantities(initialQuantities);
  }, [product?.stocks]);

 

  const handleInputChange = (text:string, stockId:number) => {
    const newQuantity = parseInt(text) || 0;
    setQuantities(prev => ({
      ...prev,
      [stockId]: newQuantity
    }));
  };

  const handleConfirmQuantity = (stockId:number,Quantity:number) => {
    dispatch(updateInputQuantityAction({ Quantity,productId:product?.id, stokId:stockId ,warehousemanId:parseInt(warehouseman?.id as string)}));
    if (product?.id) {
      dispatch(displayEditedByAction(product.id));
    }


  };

  const handelUpdateQuantity = (type: 'add' | 'remove', stokId: number) => {
    
    dispatch(updateQuantity({ type,productId:product?.id, stokId:stokId ,warehousemanId:parseInt(warehouseman?.id as string)}));
    if (product?.id) {
      dispatch(displayEditedByAction(product.id));
    }
  };

  const handleClearStock = ()=>{
    if (product?.id) {
      dispatch(clearStoksAction({productId: product?.id, warehousemanId: parseInt(warehouseman?.id || '0')}));
      
    }
  }

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
        <Image source={{ uri: replaceIp(product.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }}
         style={styles.productImage} />
          <TouchableOpacity style={styles.addButton}  onPress={() => setIsModalVisible(true)} >
          <MaterialCommunityIcons name="folder-edit-outline" size={40} color="#FF9900" />
          </TouchableOpacity>
          <ProductUpdate visible={isModalVisible} onClose={() => setIsModalVisible(false)} stoks={stoks} product={product} />

        <Text style={styles.productPrice}>${parseFloat(product.price).toFixed(3)}</Text>
        <Text style={styles.productType}>{product.type}</Text>
         <View>
         {product.stocks.length > 0 ? (
           <TouchableOpacity style={styles.confirmQuantity} onPress={()=>handleClearStock()}>
         <MaterialIcons name="clear-all" size={24} color="black" />   
        </TouchableOpacity>
        
         ) : (
          <TouchableOpacity disabled style={styles.confirmQuantity} >
         <MaterialIcons name="clear-all" size={24} color="black" />   
        </TouchableOpacity>
         )
        }

           
         </View>
         <Text style={styles.quantityGuid}>remove All stocks </Text>

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
                <FontAwesome name="minus" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.stockQuantity}>{stock.quantity}</Text>
              <TouchableOpacity style={styles.arrowUpButton} onPress={() => handelUpdateQuantity('add', stock.id)}>
                <FontAwesome name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.InputControl}>
              <TextInput
                style={styles.inputQuantity}
                placeholder="Stock Quantity"
                value={quantities[stock.id]?.toString()}
                onChangeText={(text) => handleInputChange(text, stock.id)}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.confirmQuantity} onPress={() => handleConfirmQuantity(stock.id,quantities[stock.id])}>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#FF9900" />
              </TouchableOpacity>
            </View>
            {quantities[stock.id] !== stock.quantity ?(
              <Text style={styles.quantityGuid}>Type the New Quantity and Conform </Text>
            ):(
               <Text style={styles.quantityError}>You must Confirm New Quantity 
               </Text>

            )}
           
            <View>
              {stock.quantity === 0 && (<Text style={styles.outOfStock}>Out of Stock</Text>)}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.outOfStock}>Out of Stock</Text>
      )}
          
          <ExportPDFButton product={product} buttonStyle='full' />              

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
    color: '#FF9900',
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
    backgroundColor: '#e9d66b',
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

  quantityError:{
    color:"red",
    fontFamily:"simbol",
    fontSize:10,
  },
  quantityGuid:{
    color:"#FF9900",
    fontFamily:"simbol",
    fontSize:10,
  },
  confirmQuantity:{
   paddingTop:5,
    borderColor:"#FF9900",
    borderWidth: 2,
    borderTopRightRadius:5,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',

  },
  inputQuantity: {
    borderColor:"#e9d66b",
    borderLeftWidth: 2,
    borderRightWidth: 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRadius:10,
    borderTopLeftRadius:3,
     shadowColor:"#e9d66b",
     shadowOffset: { width: 1, height: 1 },
     shadowOpacity: undefined,
    width:80,

  },
  InputControl:{
    marginVertical:15,
    flex:1,
    flexDirection:"row"
  },
  arrowUpButton: {
    backgroundColor: '#FF9900',
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
  editorInput:{
    width: 100,
    height: 70,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
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
  addButton: {
    width: 230,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF9900',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',

  },
  
});

export default ProductDetails;