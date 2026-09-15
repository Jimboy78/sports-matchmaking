import React from "react";
import { TextInput, View, Text } from "react-native";

interface ProfileInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-semibold mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded-md"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default ProfileInput;
