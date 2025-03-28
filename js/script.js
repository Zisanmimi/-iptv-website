document.addEventListener("DOMContentLoaded", function () {
    const playerContainer = document.getElementById("videoPlayerContainer");
    const video = document.getElementById("player");
    const closeButton = document.getElementById("closePlayer");

    function playStream(streamUrl) {
        if (Hls.isSupported()) {
            let hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.addEventListener("loadedmetadata", function () {
                video.play();
            });
        }

        playerContainer.style.display = "block"; // Show player
    }

    // Event listener for Play buttons
    document.querySelectorAll(".playButton").forEach(button => {
        button.addEventListener("click", function () {
            let streamUrl = this.getAttribute("data-stream");
            playStream(streamUrl);
        });
    });

    // Close Player
    closeButton.addEventListener("click", function () {
        video.pause();
        video.src = "";
        playerContainer.style.display = "none"; // Hide player
    });

    // Search Functionality
    document.getElementById("search").addEventListener("input", function () {
        let searchText = this.value.toLowerCase();
        document.querySelectorAll
