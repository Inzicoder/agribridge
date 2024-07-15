// mapHelpers.js
import Supercluster from 'supercluster';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadCoordinates = async () => {
  try {
    const savedCoordinates = await AsyncStorage.getItem('coordinates');
    if (savedCoordinates) {
      const parsedCoordinates = JSON.parse(savedCoordinates);
      return parsedCoordinates;
    }
    return [];
  } catch (error) {
    console.log('Failed to load coordinates:', error);
    return [];
  }
};

export const saveCoordinates = async (coords) => {
  try {
    await AsyncStorage.setItem('coordinates', JSON.stringify(coords));
  } catch (error) {
    console.log('Failed to save coordinates:', error);
  }
};

export const initializeSupercluster = (points, zoom) => {
  const index = new Supercluster({
    minZoom: 0,
    maxZoom: 20,
    radius: 50,
  });

  index.load(points);
  return index.getClusters([-180, -85, 180, 85], zoom);
};

export const mapAllPolygonsToPoints = (allPolygons) => {
  return allPolygons
    .map((coordinates, index) => {
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        console.log('Each coordinate must be an array of [longitude, latitude]');
        return null;
      }

      return {
        type: 'Feature',
        properties: { cluster: false, polygonId: index },
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
      };
    })
    .filter(point => point !== null);
};
