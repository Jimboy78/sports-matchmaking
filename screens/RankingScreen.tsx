import React from "react";
import { Text, View } from "react-native";
import { useSports } from "../context/SportsContext";

const RankingScreen: React.FC = () => {
  const { selectedSport } = useSports();

  // Definir los rankings ficticios
  const rankings = {
    Padel: "Ranking para Pádel: 1, 2, 3",
    Voley: "Ranking para Voleibol: 4, 5, 6",
    Tenis: "Ranking para Tenis: 7, 8, 9",
  };

  // Asegurar que solo se usen los deportes válidos
  const rankingDisplay = rankings[selectedSport] || "Deporte no seleccionado";

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <View className="bg-white p-6 rounded-lg shadow-md">
        <Text className="text-3xl font-extrabold text-center text-blue-600 mb-4">
          Ranking
        </Text>
        <Text className="text-lg text-gray-700 text-center">
          {rankingDisplay}
        </Text>
      </View>
    </View>
  );
};

export default RankingScreen;
