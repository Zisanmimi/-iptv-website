document.addEventListener("DOMContentLoaded", function() {
    const m3uFile = "m3u/channels.m3u"; // Path to the M3U file
    const videoElement = document.getElementById("iptv-video");

    fetch(m3uFile)
        .then(response => {
            if (!response.ok) {
                console.error("Failed to fetch M3U file:", response.status);
                return;
            }
            return response.text();
        })
        .then(data => {
            if (!data) {
                console.error("No data received from M3U file.");
                return;
            }
            
            const lines = data.split("\n");
            const videoUrls = [];
            const videoTitles = [];
            const videoLogos = [];

            // Parsing M3U file
            lines.forEach(line => {
                if (line.startsWith("http")) {
                    videoUrls.push(line.trim());
                } else if (line.startsWith("#EXTINF")) {
                    const titleMatch = line.match(/,([^,]+)$/);
                    const logoMatch = line.match(/tvg-logo="([^"]+)"/);

                    if (titleMatch) {
                        videoTitles.push(titleMatch[1].trim());
                    }
                    if (logoMatch) {
                        videoLogos.push(logoMatch[1].trim());
                    }
                }
            });

            console.log("Parsed Video URLs:", videoUrls);
            console.log("Parsed Video Titles:", videoTitles);
            console.log("Parsed Video Logos:", videoLogos);

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

                // Optionally, create a playlist UI with logos and titles
                const playlist = document.createElement("ul");
                videoTitles.forEach((title, index) => {
                    const listItem = document.createElement("li");
                    const logo = videoLogos[index] ? `<img src="${videoLogos[index]}" alt="${title}" width="30" height="30">` : "";
                    listItem.innerHTML = `<a href="#" onclick="changeVideo(${index})">${logo} ${title}</a>`;
                    playlist.appendChild(listItem);
                });

                document.body.appendChild(playlist);
            } else {
                console.error("No valid video URLs found in the M3U file.");
            }
        })
        .catch(error => {
            console.error("Error fetching M3U file:", error);
        });

    // Change video function for playlist interaction
    function changeVideo(index) {
        const videoElement = document.getElementById("iptv-video");
        videoElement.innerHTML = `<source src="${videoUrls[index]}" type="video/mp4">`;

        flowplayer("#video-player", {
            clip: {
                sources: [
                    { type: "video/mp4", src: videoUrls[index] }
                ],
                autoPlay: true
            }
        });
    }
});
