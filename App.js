// @flow

import React from 'react';
import { StackNavigator } from 'react-navigation';
import { AppState } from 'react-native'


import HomeScreen from './screens/homeScreen'
import GameScreen from './screens/gameScreen'
import ConnectScreen from './screens/connectScreen'
import GameSelectScreen from './screens/gameSelectScreen'
import GameAddScreen from './screens/gameAddScreen'

import BleManager from 'react-native-ble-manager';
import GlobalState from './globalState';


const DogApp = StackNavigator({
  Home: { screen: HomeScreen },
  Game: { screen: GameScreen },
  Connect: { screen: ConnectScreen },
  GameSelect: { screen: GameSelectScreen },
  GameAdd: { screen: GameAddScreen }
});

export default class App extends React.Component {

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(newAppState) {
    if(newAppState.match(/inactive|background/)) {
      for(id in GlobalState.connectedBles) {
        console.log('disconnecting '+id);
        BleManager.disconnect(id);
      }
      GlobalState.connectedBles = {};
    }
  }

  render() {
    console.ignoredYellowBox = ['Remote debugger'];
    return <DogApp/>;
  }
}
