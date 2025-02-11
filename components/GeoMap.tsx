import React from "react";
import MapView, { Marker, Geojson } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const MyMap = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const geoJsonData: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          title: "Custom Location",
          description: "User-defined location",
        },
      },
    ],
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Geojson geojson={geoJsonData} strokeColor="red" fillColor="blue" />

        <Marker coordinate={{ latitude, longitude }} title="You are here" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: 190,
      borderWidth: 0.5,
    borderColor: "#FF9900",
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 15,
    alignSelf: "center",
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    padding: 1,
  },
  map: {
    flex: 1,
    borderRadius: 15,
    zIndex: 1,
  },
});

export default MyMap;
