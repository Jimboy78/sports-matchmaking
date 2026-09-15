import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ContactScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Lista de contactos hardcodeada
  const contacts = [
    { id: "1", name: "Juan Perez", sport: "Padel" },
    { id: "2", name: "María Gomez", sport: "Tenis" },
    { id: "3", name: "Carlos López", sport: "Voleibol" },
  ];

  // Filtro de contactos basado en la búsqueda
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNotificationsPress = () => {
    Alert.alert("Notificaciones", "Aquí se mostrarían las notificaciones.");
  };

  const handleAddPersonPress = () => {
    Alert.alert("Agregar Persona", "Funcionalidad para agregar más personas.");
  };

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Notificaciones y buscador en la misma línea */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={handleNotificationsPress}>
          <Icon
            name="notifications-outline"
            size={30}
            className="text-gray-500"
          />
        </TouchableOpacity>
        <TextInput
          className="flex-1 ml-2 border border-gray-300 rounded-md p-2"
          placeholder="Buscar personas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleAddPersonPress} className="ml-2">
          <Icon name="person-add-outline" size={30} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      {/* Lista de contactos */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center p-2 border-b border-gray-200">
            <Icon
              name="person-circle"
              size={40}
              className="text-gray-500 mr-4"
            />
            <View>
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-500">{item.sport}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No se encontraron contactos.</Text>}
      />
    </View>
  );
};

export default ContactScreen;
