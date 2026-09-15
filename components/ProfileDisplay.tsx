import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ProfileDisplayProps {
  name: string;
  email: string;
  sports: string;
  photo: string;
  rankingPoints: number;
  city: string;
  onPhotoChange: (uri: string) => void;
  onEditPress: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  name,
  email,
  sports,
  photo,
  rankingPoints,
  city,
  onPhotoChange,
  onEditPress,
}) => {
  const handleLongPress = async () => {
    Alert.alert("Cambiar Foto", "¿Deseas cambiar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Seleccionar Foto",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            onPhotoChange(result.assets[0].uri);
          }
        },
      },
    ]);
  };

  // Historial de partidas hardcoded
  const matchHistory = [
    { id: "1", opponent: "Carlos", date: "2024-04-20", result: "Ganado 3-1" },
    { id: "2", opponent: "María", date: "2024-04-18", result: "Perdido 0-2" },
    { id: "3", opponent: "Luis", date: "2024-04-15", result: "Ganado 2-0" },
    { id: "4", opponent: "Ana", date: "2024-04-10", result: "Ganado 3-2" },
    { id: "5", opponent: "Juan", date: "2024-04-05", result: "Perdido 1-3" },
  ];

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <View className="flex-row items-center mb-6  gap-1">
        <TouchableOpacity onLongPress={handleLongPress} className="mr-4">
          <Image
            source={{ uri: photo }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
            className="border border-gray-300"
          />
        </TouchableOpacity>
        <View className="flex-1 gap-1">
          <Text className="text-2xl font-bold">{name}</Text>
          <Text className="text-lg text-gray-600">Ciudad: {city}</Text>
          <Text className="text-lg text-gray-600">Deporte: {sports}</Text>
        </View>
      </View>

      <View className="items-center justify-center border border-gray-300 rounded-lg p-4 w-3/4 mb-6">
        <Text className="text-3xl font-bold">Puntos: {rankingPoints}</Text>
      </View>

      {/* Historial de Partidas */}
      <View className="w-full mb-6">
        <Text className="text-2xl font-bold mb-4">Historial de Partidas</Text>
        {matchHistory.map((match) => (
          <View
            key={match.id}
            className="flex-row justify-between items-center p-4 mb-3 bg-white rounded-lg shadow"
          >
            {/* Detalles de la partida */}
            <View>
              <Text className="text-lg font-semibold">{match.opponent}</Text>
              <Text className="text-gray-600">{match.date}</Text>
            </View>
            <Text
              className={`text-lg font-semibold ${
                match.result.startsWith("Ganado")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {match.result}
            </Text>
          </View>
        ))}
      </View>

      {/* Botón de editar perfil */}
      <TouchableOpacity onPress={onEditPress}>
        <Text className="text-blue-500 text-center text-lg">Editar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileDisplay;
