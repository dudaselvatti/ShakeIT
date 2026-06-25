import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { ToastConfig, ToastProps } from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppNotificationToast } from './src/components/AppNotificationToast';

import { checkFirebaseConnection } from "./src/services/testFirebase";
import { navigationRef } from "./src/utils/RootNavigation";

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
import { ThemeProvider, useAppTheme } from "./src/contexts/ThemeContext";
import { NotificationProvider } from "./src/contexts/NotificationContext/NotificationContext";
import { RegistrationScreen } from "./src/screens/Registration";
import { LoginScreen } from "./src/screens/Login";
import { ForgotMyPasswordScreen } from "./src/screens/ForgotMyPassword";
import { WelcomeScreen } from "./src/screens/Welcome";
import { LoadingScreen } from "./src/components/LoadingScreen";
import { PartyDrawRestrictionsScreen } from "./src/screens/PartyDrawRestrictions";
import { NotificationsScreen } from "./src/screens/Notifications";

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  CreateParty: undefined;
  PartyCreated: { partyId: string };
  PartyAdmin: { partyId: string };
  PartyDrawRestrictions: { partyId: string };
  ShakeReveal: { partyId: string };
  RevealResult: undefined;
  PerfilSorteado: { idPerfil: string };
  Registration: undefined;
  Login: undefined;
  ForgotMyPassword: undefined;
  Scan: undefined;
  PartyPreview: { partyCode: string };
  ParticipantLobby: { partyId: string };
  MeuPerfil: undefined;
  Settings: undefined;
  Notifications: undefined;
  GestaoDependentes: undefined;
  FormDependente: { dependent?: Dependent } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { usuarioAtual, isLoading } = useAuth();
  const { isDark, theme } = useAppTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const customTheme = isDark ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer theme={customTheme} ref={navigationRef}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack.Navigator
          initialRouteName={usuarioAtual ? "Home" : "Welcome"}
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: theme.colors.background },
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
          <Stack.Screen name="PartyDrawRestrictions" component={PartyDrawRestrictionsScreen} />
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
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="GestaoDependentes" component={GestaoDependentesScreen} />
          <Stack.Screen name="FormDependente" component={FormDependenteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const queryClient = new QueryClient();

const toastConfig: ToastConfig = {
  app_notification: (props: ToastProps) => (
    <AppNotificationToast
      title={(props as any).text1 || 'Notificação'}
      message={(props as any).text2 || ''}
      onPress={() => {
        if (props.onPress) props.onPress();
        Toast.hide();
      }}
      onClose={() => Toast.hide()}
    />
  ),
};

export default function App() {
  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <RootNavigator />
            <Toast config={toastConfig} />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
    </QueryClientProvider>
  );
}
