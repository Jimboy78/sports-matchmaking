import React from "react";
import { View, Button, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import ProfileInput from "./ProfileInput";
import RNPickerSelect from "react-native-picker-select";
import { Sports } from "../context/SportsContext"; // Importar el tipo Sports

// Asegúrate de que ProfileData tenga las mismas propiedades en ambos archivos
interface ProfileData {
  name: string;
  email: string;
  sports: Sports;
  city: string;
  photo?: string; // Opcional si no se usa en este formulario
  rankingPoints?: number; // Opcional si no se usa en este formulario
}

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
  initialData: ProfileData;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData }) => {
  const { control, handleSubmit } = useForm<ProfileData>({
    defaultValues: initialData,
  });

  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <ProfileInput
            label="Nombre"
            value={value}
            onChangeText={onChange}
            placeholder="Nombre"
          />
        )}
        name="name"
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <ProfileInput
            label="Correo Electrónico"
            value={value}
            onChangeText={onChange}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text>Deporte:</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => onChange(itemValue as Sports)} // Asegura que el valor es del tipo Sports
              value={value}
              items={[
                { label: "Pádel", value: "Padel" },
                { label: "Voleibol", value: "Voley" },
                { label: "Tenis", value: "Tenis" }
              ]}
            />
          </View>
        )}
        name="sports"
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <ProfileInput
            label="Ciudad"
            value={value}
            onChangeText={onChange}
            placeholder="Ciudad"
          />
        )}
        name="city"
      />
      <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default ProfileForm;
