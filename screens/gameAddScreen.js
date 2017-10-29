// @flow

import React from 'react';
import { View, Text, AsyncStorage, TextInput } from 'react-native';
import { Button } from 'react-native-elements'

import Modal from 'react-native-modal'

import QRCodeScanner from 'react-native-qrcode-scanner';

import { styles } from './../styles';

export default class GameSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Scan the QR code of your deployed game!'
  };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      gameCode: '',
      gameName: 'New Game'
    };
  }

  onSuccess(e) {
    // TODO: could also use gist API here rather than the URL of the game.
    // but then this would be less compatible with other arbitrary ways of loading the game.
    // (could extract gist id if present, then load metadata from other files we assume are there).
    fetch(e.data)
      .then((response) => {
        response.text().then((gameCode) => {
          console.log(gameCode);
          this.setState({modalVisible: true, gameCode: gameCode});
        }) 
      })
  }

  // TOOD: async function?..
  storeGame() { 
    AsyncStorage.getItem('lastGameNum').then((result) =>{
      const lastNum = parseInt(result);
      const gameid = 'custom_game_'+(lastNum+1);
      AsyncStorage.setItem(gameid,
        JSON.stringify({
          name: this.state.gameName,
          code: this.state.gameCode
        })
      );
      AsyncStorage.getItem('gameIDs').then((gamesString) =>{
        let gameIDs = JSON.parse(gamesString);
        gameIDs.push(gameid);
        AsyncStorage.setItem('gameIDs',JSON.stringify(gameIDs));
        this.props.navigation.navigate('GameSelect');// navigate in probably-innermost callback - so game is likely to show up.
      });
    });
  }

  render() {
    return <View style={{flex: 1}}>
      <QRCodeScanner
        style={{flex: 1}}
        onRead={this.onSuccess.bind(this)}
        ref={(node) => { this.scannerRef = node }}
      />
      <Modal isVisible={this.state.modalVisible}>

        <View style={styles.modalContent}>

          <Text>Name your game!</Text>

          <TextInput
            style={{ height: 40 }}
            placeholder='Your game name here'
            onChangeText={(gameName) => this.setState({gameName})}
            autoFocus={true}
            maxLength = {40}
          />

          <View style={{flexDirection: 'row'}}>
            <Button 
              raised
              title='Cancel'
              onPress={() => {
                this.setState({modalVisible:false});
                this.scannerRef.reactivate();
              }}>
            </Button>
            <Button 
              raised
              title='Save'
              onPress={() => {
                this.setState({modalVisible:false});
                this.storeGame();
              }}>
            </Button>
          </View>

        </View>
      </Modal>
    </View>
  }
}