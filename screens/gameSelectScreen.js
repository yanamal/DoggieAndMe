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
        screentap: 'tap -> feed()',
        turtletap: `
          st()
          sizePicker = new DifficultyPicker 20, 1
          onRoundStart ->
            setSize sizePicker.pick()
          turtle.tap ->
            feed()
            moveto random position
        `,
        tapblue:`
          speed Infinity
          boxSize = max(totalWidth, totalHeight)/2
          boxCenters = [
            [-boxSize/2, -boxSize/2]
            [-boxSize/2, boxSize/2]
            [boxSize/2, boxSize/2]
            [boxSize/2, -boxSize/2]
          ]
          boxColors = [black, yellow, white, blue]

          # set up box size difficulty:
          # a box 3 times the normal size will take up the whole screen, so we will make that the easiest size.
          # the hardest size is the "regular" size.
          sizePicker = new DifficultyPicker boxSize*3, boxSize

          onRoundStart ->
            cg()
            # pick a size for the blue box, based on difficulty:
            blueBoxSize = sizePicker.pick()
            shuffle boxCenters
            for i in [0..3]
              moveto boxCenters[i]
              if boxColors[i] == blue
                # if this is a blue box, use our special size
                box boxColors[i], blueBoxSize
              else
                # if it's not a blue box, use the regular box size
                box boxColors[i], boxSize
            
          # on tap, see if the tap was on blue. if yes, feed the dog!
          tap ->
            if lasttap.touches blue
              feed()
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