// Seed data for the demo build (no backend yet). Everything the UI does — booking, swiping,
// profile edits — mutates app state derived from this seed.

export type SportId = "Padel" | "Tenis" | "Voley";

export const SPORTS: Record<SportId, { label: string; emoji: string; color: string }> = {
  Padel: { label: "Pádel", emoji: "🏓", color: "#c6f432" },
  Tenis: { label: "Tenis", emoji: "🎾", color: "#ffd166" },
  Voley: { label: "Vóley", emoji: "🏐", color: "#4cc9f0" },
};

export const SPORT_IDS = Object.keys(SPORTS) as SportId[];

export const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(seed)}&size=256&backgroundColor=c6f432,ffd166,4cc9f0,ffb4a2`;

export interface Player {
  id: string;
  name: string;
  age: number;
  sport: SportId;
  level: number;
  elo: number;
  distanceKm: number;
  winRate: number;
  streak: number;
  trend: number;
  position: string;
  bio: string;
  availability: string[];
}

export const PLAYERS: Player[] = [
  { id: "p1", name: "Martina Ríos", age: 27, sport: "Padel", level: 4.5, elo: 1580, distanceKm: 1.2, winRate: 64, streak: 3, trend: 24, position: "Drive", bio: "Juego martes y jueves después del laburo. Busco pareja fija para el torneo de octubre.", availability: ["Mar 19h", "Jue 19h", "Sáb 10h"] },
  { id: "p2", name: "Lucas Ferreyra", age: 31, sport: "Padel", level: 5, elo: 1642, distanceKm: 3.4, winRate: 71, streak: 5, trend: 40, position: "Revés", bio: "Ex tenista. Me gusta el juego rápido en la red.", availability: ["Lun 20h", "Mié 20h", "Sáb 10h"] },
  { id: "p3", name: "Sofía Benítez", age: 24, sport: "Padel", level: 3.5, elo: 1410, distanceKm: 0.8, winRate: 52, streak: 1, trend: 8, position: "Drive", bio: "Arranqué hace un año y no paro. ¡Sumo buena onda!", availability: ["Mar 19h", "Vie 18h"] },
  { id: "p4", name: "Nicolás Acosta", age: 35, sport: "Padel", level: 4, elo: 1502, distanceKm: 5.1, winRate: 58, streak: 0, trend: -12, position: "Revés", bio: "Juego de fondo, paciencia y globos.", availability: ["Jue 19h", "Dom 11h"] },
  { id: "p5", name: "Camila Sosa", age: 29, sport: "Padel", level: 5.5, elo: 1718, distanceKm: 7.9, winRate: 76, streak: 6, trend: 55, position: "Revés", bio: "Categoría 5ta. Entreno tres veces por semana.", availability: ["Lun 20h", "Sáb 10h"] },
  { id: "t1", name: "Tomás Giménez", age: 22, sport: "Tenis", level: 4, elo: 1530, distanceKm: 2.2, winRate: 61, streak: 2, trend: 18, position: "Fondista", bio: "Saque y derecha. Busco peloteo intenso los fines de semana.", availability: ["Sáb 10h", "Dom 11h"] },
  { id: "t2", name: "Valentina Paz", age: 26, sport: "Tenis", level: 4.5, elo: 1605, distanceKm: 4.0, winRate: 67, streak: 4, trend: 31, position: "Saque y red", bio: "Jugué interclubes. Prefiero polvo de ladrillo.", availability: ["Mar 19h", "Jue 19h"] },
  { id: "t3", name: "Julián Medina", age: 40, sport: "Tenis", level: 3, elo: 1350, distanceKm: 1.5, winRate: 45, streak: 0, trend: -6, position: "Fondista", bio: "Volviendo a jugar después de años. Paciencia conmigo 😅", availability: ["Mié 20h", "Sáb 10h"] },
  { id: "t4", name: "Agustina Luna", age: 33, sport: "Tenis", level: 5, elo: 1660, distanceKm: 9.3, winRate: 73, streak: 3, trend: 22, position: "Todo terreno", bio: "Profe de tenis. Juego por diversión los domingos.", availability: ["Dom 11h"] },
  { id: "v1", name: "Franco Morales", age: 25, sport: "Voley", level: 4.5, elo: 1570, distanceKm: 0.6, winRate: 62, streak: 2, trend: 15, position: "Armador", bio: "Armamos equipo para vóley playa. Faltan dos.", availability: ["Vie 18h", "Sáb 10h"] },
  { id: "v2", name: "Lucía Herrera", age: 28, sport: "Voley", level: 4, elo: 1495, distanceKm: 2.9, winRate: 55, streak: 1, trend: 5, position: "Punta", bio: "Jugué en la liga regional. Busco partidos mixtos.", availability: ["Mié 20h", "Vie 18h"] },
  { id: "v3", name: "Mateo Cabrera", age: 30, sport: "Voley", level: 5, elo: 1630, distanceKm: 6.2, winRate: 69, streak: 4, trend: 28, position: "Central", bio: "1,94 m y ganas de bloquear todo.", availability: ["Lun 20h", "Vie 18h"] },
  { id: "v4", name: "Florencia Díaz", age: 23, sport: "Voley", level: 3.5, elo: 1420, distanceKm: 3.3, winRate: 48, streak: 0, trend: -10, position: "Líbero", bio: "Defensa ante todo. Juego cualquier día después de las 18.", availability: ["Mar 19h", "Jue 19h", "Vie 18h"] },
];

export interface Court {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  sports: SportId[];
  pricePerHour: number;
  rating: number;
  indoor: boolean;
}

export const HOME_LOCATION = { lat: -33.1575, lng: -60.51 };

export const COURTS: Court[] = [
  { id: "c1", name: "Complejo La Red", address: "Av. San Martín 1250", lat: -33.1532, lng: -60.5068, sports: ["Padel", "Tenis"], pricePerHour: 12000, rating: 4.8, indoor: true },
  { id: "c2", name: "Club Náutico Costa", address: "Costanera Sur s/n", lat: -33.1621, lng: -60.4989, sports: ["Voley", "Tenis"], pricePerHour: 9000, rating: 4.6, indoor: false },
  { id: "c3", name: "Pádel Box Centro", address: "Belgrano 540", lat: -33.1569, lng: -60.5132, sports: ["Padel"], pricePerHour: 11000, rating: 4.5, indoor: true },
  { id: "c4", name: "Polideportivo Municipal", address: "Ruta 21 km 7", lat: -33.1498, lng: -60.5201, sports: ["Voley", "Padel"], pricePerHour: 6000, rating: 4.2, indoor: true },
  { id: "c5", name: "Tenis Club Arroyo", address: "Rivadavia 980", lat: -33.164, lng: -60.515, sports: ["Tenis"], pricePerHour: 10000, rating: 4.7, indoor: false },
];

export interface Profile {
  name: string;
  city: string;
  sport: SportId;
  level: number;
  elo: number;
  photo?: string;
  wins: number;
  losses: number;
  streak: number;
  availability: string[];
}

export const MY_PROFILE: Profile = {
  name: "Juan Pérez",
  city: "Arroyo Seco",
  sport: "Padel",
  level: 4.5,
  elo: 1554,
  wins: 38,
  losses: 24,
  streak: 3,
  availability: ["Mar 19h", "Jue 19h", "Sáb 10h"],
};

export interface MatchResult {
  id: string;
  opponentId: string;
  date: string;
  won: boolean;
  score: string;
  eloDelta: number;
}

export const MATCH_HISTORY: MatchResult[] = [
  { id: "m1", opponentId: "p4", date: "12 sep", won: true, score: "6-4 6-3", eloDelta: 14 },
  { id: "m2", opponentId: "p2", date: "9 sep", won: false, score: "4-6 5-7", eloDelta: -9 },
  { id: "m3", opponentId: "p3", date: "5 sep", won: true, score: "6-2 6-1", eloDelta: 8 },
  { id: "m4", opponentId: "p1", date: "2 sep", won: true, score: "7-6 4-6 6-4", eloDelta: 17 },
  { id: "m5", opponentId: "p5", date: "29 ago", won: false, score: "3-6 2-6", eloDelta: -6 },
];

export const LAST_TEN = [true, true, true, false, true, false, true, true, false, true];

export interface Reservation {
  id: string;
  courtId: string;
  sport: SportId;
  start: number;
  durationMin: number;
  partnerId?: string;
}

export function seedReservations(now = new Date()): Reservation[] {
  const at = (daysAhead: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    return d.getTime();
  };
  return [
    { id: "r1", courtId: "c1", sport: "Padel", start: at(1, 19), durationMin: 90, partnerId: "p1" },
    { id: "r2", courtId: "c2", sport: "Voley", start: at(3, 18), durationMin: 60, partnerId: "v1" },
  ];
}

export const SLOTS = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30"];

/** Deterministic "already booked" slots so the grid looks lived-in and stays stable between renders. */
export function isSlotTaken(courtId: string, dayKey: string, slot: string) {
  let h = 0;
  const key = courtId + dayKey + slot;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 997;
  return h % 3 === 0;
}

/** 0–100 score from level gap, shared availability and distance. */
export function compatibility(p: Player, me: Profile) {
  const levelScore = Math.max(0, 1 - Math.abs(p.level - me.level) / 3);
  const shared = p.availability.filter((a) => me.availability.includes(a)).length;
  const availScore = Math.min(1, shared / 2);
  const distScore = Math.max(0, 1 - p.distanceKm / 15);
  return Math.round((levelScore * 0.5 + availScore * 0.3 + distScore * 0.2) * 100);
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const levelName = (l: number) =>
  l < 3 ? "Principiante" : l < 4 ? "Intermedio" : l < 5 ? "Intermedio avanzado" : l < 6 ? "Avanzado" : "Competitivo";

export const playerById = (id: string) => PLAYERS.find((p) => p.id === id);
export const courtById = (id: string) => COURTS.find((c) => c.id === id);
