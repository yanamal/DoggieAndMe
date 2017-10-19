Doggie and Me is (will be) a mobile app which interacts with a PetTutor or other LightBlue Bean device, and allows you to use and/or write custom treat-dispensing apps!

Current state - Skeleton functionality:
- The app has a built-in webview, which in turn has the jquery-turtle library and CoffeeScript enabled.
- it is possible to write custom short programs (by editing index.html) in CoffeeScript (or JavaScript) that use jquery-turtle functionality. Some example programs (in CoffeeScript) are at the top of gameScreen.js
  - Immediately-useful jquery-turtle functions include:
    - ```click(callback)``` - register a callback for click events
    - ```st()``` - show the turtle (I hide it by default)
  - There is also a small but functional custom DoggieAndMe API: 
    - ```feed()```<sup>1</sup>
    - ```vibrate()```
    - ```setSize(newsise)``` - set the turtle's size (in multiples of canonical turtle size). jquery-turtle has a built-in ```grow``` function, but it is relative to current size, and thus not suitable for the current difficulty implementation.
    - ```onRoundStart(callback)``` - set callback for what to do when a round of the game starts (draw things, move turtle, etc.)
    - ```endRound()``` - end current round of the game without feeding (note: ```feed()``` also implicitly ends the round)
    - ```var x = new DifficultyPicker(easiest, hardest)``` - instantiate a new Difficulty picker: it uses light ML to adjust the particular numerical value based on how the dog did in the previous round: it starts with the ```easiest``` value, gets a baseline for how long it takes the dog to complete each round, then adjust the number between ```easiest``` and ```hardest``` to try and keep the round duration near the baseline continuously.
      - use ```x.pick()``` to actually pick a number, typically within the ```onRoundStart``` callback. Note: this only picks a new number once each round; subsequent calls within the same round return the same number.
- The webview is able to communicate with the app itself, and send and request information.
- the app cannot yet connect to or trigger a feeder - I will have to eject it from Create React Native and start using 'real' React Native before it can do that.
- Other things that require 'real' React Native:
  - full-screen mode (on android, at least) so that dogs can't accidentally back out of game
  - QR reader (to easily load new programs into memory, when that is useful)
  - (probably) using other device sensors, e.g. sound, accelerometer.
  - locking the device orientation so that it doesn't change during the game
  - drawing graphs/SVG graphics (e.g. graph of difficulty over time in a game session)


This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
The most recent version of the Create React Native App guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).

---
<sup>1</sup> Currently does not actually do much, except internal bookkeeping.