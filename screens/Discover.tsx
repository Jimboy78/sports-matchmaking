import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Modal, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SportChips from "../components/SportChips";
import BookingModal from "../components/BookingModal";
import { Avatar, Button } from "../components/ui";
import { PLAYERS, SPORTS, avatarUrl, compatibility, levelName, type Player } from "../data/demo";
import { useApp } from "../context/AppContext";
import { colors, fonts } from "../theme";

const SWIPE_THRESHOLD = 110;
const MATCH_THRESHOLD = 60;
const noSelect = { userSelect: "none" } as object;

export default function Discover() {
  const insets = useSafeAreaInsets();
  const { state, setSport, like, pass, resetDeck } = useApp();
  const [matched, setMatched] = useState<Player | null>(null);
  const [pending, setPending] = useState<Player | null>(null);
  const [bookWith, setBookWith] = useState<string | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  const matchPop = useRef(new Animated.Value(0)).current;

  const deck = useMemo(
    () =>
      PLAYERS.filter((p) => p.sport === state.sport && !state.matches.includes(p.id) && !state.passed.includes(p.id)).sort(
        (a, b) => compatibility(b, state.profile) - compatibility(a, state.profile)
      ),
    [state.sport, state.matches, state.passed, state.profile]
  );

  const top = deck[0];
  const next = deck[1];

  // PanResponder is created once; read the latest values through refs.
  const latest = useRef({ top, like, pass, profile: state.profile });
  latest.current = { top, like, pass, profile: state.profile };

  const finish = (dir: 1 | -1) => {
    const player = latest.current.top;
    if (!player) return;
    Animated.timing(position, { toValue: { x: dir * 650, y: 40 }, duration: 240, useNativeDriver: false }).start(() => {
      if (dir === 1) {
        latest.current.like(player.id);
        if (compatibility(player, latest.current.profile) >= MATCH_THRESHOLD) setMatched(player);
        else setPending(player);
      } else {
        latest.current.pass(player.id);
      }
      // Reset after React has swapped in the next card.
      requestAnimationFrame(() => position.setValue({ x: 0, y: 0 }));
    });
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) finishRef.current(1);
          else if (g.dx < -SWIPE_THRESHOLD) finishRef.current(-1);
          else Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
        },
      }),
    [position]
  );

  useEffect(() => {
    if (!matched) return;
    matchPop.setValue(0);
    Animated.spring(matchPop, { toValue: 1, friction: 4, tension: 60, useNativeDriver: false }).start();
  }, [matched, matchPop]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(null), 2200);
    return () => clearTimeout(t);
  }, [pending]);

  const rotate = position.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ["-14deg", "0deg", "14deg"] });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: "clamp" });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: "clamp" });
  const nextScale = position.x.interpolate({ inputRange: [-300, 0, 300], outputRange: [1, 0.93, 1], extrapolate: "clamp" });

  const sport = SPORTS[state.sport];

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>DESCUBRIR</Text>
        <Text style={styles.subtitle}>
          {deck.length} jugador{deck.length === 1 ? "" : "es"} de {sport.label.toLowerCase()} cerca
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <SportChips value={state.sport} onChange={setSport} />
      </View>

      <View style={styles.deck}>
        {!top && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 64 }}>🏆</Text>
            <Text style={styles.emptyTitle}>¡VISTE A TODOS!</Text>
            <Text style={styles.muted}>Probá otro deporte o volvé a ver a quienes pasaste.</Text>
            <Button label="Volver a ver" icon="refresh" variant="ghost" onPress={resetDeck} />
          </View>
        )}

        {next && (
          <Animated.View style={[styles.card, styles.cardBehind, { transform: [{ scale: nextScale }] }]}>
            <PlayerCard player={next} score={compatibility(next, state.profile)} />
          </Animated.View>
        )}

        {top && (
          <Animated.View
            key={top.id}
            {...responder.panHandlers}
            style={[styles.card, noSelect, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}
          >
            <PlayerCard player={top} score={compatibility(top, state.profile)} />
            <Animated.View style={[styles.stamp, styles.stampLike, { opacity: likeOpacity }]}>
              <Text style={[styles.stampText, { color: colors.lime }]}>JUGAMOS</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampNope, { opacity: nopeOpacity }]}>
              <Text style={[styles.stampText, { color: colors.coral }]}>PASO</Text>
            </Animated.View>
          </Animated.View>
        )}
      </View>

      {top && (
        <View style={styles.actions}>
          <RoundButton icon="close" color={colors.coral} onPress={() => finish(-1)} />
          <RoundButton icon="tennisball" color={colors.lime} big onPress={() => finish(1)} />
        </View>
      )}

      {pending && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>📨 Le enviamos tu invitación a {pending.name.split(" ")[0]}</Text>
        </View>
      )}

      <Modal visible={!!matched} transparent animationType="fade" onRequestClose={() => setMatched(null)}>
        <View style={styles.matchWrap}>
          {matched && (
            <Animated.View style={[styles.matchInner, { transform: [{ scale: matchPop }] }]}>
              <Text style={styles.matchTitle}>¡ES UN MATCH!</Text>
              <Text style={styles.matchSub}>
                A {matched.name.split(" ")[0]} también le gustaría jugar con vos
              </Text>
              <View style={styles.matchAvatars}>
                <Avatar uri={state.profile.photo ?? avatarUrl(state.profile.name)} size={110} ring={colors.lime} />
                <View style={styles.matchBall}>
                  <Text style={{ fontSize: 30 }}>{SPORTS[matched.sport].emoji}</Text>
                </View>
                <Avatar uri={avatarUrl(matched.name)} size={110} ring={colors.lime} />
              </View>
              <Button
                label="Reservar juntos"
                icon="calendar"
                onPress={() => {
                  setBookWith(matched.id);
                  setMatched(null);
                }}
                style={{ alignSelf: "stretch" }}
              />
              <Button label="Seguir buscando" variant="ghost" onPress={() => setMatched(null)} style={{ alignSelf: "stretch" }} />
            </Animated.View>
          )}
        </View>
      </Modal>

      <BookingModal visible={!!bookWith} partnerId={bookWith ?? undefined} onClose={() => setBookWith(null)} />
    </View>
  );
}

