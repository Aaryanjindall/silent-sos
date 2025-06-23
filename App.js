import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { db, ref, push } from './firebaseConfig';

export default function App() {
  const [tapCount, setTapCount] = useState(0);
  const lastShake = useRef(0);
  const lastTapTime = useRef(0);

  // Get location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { latitude: 'Permission Denied', longitude: 'Permission Denied' };
    }
    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  const sendSOS = async (triggeredBy) => {
    const date = new Date();
    const formattedTime = date.toLocaleString();
    const coords = await getLocation();

    const sosData = {
      triggeredBy: triggeredBy,
      time: formattedTime,
      location: {
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      rawTimestamp: date.getTime()
    };

    push(ref(db, 'alerts/'), sosData)
      .then(() => {
        Alert.alert("🚨 SOS Sent", `Triggered by ${triggeredBy} at ${formattedTime}`);
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  // Shake detection
  useEffect(() => {
    const subscription = Accelerometer.addListener(data => {
      const { x, y, z } = data;
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      if (totalForce > 2) {
        const now = Date.now();
        if (now - lastShake.current > 3000) {
          lastShake.current = now;
          sendSOS("Shake");
        }
      }
    });

    Accelerometer.setUpdateInterval(200);
    return () => subscription && subscription.remove();
  }, []);

  // Tap button logic
  const handleTap = () => {
    const now = Date.now();

    if (now - lastTapTime.current > 3000) {
      // Reset if last tap was too long ago
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }

    lastTapTime.current = now;

    if (tapCount + 1 >= 3) {
      setTapCount(0);
      sendSOS("3x Button Tap");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Silent SOS</Text>
      <Button title="Tap 3 Times to Trigger SOS" onPress={handleTap} color="crimson" />
      <Text style={styles.note}>
        Shake your phone or tap button 3 times quickly to send SOS with location.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 30
  },
  note: {
    fontSize: 14, color: 'gray', marginTop: 30, textAlign: 'center'
  }
});
