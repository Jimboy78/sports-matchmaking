import React from "react";
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../theme";

export function Avatar({ uri, size = 48, ring }: { uri: string; size?: number; ring?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring ? 3 : 0,
        borderColor: ring,
        overflow: "hidden",
        backgroundColor: colors.card2,
      }}
    >
      <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

interface ButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, icon, variant = "primary", disabled, style }: ButtonProps) {
  const fg = variant === "primary" ? colors.bg : variant === "danger" ? colors.coral : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "ghost" && styles.buttonGhost,
        variant === "danger" && styles.buttonDanger,
        disabled && { opacity: 0.4 },
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={fg} />}
      <Text style={[styles.buttonLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Stat({ label, value, accent = colors.text }: { label: string; value: string; accent?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: 1 },
  sectionAction: { fontFamily: fonts.semibold, color: colors.lime, fontSize: 13 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  buttonPrimary: { backgroundColor: colors.lime },
  buttonGhost: { backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.line },
  buttonDanger: { backgroundColor: "rgba(255,107,74,0.12)", borderWidth: 1, borderColor: "rgba(255,107,74,0.4)" },
  buttonLabel: { fontFamily: fonts.bold, fontSize: 15 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  statValue: { fontFamily: fonts.display, fontSize: 30, letterSpacing: 1 },
  statLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.8 },
});
