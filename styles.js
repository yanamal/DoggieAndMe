import { StyleSheet, Dimensions } from 'react-native';

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  fullscreen: {
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: 'powderblue',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});