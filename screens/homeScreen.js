// @flow

import React from 'react';
import { Text, View, Button } from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Doggie And Me'
  };
  render() {
    const { navigate } = this.props.navigation;
    return <Button
      title='test'
      onPress={() => navigate('Game')}
    />;
  }
}
