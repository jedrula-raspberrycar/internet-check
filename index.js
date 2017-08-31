const led = require('./led');
const isOnline = require('is-online');

led.setup(12).then(readyLed => {
    readyLed.setTurnedOffTime(100)
    readyLed.blinkContinuosly();
    setInterval(() => {
        isOnline().then(online => {
            console.log(online);
            if (online) {
                readyLed.setTurnedOffTime(3000);
            } else {
                readyLed.setTurnedOffTime(500);
            }
        });
    }, 3000)
})
