const track = document.getElementById("image-track");
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");

let loadedImages = 0;

function updateLoadingProgress() {
    loadedImages++;
    const progress = (loadedImages / 6) * 100; // Assuming there are 6 images
    loadingProgress.innerText = `${Math.round(progress)}%`;

    if (loadedImages === 6) {
        // All images are loaded, hide loading screen
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 500); // Delay hiding to allow smooth transition
    }
}

document.querySelectorAll(".image").forEach(img => {
    img.addEventListener("load", updateLoadingProgress);
    img.addEventListener("error", updateLoadingProgress); // Handle errors if images fail to load
});

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
    nextPercentage = Math.max(nextPercentage, -100);
    nextPercentage = Math.min(nextPercentage, 0);

    track.dataset.percentage = nextPercentage;

    track.style.transform = `translate(${nextPercentage}%, -50%)`;
}
