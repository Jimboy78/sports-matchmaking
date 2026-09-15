import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourtsMap from "../components/CourtsMap";
import SportChips from "../components/SportChips";
import BookingModal from "../components/BookingModal";
import { Button } from "../components/ui";
import { COURTS, HOME_LOCATION, SPORTS, distanceKm } from "../data/demo";
import { useApp } from "../context/AppContext";
import { money } from "../utils/format";
import { colors, fonts } from "../theme";

export default function Courts() {
  const insets = useSafeAreaInsets();
  const { state, setSport } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [bookCourt, setBookCourt] = useState<string | null>(null);

  const courts = COURTS.filter((c) => c.sports.includes(state.sport))
    .map((c) => ({ ...c, km: distanceKm(HOME_LOCATION, c) }))
    .sort((a, b) => a.km - b.km);

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <CourtsMap courts={courts} selectedId={selected} onSelect={setSelected} />
        <View style={[styles.mapOverlay, { top: insets.top + 12 }]} pointerEvents="box-none">
          <Text style={styles.title}>CANCHAS CERCA</Text>
          <SportChips value={state.sport} onChange={setSport} />
        </View>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={styles.list}>
        {courts.map((c) => {
          const on = c.id === selected;
          return (
            <Pressable key={c.id} onPress={() => setSelected(c.id)} style={[styles.card, on && styles.cardOn]}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.muted}>
                    {c.address} · {c.km.toFixed(1)} km
                  </Text>
                </View>
                <View style={styles.rating}>
                  <Ionicons name="star" size={12} color={colors.gold} />
                  <Text style={styles.ratingText}>{c.rating}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <View style={styles.tags}>
                  {c.sports.map((s) => (
                    <Text key={s} style={styles.tag}>
                      {SPORTS[s].emoji} {SPORTS[s].label}
                    </Text>
                  ))}
                  <Text style={styles.tag}>{c.indoor ? "🏠 Techada" : "☀️ Aire libre"}</Text>
                </View>
                <Text style={styles.price}>{money(c.pricePerHour)}/h</Text>
              </View>
              {on && <Button label="Reservar acá" icon="calendar" onPress={() => setBookCourt(c.id)} style={{ marginTop: 10 }} />}
            </Pressable>
          );
        })}
      </ScrollView>

      <BookingModal visible={!!bookCourt} initialCourtId={bookCourt ?? undefined} onClose={() => setBookCourt(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  map: { height: "46%", overflow: "hidden" },
  mapOverlay: { position: "absolute", left: 16, right: 16, gap: 8, zIndex: 1000 },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.text, letterSpacing: 1, textShadowColor: "rgba(0,0,0,0.8)", textShadowRadius: 12 },
  sheet: { flex: 1, marginTop: -24, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.bg },
  list: { padding: 16, paddingTop: 20, gap: 10, paddingBottom: 30 },
  card: { padding: 16, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  cardOn: { borderColor: colors.lime },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  name: { fontFamily: fonts.bold, color: colors.text, fontSize: 16 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 13, marginTop: 2 },
  rating: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.card2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  ratingText: { fontFamily: fonts.bold, color: colors.text, fontSize: 12 },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 8 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 },
  tag: { fontFamily: fonts.medium, fontSize: 11, color: colors.text, backgroundColor: colors.card2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: "hidden" },
  price: { fontFamily: fonts.display, fontSize: 24, color: colors.lime, letterSpacing: 1 },
});
