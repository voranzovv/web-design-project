const playBtn = document.getElementById("play-btn");
const playerCard = document.querySelector(".player-card");
const visualizer = document.getElementById("visualizer");
const trackTitle = document.querySelector(".track-title");
const trackArtist = document.querySelector(".track-artist");
const albumArt = document.getElementById("album-art");
const progressBar = document.querySelector(".progress-bar");
const progressWrapper = document.querySelector(".progress-bar-wrapper");

const songs = [
  {
    title: "Azhage",
    artist: "Voranzov",
    audioSrc: "audios/azhage.mp3",
    albumArt: "images/album-art.jpg",
  },
  {
    title: "Nee",
    artist: "Voranzov",
    audioSrc: "audios/nee.mp3",
    albumArt: "images/nee.jpg",
  },
  {
    title: "Thuli Thuli",
    artist: "Voranzov",
    audioSrc: "audios/Thuli.mp3",
    albumArt: "images/thuli.png",
  },
  {
    title: "Thangame",
    artist: "Voranzov",
    audioSrc: "audios/thangame.mp3",
    albumArt: "images/thangame.jpeg",
  },
  {
    title: "Ninaivugale",
    artist: "Voranzov",
    audioSrc: "audios/Ninaivugale.mp3",
    albumArt: "images/ninaivugale.jpg",
  },
];

let currentIndex = 0;
let currentSong = songs[currentIndex];
const audio = new Audio(currentSong.audioSrc);
let isPlaying = false;

// ripple effect
function spawnRipple(btn, event) {
  var ripple = document.createElement("span");
  ripple.classList.add("ripple");

  var rect = btn.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height);
  var x = event.clientX - rect.left - size / 2;
  var y = event.clientY - rect.top - size / 2;

  ripple.style.width = size + "px";
  ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";

  btn.appendChild(ripple);

  /* Remove after animation */
  setTimeout(function () {
    ripple.remove();
  }, 600);
}

// update ui - play or pause
function updatePlayerUI() {
  if (isPlaying) {
    audio.play();
    playerCard.classList.add("playing");
    visualizer.classList.add("active");
    playBtn.innerHTML = "&#9646;&#9646;";
    playBtn.setAttribute("aria-label", "Pause");
    /* Dual pulse rings */
    playBtn.classList.add("pulsing");
  } else {
    audio.pause();
    playerCard.classList.remove("playing");
    visualizer.classList.remove("active");
    playBtn.innerHTML = "&#9654;";
    playBtn.setAttribute("aria-label", "Play");
    playBtn.classList.remove("pulsing");
  }
}

// set song
function setCurrentSong(index) {
  document.querySelectorAll(".track-row").forEach(function (row) {
    row.classList.remove("active");
  });
  document.querySelectorAll(".track-row")[index].classList.add("active");

  currentIndex = index;
  currentSong = songs[currentIndex];

  /* Fade album art during swap */
  albumArt.style.opacity = "0";
  setTimeout(function () {
    albumArt.src = currentSong.albumArt;
    albumArt.style.opacity = "1";
  }, 400);

  audio.pause();
  audio.src = currentSong.audioSrc;
  audio.currentTime = 0;

  trackTitle.textContent = currentSong.title;
  trackArtist.textContent = currentSong.artist;
  progressBar.style.width = "0%";
  progressWrapper.classList.remove("progress-active");

  if (isPlaying) {
    audio.play();
  }

  updatePlayerUI();
}

// play / pause button
playBtn.addEventListener("click", function (e) {
  spawnRipple(playBtn, e);
  isPlaying = !isPlaying;
  updatePlayerUI();
});

// prograss bar
audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    var percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + "%";
    /* Show glowing dot once bar has moved */
    if (percent > 1) {
      progressWrapper.classList.add("progress-active");
    }
  }
});

// next song
audio.addEventListener("ended", function () {
  var nextIndex = (currentIndex + 1) % songs.length;
  setCurrentSong(nextIndex);
});

// set first song
setCurrentSong(0);

// previus and next buttons
var prevBtn = document.querySelector('[aria-label="Previous track"]');
var nextBtn = document.querySelector('[aria-label="Next track"]');

prevBtn.addEventListener("click", function (e) {
  spawnRipple(prevBtn, e);
  var index = currentIndex - 1;
  if (index < 0) {
    index = songs.length - 1;
  }
  setCurrentSong(index);
  isPlaying = true;
  updatePlayerUI();
});

nextBtn.addEventListener("click", function (e) {
  spawnRipple(nextBtn, e);
  var index = (currentIndex + 1) % songs.length;
  setCurrentSong(index);
  isPlaying = true;
  updatePlayerUI();
});

// keyboard mouse control
document.querySelectorAll(".track-row").forEach(function (row, index) {
  row.setAttribute("tabindex", "0");
  row.setAttribute("role", "button");
  row.setAttribute("aria-label", "Play " + songs[index].title);

  row.addEventListener("click", function () {
    setCurrentSong(index);
    isPlaying = true;
    updatePlayerUI();
  });

  row.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCurrentSong(index);
      isPlaying = true;
      updatePlayerUI();
    }
  });
});

// subscribe from
function handleSubmit() {
  var submitBtn = document.getElementById("submit-btn");
  var btnLabel = submitBtn.querySelector(".btn-label");

  submitBtn.classList.add("submitted");
  submitBtn.disabled = true;

  setTimeout(function () {
    btnLabel.textContent = "Sent!";
    submitBtn.classList.remove("submitted");
    btnLabel.style.opacity = "1";
  }, 900);
}

document
  .getElementById("subscribe-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleSubmit();
  });
