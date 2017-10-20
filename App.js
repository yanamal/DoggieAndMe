// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/homeScreen'
import GameScreen from './screens/gameScreen'
import ConnectScreen from './screens/connectScreen'
import GameSelectScreen from './screens/gameSelectScreen'

const DogApp = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen },
  Connect: { screen: ConnectScreen },
  GameSelect: { screen: GameSelectScreen }
});

export default class App extends React.Component {
  render() {
    return <DogApp/>;
  }
}
