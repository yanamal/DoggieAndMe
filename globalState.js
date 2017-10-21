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
};