import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScannerScreen from './components/ScannerScreen';

const queryClient = new QueryClient();

export default function App() {
  const [scannedResult, setScannedResult] = useState<any>(null);

  if (scannedResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>OCRacle Mobile</Text>
        <Text style={styles.score}>{scannedResult.data.truthScore.overall} / 10</Text>
        <Text style={styles.label}>{scannedResult.data.truthScore.label}</Text>
        <Text style={{ marginTop: 20, color: 'red' }} onPress={() => setScannedResult(null)}>
          Tap to Scan again
        </Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <ScannerScreen onScanned={(res) => setScannedResult(res)} />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f11',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    color: '#34d399',
    fontSize: 64,
    fontWeight: '900',
  },
  label: {
    color: '#ccc',
    fontSize: 18,
  }
});
