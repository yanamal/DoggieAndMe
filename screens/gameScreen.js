// @flow

import React from 'react';
import { View, WebView, Vibration, Platform, Dimensions } from 'react-native';

import { styles } from './../styles';

import { createResponder } from 'react-native-gesture-responder';

import BleManager from 'react-native-ble-manager';

import GlobalState from './../globalState';

import { Immersive } from 'react-native-immersive'
import Orientation from 'react-native-orientation';


const serial_service_UUID = 'a495ff10-c5b1-4b44-b512-1370f02d74de'; // UUID of the serial service on a LightBlue Bean device
const scratch_service_UUID = 'a495ff20-c5b1-4b44-b512-1370f02d74de';
const serial_UUID = 'a495ff11-c5b1-4b44-b512-1370f02d74de';
const scratch_UUID ='a495ff25-c5b1-4b44-b512-1370f02d74de';

export default class GameScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    Orientation.lockToLandscape();
    if(Platform.OS === 'android') {
      Immersive.on();
      // TODO: also, make sure that I don't need to handle interruptions like modals.
    }

    // Force width/height dynamically; assume width is biggest, since we are locking to landscape. 
    // TODO: add 48 pixels for android
    // TODO: figure out how to do this more "properly"?
    this.fullscreenStyle = {
      width: Math.max(Dimensions.get("window").width, Dimensions.get("window").height),
      height: Math.min(Dimensions.get("window").width, Dimensions.get("window").height),
      backgroundColor: 'powderblue'
    }

    const { navigate } = this.props.navigation;    

    // Set up gesture responder for quit-game-on-pinch navigation(mostly boilerplate, except the pinch logic):
    // TODO: can I turn off the shrinking on pinch?.. seems to come with the gesture responder.
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
        // custom gesture response - if pinched, navigate back
        // TODO: pinch threshold? but then need to track starting pinch state.
        // TODO: This mostly seems to react to "horizontal" pinch, not vertical. debug?..
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

  componentWillUnmount() {
    if(Platform.OS === 'android') {
      Immersive.off();
    }
    Orientation.unlockAllOrientations();
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

    // Only do the gestureResponder on ios - seems to be more trouble than it's worth on Android (interferes with touch detection, possibly slow)
    const gestureConfig = Platform.OS === 'ios' ? this.gestureResponder : {}

    return (
      <View style={this.fullscreenStyle}
       {...gestureConfig}/*TODO: this makes webview touches unreliable on android.*/>
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