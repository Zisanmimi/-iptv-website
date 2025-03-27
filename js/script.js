document.addEventListener("DOMContentLoaded", () => {
    const channelList = document.getElementById("channelList");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("categoryFilter");
    const videoPlayer = document.getElementById("videoPlayer");
    const video = document.getElementById("video");
    const closePlayer = document.getElementById("closePlayer");
    const toggleTheme = document.getElementById("toggleTheme");

    let channels = [];
    let hls;  // Store Hls.js instance globally

    async function loadChannels() {
        try {
            const response = await fetch("m3u/channels.m3u");
            const text = await response.text();
            parseM3U(text);
        } catch (error) {
            console.error("Failed to load channels:", error);
            alert("Error loading channel list. Please try again later.");
        }
    }

    function parseM3U(data) {
        const lines = data.split("\n");
        let currentChannel = {};

        lines.forEach(line => {
            if (line.startsWith("#EXTINF")) {
                const match = line.match(/tvg-logo="(.*?)".*?group-title="(.*?)",(.*)/);
                if (match) {
                    currentChannel = {
                        logo: match[1],
                        category: match[2],
                        name: match[3]
                    };
                }
            } else if (line.startsWith("http")) {
                currentChannel.url = line.trim();
                channels.push(currentChannel);
            }
        });

        displayChannels();
    }

    function displayChannels() {
        channelList.innerHTML = "";
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filteredChannels = channels.filter(channel => 
            (channel.name.toLowerCase().includes(searchTerm)) &&
            (selectedCategory === "All" || channel.category === selectedCategory)
        );

        filteredChannels.forEach(channel => {
            const div = document.createElement("div");
            div.classList.add("channel");
            div.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}">
                <h3>${channel.name}</h3>
                <button onclick="playStream('${channel.url}')">Play</button>
            `;
            channelList.appendChild(div);
        });
    }

    window.playStream = (url) => {
        videoPlayer.classList.remove("hidden");

        if (hls) {
            hls.destroy(); // Destroy any existing Hls.js instance
        }

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS.js error:", data);
                alert("Stream error! Try another channel.");
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play();
        } else {
            alert("Your browser does not support this video format.");
        }
    };

    closePlayer.addEventListener("click", () => {
        videoPlayer.classList.add("hidden");
        
        if (hls) {
            hls.destroy(); // Properly clean up Hls.js
            hls = null;
        }
        
        video.pause();
        video.src = "";
    });

    searchInput.addEventListener("input", displayChannels);
    categoryFilter.addEventListener("change", displayChannels);

    toggleTheme.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    loadChannels();
});
