import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COURTS, DAYS, SLOTS, SPORTS, isSlotTaken, playerById } from "../data/demo";
import { useApp } from "../context/AppContext";
import { formatDate, money } from "../utils/format";
import { colors, fonts } from "../theme";
import { Avatar, Button } from "./ui";
import { avatarUrl } from "../data/demo";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialCourtId?: string;
  partnerId?: string;
}

const DURATION_MIN = 90;

export default function BookingModal({ visible, onClose, initialCourtId, partnerId }: Props) {
  const { state, book } = useApp();
  const courts = COURTS.filter((c) => c.sports.includes(state.sport));
  const [courtId, setCourtId] = useState<string | undefined>();
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const pop = useRef(new Animated.Value(0)).current;

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return d;
      }),
    // Recompute when the sheet opens so "today" is always correct.
    [visible]
  );

  useEffect(() => {
    if (!visible) return;
    setCourtId(initialCourtId ?? courts[0]?.id);
    setDayIdx(0);
    setSlot(null);
    setConfirmed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialCourtId]);

  const day = days[dayIdx];
  const court = COURTS.find((c) => c.id === courtId);
  const partner = partnerId ? playerById(partnerId) : undefined;

  const slotTime = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    const d = new Date(day);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };

  const confirm = () => {
    if (!courtId || !slot) return;
    const start = slotTime(slot);
    book({ id: `r${Date.now()}`, courtId, sport: state.sport, start, durationMin: DURATION_MIN, partnerId });
    setConfirmed(start);
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: false }).start();
    setTimeout(onClose, 1800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {confirmed !== null && court ? (
            <View style={styles.success}>
              <Animated.View style={[styles.check, { transform: [{ scale: pop }] }]}>
                <Ionicons name="checkmark" size={56} color={colors.bg} />
              </Animated.View>
              <Text style={styles.title}>¡RESERVA CONFIRMADA!</Text>
              <Text style={styles.muted}>
                {court.name} · {formatDate(confirmed)}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>
                  RESERVAR {SPORTS[state.sport].emoji}
                </Text>
                <Pressable onPress={onClose} hitSlop={10}>
                  <Ionicons name="close" size={26} color={colors.muted} />
                </Pressable>
              </View>

              {partner && (
                <View style={styles.partner}>
                  <Avatar uri={avatarUrl(partner.name)} size={32} />
                  <Text style={styles.partnerText}>Jugás con {partner.name.split(" ")[0]}</Text>
                </View>
              )}

              <Text style={styles.label}>Cancha</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {courts.map((c) => {
                  const on = c.id === courtId;
                  return (
                    <Pressable key={c.id} onPress={() => setCourtId(c.id)} style={[styles.court, on && styles.courtOn]}>
                      <Text style={[styles.courtName, on && { color: colors.bg }]}>{c.name}</Text>
                      <Text style={[styles.courtMeta, on && { color: colors.bg }]}>
                        ★ {c.rating} · {money(c.pricePerHour)}/h
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={styles.label}>Día</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {days.map((d, i) => {
                  const on = i === dayIdx;
                  return (
                    <Pressable
                      key={d.toDateString()}
                      onPress={() => {
                        setDayIdx(i);
                        setSlot(null);
                      }}
                      style={[styles.day, on && styles.dayOn]}
                    >
                      <Text style={[styles.dayName, on && { color: colors.bg }]}>{i === 0 ? "Hoy" : DAYS[d.getDay()]}</Text>
                      <Text style={[styles.dayNum, on && { color: colors.bg }]}>{d.getDate()}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={styles.label}>Horario</Text>
              <View style={styles.slots}>
                {SLOTS.map((s) => {
                  const taken = !courtId || isSlotTaken(courtId, day.toDateString(), s) || slotTime(s) < Date.now();
                  const on = s === slot;
                  return (
                    <Pressable
                      key={s}
                      disabled={taken}
                      onPress={() => setSlot(s)}
                      style={[styles.slot, on && styles.slotOn, taken && styles.slotTaken]}
                    >
                      <Text style={[styles.slotText, on && { color: colors.bg }, taken && styles.slotTextTaken]}>{s}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.footer}>
                <View>
                  <Text style={styles.price}>{court ? money((court.pricePerHour * DURATION_MIN) / 60) : "—"}</Text>
                  <Text style={styles.muted}>{DURATION_MIN} min · a dividir</Text>
                </View>
                <Button label="Confirmar" icon="calendar" onPress={confirm} disabled={!slot} style={{ flex: 1 }} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 28,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: 4 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.text, letterSpacing: 1 },
  muted: { fontFamily: fonts.body, color: colors.muted, fontSize: 13 },
  label: { fontFamily: fonts.semibold, color: colors.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 },
  partner: { flexDirection: "row", alignItems: "center", gap: 8 },
  partnerText: { fontFamily: fonts.semibold, color: colors.lime },
  court: { padding: 12, borderRadius: 16, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.line, minWidth: 170 },
  courtOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  courtName: { fontFamily: fonts.bold, color: colors.text, fontSize: 14 },
  courtMeta: { fontFamily: fonts.body, color: colors.muted, fontSize: 12, marginTop: 2 },
  day: { width: 56, paddingVertical: 10, borderRadius: 16, alignItems: "center", backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.line },
  dayOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  dayName: { fontFamily: fonts.medium, color: colors.muted, fontSize: 12 },
  dayNum: { fontFamily: fonts.display, color: colors.text, fontSize: 24 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "18%", minWidth: 64, flexGrow: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.line },
  slotOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  slotTaken: { backgroundColor: "transparent" },
  slotText: { fontFamily: fonts.semibold, color: colors.text, fontSize: 13 },
  slotTextTaken: { color: "rgba(255,255,255,0.2)", textDecorationLine: "line-through" },
  footer: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 10 },
  price: { fontFamily: fonts.display, fontSize: 30, color: colors.lime, letterSpacing: 1 },
  success: { alignItems: "center", gap: 10, paddingVertical: 30 },
  check: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
});
