// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/homeScreen'
import GameScreen from './screens/gameScreen'
import ConnectScreen from './screens/connectScreen'
import GameSelectScreen from './screens/gameSelectScreen'
import GameAddScreen from './screens/gameAddScreen'

const DogApp = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen },
  Connect: { screen: ConnectScreen },
  GameSelect: { screen: GameSelectScreen },
  GameAdd: { screen: GameAddScreen }
});

export default class App extends React.Component {
  render() {
    console.ignoredYellowBox = ['Remote debugger'];
    return <DogApp/>;
  }
}
