// @flow

import React from 'react';
import { View, WebView, Vibration } from 'react-native';

import { styles } from './../styles';

import { createResponder } from 'react-native-gesture-responder';

import BleManager from 'react-native-ble-manager';

import GlobalState from './../globalState';

import { Immersive } from 'react-native-immersive'


const serial_service_UUID = 'a495ff10-c5b1-4b44-b512-1370f02d74de'; // UUID of the serial service on a LightBlue Bean device
const scratch_service_UUID = 'a495ff20-c5b1-4b44-b512-1370f02d74de';
const serial_UUID = 'a495ff11-c5b1-4b44-b512-1370f02d74de';
const scratch_UUID ='a495ff25-c5b1-4b44-b512-1370f02d74de';

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
    Immersive.on(); // TODO: only do this on android (look up in ble example)
    // TODO: also, make sure that I don't need to handle interruptions like modals.
    // TODO: change/set width and height AFTER immersive is on.
  }

  componentWillUnmount() {
    Immersive.off();
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
       /*{...this.gestureResponder}/*TODO: this makes webview touches unreliable on android.*/>
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
      console.log('feed');
      console.log(GlobalState.connectedBles)
      for(id in GlobalState.connectedBles) {
        console.log('id');        
        // [1, 0, 0, 0] reads as 1 by Bean's readScratchNumber()
        // TODO: also/alternatively write to serial?..
        BleManager.write(id, GlobalState.beanConsts.scratch_service_UUID, GlobalState.beanConsts.scratch_UUID, [1, 0, 0, 0]).then((out) => {
          console.log('wrote!');
        })
      }
    },

    vibrate: () => {
      // Note: iOS doesn't let you control the duration of vibration, so for compatibility, we don't allow it either.
      // TODO: maybe make the vibrate for android shorter, even if it has to be long on iOS.
      Vibration.vibrate(); 
    }
  }

}