function PlayerCard({ player, score }: { player: Player; score: number }) {
  const sport = SPORTS[player.sport];
  return (
    <View style={styles.cardInner}>
      <Image source={{ uri: avatarUrl(player.name) }} style={styles.cardImage} />
      <LinearGradient colors={["transparent", "rgba(10,15,13,0.95)"]} style={styles.cardShade} />
      <View style={[styles.score, { borderColor: score >= MATCH_THRESHOLD ? colors.lime : colors.gold }]}>
        <Text style={styles.scoreValue}>{score}%</Text>
        <Text style={styles.scoreLabel}>afinidad</Text>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.levelRow}>
          <View style={[styles.levelChip, { backgroundColor: sport.color }]}>
            <Text style={styles.levelText}>
              Nivel {player.level} · {levelName(player.level)}
            </Text>
          </View>
          <Text style={styles.distance}>📍 {player.distanceKm.toFixed(1)} km</Text>
        </View>
        <Text style={styles.name}>
          {player.name.toUpperCase()}, {player.age}
        </Text>
        <Text style={styles.bio} numberOfLines={2}>
          {player.bio}
        </Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>🎯 {player.position}</Text>
          <Text style={styles.tag}>🏅 {player.winRate}% victorias</Text>
          {player.availability.map((a) => (
            <Text key={a} style={styles.tag}>
              🕒 {a}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function RoundButton({ icon, color, onPress, big }: { icon: keyof typeof Ionicons.glyphMap; color: string; onPress: () => void; big?: boolean }) {
  const size = big ? 76 : 62;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.round,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
        big && { backgroundColor: color },
        pressed && { transform: [{ scale: 0.9 }] },
      ]}
    >
      <Ionicons name={icon} size={big ? 34 : 28} color={big ? colors.bg : color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, gap: 12 },
  header: { paddingHorizontal: 20 },
  title: { fontFamily: fonts.display, fontSize: 42, color: colors.text, letterSpacing: 1 },
  subtitle: { fontFamily: fonts.medium, color: colors.muted, fontSize: 14 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 14, textAlign: "center" },
  deck: { flex: 1, marginHorizontal: 20, marginTop: 4 },
  card: { ...StyleSheet.absoluteFillObject, borderRadius: 30, overflow: "hidden", backgroundColor: colors.card },
  cardBehind: { opacity: 0.7 },
  cardInner: { flex: 1 },
  cardImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  cardShade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "65%" },
  score: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    backgroundColor: "rgba(10,15,13,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: { fontFamily: fonts.display, fontSize: 26, color: colors.text, lineHeight: 26 },
  scoreLabel: { fontFamily: fonts.medium, fontSize: 9, color: colors.muted, textTransform: "uppercase" },
  cardInfo: { position: "absolute", left: 18, right: 18, bottom: 18, gap: 6 },
  levelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  levelChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  levelText: { fontFamily: fonts.bold, fontSize: 11, color: colors.bg },
  distance: { fontFamily: fonts.semibold, color: colors.text, fontSize: 12 },
  name: { fontFamily: fonts.display, fontSize: 38, color: colors.text, letterSpacing: 1, lineHeight: 40 },
  bio: { fontFamily: fonts.body, color: "rgba(241,245,242,0.85)", fontSize: 14 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  tag: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.text,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  stamp: { position: "absolute", top: 34, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 4, borderRadius: 12 },
  stampLike: { left: 24, borderColor: colors.lime, transform: [{ rotate: "-14deg" }] },
  stampNope: { right: 24, borderColor: colors.coral, transform: [{ rotate: "14deg" }] },
  stampText: { fontFamily: fonts.display, fontSize: 36, letterSpacing: 2 },
  actions: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 28, paddingBottom: 16 },
  round: { alignItems: "center", justifyContent: "center", borderWidth: 2, backgroundColor: colors.card },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 36, color: colors.text, letterSpacing: 1 },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 110,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  toastText: { fontFamily: fonts.semibold, color: colors.text, textAlign: "center" },
  matchWrap: { flex: 1, backgroundColor: "rgba(10,15,13,0.92)", alignItems: "center", justifyContent: "center", padding: 24 },
  matchInner: { width: "100%", maxWidth: 380, alignItems: "center", gap: 14 },
  matchTitle: { fontFamily: fonts.display, fontSize: 64, color: colors.lime, letterSpacing: 2, textAlign: "center" },
  matchSub: { fontFamily: fonts.medium, color: colors.text, fontSize: 15, textAlign: "center" },
  matchAvatars: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  matchBall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg,
    borderWidth: 3,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -16,
    zIndex: 2,
  },
});
