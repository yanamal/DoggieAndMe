import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';

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
        turtletap: `
        st()
        setSize(20)
        turtle.click -> 
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
    console.log('mounted');
    AsyncStorage.getItem("customGame").then((value) => {
      let tp = this.state.testPrograms;
      tp['Custom Game'] = value;
      this.setState({testPrograms:tp});
    })
  } 

  render() {

    console.log('render');
    const { navigate } = this.props.navigation;
    
    return <View>
      {Object.keys(this.state.testPrograms).map((key) => {
        return <Button
          key={'gameButton.'+key}
          title={key}
          onPress={() => navigate('Game', { code: this.state.testPrograms[key] })}
        />
      })}
    </View>
  }
}