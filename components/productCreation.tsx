
import { useState, useEffect } from "react"
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
  ScrollView,
} from "react-native"
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"
import MultiSelect from "react-native-multiple-select"
import * as ImagePicker from "expo-image-picker"
import type { stok } from "../constants/types"
import productSchema from "./productSchema"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createProductAction } from "@/app/(redux)/productsSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/(redux)/store"
import type { editedBy } from "../constants/types"
import { uploadImageToBackend } from "@/app/helpers/minio.helper"
import { replaceIp } from "@/app/helpers/replaceIp"
import React from "react"
import CameraScanner from "./CameraScanner"

const ProductCreation = ({ visible, onClose, stoks }: { visible: boolean; onClose: any; stoks: stok[] }) => {
  const [errors, setErrors] = useState<any>({})
  const [showAddStock, setShowAddStock] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const dispatch = useAppDispatch()
  const { warehouseman } = useSelector((state: RootState) => state.auth)

  const [product, setProduct] = useState<{
    id: string
    name: string
    type: string
    barcode: string
    price: string
    solde: string
    supplier: string
    image: string | null
    stocks: stok[]
    editedBy: editedBy[]
  }>({
    id: (Math.random() * 255).toString(),
    name: "Laptop HP Pavilion",
    type: "Informatique",
    barcode: "1234567890123",
    price: "1200",
    solde: "124",
    supplier: "HP",
    image: "",
    stocks: [],
    editedBy: [{ warehousemanId: Number.parseInt(warehouseman?.id as string), at: new Date() }],
  })

  const [newStock, setNewStock] = useState<stok>({
    id: 0,
    name: "",
    quantity: 0,
    localisation: {
      city: "",
      latitude: 0,
      longitude: 0,
    },
  })


  

  const handleChange = (key: keyof typeof product, value: string) => {
    setProduct({ ...product, [key]: value })
  }

  const handleStockSelection = (selectedItems: number[]) => {
    const selectedStoks = stoks
      .filter((stok) => selectedItems.includes(stok.id))
      .map((stok) => ({ ...stok, quantity: 1 }))
      setProduct({
        ...product,
        stocks: [...product.stocks, ...selectedStoks],
      })  }

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      const image = await uploadImageToBackend(uri)
      setProduct({ ...product, image: image })
    }
  }

  const handleSubmit = async () => {
    try {
      const isValid = await productSchema.isValid(product)
      if (!isValid) {
        const validationErrors = await productSchema.validate(product, { abortEarly: false }).catch((err) => err)
        const errorMessages = validationErrors.inner.reduce(
          (acc: any, err: any) => ({ ...acc, [err.path]: err.message }),
          {},
        )
        setErrors(errorMessages)
        return
      }
      dispatch(createProductAction(product))
      onClose()
    } catch (error) {
      console.error("Error submitting product:", error)
    }
  }

  const handleAddNewStock = () => {
    setShowAddStock(true)
  }

  const handleNewStockChange = (key: string, value: string | number) => {
    if (key === "city" || key === "latitude" || key === "longitude") {
      setNewStock({
        ...newStock,
        localisation: {
          ...newStock.localisation,
          [key]: key === "city" ? value : Number(value),
        },
      })
    } else {
      setNewStock({ ...newStock, [key]: key === "quantity" ? Number(value) : value })
    }
  }

  const handleSubmitNewStock = () => {
    const updatedNewStock = {
      ...newStock,
      id: Math.random() * 1000,
    }
    setProduct({
      ...product,
      stocks: [...product.stocks, updatedNewStock],
    })
    setShowAddStock(false)
    setNewStock({
      id: 0,
      name: "",
      quantity: 0,
      localisation: {
        city: "",
        latitude: 0,
        longitude: 0,
      },
    })
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
  
    setProduct({ ...product, barcode: data })
    setShowScanner(false)
  }



  const renderItem = ({ item }: { item: { label: string; value: any } }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{item.label}</Text>
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
    { label: "Price", value: "price" },
    { label: "Solde", value: "solde" },
    { label: "Supplier", value: "supplier" },
  ]

  

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FF9900" />
            </TouchableOpacity>
            <Text style={styles.title}>Add New Product</Text>
            <FlatList
              data={formFields}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              scrollEnabled={false}
              ListHeaderComponent={() => (
                <View style={styles.barcodeContainer}>
                  <Text style={styles.inputLabel}>Barcode</Text>
                  <View style={styles.barcodeInputContainer}>
                    <TextInput
                      style={[styles.input, styles.barcodeInput]}
                      placeholder="Barcode"
                      placeholderTextColor="#888"
                      value={product.barcode}
                      onChangeText={(text) => handleChange("barcode", text)}
                    />
                    <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
                      <Ionicons name="barcode-outline" size={40} color="#FF9900" />
                    </TouchableOpacity>
                  </View>
                  {errors.barcode && <Text style={styles.errorText}>{errors.barcode}</Text>}
                </View>
              )}
              ListFooterComponent={() => (
                <>
                  <Text style={styles.sectionTitle}>Select Stocks</Text>
                  {stoks.length > 0 ? (
                    <View style={styles.picker}>
                      <MultiSelect
                        items={stoks}
                        uniqueKey="id"
                        onSelectedItemsChange={handleStockSelection}
                        selectedItems={product.stocks.map((s) => s.id)}
                        selectText="Select Stocks"
                        searchInputPlaceholderText="Search Stocks..."
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
                  <TouchableOpacity style={styles.addStockButton} onPress={handleAddNewStock}>
                    {/* <Text style={styles.buttonText}>Add New Stock</Text> */}
                    <MaterialIcons name="new-label" size={40} color="#FF9900" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <Feather name="upload-cloud" size={40} color="#FF9900" />
                  </TouchableOpacity>

                  {product.image ? (
                    <Image
                      source={{ uri: replaceIp(product.image, process.env.EXPO_PUBLIC_REPLACE || "") }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Text style={styles.noImageText}>No image selected</Text>
                  )}
                  {product.stocks.length > 0 && (
                    <View style={styles.selectedStocksContainer}>
                      <Text style={styles.selectedStocksTitle}>Selected Stocks:</Text>
                      {product.stocks.map((stock) => (
                        <Text key={stock.id} style={styles.selectedStockItem}>
                          {stock.name} - Quantity: {stock.quantity}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            />

            {showAddStock && (
              <View style={styles.newStockForm}>
                <Text style={styles.newStockTitle}>Add New Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Stock Name"
                  value={newStock.name}
                  onChangeText={(text) => handleNewStockChange("name", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={newStock.quantity.toString()}
                  onChangeText={(text) => handleNewStockChange("quantity", text)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={newStock.localisation.city}
                  onChangeText={(text) => handleNewStockChange("city", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Latitude"
                  value={newStock.localisation.latitude.toString()}
                  onChangeText={(text) => handleNewStockChange("latitude", text)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Longitude"
                  value={newStock.localisation.longitude.toString()}
                  onChangeText={(text) => handleNewStockChange("longitude", text)}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.submitStockButton} onPress={handleSubmitNewStock}>
                  <Text style={styles.buttonText}>Submit New Stock</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {showScanner && (
               <CameraScanner showScanner={showScanner} setShowScanner={setShowScanner} handleBarCodeScanned={handleBarCodeScanned}/>

      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingTop: 20,
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 300,
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
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 20,
  },
  picker: {
    marginBottom: 15,
  },
  multiSelectDropdown: {
    borderColor: "#FF9900",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 20
  },
  multiSelectIndicator: {
    backgroundColor: "#fff",
    color: "#FF9900",

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
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderColor: "#FF9900",
    borderWidth: 1,
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    alignItems: "center",
  },
  buttonText: {
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
    marginTop: 50,
    marginBottom: 150,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  addStockButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderColor: "#FF9900",
    borderWidth: 1,
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    alignItems: "center",
  },
  newStockForm: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  newStockTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  submitStockButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  selectedStocksContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  selectedStocksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  selectedStockItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  barcodeContainer: {
    marginBottom: 15,
  },
  barcodeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
  },
  scanButton: {
    padding: 3,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
   boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  closeScannerButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  scannerOverlay: {
    position: "absolute",
    top: 250,
    left: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerMarker: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: "#FF9900",
    backgroundColor: "transparent",
  },
  cameraview: {
    flex: 1,
  },
 cameraoverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 16,
  },
  flipButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})

export default ProductCreation

