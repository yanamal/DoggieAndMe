// @flow

import React from 'react';
import { View, AsyncStorage} from 'react-native';

import { Button } from 'react-native-elements'

import GlobalState from './../globalState';

import { styles } from './../styles';

  
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Doggie And Me'
  };

  // load default games into asyncStorage if no games are registered.
  componentWillMount () { 
    AsyncStorage.getItem('gameIDs').then((ids)=>{
      if(!ids) {
        let gameNum = 0;
        let starterIDs = [];
        for(gameName in GlobalState.starterGames) {
          gameId = "default_game_"+gameNum;
          gameNum++;
          AsyncStorage.setItem(gameId, 
            JSON.stringify({
              name: gameName,
              code: GlobalState.starterGames[gameName]
            })
          );
          starterIDs.push(gameId);
        }
        AsyncStorage.setItem('lastGameNum', gameNum.toString()); // to generate next id. TODO: could also use uuid or something.
        AsyncStorage.setItem('gameIDs', JSON.stringify(starterIDs)); // list of IDs of existing games
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return <View>
      <Button
        raised
        buttonStyle={styles.defaultButton}
        title='Connect a treat dispenser'
        onPress={() => navigate('Connect')}
      />
      <Button
        raised
        buttonStyle={styles.defaultButton}
        title='Start a doggie game'
        onPress={() => navigate('GameSelect')}
      />
    </View>;
  }
}
