import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SportChips from "../components/SportChips";
import { Avatar } from "../components/ui";
import { PLAYERS, SPORTS, avatarUrl, levelName } from "../data/demo";
import { useApp } from "../context/AppContext";
import { colors, fonts } from "../theme";

interface Row {
  id: string;
  name: string;
  elo: number;
  level: number;
  trend: number;
  avatar: string;
  me?: boolean;
}

const PODIUM_HEIGHTS = [118, 160, 92]; // 2nd, 1st, 3rd
const MEDALS = [colors.silver, colors.gold, colors.bronze];

export default function Leaderboard() {
  const insets = useSafeAreaInsets();
  const { state, setSport } = useApp();
  const grow = useRef(new Animated.Value(0)).current;

  const rows: Row[] = [
    ...PLAYERS.filter((p) => p.sport === state.sport).map((p) => ({
      id: p.id,
      name: p.name,
      elo: p.elo,
      level: p.level,
      trend: p.trend,
      avatar: avatarUrl(p.name),
    })),
    {
      id: "me",
      name: `${state.profile.name} (vos)`,
      elo: state.profile.elo,
      level: state.profile.level,
      trend: 12,
      avatar: state.profile.photo ?? avatarUrl(state.profile.name),
      me: true,
    },
  ].sort((a, b) => b.elo - a.elo);

  useEffect(() => {
    grow.setValue(0);
    Animated.spring(grow, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false }).start();
  }, [state.sport, grow]);

  const podium = [rows[1], rows[0], rows[2]];
  const sport = SPORTS[state.sport];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>RANKING</Text>
      <Text style={styles.subtitle}>Temporada primavera 2026 · Arroyo Seco</Text>
      <SportChips value={state.sport} onChange={setSport} />

      <View style={styles.podium}>
        {podium.map((row, i) =>
          row ? (
            <View key={row.id} style={styles.podiumCol}>
              {i === 1 && <Text style={styles.crown}>👑</Text>}
              <Avatar uri={row.avatar} size={i === 1 ? 76 : 60} ring={MEDALS[i]} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {row.name.split(" ")[0]}
              </Text>
              <Text style={[styles.podiumElo, { color: MEDALS[i] }]}>{row.elo}</Text>
              <Animated.View
                style={[
                  styles.podiumBar,
                  {
                    backgroundColor: i === 1 ? sport.color : colors.card2,
                    height: grow.interpolate({ inputRange: [0, 1], outputRange: [0, PODIUM_HEIGHTS[i]] }),
                  },
                ]}
              >
                <Text style={[styles.podiumRank, i === 1 && { color: colors.bg }]}>{i === 1 ? 1 : i === 0 ? 2 : 3}</Text>
              </Animated.View>
            </View>
          ) : (
            <View key={i} style={styles.podiumCol} />
          )
        )}
      </View>

      <View style={styles.list}>
        {rows.slice(3).map((row, i) => (
          <View key={row.id} style={[styles.row, row.me && styles.rowMe]}>
            <Text style={styles.rank}>{i + 4}</Text>
            <Avatar uri={row.avatar} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowName}>{row.name}</Text>
              <Text style={styles.muted}>
                Nivel {row.level} · {levelName(row.level)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.rowElo}>{row.elo}</Text>
              <Text style={[styles.trend, { color: row.trend >= 0 ? colors.lime : colors.coral }]}>
                {row.trend >= 0 ? "▲" : "▼"} {Math.abs(row.trend)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontFamily: fonts.display, fontSize: 42, color: colors.text, letterSpacing: 1 },
  subtitle: { fontFamily: fonts.medium, color: colors.muted, fontSize: 14, marginTop: -12 },
  podium: { flexDirection: "row", alignItems: "flex-end", gap: 10, marginTop: 18 },
  podiumCol: { flex: 1, alignItems: "center", gap: 4 },
  crown: { fontSize: 28, marginBottom: -6 },
  podiumName: { fontFamily: fonts.semibold, color: colors.text, fontSize: 13 },
  podiumElo: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 1 },
  podiumBar: {
    alignSelf: "stretch",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    paddingTop: 8,
    overflow: "hidden",
  },
  podiumRank: { fontFamily: fonts.display, fontSize: 40, color: colors.text },
  list: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowMe: { borderColor: colors.lime, backgroundColor: "rgba(198,244,50,0.08)" },
  rank: { fontFamily: fonts.display, fontSize: 24, color: colors.muted, width: 26, textAlign: "center" },
  rowName: { fontFamily: fonts.bold, color: colors.text, fontSize: 14 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 12 },
  rowElo: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: 1 },
  trend: { fontFamily: fonts.bold, fontSize: 11 },
});
