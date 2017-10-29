// @flow

import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements'

import { styles } from './../styles';


// TODO: style that makes buttons distinct?.. maybe just padding?..
export default class GameSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Select a game to start'
  };

  constructor(props) {
    super(props);
    this.state = { 
      games: {} // TODO: is there an initalState thing?..
    };
  }

  // load custom game from AsyncStorage, if any
  componentWillMount () { 
    AsyncStorage.getItem("gameIDs").then((idString) => {
      const gameIDs = JSON.parse(idString);
      AsyncStorage.multiGet(gameIDs).then( (data) =>{
        let games = this.state.games; // TODO: is this necessary/good? maybe just fall back to empty games list if no state?..
        for(const [key, gameString] of data) {
          gameData = JSON.parse(gameString);
          games[gameData.name] = gameData.code;
        }
        this.setState({games: games});
      });
    })
  } 

  render() {
    const { navigate } = this.props.navigation;
    
    return <View>
      {Object.keys(this.state.games).map((gameName) => {
        return <Button
          raised
          buttonStyle={styles.defaultButton}
          key={'gameButton.'+gameName}
          title={gameName}
          onPress={() => navigate('Game', { code: this.state.games[gameName] })}
        />
      })}

      <Button
        raised
        large
        buttonStyle={[styles.defaultButton, {backgroundColor: '#ffc400'}]}
        //backgroundColor={'#ffc400'}
        icon={{name: 'add-circle-outline'}}
        title='Add a custom game'
        onPress={() => this.props.navigation.navigate('GameAdd')}
      />
    </View>
  }
}