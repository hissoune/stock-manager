import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CameraScanner = ({showScanner,setShowScanner,handleBarCodeScanned}:{showScanner:boolean,setShowScanner:any,handleBarCodeScanned:any}) => {
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

      const toggleCameraFacing = () => {
        setCameraType((prevCameraType) => (prevCameraType === ImagePicker.CameraType.back ? ImagePicker.CameraType.front : ImagePicker.CameraType.back));
      }
    
        useEffect(() => {
          ;(async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === "granted")
          })()
        }, []);
        if (hasPermission === null) {
            return <Text>Requesting for camera permission</Text>
          }
          if (hasPermission === false) {
            return <Text>No access to camera</Text>
          }

        const onBarCodeScanned = (scanData: { type: string; data: string }) => {
            if (!scanned) {
              setScanned(true)
              handleBarCodeScanned(scanData)
              setTimeout(() => setScanned(false), 1000)
            }
          }

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showScanner}
          onRequestClose={() => setShowScanner(false)}
        >
          <View style={styles.scannerContainer}>
          <CameraView 
              style={styles.cameraview} 
              facing={cameraType} 
              onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
            >
              <View style={styles.cameraoverlay}>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                  <Text style={styles.flipText}>Flip Camera</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerMarker} />
            </View>
            <TouchableOpacity style={styles.closeScannerButton} onPress={() => setShowScanner(false)}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    barcodeInputContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      barcodeInput: {
        flex: 1,
        marginRight: 10,
      },
      scanButton: {
        padding: 7,
        
        height: 70,
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

export default CameraScanner;
