document.addEventListener("DOMContentLoaded", function () {
    const m3uFile = "m3u/channels.m3u"; // Path to the M3U file

    fetch(m3uFile)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const channels = [];
            let currentChannel = {};

            // Parse M3U file
            lines.forEach(line => {
                if (line.startsWith("#EXTINF")) {
                    const titleMatch = line.match(/,([^,]+)$/);
                    if (titleMatch) {
                        currentChannel.title = titleMatch[1].trim();
                    }

                    const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                    if (logoMatch) {
                        currentChannel.logo = logoMatch[1].trim();
                    }
                }

                if (line.startsWith("http")) {
                    currentChannel.url = line.trim();
                    channels.push(currentChannel);
                    currentChannel = {};
                }
            });

            // Display channels
            const channelListElement = document.getElementById("channel-list");

            channels.forEach(channel => {
                const listItem = document.createElement("li");

                const logoImg = channel.logo ? `<img src="${channel.logo}" alt="${channel.title}" width="30" height="30">` : '';
                listItem.innerHTML = `
                    ${logoImg}
                    <a href="#" onclick="playStream('${channel.url}'); return false;">${channel.title}</a>
                `;

                channelListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching M3U file:", error));
});

// Function to play the IPTV stream
function playStream(url) {
    const videoPlayer = document.getElementById("video-player");

    if (videoPlayer) {
        videoPlayer.src = url;
        videoPlayer.play();
    } else {
        console.error("Video player not found!");
    }
}
