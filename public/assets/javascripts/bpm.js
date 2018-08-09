
var bpm = function (options) {
  if (!(this instanceof bpm)) {
    return new bpm(options);
  }

  bpm._ = this;
  Object.assign(this, options || {}, bpm._defaults);
  bpm.reset();
}

bpm._defaults = {
  tempo: 120,
  fps: 4,
  baseDuration: 1,
  numerator: 4,
  denominator: 4
};

bpm.reset = function() {
  var instance = bpm._;
  instance._intervalId = null;
  instance._lastTimestamp = null;
  instance._tickAmount = ((1000 * 60) / instance.tempo) / instance.baseDuration;
  instance._elaspedTime = 0;
  instance._eventListeners = {};
  instance._currentNumerator = 0;
  instance._currentMeasure = 0;
};

bpm.start = function() {
  var instance = bpm._;
  instance._intervalId = setInterval(function() {
    bpm._update();
  }, this.fps);
};

bpm.stop = function() {
  var instance = bpm._;
  clearInterval(instance._intervalId);
  bpm.reset();
};

bpm.on = function(eventType, callback) {
  var instance = bpm._;
  if (!instance._eventListeners[eventType]) {
    instance._eventListeners[eventType] = [];
  }
  var listeners = instance._eventListeners[eventType];
  listeners.push(callback);
};

bpm._update = function() {
  var instance = bpm._;
  var currentTimestamp = Date.now();
  if (!instance._lastTimestamp) {
    instance._lastTimestamp = currentTimestamp;
    return;
  }
  var delta = currentTimestamp - instance._lastTimestamp;
  instance._elaspedTime += delta;
  if (instance._elaspedTime >= instance._tickAmount) {
    bpm._fire();
    instance._elaspedTime = 0;
  }
  instance._lastTimestamp = currentTimestamp;
};

bpm._fire = function() {
  var instance = bpm._;
  if (instance._currentNumerator === instance.denominator) {
    instance._currentNumerator = 0;
    instance._currentMeasure += 1;
  }
  instance._currentNumerator += 1;
  instance._eventListeners.quarter.forEach(function(callback) {
    callback();
  });
};
