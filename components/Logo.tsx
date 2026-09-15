import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, fonts } from "../theme";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx="32" cy="32" r="30" fill={colors.lime} />
      <Path d="M14 10 C 26 22, 26 42, 14 54" stroke={colors.bg} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M50 10 C 38 22, 38 42, 50 54" stroke={colors.bg} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M35 15 L25 34 H32 L28 49 L41 29 H34 L38 15 Z" fill={colors.bg} />
    </Svg>
  );
}

export default function Logo({ size = 36, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} />
      {wordmark && (
        <Text style={[styles.word, { fontSize: size * 0.82 }]}>
          MATCH<Text style={{ color: colors.lime }}>POINT</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  word: { fontFamily: fonts.display, color: colors.text, letterSpacing: 1.5 },
});
