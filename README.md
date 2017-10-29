Doggie and Me is a mobile app which interacts with a PetTutor or other LightBlue Bean device, and allows you to use and/or write custom treat-dispensing apps!

# Current state - Basic functionality:
- Connect a PetTutor (or any LightBlue Bean device)
  - Can connect several at the same time to trigger all of them each time the right thing happens in the game
- Start an existing game, which will trigger a feed on each connected feeder whenever the "right thing" happens in the game.
  - Built-in games:
    - screentap: feed when anywhere on the screen is tapped
    - turtletap: feed when the turtle is tapped (turtle moves around and changes size, depending on difficulty)
    - bluetap: feed when the blue square is tapped (squares move around and the blue square changes size, depending on difficulty)
- Load a new game from the internet
  - scans a QR code, attempts to load a CoffeeScript game from the URL in the QR code.
    - assumes that the CoffeeScript game is using jquery-turtle plus some dog-specific functionality.
  - Intended to work with the Doggie And Me gym, which will soon be at http://doggieand.me (but is not deployed yet)
    - the github project for the gym is https://github.com/yanamal/doggym

# Future work:
- Graph dog performance (speed, difficulty, etc.)
- (doglib) Sound detection: feed (or don't feed) when the dog barks
- (doglib) react to accelerometer and other data (e.g. when the tablet/phone is moved)
- Somehow work with peripherals (e.g. smart clicker)
- Lots of other things!!


This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
The most recent version of the Create React Native App guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).

It uses CoffeeScript, jquery, and jquery-turtle.