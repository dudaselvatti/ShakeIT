import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function BotaoTeste() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Ambiente Configurado com Sucesso!</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});