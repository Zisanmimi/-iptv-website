document.addEventListener("DOMContentLoaded", function () {
    const channelList = document.getElementById("channel-list");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("category");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    async function loadM3U() {
        try {
            const response = await fetch("playlist.m3u"); // Load M3U file
            const text = await response.text();
            const channels = parseM3U(text);
            displayChannels(channels);
        } catch (error) {
            console.error("Error loading M3U:", error);
        }
    }

    function parseM3U(m3uText) {
        const lines = m3uText.split("\n");
        const channels = [];
        let currentChannel = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith("#EXTINF")) {
                const regex = /#EXTINF:-1 tvg-id="([^"]+)" tvg-logo="([^"]+)" group-title="([^"]+)",(.+)/;
                const match = line.match(regex);
                if (match) {
                    currentChannel = {
                        id: match[1],
                        logo: match[2],
                        category: match[3],
                        name: match[4],
                    };
                }
            } else if (line.startsWith("http")) {
                currentChannel.url = line;
                channels.push(currentChannel);
            }
        });

        return channels;
    }

    function displayChannels(channels) {
        channelList.innerHTML = "";
        channels.forEach(channel => {
            const channelItem = document.createElement("div");
            channelItem.classList.add("channel-item");

            channelItem.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}">
                <div class="channel-info">
                    <h3>${channel.name}</h3>
                    <p>Category: ${channel.category}</p>
                    <a href="${channel.url}" target="_blank">Watch Now</a>
                </div>
            `;

            channelList.appendChild(channelItem);
        });
    }

    searchInput.addEventListener("input", function () {
        const filterText = searchInput.value.toLowerCase();
        const filteredChannels = channels.filter(channel => 
            channel.name.toLowerCase().includes(filterText)
        );
        displayChannels(filteredChannels);
    });

    categoryFilter.addEventListener("change", function () {
        const selectedCategory = categoryFilter.value;
        const filteredChannels = selectedCategory === "All" 
            ? channels 
            : channels.filter(channel => channel.category === selectedCategory);
        displayChannels(filteredChannels);
    });

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    loadM3U();
});
