document.addEventListener("DOMContentLoaded", () => {
  // NCDownload - funções principais

  const audio = new Audio();
  let currentTrack = null;
  let isPlaying = false;

  // Dados de demonstração
  const demoTrack = {
    title: "NC Original",
    artist: "NCDownload",
    file: "audio/nc-demo.wav"
  };

  // -----------------------------
  // PLAYER
  // -----------------------------

  function playTrack(track = demoTrack) {
    currentTrack = track;

    if (audio.src !== new URL(track.file, window.location.href).href) {
      audio.src = track.file;
    }

    audio.play()
      .then(() => {
        isPlaying = true;
        updatePlayerButtons();
      })
      .catch(() => {
        console.log("Áudio de demonstração ainda não disponível.");
      });

    updatePlayerInfo(track);
  }

  function togglePlay() {
    if (!audio.src) {
      playTrack();
      return;
    }

    if (audio.paused) {
      audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }

    updatePlayerButtons();
  }

  function updatePlayerInfo(track) {
    document.querySelectorAll(
      "#player-title, .player-title, [data-player-title]"
    ).forEach(el => {
      el.textContent = track.title;
    });

    document.querySelectorAll(
      "#player-artist, .player-artist, [data-player-artist]"
    ).forEach(el => {
      el.textContent = track.artist;
    });
  }

  function updatePlayerButtons() {
    document.querySelectorAll(
      "#play-button, .play-button, [data-play]"
    ).forEach(button => {
      button.textContent = isPlaying ? "❚❚" : "▶";
    });
  }

  audio.addEventListener("timeupdate", () => {
    const progress = audio.duration
      ? (audio.currentTime / audio.duration) * 100
      : 0;

    document.querySelectorAll(
      "#progress, .progress, [data-progress]"
    ).forEach(el => {
      if ("value" in el) el.value = progress;
      else el.style.width = progress + "%";
    });
  });

  audio.addEventListener("ended", () => {
    isPlaying = false;
    updatePlayerButtons();
  });

  // -----------------------------
  // BOTÕES DE PLAY
  // -----------------------------

  document.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-play], .play-button, #play-button"
    );

    if (button) {
      event.preventDefault();
      togglePlay();
    }
  });

  // -----------------------------
  // FAVORITOS
  // -----------------------------

  let favorites = JSON.parse(
    localStorage.getItem("ncFavorites") || "[]"
  );

  document.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-favorite], .favorite-button"
    );

    if (!button) return;

    event.preventDefault();

    const name =
      button.dataset.favorite ||
      button.closest("[data-track]")?.dataset.track ||
      "NC Original";

    if (favorites.includes(name)) {
      favorites = favorites.filter(item => item !== name);
      button.textContent = "♡";
    } else {
      favorites.push(name);
      button.textContent = "♥";
    }

    localStorage.setItem(
      "ncFavorites",
      JSON.stringify(favorites)
    );
  });

  // -----------------------------
  // DOWNLOADS
  // -----------------------------

  let downloads = JSON.parse(
    localStorage.getItem("ncDownloads") || "[]"
  );

  document.addEventListener("click", event => {
    const button = event.target.closest(
      "[data-download], .download-button"
    );

    if (!button) return;

    event.preventDefault();

    const
