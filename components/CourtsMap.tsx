// Native implementation (iOS/Android). The web build resolves CourtsMap.web.tsx instead.
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { HOME_LOCATION, SPORTS, type Court } from "../data/demo";
import { colors } from "../theme";

export interface CourtsMapProps {
  courts: Court[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CourtsMap({ courts, selectedId, onSelect }: CourtsMapProps) {
  const map = useRef<MapView>(null);

  useEffect(() => {
    const court = courts.find((c) => c.id === selectedId);
    if (court) map.current?.animateToRegion({ latitude: court.lat, longitude: court.lng, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 500);
  }, [selectedId, courts]);

  return (
    <MapView
      ref={map}
      style={StyleSheet.absoluteFill}
      userInterfaceStyle="dark"
      initialRegion={{ latitude: HOME_LOCATION.lat, longitude: HOME_LOCATION.lng, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
    >
      {courts.map((c) => (
        <Marker key={c.id} coordinate={{ latitude: c.lat, longitude: c.lng }} onPress={() => onSelect(c.id)}>
          <View style={[styles.pin, c.id === selectedId && styles.pinOn]}>
            <Text style={{ fontSize: 18 }}>{SPORTS[c.sports[0]].emoji}</Text>
          </View>
        </Marker>
      ))}
      <Marker coordinate={{ latitude: HOME_LOCATION.lat, longitude: HOME_LOCATION.lng }}>
        <View style={styles.me} />
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  pinOn: { backgroundColor: colors.lime, transform: [{ scale: 1.2 }] },
  me: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.sky, borderWidth: 3, borderColor: "#fff" },
});
