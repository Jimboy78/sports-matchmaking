import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Logo from "../components/Logo";
import SportChips from "../components/SportChips";
import BookingModal from "../components/BookingModal";
import { Avatar, Button, SectionHeader, Stat } from "../components/ui";
import { SPORTS, avatarUrl, courtById, playerById } from "../data/demo";
import { useApp } from "../context/AppContext";
import { formatCountdown, formatDate, useNow } from "../utils/format";
import { colors, fonts } from "../theme";

export default function Home() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { state, setSport, cancel } = useApp();
  const [booking, setBooking] = useState(false);
  const now = useNow(30000);

  const upcoming = state.reservations.filter((r) => r.start > now);
  const next = upcoming[0];
  const nextSport = next ? SPORTS[next.sport] : SPORTS[state.sport];
  const partner = next?.partnerId ? playerById(next.partnerId) : undefined;
  const matched = state.matches.map(playerById).filter(Boolean);
  const { profile } = state;
  const winRate = Math.round((profile.wins / (profile.wins + profile.losses)) * 100);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topRow}>
          <Logo size={32} />
          <Pressable style={styles.bell} onPress={() => navigation.navigate("Descubrir")}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.badge} />
          </Pressable>
        </View>

        <View>
          <Text style={styles.hello}>Hola, {profile.name.split(" ")[0]} 👋</Text>
          <Text style={styles.headline}>¿A QUÉ JUGAMOS HOY?</Text>
        </View>

        <SportChips value={state.sport} onChange={setSport} />

        {next ? (
          <LinearGradient colors={[nextSport.color, colors.limeDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <Text style={styles.heroWatermark}>{nextSport.emoji}</Text>
            <Text style={styles.heroLabel}>PRÓXIMO PARTIDO</Text>
            <Text style={styles.heroCountdown}>{formatCountdown(next.start - now)}</Text>
            <Text style={styles.heroCourt}>{courtById(next.courtId)?.name}</Text>
            <Text style={styles.heroDate}>{formatDate(next.start)}</Text>
            {partner && (
              <View style={styles.heroPartner}>
                <Avatar uri={avatarUrl(partner.name)} size={34} ring={colors.bg} />
                <Text style={styles.heroPartnerText}>con {partner.name}</Text>
              </View>
            )}
          </LinearGradient>
        ) : (
          <Pressable style={styles.emptyHero} onPress={() => setBooking(true)}>
            <Ionicons name="calendar-outline" size={28} color={colors.lime} />
            <Text style={styles.emptyText}>No tenés partidos. ¡Reservá una cancha!</Text>
          </Pressable>
        )}

        <View style={styles.stats}>
          <Stat label="ELO" value={String(profile.elo)} accent={colors.lime} />
          <Stat label="Victorias" value={`${winRate}%`} />
          <Stat label="Racha" value={`${profile.streak}🔥`} accent={colors.gold} />
        </View>

        <SectionHeader title="TUS COMPAÑEROS" action="Descubrir más" onAction={() => navigation.navigate("Descubrir")} />
        {matched.length === 0 ? (
          <Text style={styles.muted}>Deslizá en Descubrir para encontrar con quién jugar.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {matched.map((p) => (
              <View key={p!.id} style={styles.mate}>
                <Avatar uri={avatarUrl(p!.name)} size={60} ring={SPORTS[p!.sport].color} />
                <Text style={styles.mateName}>{p!.name.split(" ")[0]}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <SectionHeader title="MIS RESERVAS" />
        {upcoming.length === 0 && <Text style={styles.muted}>Sin reservas próximas.</Text>}
        {upcoming.map((r) => {
          const court = courtById(r.courtId);
          const mate = r.partnerId ? playerById(r.partnerId) : undefined;
          return (
            <View key={r.id} style={styles.reservation}>
              <View style={[styles.resIcon, { backgroundColor: SPORTS[r.sport].color }]}>
                <Text style={{ fontSize: 22 }}>{SPORTS[r.sport].emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resTitle}>{court?.name}</Text>
                <Text style={styles.muted}>
                  {formatDate(r.start)} · {r.durationMin} min{mate ? ` · con ${mate.name.split(" ")[0]}` : ""}
                </Text>
              </View>
              <Pressable onPress={() => cancel(r.id)} hitSlop={10}>
                <Ionicons name="close-circle-outline" size={24} color={colors.muted} />
              </Pressable>
            </View>
          );
        })}

        <Button label="Reservar cancha" icon="add-circle" onPress={() => setBooking(true)} />
      </ScrollView>

      <BookingModal visible={booking} onClose={() => setBooking(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40, gap: 18 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.coral },
  hello: { fontFamily: fonts.medium, color: colors.muted, fontSize: 15 },
  headline: { fontFamily: fonts.display, color: colors.text, fontSize: 42, letterSpacing: 1, lineHeight: 44 },
  hero: { borderRadius: 26, padding: 22, overflow: "hidden" },
  heroWatermark: { position: "absolute", right: -18, bottom: -30, fontSize: 150, opacity: 0.22 },
  heroLabel: { fontFamily: fonts.bold, color: colors.bg, fontSize: 12, letterSpacing: 1.5 },
  heroCountdown: { fontFamily: fonts.display, color: colors.bg, fontSize: 64, lineHeight: 66 },
  heroCourt: { fontFamily: fonts.bold, color: colors.bg, fontSize: 18 },
  heroDate: { fontFamily: fonts.medium, color: "rgba(10,15,13,0.7)", fontSize: 14 },
  heroPartner: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  heroPartnerText: { fontFamily: fonts.semibold, color: colors.bg },
  emptyHero: {
    borderRadius: 26,
    padding: 26,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.line,
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontFamily: fonts.semibold, color: colors.text },
  stats: { flexDirection: "row", gap: 10 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 13 },
  mate: { alignItems: "center", gap: 6 },
  mateName: { fontFamily: fonts.semibold, color: colors.text, fontSize: 12 },
  reservation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  resIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  resTitle: { fontFamily: fonts.bold, color: colors.text, fontSize: 15 },
});
