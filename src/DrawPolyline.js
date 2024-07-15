import { Camera, LineLayer, MapView, ShapeSource } from '@rnmapbox/maps';
import { Button, View, StyleSheet } from 'react-native';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import CrosshairOverlay from './components/CrosshairOverlay';
import { loadCoordinates, saveCoordinates, initializeSupercluster, mapAllPolygonsToPoints } from './mapHelpers';

const lineLayerStyle = {
  lineColor: '#ff0000',
};

const Polygon = ({ coordinates, id }) => {
  const features = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: `a-feature-${id}`,
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        },
      ],
    }),
    [coordinates, id],
  );

  const sourceId = `polygonFill-${id}`;
  const layerId = `line-layer-${id}`;

  return (
    <ShapeSource key={id} id={sourceId} shape={features}>
      <LineLayer id={layerId} existing={true} style={lineLayerStyle} />
    </ShapeSource>
  );
};

const DrawPolyline = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [lastCoordinate, setLastCoordinate] = useState([0, 0]);
  const [started, setStarted] = useState(false);
  const [crosshairPos, setCrosshairPos] = useState([0, 0]);
  const [allPolygons, setAllPolygons] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [zoom, setZoom] = useState(12);

  const mapRef = useRef(null);

  useEffect(() => {
    const loadInitialCoordinates = async () => {
      const loadedCoordinates = await loadCoordinates();
      setCoordinates(loadedCoordinates);
      setAllPolygons(loadedCoordinates);
      if (loadedCoordinates.length > 0) {
        setLastCoordinate(loadedCoordinates[loadedCoordinates.length - 1]);
      }
    };

    loadInitialCoordinates();
  }, []);

  useEffect(() => {
    if (!Array.isArray(allPolygons) || allPolygons.length === 0) {
      console.log('allPolygons must be a non-empty array');
      return;
    }

    const points = mapAllPolygonsToPoints(allPolygons);
    const clusters = initializeSupercluster(points, zoom);
    setClusters(clusters);
  }, [allPolygons, zoom]);

  const coordinatesWithLast = useMemo(
    () => [...coordinates, lastCoordinate],
    [coordinates, lastCoordinate],
  );

  const btnHandler = btnType => {
    if (btnType === 'Start') {
      setStarted(true);
      setCoordinates(prevCoordinates => [...prevCoordinates, lastCoordinate]);
      setLastCoordinate([0, 0]);
    } else if (btnType === 'Add') {
      const newCoordinates = [...coordinates, lastCoordinate];
      setCoordinates(newCoordinates);
      setAllPolygons(prevPolygons => [...prevPolygons, newCoordinates]);
      saveCoordinates([...allPolygons, newCoordinates]);
    } else {
      setStarted(false);
    }
  };

  const cameraHandler = async () => {
    const crosshairCoords = await mapRef.current?.getCoordinateFromView(
      crosshairPos,
    );
    if (crosshairCoords && started) {
      setLastCoordinate(crosshairCoords);
    }
  };

  const handleZoomChange = zoom => {
    setZoom(zoom);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {!started ? (
          <Button title="Start" onPress={() => btnHandler('Start')} />
        ) : (
          <View style={styles.buttonGroup}>
            <Button title="Add" onPress={() => btnHandler('Add')} />
            <Button title="Stop" onPress={() => btnHandler('Stop')} />
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          onCameraChanged={cameraHandler}
          onZoomChange={handleZoomChange}>
          {clusters.length > 0 &&
            clusters.map(cluster => {
              if (cluster.properties.cluster) {
                return (
                  <ShapeSource
                    key={cluster.properties.clusterId}
                    id={`cluster-${cluster.properties.clusterId}`}>
                    <LineLayer
                      id={`cluster-line-${cluster.properties.clusterId}`}
                      style={{ lineColor: 'blue', lineWidth: 2 }}
                    />
                  </ShapeSource>
                );
              } else {
                return allPolygons.map((polygon, index) => (
                  <Polygon
                    key={index}
                    id={index}
                    coordinates={coordinatesWithLast}
                  />
                ));
              }
            })}
          {started && <Polygon coordinates={coordinatesWithLast} />}
          <Camera
            defaultSettings={{
              centerCoordinate: [-73.970895, 40.723279],
              zoomLevel: 12,
            }}
          />
        </MapView>
        <CrosshairOverlay onCenter={c => setCrosshairPos(c)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  crosshairOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshair: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderColor: 'red',
  },
});

export default DrawPolyline;
