# React Native Mapbox Polyline Drawer

This project is a React Native application that allows users to draw polylines on a Mapbox map. The application supports clustering of points and saving/loading of drawn polylines.

## Features

- Draw polylines on a Mapbox map
- Save and load polylines using AsyncStorage
- Cluster points based on zoom level
- Visualize clusters and individual points with different styles

## Prerequisites

- Node.js
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## Dependencies

- `@rnmapbox/maps`: Mapbox integration for React Native
- `react-native`: React Native framework
- `react-native-async-storage/async-storage`: AsyncStorage for saving/loading coordinates
- `supercluster`: Clustering library for geo data

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/react-native-mapbox-polyline-drawer.git
   cd react-native-mapbox-polyline-drawer

2. **install dependencies
   Using npm:
   ```

npm install

or using yarn

yarn install

3. **Configure Mapbox:

Follow the instructions for setting up Mapbox in React Native:
https://github.com/rnmapbox/maps

4. **Run the application:

For ios :
npx react-native run-ios

For Android:
npx react-native run-android
