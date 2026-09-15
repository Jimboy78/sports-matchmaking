import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  LAST_TEN,
  MATCH_HISTORY,
  MY_PROFILE,
  seedReservations,
  type MatchResult,
  type Profile,
  type Reservation,
  type SportId,
} from "../data/demo";

interface State {
  sport: SportId;
  profile: Profile;
  reservations: Reservation[];
  matches: string[];
  passed: string[];
  history: MatchResult[];
  /** Most recent first. */
  lastTen: boolean[];
}

type Action =
  | { type: "sport"; sport: SportId }
  | { type: "profile"; profile: Partial<Profile> }
  | { type: "book"; reservation: Reservation }
  | { type: "cancel"; id: string }
  | { type: "like"; id: string }
  | { type: "pass"; id: string }
  | { type: "resetDeck" }
  | { type: "recordMatch"; result: MatchResult };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "sport":
      return { ...state, sport: action.sport };
    case "profile":
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case "book":
      return { ...state, reservations: [...state.reservations, action.reservation].sort((a, b) => a.start - b.start) };
    case "cancel":
      return { ...state, reservations: state.reservations.filter((r) => r.id !== action.id) };
    case "like":
      return state.matches.includes(action.id) ? state : { ...state, matches: [action.id, ...state.matches] };
    case "pass":
      return { ...state, passed: [...state.passed, action.id] };
    case "resetDeck":
      return { ...state, passed: [] };
    case "recordMatch": {
      const { result } = action;
      const { profile } = state;
      return {
        ...state,
        history: [result, ...state.history],
        lastTen: [result.won, ...state.lastTen].slice(0, 10),
        profile: {
          ...profile,
          elo: profile.elo + result.eloDelta,
          wins: profile.wins + (result.won ? 1 : 0),
          losses: profile.losses + (result.won ? 0 : 1),
          streak: result.won ? profile.streak + 1 : 0,
        },
      };
    }
    default:
      return state;
  }
}

function useAppState() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    sport: MY_PROFILE.sport,
    profile: MY_PROFILE,
    reservations: seedReservations(),
    matches: ["p1", "v1"],
    passed: [],
    history: MATCH_HISTORY,
    lastTen: LAST_TEN,
  }));

  const actions = useMemo(
    () => ({
      setSport: (sport: SportId) => dispatch({ type: "sport", sport }),
      updateProfile: (profile: Partial<Profile>) => dispatch({ type: "profile", profile }),
      book: (reservation: Reservation) => dispatch({ type: "book", reservation }),
      cancel: (id: string) => dispatch({ type: "cancel", id }),
      like: (id: string) => dispatch({ type: "like", id }),
      pass: (id: string) => dispatch({ type: "pass", id }),
      resetDeck: () => dispatch({ type: "resetDeck" }),
      recordMatch: (result: MatchResult) => dispatch({ type: "recordMatch", result }),
    }),
    []
  );

  return { state, ...actions };
}

type AppContextValue = ReturnType<typeof useAppState>;

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
