// @flow

import React from 'react';
import { View, Text,
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
  /*
  static navigationOptions = {
    title: 'Connect to a dispenser',
  };
  */

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Button
        title=''
        icon={{name: 'refresh'}}
        buttonStyle={styles.defaultButton}
        onPress={params.startScan ? params.startScan : () => null}
      />
    );
    if (params.connecting) {
      headerRight = <Text>Connecting...</Text>;
    }
    else if (params.scanning) {
      headerRight = <Text>Scanning...</Text>;
    }
    return { headerRight:headerRight, title: 'Connect to a dispenser' };
  };

  constructor(props){
    super(props)
    this.state = {
      beans: new Map()
    }
  }

  connectBean = (id) => {
    BleManager.stopScan().then( () => { // TODO: why doesn't this trigger the state change?..
      this.props.navigation.setParams({connecting: true});
      BleManager.connect(id).then(() => {
        BleManager.retrieveServices(id).then((peripheralInfo) => { // somehow I feel like this is a perverse use of promises. oh well.
          this.props.navigation.setParams({connecting: false});
          GlobalState.connectedBles[id] = peripheralInfo;
          // remove from 'disconnected' list. TODO: keep in list, but mark/merge?..
          // the issue is that state is lost on navigate back, so have to be flexible about whether they are present in the state.
          let beans = this.state.beans;
          delete beans[id];
          this.setState({beans:beans});
        }); 
      })   
      .catch((error) => {
        // Connection failure
        console.log(error);
      });
    });
  }

  startScan = () => {
    this.props.navigation.setParams({scanning: true});
    BleManager.scan([GlobalState.beanConsts.serial_service_UUID], 20).then((results) => {
      console.log('Scanning...');
    });
  }

  componentDidMount() { 
    this.props.navigation.setParams({ startScan: this.startScan });

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (data) => {
      console.log(data);
      if(!(data.id in this.state.beans)) {
        let beans = this.state.beans;
        beans[data.id] = data;
        this.setState({beans:beans});
      }
    });

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      // TODO: this stops working sometimes?..
      this.props.navigation.setParams({scanning: false});
    });

    BleManager.start({showAlert: false}).then(() => {
      this.startScan();
    });
  }

  componentWillUnmount() {
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
  }

  render() {
    return <View>
      {Object.keys(GlobalState.connectedBles).map((beanID) => {
        return <Button
          raised
          buttonStyle={[styles.defaultButton, {backgroundColor:'#00c853'}]}
          icon={{name: 'check-circle'}}
          key={'beanListing.'+beanID}
          title={ GlobalState.connectedBles[beanID].name || 'mystery device'}
          onPress={() => this.connectBean(beanID)}
        />
      })}
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