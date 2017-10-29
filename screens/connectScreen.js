// @flow

import React from 'react';
import { View, 
  AsyncStorage,
  NativeEventEmitter, NativeModules } from 'react-native';

import { Button } from 'react-native-elements'

import { styles } from './../styles';
  
import BleManager from 'react-native-ble-manager';

import GlobalState from './../globalState';

const BleManagerModule = NativeModules.BleManager;  
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
// TODO: disconnect; reflect connection state in interface.


export default class ConnectScreen extends React.Component {
  static navigationOptions = {
    title: 'Connect to a dispenser'
  };

  constructor(props){
    super(props)
    this.state = {
      beans: new Map()
    }
  }


  connectBean = (id) => {
    BleManager.stopScan().then( () =>{
      BleManager.connect(id).then(() => {
        BleManager.retrieveServices(id).then((peripheralInfo) => { // somehow I feel like this is a perverse use of promises. oh well.
          GlobalState.connectedBles[id] = true;
        }); 
      })   
      .catch((error) => {
        // Connection failure
        console.log(error);
      });
    });
  }

  componentDidMount() {
    
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (data) => {
      console.log(data);
      if(!(data.id in this.state.beans)) {
        s = this.state;
        s.beans[data.id] = data;
        this.setState(s); // TODO: why does it complain about not being mounted?.. probably remove listener on navigate back?..
        console.log(this.state.beans);
      }
    });

    BleManager.start({showAlert: false}).then(() => {
      // TODO: continuous scan and/or reflect whether scanning in the interface.
      BleManager.scan([GlobalState.beanConsts.serial_service_UUID], 100).then((results) => {
        console.log('Scanning...');
      });
    });
  }

  render() {
    return <View>
      {Object.keys(this.state.beans).map((beanID) => {
        return <Button
          raised
          buttonStyle={styles.defaultButton}
          key={'beanListing.'+beanID}
          title={ this.state.beans[beanID].name || 'mystery device'}
          onPress={() => this.connectBean(beanID)}
        />
      })}
    </View>;
  }
}