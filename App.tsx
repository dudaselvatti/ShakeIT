
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./src/screens/Home";
import { CreatePartyScreen } from "./src/screens/CreateParty";
import { PartyCreatedScreen } from "./src/screens/PartyCreated";

import { usuariosMock } from './src/mocks/usuariosMock';
import { perfisMock } from './src/mocks/perfisMock';

export type RootStackParamList = {
  Home: undefined;
  CreateParty: undefined;
  PartyCreated: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />

      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateParty" component={CreatePartyScreen} />
        <Stack.Screen name="PartyCreated" component={PartyCreatedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
