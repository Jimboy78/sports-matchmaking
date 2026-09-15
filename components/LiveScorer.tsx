import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PLAYERS, SPORTS, avatarUrl, levelName } from "../data/demo";
import { useApp } from "../context/AppContext";
import {
  callout,
  eloDelta,
  other,
  pointLabels,
  replay,
  setScores,
  type Callout,
  type MatchConfig,
  type Side,
  type Snapshot,
} from "../utils/scoring";
import { colors, fonts } from "../theme";
import { Avatar, Button } from "./ui";

const NATIVE = Platform.OS !== "web";
const SIDE_COLOR: Record<Side, string> = { 0: colors.lime, 1: colors.coral };

type Phase = "setup" | "live" | "done";

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** Springs back to 1 whenever `value` changes, for the "score just changed" pop. */
function useBump(value: unknown) {
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    scale.setValue(1.35);
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: NATIVE }).start();
  }, [value, scale]);
  return scale;
}

function Pill({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, on && styles.pillOn]}>
      <Text style={[styles.pillText, on && styles.pillTextOn]}>{label}</Text>
    </Pressable>
  );
}

function CalloutBanner({ call, names }: { call: Callout; names: [string, string] }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: NATIVE }).start();
  }, [call.text, call.side, anim]);

  return (
    <Animated.View
      style={[
        styles.callout,
        {
          backgroundColor: call.tone === "hot" ? colors.coral : colors.sky,
          opacity: anim,
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
        },
      ]}
    >
      <Text style={styles.calloutText}>
        {call.text}
        {call.side !== null ? ` · ${names[call.side].toUpperCase()}` : ""}
      </Text>
    </Animated.View>
  );
}

function ScoreRow({
  side,
  name,
  avatar,
  snap,
  labels,
  config,
}: {
  side: Side;
  name: string;
  avatar: string;
  snap: Snapshot;
  labels: [string, string];
  config: MatchConfig;
}) {
  const live = snap.winner === null;
  return (
    <View style={styles.row}>
      <View style={styles.serveSlot}>{live && snap.server === side && <View style={[styles.serveDot, { backgroundColor: SIDE_COLOR[side] }]} />}</View>
      <Avatar uri={avatar} size={30} />
      <Text style={[styles.rowName, snap.winner === side && { color: SIDE_COLOR[side] }]} numberOfLines={1}>
        {name}
      </Text>
      {snap.sets.map((set, i) => (
        <Text key={i} style={[styles.cell, set[side] > set[other(side)] && styles.cellWon]}>
          {set[side]}
        </Text>
      ))}
      {live && config.format === "raqueta" && <Text style={[styles.cell, styles.cellCurrent]}>{snap.games[side]}</Text>}
      {live && <Text style={[styles.cellPoints, { color: SIDE_COLOR[side] }]}>{labels[side]}</Text>}
    </View>
  );
}

function TapZone({
  side,
  name,
  label,
  serving,
  serveEmoji,
  disabled,
  onPress,
}: {
  side: Side;
  name: string;
  label: string;
  serving: boolean;
  serveEmoji: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const bump = useBump(label);
  const color = SIDE_COLOR[side];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={`Punto para ${name}`}
      style={({ pressed }) => [styles.zone, { borderColor: color }, pressed && { backgroundColor: `${color}26`, transform: [{ scale: 0.97 }] }]}
    >
      <View style={styles.zoneTop}>
        <Text style={styles.zoneName} numberOfLines={1}>
          {name}
        </Text>
        {serving && <Text style={styles.zoneServe}>{serveEmoji}</Text>}
      </View>
      <Animated.Text style={[styles.zonePoints, { color, transform: [{ scale: bump }] }]}>{label}</Animated.Text>
      <Text style={[styles.zoneHint, { color }]}>+ PUNTO</Text>
    </Pressable>
  );
}

function StatLine({ label, values }: { label: string; values: [number, number] }) {
  const total = Math.max(1, values[0] + values[1]);
  return (
    <View style={styles.statLine}>
      <View style={styles.statLineHead}>
        <Text style={[styles.statValue, { color: colors.lime }]}>{values[0]}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.coral }]}>{values[1]}</Text>
      </View>
      <View style={styles.statBar}>
        <View style={{ flex: values[0] / total, backgroundColor: colors.lime }} />
        <View style={{ flex: values[1] / total, backgroundColor: colors.coral }} />
      </View>
    </View>
  );
}

const CONFETTI = ["🎾", "🏆", "✨", "🔥", "🏓", "💚"];

