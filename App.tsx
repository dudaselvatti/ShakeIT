import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
import { ParticipantLobbyScreen } from "./src/screens/ParticipantLobby";
import { MeuPerfilScreen } from "./src/screens/MeuPerfil";
import { SettingsScreen } from "./src/screens/Settings";
import { GestaoDependentesScreen } from "./src/screens/GestaoDependentes";
import { FormDependenteScreen } from "./src/screens/FormDependente";
import { Dependent } from "./src/types/Dependent";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext/AuthContext";
import { RegistrationScreen } from "./src/screens/Registration";
import { LoginScreen } from "./src/screens/Login";
import { ForgotMyPasswordScreen } from "./src/screens/ForgotMyPassword";
import { WelcomeScreen } from "./src/screens/Welcome";
import { LoadingScreen } from "./src/components/LoadingScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Home: { novaParty?: Party } | undefined;
  CreateParty: undefined;
  PartyCreated: { party: Party };
  PartyAdmin: { partyName: string; partyCode: string };
  ShakeReveal: undefined;
  RevealResult: undefined;
  PerfilSorteado: { idUsuario: string };
  Registration: undefined;
  Login: undefined;
  ForgotMyPassword: undefined;
  Scan: undefined;
  PartyPreview: { partyCode: string };
  ParticipantLobby: { partyId: string };
  MeuPerfil: undefined;
  Settings: undefined;
  GestaoDependentes: undefined;
  FormDependente: { dependent?: Dependent } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { usuarioAtual, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <Stack.Navigator
        initialRouteName={usuarioAtual ? "Home" : "Welcome"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ route }: any) => ({ animation: route.params?.animation || 'slide_from_left' })} 
        />
        <Stack.Screen name="CreateParty" component={CreatePartyScreen} />
        <Stack.Screen name="PartyCreated" component={PartyCreatedScreen} />
        <Stack.Screen name="PartyAdmin" component={PartyAdminScreen} />
        <Stack.Screen name="ShakeReveal" component={ShakeRevealScreen} />
        <Stack.Screen name="PerfilSorteado" component={PerfilSorteadoScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotMyPassword" component={ForgotMyPasswordScreen} />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen} 
          options={({ route }: any) => ({ animation: route.params?.animation || 'slide_from_right' })} 
        />
        <Stack.Screen name="PartyPreview" component={PartyPreviewScreen} />
        <Stack.Screen name="ParticipantLobby" component={ParticipantLobbyScreen} />
        <Stack.Screen 
          name="MeuPerfil" 
          component={MeuPerfilScreen} 
          options={({ route }: any) => ({ animation: route.params?.animation || 'slide_from_right' })} 
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="GestaoDependentes" component={GestaoDependentesScreen} />
        <Stack.Screen name="FormDependente" component={FormDependenteScreen} />
      </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
