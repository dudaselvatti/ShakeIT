import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./src/screens/Home";
import { CreatePartyScreen } from "./src/screens/CreateParty";
import { PartyAdminScreen } from "./src/screens/PartyAdmin";

export type RootStackParamList = { //Não me parece ser o lugar certo para isso, mas ok por enquanto
	Home: undefined;
	CreateParty: undefined;
	PartyAdmin: { partyName: string; partyCode: string };
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
			<Stack.Screen name="PartyAdmin" component={PartyAdminScreen} options={{ headerShown: false }}/>
		</Stack.Navigator>
		</NavigationContainer>
	);
}
