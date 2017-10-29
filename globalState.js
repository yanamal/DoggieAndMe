// @flow

// screw your paradigms, I just want a bit of mostly-static global data.

export default class GlobalState {
  static connectedBles = {};
  
  static beanConsts = { // UUIDs of the serial/scratch service/characteristic on a LightBlue Bean device
    serial_service_UUID: 'a495ff10-c5b1-4b44-b512-1370f02d74de',
    scratch_service_UUID: 'a495ff20-c5b1-4b44-b512-1370f02d74de',
    serial_UUID: 'a495ff11-c5b1-4b44-b512-1370f02d74de',
    scratch_UUID: 'a495ff25-c5b1-4b44-b512-1370f02d74de'
  };

  static starterGames = {
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