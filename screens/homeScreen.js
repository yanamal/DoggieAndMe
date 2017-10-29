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
      <Button
        raised
        title='Add a custom game'
        onPress={() => navigate('GameAdd')}
      />
    </View>;
  }
}
