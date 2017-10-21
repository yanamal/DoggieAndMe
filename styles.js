import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  fullscreen: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: 'powderblue'
  },
});