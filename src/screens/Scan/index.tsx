import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Button } from "../../components/Button";
import { styles } from "./styles";

export const ScanScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader headerTitle="Escanear Party" />
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
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
        <AppFooter />
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
            if (scanned) return;
            setScanned(true);
            console.log("QR Code Lido:", result.data);
            navigation.navigate("PartyPreview", { partyCode: result.data });
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
      <AppFooter />
    </SafeAreaView>
  );
};
