// @flow

import React from 'react';
import { View, Button, 
  AsyncStorage,
  NativeEventEmitter, NativeModules } from 'react-native';

import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;  
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
const serial_service_UUID = 'a495ff10-c5b1-4b44-b512-1370f02d74de'; // UUID of the serial service on a LightBlue Bean device
const scratch_service_UUID = 'a495ff20-c5b1-4b44-b512-1370f02d74de';
const serial_UUID = 'a495ff11-c5b1-4b44-b512-1370f02d74de';
const scratch_UUID ='a495ff25-c5b1-4b44-b512-1370f02d74de'

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
          console.log(peripheralInfo);
          setTimeout(() => {
            // [1, 0, 0, 0] reads as 1 by Bean's readScratchNumber()
            BleManager.write(id, scratch_service_UUID, scratch_UUID, [1, 0, 0, 0]).then((out) => {
              console.log('wrote!');
            })  
            .catch((error) => {
              // Failure code
              console.log(error);
            });
          }, 500);
        }); 
      })   
      .catch((error) => {
        // Failure code
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
        this.setState(s); // TODO: why does it complain about not being mounted?.. probably remove listener?..
        console.log(this.state.beans);
      }
    });

    BleManager.start({showAlert: false}).then(() => {
      BleManager.scan([], 100).then((results) => {
        console.log('Scanning...');
      });
    });
  }

  render() {
    return <View>
      {Object.keys(this.state.beans).map((beanID) => {
        return <Button
          key={'beanListing.'+beanID}
          title={ this.state.beans[beanID].name || 'mystery device'}
          onPress={() => this.connectBean(beanID)}
        />
      })}
    </View>;
  }
}