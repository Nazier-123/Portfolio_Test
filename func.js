const track = document.getElementById("image-track");
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");

const images = document.querySelectorAll(".image");
const totalImages = images.length || 6; // fallback to 6 if none found
let loadedImages = 0;

// Use requestAnimationFrame to throttle transform updates for smoother performance.
let rafId = null;
let targetPercentage = 0;

function applyTransform() {
    track.style.transform = `translate(${targetPercentage}%, -50%)`;
    rafId = null;
}

function updateLoadingProgress() {
    loadedImages++;
    const progress = (loadedImages / totalImages) * 100;
    loadingProgress.innerText = `${Math.round(progress)}%`;

    if (loadedImages >= totalImages) {
        // All images are loaded, hide loading screen
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 500); // Delay hiding to allow smooth transition
    }
}

images.forEach(img => {
    img.addEventListener("load", updateLoadingProgress);
    img.addEventListener("error", updateLoadingProgress); // Handle errors if images fail to load
});

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    // Make sure prevPercentage reflects the current position (or 0)
    track.dataset.prevPercentage = track.dataset.percentage || "0";
}

window.onmousemove = e => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage || "0") + percentage;
    nextPercentage = Math.max(nextPercentage, -100);
    nextPercentage = Math.min(nextPercentage, 0);

    track.dataset.percentage = nextPercentage;
    targetPercentage = nextPercentage;

    if (!rafId) {
        rafId = requestAnimationFrame(applyTransform);
    }
}