function ConfettiPiece({ x, delay, emoji, drift }: { x: number; delay: number; emoji: string; drift: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 2400, delay, easing: Easing.out(Easing.quad), useNativeDriver: NATIVE }).start();
  }, [t, delay]);
  return (
    <Animated.Text
      style={[
        styles.confetti,
        {
          left: `${x}%` as `${number}%`,
          opacity: t.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-40, 720] }) },
            { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, drift] }) },
            { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "540deg"] }) },
          ],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 95,
        delay: i * 80,
        emoji: CONFETTI[i % CONFETTI.length],
        drift: (Math.random() - 0.5) * 90,
      })),
    []
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} {...p} />
      ))}
    </View>
  );
}

function EloCounter({ from, to }: { from: number; to: number }) {
  const [shown, setShown] = useState(from);
  useEffect(() => {
    const t = new Animated.Value(0);
    const id = t.addListener(({ value }) => setShown(Math.round(from + (to - from) * value)));
    Animated.timing(t, { toValue: 1, duration: 1400, delay: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => t.removeListener(id);
  }, [from, to]);
  return <Text style={styles.eloValue}>{shown}</Text>;
}

export default function LiveScorer({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { state, recordMatch } = useApp();
  const sport = SPORTS[state.sport];

  const rivals = useMemo(() => {
    const pool = PLAYERS.filter((p) => p.sport === state.sport);
    return [...pool].sort((a, b) => Number(state.matches.includes(b.id)) - Number(state.matches.includes(a.id)));
  }, [state.sport, state.matches]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [rivalId, setRivalId] = useState<string | null>(null);
  const [golden, setGolden] = useState(true);
  const [firstServer, setFirstServer] = useState<Side>(0);
  const [log, setLog] = useState<Side[]>([]);

  useEffect(() => {
    if (!visible) return;
    setPhase("setup");
    setLog([]);
    setRivalId(rivals[0]?.id ?? null);
    setGolden(state.sport === "Padel");
    setFirstServer(0);
    // Reset only when the sheet opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const rival = rivals.find((p) => p.id === rivalId) ?? null;
  const config = useMemo<MatchConfig>(
    () => ({ format: state.sport === "Voley" ? "voley" : "raqueta", goldenPoint: state.sport !== "Voley" && golden, firstServer }),
    [state.sport, golden, firstServer]
  );
  const snap = useMemo(() => replay(config, log), [config, log]);
  const call = useMemo(() => callout(config, log, snap), [config, log, snap]);
  const labels = pointLabels(config, snap);

  useEffect(() => {
    if (phase !== "live" || snap.winner === null) return;
    const timer = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(timer);
  }, [phase, snap.winner]);

  const myName = state.profile.name.split(" ")[0];
  const rivalName = rival?.name.split(" ")[0] ?? "Rival";
  const names: [string, string] = [myName, rivalName];
  const myAvatar = state.profile.photo ?? avatarUrl(state.profile.name);
  const won = snap.winner === 0;
  const delta = rival ? eloDelta(state.profile.elo, rival.elo, won) : 0;

  const point = (side: Side) => {
    if (snap.winner === null) setLog((l) => [...l, side]);
  };

  const save = () => {
    if (!rival) return;
    recordMatch({
      id: `live-${Date.now()}`,
      opponentId: rival.id,
      date: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short" }),
      won,
      score: setScores(snap),
      eloDelta: delta,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={[styles.screen, { paddingTop: Platform.OS === "web" ? 0 : insets.top }]}>
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Cerrar marcador">
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>
              {sport.emoji} MARCADOR {sport.label.toUpperCase()}
            </Text>
            {phase === "live" ? (
              <Pressable onPress={() => setLog((l) => l.slice(0, -1))} disabled={!log.length} hitSlop={10} accessibilityLabel="Deshacer punto">
                <Ionicons name="arrow-undo" size={24} color={log.length ? colors.text : colors.muted} />
              </Pressable>
            ) : (
              <View style={{ width: 24 }} />
            )}
          </View>

          {phase === "setup" && (
            <ScrollView contentContainerStyle={styles.body}>
              <Text style={styles.title}>NUEVO PARTIDO</Text>
              <Text style={styles.muted}>Anotá punto a punto. Al terminar se calcula tu nuevo ELO.</Text>

              <Text style={styles.label}>Rival</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {rivals.map((p) => {
                  const on = p.id === rivalId;
                  return (
                    <Pressable key={p.id} onPress={() => setRivalId(p.id)} style={[styles.rival, on && styles.rivalOn]}>
                      <Avatar uri={avatarUrl(p.name)} size={54} ring={on ? colors.lime : undefined} />
                      <Text style={styles.rivalName} numberOfLines={1}>
                        {p.name.split(" ")[0]}
                      </Text>
                      <Text style={styles.rivalMeta}>
                        {p.elo} · {levelName(p.level)}
                      </Text>
                      {state.matches.includes(p.id) && <Text style={styles.rivalTag}>MATCH</Text>}
                    </Pressable>
                  );
                })}
              </ScrollView>

              {rival && (
                <View style={styles.odds}>
                  <Text style={styles.oddsText}>
                    Si ganás <Text style={{ color: colors.lime }}>+{eloDelta(state.profile.elo, rival.elo, true)}</Text> · si perdés{" "}
                    <Text style={{ color: colors.coral }}>{eloDelta(state.profile.elo, rival.elo, false)}</Text> ELO
                  </Text>
                </View>
              )}

              <Text style={styles.label}>Formato</Text>
              <Text style={styles.muted}>
                {config.format === "voley"
                  ? "Mejor de 3 sets a 25 (tercero a 15), diferencia de 2."
                  : "Mejor de 3 sets, tie-break a 7 en el 6-6."}
              </Text>
              {config.format === "raqueta" && (
                <View style={styles.pills}>
                  <Pill label="Ventaja clásica" on={!golden} onPress={() => setGolden(false)} />
                  <Pill label="Punto de oro" on={golden} onPress={() => setGolden(true)} />
                </View>
              )}

              <Text style={styles.label}>Saca primero</Text>
              <View style={styles.pills}>
                <Pill label={`${myName} (vos)`} on={firstServer === 0} onPress={() => setFirstServer(0)} />
                <Pill label={rivalName} on={firstServer === 1} onPress={() => setFirstServer(1)} />
              </View>

              <Button label="Empezar partido" icon="play" disabled={!rival} onPress={() => setPhase("live")} style={{ marginTop: 10 }} />
            </ScrollView>
          )}

          {phase === "live" && (
            <View style={styles.live}>
              <View style={styles.board}>
                <ScoreRow side={0} name={myName} avatar={myAvatar} snap={snap} labels={labels} config={config} />
                <View style={styles.boardDivider} />
                <ScoreRow side={1} name={rivalName} avatar={avatarUrl(rival?.name ?? "rival")} snap={snap} labels={labels} config={config} />
              </View>

              <View style={styles.calloutSlot}>{call && <CalloutBanner call={call} names={names} />}</View>

              <View style={styles.zones}>
                {([0, 1] as Side[]).map((side) => (
                  <TapZone
                    key={side}
                    side={side}
                    name={names[side]}
                    label={labels[side]}
                    serving={snap.winner === null && snap.server === side}
                    serveEmoji={sport.emoji}
                    disabled={snap.winner !== null}
                    onPress={() => point(side)}
                  />
                ))}
              </View>

              <View style={styles.momentum}>
                <Text style={styles.momentumLabel}>MOMENTUM</Text>
                <View style={styles.momentumDots}>
                  {log.slice(-20).map((s, i) => (
                    <View key={`${log.length}-${i}`} style={[styles.momentumDot, { backgroundColor: SIDE_COLOR[s] }]} />
                  ))}
                </View>
              </View>

              <View style={styles.stats}>
                <StatLine label="Puntos ganados" values={snap.won} />
                <StatLine label="Mejor racha" values={snap.bestRun} />
                {config.format === "raqueta" && <StatLine label="Quiebres" values={snap.breaks} />}
              </View>
            </View>
          )}

          {phase === "done" && (
            <ScrollView contentContainerStyle={[styles.body, styles.done]}>
              {won && <Confetti />}
              <Text style={styles.doneEmoji}>{won ? "🏆" : "💪"}</Text>
              <Text style={[styles.doneTitle, { color: won ? colors.lime : colors.coral }]}>{won ? "¡GANASTE!" : "PERDISTE"}</Text>
              <Text style={styles.doneScore}>{setScores(snap)}</Text>
              <Text style={styles.muted}>vs {rival?.name}</Text>

              <View style={styles.eloCard}>
                <Text style={styles.label}>Tu ELO</Text>
                <EloCounter from={state.profile.elo} to={state.profile.elo + delta} />
                <Text style={[styles.eloDelta, { color: delta >= 0 ? colors.lime : colors.coral }]}>
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </Text>
              </View>

              <View style={[styles.stats, { alignSelf: "stretch" }]}>
                <StatLine label="Puntos ganados" values={snap.won} />
                <StatLine label="Mejor racha" values={snap.bestRun} />
                {config.format === "raqueta" && <StatLine label="Quiebres" values={snap.breaks} />}
              </View>

              <Button label="Guardar resultado" icon="checkmark-circle" onPress={save} style={{ alignSelf: "stretch" }} />
              <Button
                label="Revancha"
                icon="refresh"
                variant="ghost"
                onPress={() => {
                  setLog([]);
                  setFirstServer(other(firstServer));
                  setPhase("live");
                }}
                style={{ alignSelf: "stretch" }}
              />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)" },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    maxHeight: 900,
    alignSelf: "center",
    backgroundColor: colors.bg,
    overflow: "hidden",
    ...(Platform.OS === "web" ? { borderRadius: 28, borderWidth: 1, borderColor: colors.line } : null),
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 14 },
  headerTitle: { fontFamily: fonts.display, color: colors.text, fontSize: 20, letterSpacing: 1.5 },
  body: { padding: 20, paddingTop: 4, gap: 10 },
  title: { fontFamily: fonts.display, color: colors.text, fontSize: 40, letterSpacing: 1, lineHeight: 42 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 13 },
  label: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginTop: 8 },
  rival: { width: 104, alignItems: "center", gap: 4, padding: 10, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  rivalOn: { borderColor: colors.lime, backgroundColor: colors.card2 },
  rivalName: { fontFamily: fonts.bold, color: colors.text, fontSize: 13 },
  rivalMeta: { fontFamily: fonts.body, color: colors.muted, fontSize: 10 },
  rivalTag: { fontFamily: fonts.bold, color: colors.bg, backgroundColor: colors.lime, fontSize: 9, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, overflow: "hidden" },
  odds: { padding: 12, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  oddsText: { fontFamily: fonts.semibold, color: colors.text, fontSize: 13, textAlign: "center" },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  pillOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  pillText: { fontFamily: fonts.semibold, color: colors.text, fontSize: 13 },
  pillTextOn: { color: colors.bg },

  live: { flex: 1, paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  board: { borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingVertical: 6 },
  boardDivider: { height: 1, backgroundColor: colors.line, marginHorizontal: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 8 },
  serveSlot: { width: 10, alignItems: "center" },
  serveDot: { width: 8, height: 8, borderRadius: 4 },
  rowName: { flex: 1, fontFamily: fonts.bold, color: colors.text, fontSize: 15 },
  cell: { width: 26, textAlign: "center", fontFamily: fonts.display, color: colors.muted, fontSize: 24 },
  cellWon: { color: colors.text },
  cellCurrent: { color: colors.gold },
  cellPoints: { minWidth: 46, textAlign: "center", fontFamily: fonts.display, fontSize: 30, backgroundColor: colors.card2, borderRadius: 10, overflow: "hidden" },
  calloutSlot: { height: 40, alignItems: "center", justifyContent: "center" },
  callout: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 999 },
  calloutText: { fontFamily: fonts.display, color: colors.bg, fontSize: 20, letterSpacing: 1.5 },
  zones: { flex: 1, minHeight: 200, flexDirection: "row", gap: 12 },
  zone: { flex: 1, borderRadius: 24, borderWidth: 2, backgroundColor: colors.card, padding: 14, justifyContent: "space-between", alignItems: "center" },
  zoneTop: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "stretch", justifyContent: "center" },
  zoneName: { fontFamily: fonts.bold, color: colors.text, fontSize: 15, flexShrink: 1 },
  zoneServe: { fontSize: 16 },
  zonePoints: { fontFamily: fonts.display, fontSize: 88, lineHeight: 96 },
  zoneHint: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.5 },
  momentum: { gap: 6 },
  momentumLabel: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 11, letterSpacing: 1 },
  momentumDots: { flexDirection: "row", gap: 4, height: 12, alignItems: "center" },
  momentumDot: { width: 12, height: 12, borderRadius: 6 },
  stats: { gap: 10, padding: 14, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  statLine: { gap: 5 },
  statLineHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statLabel: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 12 },
  statValue: { fontFamily: fonts.display, fontSize: 20, minWidth: 28, textAlign: "center" },
  statBar: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: colors.card2 },

  done: { alignItems: "center", paddingTop: 20 },
  doneEmoji: { fontSize: 72 },
  doneTitle: { fontFamily: fonts.display, fontSize: 56, letterSpacing: 2, lineHeight: 60 },
  doneScore: { fontFamily: fonts.display, color: colors.text, fontSize: 34, letterSpacing: 2 },
  eloCard: { alignItems: "center", alignSelf: "stretch", padding: 16, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, marginVertical: 6 },
  eloValue: { fontFamily: fonts.display, color: colors.text, fontSize: 64, lineHeight: 68 },
  eloDelta: { fontFamily: fonts.display, fontSize: 26 },
  confetti: { position: "absolute", top: 0, fontSize: 26 },
});
