import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Medidas, Preferencias } from "./src/types/Perfil";
import { checkFirebaseConnection } from "./src/services/testFirebase";

import { HomeScreen } from "./src/screens/Home";
import { CreatePartyScreen } from "./src/screens/CreateParty";
import { PartyCreatedScreen } from "./src/screens/PartyCreated";
import { PartyAdminScreen } from "./src/screens/PartyAdmin";
import { Party } from "./src/types/Party";
import { ShakeRevealScreen } from "./src/screens/ShakeReveal";
import { PerfilSorteadoScreen } from "./src/screens/PerfilSorteado";
import { ScanScreen } from "./src/screens/Scan";
import { PartyPreviewScreen } from "./src/screens/PartyPreview";

export type RootStackParamList = {
  Home: { novaParty?: Party } | undefined;
  CreateParty: undefined;
  PartyCreated: { party: Party };
  PartyAdmin: { partyName: string; partyCode: string };
  ShakeReveal: undefined;
  RevealResult: undefined;
  PerfilSorteado: { idUsuario: number };
  Scan: undefined;
  PartyPreview: { partyCode: string };
  ParticipantLobby: { partyId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ParticipantLobbyPlaceholder = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18 }}>Lobby do Participante (T16) - Em breve!</Text>
  </View>
);

export default function App() {
  useEffect(() => {
    checkFirebaseConnection();
  }, []);

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
        <Stack.Screen name="PartyAdmin" component={PartyAdminScreen} />
        <Stack.Screen name="ShakeReveal" component={ShakeRevealScreen} />
        <Stack.Screen name="PerfilSorteado" component={PerfilSorteadoScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="PartyPreview" component={PartyPreviewScreen} />
        <Stack.Screen name="ParticipantLobby" component={ParticipantLobbyPlaceholder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
