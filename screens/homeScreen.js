// @flow

import React from 'react';
import { Button, AsyncStorage } from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Doggie And Me'
  };
  render() {
    // Test - set a 'custom' game in asyncStorage

    console.log('render home');
    AsyncStorage.setItem("customGame", `
    st()
    setSize(20)
    turtle.click -> 
      feed()
    onRoundStart ->
      moveto random position
    `);

    const { navigate } = this.props.navigation;
    return <Button
      title='Start a doggie game'
      onPress={() => navigate('GameSelect')}
    />;
  }
}
