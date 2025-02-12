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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MultiSelect from "react-native-multiple-select"
import type { stok } from "../constants/types"
import React from "react"
import productSchema from "./productSchema"

const ProductCreation = ({ visible, onClose, stoks }: { visible: boolean; onClose: any; stoks: stok[] }) => {
  const [errors, setErrors] = useState<any>({})

  const [product, setProduct] = useState<{
    name: string
    type: string
    barcode: string
    price: string
    solde: string
    supplier: string
    image: string
    stoks: stok[]
  }>({
    name: "",
    type: "",
    barcode: "",
    price: "",
    solde: "",
    supplier: "",
    image: "",
    stoks: [],
  })

  const handleChange = (key: keyof typeof product, value: string) => {
    setProduct({ ...product, [key]: value })
  }

  const handleStockSelection = (selectedItems: number[]) => {
    const selectedStoks = stoks.filter((stok) => selectedItems.includes(stok.id))
    setProduct({ ...product, stoks: selectedStoks })
  }

  const handleSubmit = () => {
    productSchema
      .validate(product, { abortEarly: false })
      .then(() => {
        console.log("Product Added:", product)
        onClose() 
      })
      .catch((err) => {
        const validationErrors: { [key: string]: string } = {}
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message
        })
        setErrors(validationErrors)
      })
    onClose()
  }

  const renderItem = ({ item }: { item: { label: string; value: any } }) => (
    <TextInput
      style={styles.input}
      placeholder={item.label}
      placeholderTextColor="#888"
      value={product[item.value as keyof typeof product] as string}
      onChangeText={(text) => handleChange(item.value, text)}
      keyboardType={item.value === "price" || item.value === "solde" ? "numeric" : "default"}
    />
  )

  const formFields = [
    { label: "Product Name", value: "name" },
    { label: "Product Type", value: "type" },
    { label: "Barcode", value: "barcode" },
    { label: "Price", value: "price" },
    { label: "Solde", value: "solde" },
    { label: "Supplier", value: "supplier" },
    { label: "Image URL", value: "image" },
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
                        selectedItems={product.stoks.map((s) => s.id)}
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
})

export default ProductCreation

