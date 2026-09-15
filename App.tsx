import React from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { AppProvider } from "./context/AppContext";
import DesktopShowcase from "./components/DesktopShowcase";
import Home from "./screens/Home";
import Discover from "./screens/Discover";
import Courts from "./screens/Courts";
import Leaderboard from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import { colors, fonts } from "./theme";

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Inicio: ["home", "home-outline"],
  Descubrir: ["flame", "flame-outline"],
  Canchas: ["map", "map-outline"],
  Ranking: ["trophy", "trophy-outline"],
  Perfil: ["person", "person-outline"],
};

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.card, primary: colors.lime, text: colors.text, border: colors.line },
};

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line, height: 66, paddingTop: 8, paddingBottom: 10 },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => {
          const [on, off] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? on : off} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Descubrir" component={Discover} />
      <Tab.Screen name="Canchas" component={Courts} />
      <Tab.Screen name="Ranking" component={Leaderboard} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const { width } = useWindowDimensions();

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const app = (
    <AppProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Tabs />
      </NavigationContainer>
    </AppProvider>
  );

  return <SafeAreaProvider>{Platform.OS === "web" && width >= 1000 ? <DesktopShowcase>{app}</DesktopShowcase> : app}</SafeAreaProvider>;
}
