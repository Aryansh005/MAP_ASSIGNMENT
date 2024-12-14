/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, View } from 'react-native';
import SaverMode from './src/components/ShowSaverMode';
import MapTracker from './src/components/MapTracker';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SaverMode />
        <MapTracker/>
      </View>
    </SafeAreaView>
  );
}

export default App;
