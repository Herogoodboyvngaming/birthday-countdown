// Emoji bay (debounce để tránh lag khi click nhanh)
const emojis = ['🎉','🎊','🎂','🥳','🎈','🎁','🍰','✨','🎆','🎇','🎀','🍭','🎁','🥂'];
let clickTimeout = null;

document.body.addEventListener('click', e => {
    if (e.target.id === 'musicBtn' || e.target.id === 'lyricsBtn' || e.target.id === 'memoryBtn') return;

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        const el = document.createElement('div');
        el.classList.add('fly-emoji');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }, 150);
});

// Nút bật/tắt nhạc
const musicBtn = document.getElementById('musicBtn');
const player = document.getElementById('youtubePlayer');
let isPlaying = false;

musicBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (isPlaying) {
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        musicBtn.textContent = '🎵 BẬT NHẠC NỀN 🎵';
        isPlaying = false;
    } else {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        musicBtn.textContent = '⏸ TẮT NHẠC NỀN';
        isPlaying = true;
    }
});

// Nút bật lyrics karaoke
const lyricsBtn = document.getElementById('lyricsBtn');
const karaokeBox = document.getElementById('karaokeBox');
const lyricsLines = document.getElementById('lyricsLines');

lyricsBtn.addEventListener('click', e => {
    e.stopPropagation();
    karaokeBox.style.display = 'block';
    lyricsBtn.style.display = 'none';
});

// Lyrics data
const lyricsData = [
    { text: "Ngày hôm nay ta cùng hân hoan nơi đây" },
    { text: "Mọi người bên nhau ta hát mừng sinh nhật" },
    { text: "1, 2, 3 ta cùng thổi tắt nến" },
    { text: "Happy Birthday, Happy Birthday to you" },
    { text: "On this day altogether will be" },
    { text: "And we'll all sing for your birthday" },
    { text: "One, two, three we blow up the candles" },
    { text: "Happy Birthday, Happy Birthday to you" },
    { text: "Chúc cho bạn luôn vui tươi" },
    { text: "Chúc cho bạn luôn thành công" },
    { text: "Chúc cho bạn luôn hạnh phúc" },
    { text: "Happy Birthday to you!" }
];

lyricsData.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line.text;
    lyricsLines.appendChild(p);
});

// Simple karaoke highlight (mỗi dòng 5s)
let currentLine = 0;
let karaokeInterval;

function startKaraoke() {
    currentLine = 0;
    const lines = lyricsLines.querySelectorAll('p');
    lines.forEach(p => p.classList.remove('active'));

    karaokeInterval = setInterval(() => {
        if (currentLine > 0) lines[currentLine - 1].classList.remove('active');
        if (currentLine < lines.length) {
            lines[currentLine].classList.add('active');
            currentLine++;
        } else {
            clearInterval(karaokeInterval);
        }
    }, 5000);
}

musicBtn.addEventListener('click', () => {
    if (isPlaying && karaokeBox.style.display === 'block') startKaraoke();
});

// Nút xem kỉ niệm
const memoryBtn = document.getElementById('memoryBtn');
const memorySection = document.getElementById('memorySection');

memoryBtn.addEventListener('click', e => {
    e.stopPropagation();
    memorySection.style.display = 'block';
    memoryBtn.style.display = 'none';
});

// Countdown mượt với throttle
const now = new Date();
let target = new Date(now.getFullYear(), 1, 26, 20, 0, 0);
if (now > target) target.setFullYear(now.getFullYear() + 1);

const countdownEl = document.getElementById('countdown');
const celebrationEl = document.getElementById('celebration');
const fireworksEl = document.getElementById('fireworks');

let lastUpdate = 0;

function updateCountdown(time) {
    if (time - lastUpdate < 1000) {
        requestAnimationFrame(updateCountdown);
        return;
    }
    lastUpdate = time;

    const diff = target - Date.now();

    if (diff <= 0) {
        countdownEl.style.opacity = '0';
        setTimeout(() => {
            countdownEl.style.display = 'none';
            celebrationEl.style.display = 'block';
            celebrationEl.style.opacity = '1';
            fireworksEl.classList.add('active');
            if (!isPlaying) {
                player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                musicBtn.textContent = '⏸ TẮT NHẠC NỀN';
                isPlaying = true;
            }
        }, 1200);
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    requestAnimationFrame(updateCountdown);
}

requestAnimationFrame(updateCountdown);
