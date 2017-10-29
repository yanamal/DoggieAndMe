// @flow

import React from 'react';
import { Linking, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default class GameSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Scan the QR code of your deployed game!'
  };

  onSuccess(e) {
    // TODO: could also use gist API here rather than the URL of the game.
    // but then this would be less compatible with other arbitrary ways of loading the game.
    // (could extract gist id if present, then load metadata from other files we assume are there).
    fetch(e.data)
      .then((response) => {
        response.text().then((text) => {
          console.log(text);
          AsyncStorage.setItem("customGame", text);
          this.props.navigation.navigate('GameSelect');
        }) 
      })
  }


  render() {
    return <QRCodeScanner
      onRead={this.onSuccess.bind(this)}
      topContent={( // TODO: no top/bottom content?..
        <Text>
          Scan the QR code of your deployed game!
        </Text>
      )}
      bottomContent={(
        <TouchableOpacity>
          <Text>OK. Got it!</Text>
        </TouchableOpacity>
      )}
    />
  }
}