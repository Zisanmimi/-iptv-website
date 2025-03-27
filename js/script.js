let channels = [];

async function loadChannels() {
    const response = await fetch("channels.json");
    channels = await response.json();
    displayChannels(channels);
}

function displayChannels(channelList) {
    const container = document.getElementById("channel-list");
    container.innerHTML = "";
    channelList.forEach(channel => {
        const channelDiv = document.createElement("div");
        channelDiv.classList.add("channel");
        channelDiv.innerHTML = `
            <img src="logos/${channel.logo}" alt="${channel.name}">
            <h3>${channel.name} (${channel.quality})</h3>
            <a href="${channel.url}" target="_blank">Watch Now</a>
        `;
        container.appendChild(channelDiv);
    });
}

function filterChannels(category) {
    if (category === "All") {
        displayChannels(channels);
    } else {
        const filtered = channels.filter(ch => ch.category === category);
        displayChannels(filtered);
    }
}

window.onload = loadChannels;
