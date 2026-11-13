const scenes = [
    document.getElementById("scene1"),
    document.getElementById("scene2"),
    document.getElementById("scene3"),
    document.getElementById("scene4"),
    document.getElementById("scene5"),
    document.getElementById("scene6")
];

const audio = document.getElementById("trainAudio");
const progressBar = document.getElementById("progressBar");

const playBtn = document.getElementById("playBtn");
const soundBtn = document.getElementById("soundBtn");

let currentScene = 0;
let elapsed = 0;
let paused = false;
let muted = false;
let lastTime = performance.now();

const sceneDuration = 12;
const totalDuration = scenes.length * sceneDuration;

function showScene(index) {
    scenes.forEach(scene => {
        scene.classList.remove("active");
    });

    scenes[index].classList.add("active");
    currentScene = index;

    if (index === 0) {
        const train = document.querySelector(".arriving");
        train.style.animation = "none";
        void train.offsetWidth;
        train.style.animation = "arrive 8s forwards";
    }

    if (index === 3 || index === 4) {
        const hearts = document.querySelector(".hearts");
        if (hearts) {
            hearts.style.animation = "heartFloat 3s infinite";
        }
    }
}

function togglePlayback() {
    paused = !paused;

    document.body.classList.toggle("paused", paused);

    if (paused) {
        audio.pause();
        playBtn.innerText = "▶ Play";
    } else {
        lastTime = performance.now();
        playBtn.innerText = "❚❚ Pause";

        if (!muted) {
            audio.play().catch(() => {});
        }
    }
}

function toggleSound() {
    muted = !muted;

    audio.muted = muted;

    soundBtn.innerText = muted
        ? "🔇 Sound Off"
        : "🔊 Sound On";

    if (!muted && !paused) {
        audio.play().catch(() => {});
    }
}

function restartStory() {
    elapsed = 0;
    lastTime = performance.now();

    document.body.classList.remove("paused");
    paused = false;

    playBtn.innerText = "❚❚ Pause";

    audio.currentTime = 0;

    showScene(0);

    if (!muted) {
        audio.play().catch(() => {});
    }
}

function animate(now) {
    if (!paused) {
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        elapsed += delta;

        let sceneIndex = Math.min(
            Math.floor(elapsed / sceneDuration),
            scenes.length - 1
        );

        if (sceneIndex !== currentScene) {
            showScene(sceneIndex);
        }

        progressBar.style.width =
            Math.min((elapsed / totalDuration) * 100, 100) + "%";

        if (elapsed >= totalDuration) {
            elapsed = totalDuration;
            paused = true;

            document.body.classList.add("paused");
            audio.pause();

            playBtn.innerText = "▶ Play";
        }
    }

    lastTime = now;
    requestAnimationFrame(animate);
}

// Create stars for the night scenes
const starsContainer = document.getElementById("stars");

for (let i = 0; i < 70; i++) {
    const star = document.createElement("div");

    star.className = "star";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 65 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";

    starsContainer.appendChild(star);
}

// Audio starts after user interaction because
// browsers restrict automatic audio playback.
document.addEventListener("click", function startAudio() {
    if (!muted && !paused) {
        audio.play().catch(() => {});
    }
}, { once: true });

// Start the animation
showScene(0);
requestAnimationFrame(animate);
