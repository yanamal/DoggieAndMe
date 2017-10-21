// @flow

import React from 'react';
import { View, 
  AsyncStorage, } from 'react-native';

import { Button } from 'react-native-elements'
  
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Doggie And Me'
  };
  render() {
    // Test - set a 'custom' game in asyncStorage
    AsyncStorage.setItem("customGame", `
    st()
    setSize(20)
    turtle.click -> 
      feed()
    onRoundStart ->
      moveto random position
    `);

    const { navigate } = this.props.navigation;
    return <View>
      <Button
        raised
        title='Connect a treat dispenser'
        onPress={() => navigate('Connect')}
      />
      <Button
        raised
        title='Start a doggie game'
        onPress={() => navigate('GameSelect')}
      />
    </View>;
  }
}
