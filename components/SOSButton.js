// components/SOSButton.js
import React from 'react';
import { View, Button } from 'react-native';

export default function SOSButton({ triggerSOS }) {
  return (
    <View style={{ margin: 20 }}>
      <Button title="Trigger SOS" onPress={triggerSOS} color="red" />
    </View>
  );
}
