// Function to fetch and parse M3U playlist
async function fetchM3UPlaylist() {
    const m3uFile = 'channels.m3u'; // Your M3U file URL
    const response = await fetch(m3uFile);
    const data = await response.text();
    return parseM3U(data);
}

// Function to parse M3U file content into channel names and URLs
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
            const channelName = line.split(',')[1].trim();
            const streamUrl = lines[i + 1].trim();
            channels.push({ name: channelName, url: streamUrl });
        }
    }

    return channels;
}

// Function to display channel list on the page
function displayChannelList(channels) {
    const channelListElement = document.getElementById('channel-list');
    channelListElement.innerHTML = '';

    channels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.classList.add('channel-item');
        channelItem.textContent = channel.name;

        channelItem.addEventListener('click', () => {
            playChannel(channel.url);
        });

        channelListElement.appendChild(channelItem);
    });
}

// Function to load and play the selected channel using Flowplayer
function playChannel(url) {
    const flowplayerContainer = document.getElementById('flowplayer-container');
    flowplayerContainer.innerHTML = ''; // Clear the previous player

    flowplayer(flowplayerContainer, {
        clip: {
            sources: [
                {
                    type: 'application/x-mpegurl',
                    src: url
                }
            ]
        }
    });
}

// Fetch the M3U playlist and display channels
fetchM3UPlaylist().then(channels => {
    displayChannelList(channels);
});
