import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { BotaoTeste } from './src/components/BotaoTeste';

export default function App() {
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