import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCreation = ({ visible, onClose }:{visible:any,onClose:any}) => {
  const [product, setProduct] = useState({
    name: '',
    type: '',
    barcode: '',
    price: '',
    solde: '',
    supplier: '',
    image: '',
    warehouseId: '',
  });

  const handleChange = (key:any, value:any) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = () => {
    console.log('Product Added:', product);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FF9900" />
          </TouchableOpacity>

          <Text style={styles.title}>Add New Product</Text>

          {/* Form Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            placeholderTextColor="#888"
            value={product.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Product Type"
            placeholderTextColor="#888"
            value={product.type}
            onChangeText={(text) => handleChange('type', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Barcode"
            placeholderTextColor="#888"
            value={product.barcode}
            onChangeText={(text) => handleChange('barcode', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={product.price}
            onChangeText={(text) => handleChange('price', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Solde"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={product.solde}
            onChangeText={(text) => handleChange('solde', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Supplier"
            placeholderTextColor="#888"
            value={product.supplier}
            onChangeText={(text) => handleChange('supplier', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            placeholderTextColor="#888"
            value={product.image}
            onChangeText={(text) => handleChange('image', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Warehouse ID"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={product.warehouseId}
            onChangeText={(text) => handleChange('warehouseId', text)}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9900',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProductCreation;
