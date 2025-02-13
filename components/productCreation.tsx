import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MultiSelect from "react-native-multiple-select"
import type { stok } from "../constants/types"
import React from "react"
import productSchema from "./productSchema"
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createProductAction } from "@/app/(redux)/productsSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/app/(redux)/store"
import { editedBy } from '../constants/types';
import { uploadImageToBackend } from "@/app/helpers/minio.helper"


const ProductCreation = ({ visible, onClose, stoks }: { visible: boolean; onClose: any; stoks: stok[] }) => {
  const [errors, setErrors] = useState<any>({})
  const [scanning, setScanning] = useState(false); 
  const dispatch = useAppDispatch();
  const { warehouseman } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<{
    id:string
    name: string
    type: string
    barcode: string
    price: string
    solde: string
    supplier: string
    image: string | null 
    stocks: stok[],
    editedBy: editedBy[]
  }>({
    id:(Math.random() * 255).toString(),
    name: "Laptop HP Pavilion",
    type: "Informatique",
    barcode: "1234567890123",
    price: "1200",
    solde: "124",
    supplier: "HP",
    image: "",
    stocks: [],
    editedBy: [{warehousemanId:parseInt(warehouseman?.id as string), at: new Date()}]
  })

  const handleChange = (key: keyof typeof product, value: string) => {
    setProduct({ ...product, [key]: value })
  }

  const handleStockSelection = (selectedItems: number[]) => {
    const selectedStoks = stoks.filter((stok) => selectedItems.includes(stok.id))
    .map((stok) => ({ ...stok, quantity: 1 }));
    setProduct({ ...product, stocks: selectedStoks })
  };


  
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission denied. You need to grant permission to access the media library.');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true, 
      quality: 0.5, 
    });
  
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const imageUri = await uploadImageToBackend(pickerResult.assets[0].uri);
      console.log("Image URI after upload:", imageUri); 
      if (imageUri) {
        setProduct({ ...product, image: imageUri });
      } else {
        alert('Image upload failed. Please try again.');
      }
    } else {
      alert('No image selected. Please try again.');
    }
  };
  

  const handleSubmit = () => {
    productSchema
      .validate(product, { abortEarly: false })
      .then(() => {
        dispatch(createProductAction(product))
        console.log("Product Added:", product)
      })
      .catch((err) => {
        const validationErrors: { [key: string]: string } = {}
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message
        })
        setErrors(validationErrors)
      }).finally(() => {onClose() 
      })
  }

  const renderItem = ({ item }: { item: { label: string; value: any } }) => (
    <View>
 <TextInput
      style={styles.input}
      placeholder={item.label}
      placeholderTextColor="#888"
      value={product[item.value as keyof typeof product] as string}
      onChangeText={(text) => handleChange(item.value, text)}
      keyboardType={item.value === "price" || item.value === "solde" ? "numeric" : "default"}
    />
    {errors[item.value] && <Text style={styles.errorText}>{errors[item.value]}</Text>}
    </View>
   

  )

  const formFields = [
    { label: "Product Name", value: "name" },
    { label: "Product Type", value: "type" },
    { label: "Barcode", value: "barcode" },
    { label: "Price", value: "price" },
    { label: "Solde", value: "solde" },
    { label: "Supplier", value: "supplier" },
  ]

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FF9900" />
            </TouchableOpacity>
            <Text style={styles.title}>Add New Product</Text>
            <FlatList
              data={formFields}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              ListFooterComponent={() => (
                <>
                  <Text style={styles.label}>Select Stocks</Text>
                  {stoks.length > 0 ? (
                    <View style={styles.picker}>
                      <MultiSelect
                        items={stoks}
                        uniqueKey="id"
                        onSelectedItemsChange={handleStockSelection}
                        selectedItems={product.stocks.map((s) => s.id)}
                        selectText="Select Stocks"
                        searchInputPlaceholderText="Search Stocks..."
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#FF9900"
                        tagBorderColor="#FF9900"
                        tagTextColor="#000"
                        selectedItemTextColor="#FF9900"
                        selectedItemIconColor="#FF9900"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: "#000" }}
                        submitButtonColor="#FF9900"
                        submitButtonText="Confirm"
                        styleDropdownMenuSubsection={styles.multiSelectDropdown}
                        styleIndicator={styles.multiSelectIndicator}
                        styleItemsContainer={styles.multiSelectItemsContainer}
                        styleSelectorContainer={styles.multiSelectSelectorContainer}
                        styleTextDropdown={styles.multiSelectTextDropdown}
                        styleInputGroup={styles.multiSelectInputGroup}
                        styleMainWrapper={styles.multiSelectMainWrapper}
                        styleTextDropdownSelected={styles.multiSelectTextDropdownSelected}
                        single={false}
                        fixedHeight={true}
                      />
                    </View>
                  ) : (
                    <Text style={styles.noStocksText}>No Stocks Available</Text>
                  )}
                  <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <Text style={styles.imageButtonText}>Add Image</Text>
                  </TouchableOpacity>

                  {product.image ? (
                    <Image source={{ uri: product.image }} style={styles.imagePreview} />
                  ) : (
                    <Text style={styles.noImageText}>No image selected</Text>
                  )}
                </>
              )}
              
            />
            
            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    height: "90%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9900",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  picker: {
    marginBottom: 15,
  },
  multiSelectDropdown: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  multiSelectIndicator: {
    backgroundColor: "#FF9900",
  },
  multiSelectItemsContainer: {
    maxHeight: 150,
  },
  multiSelectSelectorContainer: {
    marginBottom: 10,
  },
  multiSelectTextDropdown: {
    fontSize: 16,
    color: "#333",
  },
  multiSelectTextDropdownSelected: {
    fontSize: 16,
    color: "#FF9900",
  },
  multiSelectInputGroup: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  multiSelectMainWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageButton: {
    marginTop: 20,
    backgroundColor: "#FF9900",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  noStocksText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
})

export default ProductCreation

