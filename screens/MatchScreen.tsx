import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSports } from "../context/SportsContext";
import { ProfileData } from "../screens/ProfileScreen"; // Asegúrate de importar el tipo ProfileData

interface Profile {
  id: string;
  name: string;
  photo: string;
  sport: string;
  city: string;
}

const MatchScreen: React.FC = () => {
  const { selectedSport, selectedCity } = useSports();
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

  // Simulación de perfiles de usuarios (deberías reemplazar esto con datos reales)
  useEffect(() => {
    // Simulación de perfiles
    const mockProfiles: Profile[] = [
      {
        id: "1",
        name: "Ana",
        photo: "https://via.placeholder.com/50",
        sport: "Padel",
        city: "Buenos Aires",
      },
      {
        id: "2",
        name: "Luis",
        photo: "https://via.placeholder.com/50",
        sport: "Padel",
        city: "Buenos Aires",
      },
      {
        id: "3",
        name: "María",
        photo: "https://via.placeholder.com/50",
        sport: "Voley",
        city: "Buenos Aires",
      },
      // Agregar más perfiles aquí
    ];
    setProfiles(mockProfiles);
  }, []);

  useEffect(() => {
    // Filtrar perfiles según el deporte seleccionado y la ciudad
    const results = profiles.filter(
      (profile) =>
        profile.sport === selectedSport &&
        profile.city === selectedCity &&
        profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(results);
  }, [selectedSport, selectedCity, searchTerm, profiles]);

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Buscar Perfiles</Text>

      <TextInput
        className="border border-gray-300 p-2 rounded mb-4"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Button title="Buscar" onPress={() => {}} color="tomato" />

      <FlatList
        data={filteredProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center p-2 mb-2 bg-white rounded shadow">
            <View className="w-12 h-12 mr-4">
              <Image
                source={{ uri: item.photo }}
                className="w-full h-full rounded-full"
              />
            </View>
            <View>
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-600">{item.sport}</Text>
              <Text className="text-gray-400">{item.city}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MatchScreen;
