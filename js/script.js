document.addEventListener("DOMContentLoaded", () => {
    const channelList = document.getElementById("channelList");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("categoryFilter");
    const videoPlayer = document.getElementById("videoPlayer");
    const video = document.getElementById("video");
    const closePlayer = document.getElementById("closePlayer");
    const toggleTheme = document.getElementById("toggleTheme");

    let channels = [];

    async function loadChannels() {
        const response = await fetch("m3u/channels.m3u");
        const text = await response.text();
        parseM3U(text);
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
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else {
            video.src = url;
        }
    };

    closePlayer.addEventListener("click", () => {
        videoPlayer.classList.add("hidden");
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
document.addEventListener("DOMContentLoaded", function () {
    function playStream(url) {
        const video = document.getElementById("player");

        if (Hls.isSupported()) {
            let hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
        }

        video.play();
    }

    document.querySelectorAll(".play-button").forEach(button => {
        button.addEventListener("click", function () {
            const streamUrl = this.getAttribute("data-stream");
            playStream(streamUrl);
        });
    });
});
