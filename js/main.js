const playBtn = document.getElementById("play-btn");
const playerCard = document.querySelector(".player-card");
const visualizer = document.getElementById("visualizer");
const trackTitle = document.querySelector(".track-title");
const trackArtist = document.querySelector(".track-artist");
const albumArt = document.getElementById("album-art");
const progressBar = document.querySelector(".progress-bar");

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

// UPDATE UI
function updatePlayerUI() {
  if (isPlaying) {
    audio.play();
    playerCard.classList.add("playing");
    visualizer.classList.add("active");
    playBtn.innerHTML = "&#9646;&#9646;";
    playBtn.setAttribute("aria-label", "Pause");
    // Add pulsing ring to play button
    playBtn.classList.add("pulsing");
  } else {
    audio.pause();
    playerCard.classList.remove("playing");
    visualizer.classList.remove("active");
    playBtn.innerHTML = "&#9654;";
    playBtn.setAttribute("aria-label", "Play");
    // Remove pulsing ring
    playBtn.classList.remove("pulsing");
  }
}

// SET SONG
function setCurrentSong(index) {
  document.querySelectorAll(".track-row").forEach(function (row) {
    row.classList.remove("active");
  });
  document.querySelectorAll(".track-row")[index].classList.add("active");

  currentIndex = index;
  currentSong = songs[currentIndex];

  albumArt.style.opacity = "0";
  setTimeout(function () {
    albumArt.style.opacity = "1";
  }, 400);

  audio.pause();
  audio.src = currentSong.audioSrc;
  audio.currentTime = 0;

  trackTitle.textContent = currentSong.title;
  trackArtist.textContent = currentSong.artist;
  albumArt.src = currentSong.albumArt;
  progressBar.style.width = "0%";

  if (isPlaying) {
    audio.play();
  }

  updatePlayerUI();
}

// PLAY / PAUSE BUTTON
playBtn.addEventListener("click", function () {
  isPlaying = !isPlaying;
  updatePlayerUI();
});

// PROGRESS BAR
audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    var percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + "%";
  }
});

// AUTO NEXT SONG
audio.addEventListener("ended", function () {
  var nextIndex = (currentIndex + 1) % songs.length;
  setCurrentSong(nextIndex);
});

// INITIAL SONG
setCurrentSong(0);

// SUBMIT BUTTON ANIMATION
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

// PREV / NEXT BUTTONS
var prevBtn = document.querySelector('[aria-label="Previous track"]');
var nextBtn = document.querySelector('[aria-label="Next track"]');

prevBtn.addEventListener("click", function () {
  var index = currentIndex - 1;
  if (index < 0) {
    index = songs.length - 1;
  }
  setCurrentSong(index);
  isPlaying = true;
  updatePlayerUI();
});

nextBtn.addEventListener("click", function () {
  var index = (currentIndex + 1) % songs.length;
  setCurrentSong(index);
  isPlaying = true;
  updatePlayerUI();
});

// Make track rows keyboard accessible
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

// Subscribe form submit
document
  .getElementById("subscribe-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleSubmit();
  });
