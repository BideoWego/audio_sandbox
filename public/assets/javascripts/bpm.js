
var bpm = function (options) {
  if (!(this instanceof bpm)) {
    return new bpm(options);
  }

  // TODO create options settings validations
  // For example, the user should not be able to set 0 for numberator nor
  // denominator
  // The user should not be able to set a numerator less than the denominator
  // The numerator and denominator must be integers etc...
  bpm._ = this;
  Object.assign(this, bpm._defaults, options || {});

  this._intervalId = null;
  this._lastTimestamp = null;
  this._tickAmount = ((1000 * 60) / this.tempo) * this.baseDuration;
  this._elaspedTime = 0;
  this._eventListeners = {};
  this._currentNumerator = 0;
  this._currentMeasure = 0;
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
  instance._elaspedTime = 0;
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

bpm.position = function() {
  // TODO make this a setter or getter
  var instance = bpm._;
  var n = instance._currentNumerator;
  var m = instance._currentMeasure;
  return { n: n, m: m };
};

bpm.addEventType = function(eventType, predicate) {
  // TODO add ability to define event types that will only fire if the
  // predicate method returns truthy
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
  var n = instance._currentNumerator;
  var m = instance._currentMeasure;
  bpm._emit('beat', n, m);
  instance._currentNumerator += 1 * instance.baseDuration;
};

bpm._emit = function(eventType, n, m) {
  var instance = bpm._;
  if (!instance._eventListeners[eventType]) {
    return;
  }
  instance._eventListeners[eventType].forEach(function(callback) {
    callback(n, m);
  });
};
