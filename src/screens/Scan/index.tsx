import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { styles } from "./styles";

export const ScanScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Tenta solicitar permissão no mount apenas se não tiver sido concedida e puder perguntar
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas no mount para evitar loops

  if (!permission) {
    // Permissão ainda está carregando
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader headerTitle="Escanear Party" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Permissão negada ou aguardando ação
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader headerTitle="Escanear Party" />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Acesso à Câmera Necessário</Text>
          <Text style={styles.permissionSubText}>
            Precisamos do acesso à câmera para ler o QR Code da Party.
          </Text>
          <Button 
            title="Permitir Câmera" 
            onPress={requestPermission} 
            style={{ marginBottom: 16, width: "100%" }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Escanear Party" />
      <View style={{ flex: 1 }}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={(result) => {
            console.log("QR Code Lido:", result.data);
            // TODO: Implementar lógica de entrada na party
            // navigation.navigate("PartyAdmin", { partyCode: result.data });
          }}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="none">
          <View style={styles.maskHole}>
            <View style={styles.transparentOverlay} />
          </View>
          <View style={styles.bottomInstructionContainer}>
            <Text style={styles.instructionText}>
              Aponte a câmera para o QR Code para entrar na Party
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
