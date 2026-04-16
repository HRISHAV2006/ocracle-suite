import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';

export default function ScannerScreen({ onScanned }: { onScanned: (res: any) => void }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      // In production, point to the actual accessible local IP or prod server
      // Since emulator localhost is 10.0.2.2 on Android, we'll configure a dynamic approach later.
      // Use standard localhost:3001 for scaffolding purposes.
      const response = await axios.post('http://10.0.2.2:3001/api/v1/scan/barcode', {
        barcode: data
      });
      onScanned(response.data);
    } catch (err) {
      alert(`API Error: Make sure your Metro Bundler points back to your machine IP.`);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text style={{color: 'white'}}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={{color: 'white'}}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "upc_e", "qr"],
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Align barcode within frame</Text>
      </View>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  }
});
