import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { BotaoTeste } from './src/components/BotaoTeste';
import { usuariosMock } from './src/mocks/usuariosMock';
import { perfisMock } from './src/mocks/perfisMock';

export default function App() {
  console.log(usuariosMock);
  console.log(perfisMock);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShakeIT</Text>
      <Text>Estrutura de pastas validada!</Text>
      
      <BotaoTeste />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});