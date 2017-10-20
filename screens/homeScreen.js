// @flow

import React from 'react';
import { View, Button, 
  AsyncStorage, } from 'react-native';

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
        title='Connect a treat dispenser'
        onPress={() => navigate('Connect')}
      />
      <Button
        title='Start a doggie game'
        onPress={() => navigate('GameSelect')}
      />
    </View>;
  }
}
