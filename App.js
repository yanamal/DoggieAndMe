// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/homeScreen'
import GameScreen from './screens/gameScreen'

const DogApp = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen }
});

export default class App extends React.Component {
  render() {
    return <DogApp/>;
  }
}
