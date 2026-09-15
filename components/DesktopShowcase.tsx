// Web-only wrapper for wide screens: a landing column next to the app running inside a phone frame.
import React from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LogoMark } from "./Logo";
import { colors, fonts } from "../theme";

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: "flame", text: "Descubrí jugadores deslizando, con afinidad por nivel, horarios y distancia" },
  { icon: "calendar", text: "Reservá canchas por día y horario en segundos" },
  { icon: "map", text: "Mapa de canchas cercanas con precios y valoraciones" },
  { icon: "trophy", text: "Ranking ELO por deporte con podio y tendencias" },
];

export default function DesktopShowcase({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();
  // Keep a real phone width; on short windows the page scrolls instead of squashing the app.
  const phoneHeight = Math.max(680, Math.min(844, height - 48));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ minHeight: height }}>
    <View style={[styles.page, { minHeight: height, paddingVertical: 24 }]}>
      <View style={[styles.glow, { top: -200, left: -160 }]} />
      <View style={[styles.glow, styles.glowSky, { bottom: -220, right: 120 }]} />

      <View style={styles.copy}>
        <View style={styles.brand}>
          <LogoMark size={56} />
          <Text style={styles.wordmark}>
            MATCH<Text style={{ color: colors.lime }}>POINT</Text>
          </Text>
        </View>
        <Text style={styles.headline}>ENCONTRÁ CON QUIÉN JUGAR.</Text>
        <Text style={styles.lead}>
          Pádel, tenis y vóley en tu ciudad: matchmaking entre jugadores, reservas de canchas y ranking — en una sola app hecha con React Native y Expo.
        </Text>
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={18} color={colors.bg} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
        <View style={styles.badges}>
          {["React Native", "Expo", "TypeScript", "iOS · Android · Web"].map((b) => (
            <Text key={b} style={styles.badge}>
              {b}
            </Text>
          ))}
        </View>
        <Text style={styles.hint}>👉 Probá la demo en el teléfono: deslizá tarjetas, reservá y editá tu perfil.</Text>
      </View>

      <View style={[styles.phone, { height: phoneHeight, width: 390 }]}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    backgroundColor: colors.bg,
    overflow: "hidden",
    paddingHorizontal: 40,
  },
  glow: { position: "absolute", width: 520, height: 520, borderRadius: 260, backgroundColor: "rgba(198,244,50,0.12)" },
  glowSky: { backgroundColor: "rgba(76,201,240,0.1)" },
  copy: { maxWidth: 520, gap: 22 },
  brand: { flexDirection: "row", alignItems: "center", gap: 14 },
  wordmark: { fontFamily: fonts.display, fontSize: 44, color: colors.text, letterSpacing: 2 },
  headline: { fontFamily: fonts.display, fontSize: 84, lineHeight: 80, color: colors.text, letterSpacing: 1 },
  lead: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.muted },
  features: { gap: 12 },
  feature: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  featureText: { fontFamily: fonts.medium, fontSize: 15, color: colors.text, flex: 1 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  hint: { fontFamily: fonts.medium, fontSize: 14, color: colors.lime },
  phone: {
    borderRadius: 52,
    borderWidth: 12,
    borderColor: "#1d2622",
    backgroundColor: colors.bg,
    overflow: "hidden",
    shadowColor: colors.lime,
    shadowOpacity: 0.25,
    shadowRadius: 60,
  },
  notch: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 110,
    height: 28,
    borderRadius: 16,
    backgroundColor: "#000",
    zIndex: 10,
  },
  screen: { flex: 1, paddingTop: 30 },
});
