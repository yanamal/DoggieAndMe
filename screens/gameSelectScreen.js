// @flow

import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements'


// TODO: style that makes buttons distinct?.. maybe just padding?..
export default class GameSelectScreen extends React.Component {
  static navigationOptions = {
    title: 'Select a game to start'
  };

  constructor(props) {
    super(props);
    this.state = { 
      testPrograms: {
        screentap: 'click -> feed()',
        screentap2: 'tap -> feed()',
        turtletap: `
        st()
        setSize(20)
        turtle.click -> 
          feed()
          moveto random position
        `,
        turtletap2: `
        st()
        setSize(20)
        turtle.tap -> 
          feed()
          moveto random position
        `,
        turtletap3: `
        st()
        sizePicker = new DifficultyPicker(20,1);
        turtle.click -> 
          feed()
        onRoundStart ->
          setSize(sizePicker.pick());
          moveto random position
        `
      }
    };
  }

  // load custom game from AsyncStorage, if any
  componentWillMount () { 
    AsyncStorage.getItem("customGame").then((value) => {
      let tp = this.state.testPrograms;
      tp['Custom Game'] = value;
      this.setState({testPrograms:tp});
    })
  } 

  render() {
    const { navigate } = this.props.navigation;
    
    return <View>
      {Object.keys(this.state.testPrograms).map((gameName) => {
        return <Button
          raised
          key={'gameButton.'+gameName}
          title={gameName}
          onPress={() => navigate('Game', { code: this.state.testPrograms[gameName] })}
        />
      })}
    </View>
  }
}