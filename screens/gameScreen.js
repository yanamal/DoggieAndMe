// @flow

import React from 'react';
import { View, WebView, Vibration } from 'react-native';

import { styles } from './../styles';

import { createResponder } from 'react-native-gesture-responder';


export default class GameScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  // set up gesture detection (mostly boilerplate, except the pinch logic:
  componentWillMount() {
    const { navigate } = this.props.navigation;    
    this.gestureResponder = createResponder({
      onStartShouldSetResponder: (evt, gestureState) => true,
      onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponder: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: (evt, gestureState) => true,
      onResponderGrant: (evt, gestureState) => {},
      onResponderMove: (evt, gestureState) => {
      },
      onResponderTerminationRequest: (evt, gestureState) => true,
      onResponderRelease: (evt, gestureState) => {
        // custom gesture response - if pinched (within some constraints), navigate back
        // TODO: pinch threshold? but then need to track starting pinch state.
        if (gestureState.pinch && gestureState.previousPinch && gestureState.pinch < gestureState.previousPinch ) {
          this.props.navigation.goBack();
        }
      },
      onResponderTerminate: (evt, gestureState) => {},
      
      onResponderSingleTapConfirmed: (evt, gestureState) => {},
      
      moveThreshold: 2,
      debug: false
    });
  }

  // postMessage setup

  onWebViewMessage = (event) => {
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
      <View style={styles.fullscreen}
       {...this.gestureResponder}/*TODO: this makes webview touches unreliable on android.*/>
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