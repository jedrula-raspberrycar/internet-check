const gpio = require('rpi-gpio');


function setupWritePin(pin) {
  return new Promise((resolve, reject ) => {
    gpio.setup(pin, gpio.DIR_OUT, resolve);
  });
}

function writeToPin(pin, val) {
  return new Promise((resolve, reject ) => {
    gpio.write(pin, val, resolve);
  });
}

function resolveInTimeout(timeout) {
  return new Promise((resolve, reject ) => {
    setTimeout(resolve, timeout);
  });
}

function resolveInHalfSecond() {
  return resolveInTimeout(500);
}

function blinkOnce(pin) {
  return writeToPin(pin, true).then(resolveInHalfSecond).then(() => writeToPin(pin, false));
}

function readyLed(pin) {
  function getTurnedOffTime() {
    return turnedOffTime;
  }
  function setTurnedOffTime(newTurnedOffTime) {
    turnedOffTime = newTurnedOffTime;
  }
  let mode;
  function blinkContinuosly(newTurnedOffTime) {
    return blinkOnce(pin).then(() => resolveInTimeout(getTurnedOffTime()).then(() => blinkContinuosly(getTurnedOffTime())));
  }
  const led = {
    blinkOnce() {
      return blinkOnce(pin);
    },
    blinkContinuosly,
    setTurnedOffTime
  };
  return led;
}

module.exports = {
  setup(pin) {
    let ready = false;
    return setupWritePin(pin).then(() => {
      ready = true;
      return readyLed(pin)
    })
  },
}
