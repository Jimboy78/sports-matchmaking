import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

const MapScreen: React.FC = () => {
  // Coordenadas centrales
  const latitude = -33.158217;
  const longitude = -60.515815;

  // Calculando `latitudeDelta` y `longitudeDelta`
  const LATITUDE_DELTA = 0.00922; // Ajustar según el nivel de zoom deseado
  const LONGITUDE_DELTA =
    LATITUDE_DELTA *
    (Dimensions.get("window").width / Dimensions.get("window").height);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title="Ubicación" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
