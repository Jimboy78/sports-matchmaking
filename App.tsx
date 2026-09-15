import "nativewind";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./screens/ProfileScreen";
import RankingScreen from "./screens/RankingScreen";
import MatchScreen from "./screens/MatchScreen";
import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import MapScreen from "./screens/MapScreen";
import { SportsProvider } from "./context/SportsContext"; // Asegúrate de importar el SportsProvider

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SportsProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case "Profile":
                  iconName = focused ? "person" : "person-outline";
                  break;
                case "Map":
                  iconName = focused ? "map" : "map-outline";
                  break;
                case "Contacts":
                  iconName = focused ? "book" : "book-outline";
                  break;
                case "Home":
                  iconName = focused ? "home" : "home-outline";
                  break;
                // case "Ranking":
                //   iconName = focused ? "trophy" : "trophy-outline";
                //   break;
                // case "Match":
                //   iconName = focused ? "search" : "search-outline";
                //   break;
                default:
                  iconName = "help-circle"; // Valor por defecto
                  break;
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{ title: "Map" }}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactScreen}
            options={{ title: "Contacts" }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Perfil" }}
          />
          {/* <Tab.Screen
            name="Ranking"
            component={RankingScreen}
            options={{ title: "Ranking" }}
          />
          <Tab.Screen
            name="Match"
            component={MatchScreen}
            options={{ title: "Buscar Match" }}
          /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </SportsProvider>
  );
};

export default App;
