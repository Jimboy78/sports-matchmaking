import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SportChips from "../components/SportChips";
import { Avatar, Button, SectionHeader, Stat } from "../components/ui";
import { LAST_TEN, MATCH_HISTORY, SPORTS, avatarUrl, levelName, playerById, type SportId } from "../data/demo";
import { useApp } from "../context/AppContext";
import { colors, fonts } from "../theme";

const MAX_LEVEL = 7;

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { state, updateProfile, setSport } = useApp();
  const { profile } = state;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: profile.name, city: profile.city, sport: profile.sport, level: profile.level });

  const total = profile.wins + profile.losses;
  const winRate = Math.round((profile.wins / total) * 100);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) updateProfile({ photo: result.assets[0].uri });
  };

  const startEdit = () => {
    setDraft({ name: profile.name, city: profile.city, sport: profile.sport, level: profile.level });
    setEditing(true);
  };

  const save = () => {
    updateProfile({ ...draft, name: draft.name.trim() || profile.name, city: draft.city.trim() || profile.city });
    setSport(draft.sport);
    setEditing(false);
  };

  const sport = SPORTS[profile.sport];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <LinearGradient colors={["rgba(198,244,50,0.22)", "rgba(198,244,50,0)"]} style={styles.header}>
        <Pressable onPress={pickPhoto} style={styles.avatarWrap}>
          <Avatar uri={profile.photo ?? avatarUrl(profile.name)} size={112} ring={colors.lime} />
          <View style={styles.camera}>
            <Ionicons name="camera" size={16} color={colors.bg} />
          </View>
        </Pressable>
        <Text style={styles.name}>{profile.name.toUpperCase()}</Text>
        <Text style={styles.muted}>
          📍 {profile.city} · {sport.emoji} {sport.label}
        </Text>
      </LinearGradient>

      <View style={styles.eloCard}>
        <View>
          <Text style={styles.eloLabel}>RATING ELO</Text>
          <Text style={styles.elo}>{profile.elo}</Text>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.levelText}>
            Nivel {profile.level} · {levelName(profile.level)}
          </Text>
          <View style={styles.levelTrack}>
            <View style={[styles.levelFill, { width: `${(profile.level / MAX_LEVEL) * 100}%` }]} />
          </View>
          <Text style={styles.small}>Próximo nivel: +{Math.max(0, Math.round((Math.floor(profile.level) + 1 - profile.level) * 100))} pts</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label="Partidos" value={String(total)} />
        <Stat label="Victorias" value={String(profile.wins)} accent={colors.lime} />
        <Stat label="Win rate" value={`${winRate}%`} />
        <Stat label="Racha" value={`${profile.streak}🔥`} accent={colors.gold} />
      </View>

      <SectionHeader title="ÚLTIMOS 10" />
      <View style={styles.form}>
        {LAST_TEN.map((won, i) => (
          <View key={i} style={[styles.formDot, { backgroundColor: won ? colors.lime : colors.coral }]}>
            <Text style={styles.formDotText}>{won ? "G" : "P"}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="HISTORIAL" />
      {MATCH_HISTORY.map((m) => {
        const rival = playerById(m.opponentId);
        return (
          <View key={m.id} style={styles.match}>
            <Avatar uri={avatarUrl(rival?.name ?? m.opponentId)} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.matchName}>vs {rival?.name}</Text>
              <Text style={styles.muted}>
                {m.date} · {m.score}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <Text style={[styles.result, { backgroundColor: m.won ? colors.lime : colors.coral }]}>{m.won ? "GANADO" : "PERDIDO"}</Text>
              <Text style={[styles.delta, { color: m.eloDelta >= 0 ? colors.lime : colors.coral }]}>
                {m.eloDelta >= 0 ? "+" : ""}
                {m.eloDelta} ELO
              </Text>
            </View>
          </View>
        );
      })}

      {editing ? (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>EDITAR PERFIL</Text>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput style={styles.input} value={draft.name} onChangeText={(name) => setDraft((d) => ({ ...d, name }))} placeholderTextColor={colors.muted} />
          <Text style={styles.inputLabel}>Ciudad</Text>
          <TextInput style={styles.input} value={draft.city} onChangeText={(city) => setDraft((d) => ({ ...d, city }))} placeholderTextColor={colors.muted} />
          <Text style={styles.inputLabel}>Deporte principal</Text>
          <SportChips value={draft.sport} onChange={(s: SportId) => setDraft((d) => ({ ...d, sport: s }))} />
          <Text style={styles.inputLabel}>Nivel</Text>
          <View style={styles.stepper}>
            <Pressable style={styles.stepBtn} onPress={() => setDraft((d) => ({ ...d, level: Math.max(1, d.level - 0.5) }))}>
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>
            <Text style={styles.stepValue}>{draft.level.toFixed(1)}</Text>
            <Pressable style={styles.stepBtn} onPress={() => setDraft((d) => ({ ...d, level: Math.min(MAX_LEVEL, d.level + 0.5) }))}>
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
            <Text style={styles.muted}>{levelName(draft.level)}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            <Button label="Cancelar" variant="ghost" onPress={() => setEditing(false)} style={{ flex: 1 }} />
            <Button label="Guardar" icon="checkmark" onPress={save} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <Button label="Editar perfil" icon="create-outline" variant="ghost" onPress={startEdit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { alignItems: "center", gap: 6, paddingVertical: 18, borderRadius: 28 },
  avatarWrap: { position: "relative" },
  camera: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.bg,
  },
  name: { fontFamily: fonts.display, fontSize: 36, color: colors.text, letterSpacing: 1, marginTop: 6 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 13 },
  small: { fontFamily: fonts.body, color: colors.muted, fontSize: 11 },
  eloCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  eloLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.muted, letterSpacing: 1 },
  elo: { fontFamily: fonts.display, fontSize: 58, color: colors.lime, lineHeight: 60 },
  levelText: { fontFamily: fonts.semibold, color: colors.text, fontSize: 13 },
  levelTrack: { height: 10, borderRadius: 5, backgroundColor: colors.card2, overflow: "hidden" },
  levelFill: { height: "100%", borderRadius: 5, backgroundColor: colors.lime },
  stats: { flexDirection: "row", gap: 8 },
  form: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  formDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  formDotText: { fontFamily: fonts.bold, fontSize: 11, color: colors.bg },
  match: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  matchName: { fontFamily: fonts.bold, color: colors.text, fontSize: 14 },
  result: { fontFamily: fonts.bold, fontSize: 10, color: colors.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: "hidden" },
  delta: { fontFamily: fonts.bold, fontSize: 11 },
  editCard: { gap: 8, padding: 18, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lime },
  editTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.text, letterSpacing: 1 },
  inputLabel: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 },
  input: {
    fontFamily: fonts.medium,
    color: colors.text,
    backgroundColor: colors.card2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card2, alignItems: "center", justifyContent: "center" },
  stepValue: { fontFamily: fonts.display, fontSize: 30, color: colors.lime, minWidth: 44, textAlign: "center" },
});
