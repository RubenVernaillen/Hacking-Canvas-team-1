// Geluid vanaf een online bron
const geluidUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_84e3ce5a0d.mp3?filename=mouse-click-153941.mp3";

document.querySelectorAll("h2").forEach(titel => {
    titel.addEventListener("click", () => {
        const audio = new Audio(geluidUrl);
        audio.play().catch(err => console.error("Kon audio niet afspelen:", err));
    });
});
