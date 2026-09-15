import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SPORTS, SPORT_IDS, type SportId } from "../data/demo";
import { colors, fonts } from "../theme";

export default function SportChips({ value, onChange }: { value: SportId; onChange: (s: SportId) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {SPORT_IDS.map((id) => {
        const on = id === value;
        const sport = SPORTS[id];
        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            style={({ pressed }) => [
              styles.chip,
              on && { backgroundColor: sport.color, borderColor: sport.color },
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <Text style={styles.emoji}>{sport.emoji}</Text>
            <Text style={[styles.label, on && { color: colors.bg }]}>{sport.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  emoji: { fontSize: 16 },
  label: { fontFamily: fonts.semibold, color: colors.text, fontSize: 14 },
});
