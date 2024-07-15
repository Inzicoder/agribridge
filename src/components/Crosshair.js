import React from 'react';
import { View, StyleSheet } from 'react-native';

const Crosshair = ({ size, w, onLayout }) => {
  return (
    <View
      onLayout={onLayout}
      style={{ width: 2 * size + 1, height: 2 * size + 1 }}
    >
      <View style={[styles.crosshair, { left: size, borderWidth: w / 2.0 }]} />
      <View style={[styles.crosshair, { left: size, borderWidth: w / 2.0 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  crosshair: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderColor: 'ed',
  },
});

export default Crosshair;