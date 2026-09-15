import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ProfileForm from "../components/ProfileForm";
import ProfileDisplay from "../components/ProfileDisplay";
import { useSports } from "../context/SportsContext";
import { Sports } from "../context/SportsContext";

export interface ProfileData {
  name: string;
  email: string;
  sports: Sports;
  photo: string;
  rankingPoints: number;
  city: string;
}

const ProfileScreen: React.FC = () => {
  const { setSelectedSport } = useSports();
  const [profile, setProfile] = useState<ProfileData>({
    name: "Juan Perez",
    email: "juanperez@example.com",
    sports: "Padel",
    photo: "https://via.placeholder.com/100",
    rankingPoints: 1000,
    city: "Buenos Aires"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);

  const handleProfileUpdate = (data: ProfileData) => {
    setProfile(data);
    setSelectedSport(data.sports); // Actualizamos el deporte seleccionado
    setIsEditing(false);
  };

  const handlePhotoChange = (uri: string) => {
    setProfile(prevProfile => ({ ...prevProfile, photo: uri }));
  };

  const handleEditPress = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempProfile(profile);
  };

  return (
    <View className="flex-1 p-4 bg-zinc-100">
      {isEditing ? (
        <View>
          <ProfileForm
            onSubmit={handleProfileUpdate}
            initialData={tempProfile}
          />
          <TouchableOpacity onPress={handleCancelEdit}>
            <Text className="text-gray-500 text-center mt-2">Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ProfileDisplay
          name={profile.name}
          email={profile.email}
          sports={profile.sports}
          photo={profile.photo}
          rankingPoints={profile.rankingPoints}
          city={profile.city}
          onPhotoChange={handlePhotoChange}
          onEditPress={handleEditPress}
        />
      )}
    </View>
  );
};

export default ProfileScreen;
