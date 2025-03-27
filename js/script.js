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
    channels.forEach(channel => {
        const div = document.createElement("div");
        div.classList.add("channel");
        div.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            <h3>${channel.name}</h3>
            <button class="playButton" data-url="${channel.url}">Play</button>
        `;
        channelList.appendChild(div);
    });

    // Attach event listeners to buttons
    document.querySelectorAll(".playButton").forEach(button => {
        button.addEventListener("click", function() {
            const url = this.getAttribute("data-url");
            playStream(url);
        });
    });
    }

    window.playStream = (url) => {
    console.log("Opening Stream:", url);
    const videoFrame = document.getElementById("videoFrame");
    const videoPlayer = document.getElementById("videoPlayer");

    videoFrame.src = url;  // Set stream URL in iframe
    videoPlayer.classList.remove("hidden"); // Show player
};

// Close button functionality
document.getElementById("closePlayer").addEventListener("click", () => {
    document.getElementById("videoPlayer").classList.add("hidden");
    document.getElementById("videoFrame").src = ""; // Stop the stream
});

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
