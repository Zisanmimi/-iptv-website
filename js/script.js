document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("category");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const channelList = document.getElementById("channel-list");
    
    const channels = [
        { name: "7S Music", logo: "https://i.imgur.com/zDiIhdN.png", url: "http://103.199.161.254/Content/7smusic/Live/Channel(7smusic)/index.m3u8", category: "Music" },
        { name: "9X Jalwa", logo: "https://i.imgur.com/qubgOi5.png", url: "https://amg01281-9xmediapvtltd-9xjalwa-samsungin-goszf.amagi.tv/playlist/amg01281-9xmediapvtltd-9xjalwa-samsungin/playlist.m3u8", category: "Music" },
        { name: "Aaj Tak", logo: "https://i.imgur.com/RpIdCB3.png", url: "https://aajtaklive-amd.akamaized.net/hls/live/2014416/aajtak/aajtaklive/live_404p/chunks.m3u8", category: "News" },
        { name: "BTV National", logo: "https://i.imgur.com/5OE2FDt.png", url: "https://www.btvlive.gov.bd/streams/ef8b8bbc-98b7-4ba7-a49d-a0adaf259d35/ES/355ba051-9a60-48aa-adcf-5a6c64da8c5c/355ba051-9a60-48aa-adcf-5a6c64da8c5c_3_playlist.m3u8", category: "General" }
        // Add more channels here
    ];

    function displayChannels() {
        channelList.innerHTML = "";
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        channels
            .filter(channel =>
                (channel.name.toLowerCase().includes(searchTerm) || searchTerm === "") &&
                (selectedCategory === "All" || channel.category === selectedCategory)
            )
            .forEach(channel => {
                const channelItem = document.createElement("div");
                channelItem.classList.add("channel");

                channelItem.innerHTML = `
                    <img src="${channel.logo}" alt="${channel.name}" class="channel-logo">
                    <div class="channel-info">
                        <h3>${channel.name}</h3>
                        <p>Category: ${channel.category}</p>
                        <a href="${channel.url}" target="_blank">Watch Now</a>
                    </div>
                `;

                channelList.appendChild(channelItem);
            });
    }

    searchInput.addEventListener("input", displayChannels);
    categoryFilter.addEventListener("change", displayChannels);
    
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    displayChannels(); // Initial render
});
