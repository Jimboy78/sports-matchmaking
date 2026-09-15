// Match scoring engine. The whole match is derived by replaying the point log, so undo is just
// dropping the last point and every view (scoreboard, callouts, stats) stays consistent.

export type Side = 0 | 1;
export type ScoreFormat = "raqueta" | "voley";

export interface MatchConfig {
  /** raqueta = tennis/pádel games & sets; voley = rally scoring. */
  format: ScoreFormat;
  /** Pádel "punto de oro": at 40-40 the next point wins the game. */
  goldenPoint: boolean;
  firstServer: Side;
}

export interface Snapshot {
  sets: [number, number][];
  setsWon: [number, number];
  games: [number, number];
  points: [number, number];
  tiebreak: boolean;
  server: Side;
  winner: Side | null;
  won: [number, number];
  bestRun: [number, number];
  breaks: [number, number];
  run: { side: Side | null; length: number };
}

export interface Callout {
  text: string;
  side: Side | null;
  tone: "hot" | "info";
}

const SETS_TO_WIN = 2;
const TENNIS_POINTS = ["0", "15", "30", "40"];

export const other = (s: Side): Side => (s === 0 ? 1 : 0);

export function replay(config: MatchConfig, log: Side[]): Snapshot {
  const snap: Snapshot = {
    sets: [],
    setsWon: [0, 0],
    games: [0, 0],
    points: [0, 0],
    tiebreak: false,
    server: config.firstServer,
    winner: null,
    won: [0, 0],
    bestRun: [0, 0],
    breaks: [0, 0],
    run: { side: null, length: 0 },
  };
  let tbServer: Side = config.firstServer;
  let tbPlayed = 0;

  const closeSet = (s: Side, score: [number, number]) => {
    snap.sets.push(score);
    snap.setsWon[s]++;
    snap.games = [0, 0];
    snap.points = [0, 0];
    snap.tiebreak = false;
    if (snap.setsWon[s] === SETS_TO_WIN) snap.winner = s;
  };

  for (const s of log) {
    if (snap.winner !== null) break;
    const o = other(s);

    snap.won[s]++;
    snap.run = snap.run.side === s ? { side: s, length: snap.run.length + 1 } : { side: s, length: 1 };
    snap.bestRun[s] = Math.max(snap.bestRun[s], snap.run.length);
    snap.points[s]++;

    if (config.format === "voley") {
      // Rally scoring: the rally winner serves next. Deciding third set goes to 15.
      snap.server = s;
      const target = snap.sets.length === 2 ? 15 : 25;
      if (snap.points[s] >= target && snap.points[s] - snap.points[o] >= 2) closeSet(s, [snap.points[0], snap.points[1]]);
      continue;
    }

    if (snap.tiebreak) {
      tbPlayed++;
      if (snap.points[s] >= 7 && snap.points[s] - snap.points[o] >= 2) {
        snap.games[s]++;
        closeSet(s, [snap.games[0], snap.games[1]]);
        // Whoever received first in the tie-break serves the next set.
        snap.server = other(tbServer);
      } else {
        // One serve, then alternate every two points.
        snap.server = ((tbServer + Math.floor((tbPlayed + 1) / 2)) % 2) as Side;
      }
      continue;
    }

    const ps = snap.points[s];
    const po = snap.points[o];
    const gameWon = ps >= 4 && (ps - po >= 2 || (config.goldenPoint && po >= 3));
    if (!gameWon) continue;

    if (s !== snap.server) snap.breaks[s]++;
    snap.games[s]++;
    snap.points = [0, 0];
    snap.server = other(snap.server);

    const gs = snap.games[s];
    const go = snap.games[o];
    if (gs >= 6 && gs - go >= 2) {
      closeSet(s, [snap.games[0], snap.games[1]]);
    } else if (gs === 6 && go === 6) {
      snap.tiebreak = true;
      tbServer = snap.server;
      tbPlayed = 0;
    }
  }

  return snap;
}

export function pointLabels(config: MatchConfig, snap: Snapshot): [string, string] {
  const [a, b] = snap.points;
  if (config.format === "voley" || snap.tiebreak) return [String(a), String(b)];
  if (a >= 3 && b >= 3) {
    if (a === b) return ["40", "40"];
    return a > b ? ["AD", "40"] : ["40", "AD"];
  }
  return [TENNIS_POINTS[a], TENNIS_POINTS[b]];
}

/** What's at stake on the next point, found by replaying both possible outcomes. */
export function callout(config: MatchConfig, log: Side[], snap: Snapshot): Callout | null {
  if (snap.winner !== null) return null;
  const sides: Side[] = [0, 1];
  const next = sides.map((s) => replay(config, [...log, s]));

  for (const s of sides) if (next[s].winner === s) return { text: "MATCH POINT", side: s, tone: "hot" };
  for (const s of sides) if (next[s].setsWon[s] > snap.setsWon[s]) return { text: "SET POINT", side: s, tone: "hot" };

  if (config.format === "raqueta") {
    if (snap.tiebreak) return snap.points[0] + snap.points[1] === 0 ? { text: "TIE-BREAK", side: null, tone: "info" } : null;
    const [a, b] = snap.points;
    if (config.goldenPoint && a === 3 && b === 3) return { text: "PUNTO DE ORO", side: null, tone: "hot" };
    for (const s of sides) {
      if (s !== snap.server && next[s].games[s] > snap.games[s]) return { text: "BREAK POINT", side: s, tone: "hot" };
    }
    if (a >= 3 && a === b) return { text: "DEUCE", side: null, tone: "info" };
    if (a >= 3 && b >= 3) return { text: "VENTAJA", side: a > b ? 0 : 1, tone: "info" };
  }
  return null;
}

/** Standard Elo update (K = 32) from the player's perspective. */
export function eloDelta(me: number, opponent: number, won: boolean, k = 32) {
  const expected = 1 / (1 + 10 ** ((opponent - me) / 400));
  return Math.round(k * ((won ? 1 : 0) - expected));
}

export const setScores = (snap: Snapshot) => snap.sets.map(([a, b]) => `${a}-${b}`).join(" ");
