// Emoji bay (không delay, tối ưu RAM: giới hạn 15 emoji, remove nhanh)
const emojis = ['🎉','🎊','🎂','🥳','🎈','🎁','🍰','✨','🎆','🎇','🎀','🍭','🎁','🥂'];
let activeEmojis = 0;
const MAX_EMOJIS = 15;

document.body.addEventListener('click', e => {
    if (e.target.id === 'musicBtn' || e.target.id === 'memoryBtn' || e.target.id === 'closeMemory') return;

    if (activeEmojis >= MAX_EMOJIS) return;

    const el = document.createElement('div');
    el.classList.add('fly-emoji');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
    document.body.appendChild(el);
    activeEmojis++;

    setTimeout(() => {
        if (el.parentNode) el.remove();
        activeEmojis--;
    }, 1800);
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

// Nút xem kỉ niệm + nút đóng
const memoryBtn = document.getElementById('memoryBtn');
const memorySection = document.getElementById('memorySection');
const closeMemory = document.getElementById('closeMemory');

memoryBtn.addEventListener('click', e => {
    e.stopPropagation();
    memorySection.style.display = 'block';
    memoryBtn.style.display = 'none';
});

closeMemory.addEventListener('click', e => {
    e.stopPropagation();
    memorySection.style.display = 'none';
    memoryBtn.style.display = 'block';
});

// Countdown chuẩn đến 20:00 ngày 26/02 năm tới (tính từ 2009)
const now = new Date();
let nextBirthday = new Date(now.getFullYear(), 1, 26, 20, 0, 0); // Tháng 2 index 1

if (now > nextBirthday) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
}

const countdownEl = document.getElementById('countdown');
const celebrationEl = document.getElementById('celebration');
const fireworksEl = document.getElementById('fireworks');

let lastSecond = 0;

function updateCountdown() {
    const currentSecond = Math.floor(Date.now() / 1000);
    if (currentSecond === lastSecond) {
        requestAnimationFrame(updateCountdown);
        return;
    }
    lastSecond = currentSecond;

    const diff = nextBirthday - Date.now();

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

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    requestAnimationFrame(updateCountdown);
}

requestAnimationFrame(updateCountdown);
