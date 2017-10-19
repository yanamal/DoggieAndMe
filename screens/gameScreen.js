// @flow

import React from 'react';
import { View, WebView, Vibration } from 'react-native';

import { styles } from './../styles';


export default class GameScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  // postMessage setup

  onWebViewMessage = (event) => {
    // console.log(event.nativeEvent.data);
    message = JSON.parse(event.nativeEvent.data);
    if(message && message.type && (message.type in this.apiFunctions)) {
      this.apiFunctions[message.type](message.payload);
    }
    else {
      console.log(event.nativeEvent.data);
    }
  }

  // note arrow function format, to preserve 'this' reference when it's passed in as a callback.
  onWebViewLoad = () => {
    const { params } = this.props.navigation.state;

    this.webViewRef.postMessage(JSON.stringify({
      type:'bridgeLoaded'
    }));
    this.webViewRef.postMessage(JSON.stringify({
      type:'setProgram',
      payload: {
        code: params.code,
        programType: 'CoffeeScript' // TODO: allow either
      }
    }));
  }

  // render the webview
  render() {
    const webviewContent = require('./../webviewContent/index.html')
    return (
      <View style={styles.fullscreen}>
        <WebView
          onLoad={this.onWebViewLoad}
          ref={webview => {this.webViewRef = webview;}} // stores a reference to the webview object in the GameScreen wrapper
          source={webviewContent}
          onMessage={this.onWebViewMessage}
        />
      </View>
    );
  }

  // game-specific functions (triggered by webview messages).
  // dict of webview message 'type' fields to function to call.
  // function (optionally) takes in the 'payload' field passed along in the webview message.
  apiFunctions = {
    feed: () => {
      // TODO.
      console.log('feed');
    },

    vibrate: () => {
      // Note: iOS doesn't let you control the duration of vibration, so for compatibility, we don't allow it either.
      // TODO: maybe make the vibrate for android shorter, even if it has to be long on iOS.
      Vibration.vibrate(); 
    }
  }

}