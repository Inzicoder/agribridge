import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Crosshair from './Crosshair';

const CrosshairOverlay = ({ onCenter }) => {
  const crosshairRef = useRef(null);

  return (
    <View style={styles.crosshairOverlay} pointerEvents="none">
      <Crosshair
        size={20}
        w={1.0}
        ref={crosshairRef}
        onLayout={e => {
          const { x, y, width, height } = e.nativeEvent.layout;
          onCenter([x + width / 2.0, y + height / 2.0]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  crosshairOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CrosshairOverlay;