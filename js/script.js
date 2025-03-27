document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const channelList = document.getElementById("channelList");

    let channels = [];

    // Load M3U File
    async function loadM3U() {
        try {
            const response = await fetch("m3u/channels.m3u");
            const data = await response.text();
            parseM3U(data);
        } catch (error) {
            console.error("Error loading M3U file", error);
        }
    }

    // Parse M3U Content
    function parseM3U(m3uText) {
        const lines = m3uText.split("\n");
        let currentChannel = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith("#EXTINF")) {
                const match = line.match(/tvg-id="(.*?)".*?tvg-logo="(.*?)".*?group-title="(.*?)",(.*)/);
                if (match) {
                    currentChannel = {
                        id: match[1],
                        logo: match[2],
                        category: match[3],
                        name: match[4],
                    };
                }
            } else if (line && !line.startsWith("#")) {
                currentChannel.url = line;
                channels.push(currentChannel);
            }
        });

        displayChannels(channels);
    }

    // Display Channels
    function displayChannels(filteredChannels) {
        channelList.innerHTML = "";
        filteredChannels.forEach(channel => {
            const channelDiv = document.createElement("div");
            channelDiv.classList.add("channel");
            channelDiv.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}">
                <h3>${channel.name}</h3>
                <p>Category: ${channel.category}</p>
                <a href="${channel.url}" target="_blank">Watch Now</a>
            `;
            channelList.appendChild(channelDiv);
        });
    }

    // Search Function
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = channels.filter(channel =>
            channel.name.toLowerCase().includes(searchTerm)
        );
        displayChannels(filtered);
    });

    // Category Filter
    categoryFilter.addEventListener("change", function () {
        const selectedCategory = categoryFilter.value;
        const filtered = selectedCategory === "all"
            ? channels
            : channels.filter(channel => channel.category === selectedCategory);
        displayChannels(filtered);
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    // Load Channels
    loadM3U();
});
