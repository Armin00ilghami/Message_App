import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No internet connection!</Text>
        </View>
      )}
      {/* Your other components */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    margin: 20,
    top: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius:20,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
