import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {MAPBOX_ACCESS_TOKEN} from './src/config';
import DrawPolyline from './src/DrawPolyline';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const App = () => {


    return (
    <View style={styles.page}>
      <View style={styles.container}>
 
        <DrawPolyline />
      </View>
    </View>

  );
}

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },

});