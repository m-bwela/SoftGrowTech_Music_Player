// ======== DOM ELEMENTS ==========================
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const playlistEl = document.getElementById('playlist');
const volumeDisplay = document.getElementById('volume-display');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

// ======== Songs Array ==========================
const songs = [
    {
        title: 'Chill Vibes',
        artist: 'Paulyudin Artist',
        src: 'assets/music/paulyudin-chill-silent-bloom-chill-481864.mp3',
        cover: 'assets/covers/paulyudin.jpg'
    },
    {
        title: 'Sweet Life',
        artist: 'Alex Grohl Artist',
        src: 'assets/music/alexgrohl-sweet-life-luxury-chill-438146.mp3',
        cover: 'assets/covers/en.jpeg'
    },
    {
        title: 'Summer Vibes',
        artist: 'Inplus music',
        src: 'assets/music/lnplusmusic-summer-beach-party-music-353701.mp3',
        cover: 'assets/covers/Inplusmusic.jpg'
    },
    {
        title: 'Tremox Beatz',
        artist: 'Chris Brown',
        src: 'assets/music/tremoxbeatz-free-acoustic-chris-brown-rnb-type-beat-for-love-by-tremoxbeatz-217527.mp3',
        cover: 'assets/covers/chrisbrown.jpg'
    },
    {
        title: 'Night Drive',
        artist: 'Night Phonk',
        src: 'assets/music/artissizm-night-phonk-203960.mp3',
        cover: 'assets/covers/night phonk.jpeg'
    },
    {
        title: 'Phonk Music',
        artist: 'RSNCE Phonk',
        src: 'assets/music/rsnce_phonk_music-aggressive-phonk-phonk-2025-mix-239735.mp3',
        cover: 'assets/covers/rsnce phonk.jpeg'
    },
    {
        title: 'Evening Glow',
        artist: 'Clavier Music',
        src: 'assets/music/clavier-music-evening-glow-soft-piano-music-243818.mp3',
        cover: 'assets/covers/clavier.jpg'
    },
    {
        title: 'Retro Lounge',
        artist: 'Brans Boynd',
        src: 'assets/music/bransboynd-retro-lounge-389644.mp3',
        cover: 'assets/covers/retro lounge.jpg'
    }
    
];

// ====== STATE =======
let currentSongIndex = 0;
let isPlaying = false;

// ====== Initialize ========
function init() {
    loadSong(currentSongIndex);
    renderPlaylist();
    audio.volume = volumeSlider.value / 100;
}

// ================= Load Song =================
function loadSong(index) {
    const song = songs[index];
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    updatePlaylistActive();
}

// ================= Play / Pause =================
function playSong() {
    isPlaying = true;
    audio.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}    

// ================= Previous / Next =================
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// ================= Progress Bar =================
function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }
}

function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ===== Volume Control =====
function setVolume() {
    audio.volume = volumeSlider.value / 100;
    volumeDisplay.textContent = volumeSlider.value;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volume = volumeSlider.value;
    if (volume == 0) {
        volumeIcon.classList.remove('fa-volume-down', 'fa-volume-up');
        volumeIcon.classList.add('fa-volume-mute');
    } else if (volume < 50) {
        volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-up');
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-down');
        volumeIcon.classList.add('fa-volume-up');
    }
}

// ===== Playlist =====
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="song-title">${song.title}</span>
            <span class="song-artist">${song.artist}</span>
        `;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
            // Close sidebar after click
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        });
        playlistEl.appendChild(li);
    });
    updatePlaylistActive();
}

function updatePlaylistActive() {
    const items = playlistEl.querySelectorAll('li');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// ====== Keyboard Shortcuts ======
function handleKeyboard(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            nextSong();
            break;
        case 'ArrowLeft':
            prevSong();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
            setVolume();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
            setVolume();
            break;
    }
}

// ===== Event Listeners ======
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
document.addEventListener('keydown', handleKeyboard);

// ====== Start ======
init();

// Sidebar toggle functionality
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        // Show close button only on mobile
        if (sidebarClose) {
            if (window.innerWidth <= 600) {
                sidebarClose.style.display = 'block';
            } else {
                sidebarClose.style.display = 'none';
            }
        }
    });
}

if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarClose.style.display = 'none';
    });
}