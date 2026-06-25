import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { createStyles } from "./styles";
import { useAppTheme } from "../../contexts/ThemeContext";

export const ScanScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState("");
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
        <AppHeader headerTitle="Escanear Party" showBackButton={true} showSettingsIcon={true} />
        <AppFooter />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader headerTitle="Escanear Party" showBackButton={true} showSettingsIcon={true} />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Acesso à Câmera Necessário</Text>
          <Text style={styles.permissionSubText}>
            Precisamos do acesso à câmera para ler o QR Code da Party.
          </Text>
          <Button 
            title="Permitir Câmera" 
            onPress={requestPermission} 
            style={styles.permissionButton}
          />
        </View>
        <AppFooter />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Escanear Party" showBackButton={true} showSettingsIcon={true} />
      <View style={styles.cameraContainer}>
        {!isManualEntry ? (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={(result) => {
                if (scanned) return;
                setScanned(true);
                navigation.navigate("PartyPreview", { partyCode: result.data });
              }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            />
            <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="box-none">
              <View style={styles.topInstructionContainer} pointerEvents="box-none">
                <Text style={styles.instructionText}>
                  Aponte a câmera para o QR Code
                </Text>
              </View>
              <View style={styles.maskHole} pointerEvents="none">
                <View style={styles.transparentOverlay} />
              </View>
              <View style={styles.bottomInstructionContainer} pointerEvents="box-none">
                <Button
                  title="Digitar Código"
                  onPress={() => setIsManualEntry(true)}
                  variant="outline"
                  style={{ backgroundColor: theme.colors.surface, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 8, height: 'auto' }}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: theme.colors.text, marginBottom: 16, textAlign: 'center' }}>
              Digite o código da Party
            </Text>
            <Input
              placeholder="Ex: ABC1234"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
            />
            <Button
              title="Entrar"
              onPress={() => {
                if (manualCode.trim()) {
                  navigation.navigate("PartyPreview", { partyCode: manualCode.trim().toUpperCase() });
                }
              }}
              style={{ marginTop: 24 }}
            />
            <Button
              title="Voltar para a Câmera"
              onPress={() => setIsManualEntry(false)}
              variant="text"
              style={{ marginTop: 16 }}
            />
          </View>
        )}
      </View>
      <AppFooter />
    </SafeAreaView>
  );
};
