// sports/SportsContext.tsx
import React, { createContext, useState, useContext } from "react";

// Define el tipo específico de deportes
export type Sports = "Padel" | "Voley" | "Tenis";

interface SportsContextType {
  selectedSport: Sports;
  setSelectedSport: (sport: Sports) => void;
}

const SportsContext = createContext<SportsContextType | undefined>(undefined);

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedSport, setSelectedSport] = useState<Sports>("Padel");

  return (
    <SportsContext.Provider value={{ selectedSport, setSelectedSport }}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error("useSports debe usarse dentro de un SportsProvider");
  }
  return context;
};
