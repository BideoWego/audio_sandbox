window.onload = function() {
  var kick = document.getElementById('kick');
  var snare = document.getElementById('snare');
  var hh = document.getElementById('hh');
  var beat = document.getElementById('beat');
  var measure = document.getElementById('measure');
  var playBtn = document.getElementById('play');
  var stopBtn = document.getElementById('stop');
  var toggleAudioBtn = document.getElementById('toggle-audio');
  var toggleCounterBtn = document.getElementById('toggle-counter');
  var audio = document.getElementById('audio');
  var counter = document.getElementById('counter');
  var isShowingCounter = true;

  playBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!bpm.isPlaying) {
      bpm.start();
    }
    return false;
  });

  stopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (bpm.isPlaying) {
      bpm.stop();
      beat.innerHTML = 0;
      measure.innerHTML = 0;
    }
    return false;
  });

  toggleAudioBtn.addEventListener('click', function(e) {
    e.preventDefault();
    audio.style.display = audio.style.display === 'none' ? 'block' : 'none';
    return false;
  });

  toggleCounterBtn.addEventListener('click', function(e) {
    e.preventDefault();
    counter.style.display = counter.style.display === 'none' ? 'block' : 'none';
    isShowingCounter = !isShowingCounter;
    stopBtn.click();
    return false;
  });

  bpm({ baseDuration: 0.5 });

  bpm.on('beat', function(n, m) {
    if (n === Math.floor(n)) {
      kick.currentTime = 0;
      kick.play();
    }

    if (m > 3 && (n === 1 || n === 3)) {
      snare.currentTime = 0;
      snare.play();
    }

    if (m > 1 && n !== Math.floor(n)) {
      hh.currentTime = 0;
      hh.play();
    }

    if (isShowingCounter) {
      beat.innerHTML = n;
      measure.innerHTML = m;
    }
  });
};
