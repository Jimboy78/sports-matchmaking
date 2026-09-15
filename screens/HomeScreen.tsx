import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen: React.FC = () => {
  // Datos hardcodeados para las reservas
  const reservations = [
    {
      id: "1",
      location: "Cancha Central - Pádel",
      person: "Juan Pérez",
      photo: "https://via.placeholder.com/50",
      time: "15:00 - 16:00",
    },
    {
      id: "2",
      location: "Cancha del Club - Tenis",
      person: "María Gómez",
      photo: "https://via.placeholder.com/50",
      time: "17:00 - 18:00",
    },
  ];

  // Función para mostrar detalles de la reserva
  const showReservationDetails = (reservation: (typeof reservations)[0]) => {
    Alert.alert(
      `Reserva en ${reservation.location}`,
      `Persona: ${reservation.person}\nHora: ${reservation.time}`,
      [{ text: "OK" }]
    );
  };

  // Función nueva reserva
  const newReservation = () => {
    Alert.alert(`Proximamente funcionalidad para la reserva`);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="p-2 text-lg">Mis reservas</Text>
      {reservations.map((reservation) => (
        <TouchableOpacity
          key={reservation.id}
          className="mb-4 p-4 border border-gray-200 rounded-lg shadow-md"
          onPress={() => showReservationDetails(reservation)}
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: reservation.photo }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold">
                {reservation.person}
              </Text>
              <Text className="text-gray-600">{reservation.location}</Text>
              <Text className="text-gray-600">Hora: {reservation.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Tarjeta para agregar reserva */}
      <TouchableOpacity
        className="p-4 border-dashed border-2 border-gray-400 rounded-lg flex-row items-center justify-center"
        onPress={() => {
          newReservation();
        }}
      >
        <Icon name="add" size={30} color="gray" />
        <Text className="ml-2 text-gray-600">Agregar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
