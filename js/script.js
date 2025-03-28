document.addEventListener("DOMContentLoaded", function() {
    const m3uFile = "m3u/channels.m3u"; // Path to the M3U file
    const videoElement = document.getElementById("iptv-video");

    fetch(m3uFile)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const videoUrls = [];
            const videoTitles = [];

            // Parsing M3U file
            lines.forEach(line => {
                if (line.startsWith("http")) {
                    videoUrls.push(line.trim());
                } else if (line.startsWith("#EXTINF")) {
                    const titleMatch = line.match(/,([^,]+)$/);
                    if (titleMatch) {
                        videoTitles.push(titleMatch[1].trim());
                    }
                }
            });

            // Check if we have URLs to load
            if (videoUrls.length > 0) {
                // Set the first video URL as the source
                videoElement.innerHTML = `<source src="${videoUrls[0]}" type="video/mp4">`;

                // Initialize Flowplayer with the dynamic source
                flowplayer("#video-player", {
                    clip: {
                        sources: [
                            { type: "video/mp4", src: videoUrls[0] }
                        ],
                        autoPlay: true, // Auto play on load
                        autoBuffering: true // Enable buffering
                    },
                    plugins: {
                        controls: {
                            fullscreen: true,
                            mute: true,
                            volume: true
                        }
                    }
                });

                // Optionally, you can create a playlist UI
                const playlist = document.createElement("ul");
                videoTitles.forEach((title, index) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = title;
                    listItem.style.cursor = "pointer";
                    listItem.addEventListener("click", () => {
                        videoElement.innerHTML = `<source src="${videoUrls[index]}" type="video/mp4">`;
                        flowplayer("#video-player", {
                            clip: {
                                sources: [
                                    { type: "video/mp4", src: videoUrls[index] }
                                ]
                            }
                        });
                    });
                    playlist.appendChild(listItem);
                });
                document.body.appendChild(playlist);
            }
        })
        .catch(error => {
            console.error("Error loading M3U file:", error);
        });
});
