<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IPTV Channels</title>
    <style>
        .channel-list {
            list-style-type: none;
            padding: 0;
        }

        .channel-list li {
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
        }

        .channel-list img {
            margin-right: 10px;
        }

        .channel-list a {
            text-decoration: none;
            color: black;
            font-size: 18px;
        }

        .channel-list a:hover {
            color: #007bff;
        }

        .flowplayer-container {
            margin-top: 20px;
            text-align: center;
        }

        iframe {
            width: 100%;
            height: 480px;
            border: none;
        }
    </style>
    <!-- Flowplayer CSS -->
    <link rel="stylesheet" href="https://cdn.flowplayer.com/flowplayer.min.css">

    <!-- Flowplayer JS -->
    <script src="https://cdn.flowplayer.com/flowplayer.min.js"></script>
</head>
<body>

    <h2>IPTV Channels</h2>
    <ul id="channel-list" class="channel-list"></ul>

    <!-- Container for the Flowplayer -->
    <div id="flowplayer-container" class="flowplayer-container"></div>

    <script>
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
                            <a href="#" onclick="openFlowplayer('${channel.url}')">${channel.title}</a>
                        `;

                        // Append the channel to the list
                        channelListElement.appendChild(listItem);
                    });
                })
                .catch(error => console.error("Error fetching M3U file:", error));
        });

        function openFlowplayer(url) {
            const flowplayerContainer = document.getElementById("flowplayer-container");
            
            // Clear any previous content in the player container
            flowplayerContainer.innerHTML = "";

            // Create Flowplayer iframe dynamically
            const iframe = document.createElement('iframe');
            iframe.src = `https://embed.flowplayer.com/?stream=${url}`;
            iframe.allowFullscreen = true;

            // Append the iframe to the container
            flowplayerContainer.appendChild(iframe);
        }
    </script>
  
</body>
</html>
