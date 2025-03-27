// Function to fetch and parse M3U playlist
async function fetchM3UPlaylist() {
    const m3uFile = 'channels.m3u'; // Your M3U file URL
    const response = await fetch(m3uFile);
    const data = await response.text();
    return parseM3U(data);
}

// Function to parse M3U file content into channel names, URLs, logos, and view counts
function parseM3U(data) {
    const lines = data.split('\n');
    const channels = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
            const channelName = line.split(',')[1].trim();
            const logoUrl = line.match(/tvg-logo="([^"]+)"/) ? line.match(/tvg-logo="([^"]+)"/)[1] : '';
            const streamUrl = lines[i + 1].trim();
            channels.push({ name: channelName, url: streamUrl, logo: logoUrl, views: 0 });
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
        
        const logoImg = document.createElement('img');
        logoImg.src = channel.logo ? channel.logo : 'default-logo.png'; // Use default logo if none provided
        channelItem.appendChild(logoImg);
        
        const channelName = document.createElement('div');
        channelName.classList.add('channel-name');
        channelName.textContent = channel.name;
        channelItem.appendChild(channelName);

        const viewCount = document.createElement('div');
        viewCount.classList.add('view-count');
        viewCount.textContent = `Views: ${channel.views}`;
        channelItem.appendChild(viewCount);

        // Add event listener to play channel on click
        channelItem.addEventListener('click', () => {
            playChannel(channel.url);
            incrementViewCount(channel);
        });

        channelListElement.appendChild(channelItem);
    });
}

// Function to load and play the selected channel using Flowplayer
function playChannel(url) {
    const flowplayerContainer = document.getElementById('flowplayer-container');
    
    // Check if Flowplayer is already loaded, if yes, clear it and reload the player
    if (flowplayerContainer.innerHTML !== '') {
        flowplayerContainer.innerHTML = ''; // Clear previous player
    }

    try {
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
    } catch (error) {
        console.error("Error initializing Flowplayer:", error);
        alert("An error occurred while trying to load the stream.");
    }
}

// Function to increment the view count for a channel
function incrementViewCount(channel) {
    channel.views += 1;
    displayChannelList(channels); // Re-render the list with updated view counts
}

// Fetch the M3U playlist and display channels
fetchM3UPlaylist().then(channels => {
    displayChannelList(channels);
});
