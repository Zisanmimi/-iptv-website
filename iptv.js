document.addEventListener("DOMContentLoaded", function() {
    const m3uFile = "m3u/channels.m3u"; // Path to the M3U file

    fetch(m3uFile)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const channels = [];
            let currentChannel = {};

            // Parsing M3U file to extract channel details
            lines.forEach(line => {
                if (line.startsWith("#EXTINF")) {
                    // Extract channel title
                    const titleMatch = line.match(/,([^,]+)$/);
                    if (titleMatch) {
                        currentChannel.title = titleMatch[1].trim();
                    }

                    // Extract logo URL
                    const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                    if (logoMatch) {
                        currentChannel.logo = logoMatch[1].trim();
                    }
                }

                // Check for video URL
                if (line.startsWith("http")) {
                    currentChannel.url = line.trim();
                    channels.push(currentChannel);
                    currentChannel = {};  // Reset current channel after adding it
                }
            });

            // Display the list of channels
            const channelListElement = document.getElementById("channel-list");

            channels.forEach(channel => {
                const listItem = document.createElement("li");

                // Create the channel list item
                const logoImg = channel.logo ? `<img src="${channel.logo}" alt="${channel.title}" width="30" height="30">` : '';
                listItem.innerHTML = `
                    ${logoImg}
                    <a href="#" onclick="playStream('${channel.url}')">${channel.title}</a>
                `;

                // Append the channel to the list
                channelListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching M3U file:", error));
});

// Function to play stream
function playStream(url) {
    const iframe = document.getElementById("streaming-iframe");
    iframe.src = url;

    // Show the streaming player container
    document.getElementById("streaming-player-container").style.display = "block";
}

// Close button functionality
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("streaming-player-container").style.display = "none";
    document.getElementById("streaming-iframe").src = '';  // Stop the stream
});
