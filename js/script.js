document.addEventListener('DOMContentLoaded', () => {
  fetch('m3u/channels.m3u')
    .then(response => response.text())
    .then(data => {
      const channels = parseM3U(data);
      const channelList = document.getElementById('channel-list');
      channels.forEach(channel => {
        const div = document.createElement('div');
        div.classList.add('channel-item');
        div.innerHTML = `
          <img src="${channel.logo}" alt="${channel.name}">
          <h3>${channel.name}</h3>
          <p>${channel.url}</p>
        `;
        channelList.appendChild(div);
      });
    });
});

function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];
  let currentChannel = {};
  lines.forEach(line => {
    if (line.startsWith('#EXTINF:')) {
      if (currentChannel.name) {
        channels.push(currentChannel);
      }
      currentChannel = { name: line.split(',')[1], url: '', logo: '' };
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
    } else if (line.endsWith('.png') || line.endsWith('.jpg')) {
      currentChannel.logo = line;
    }
  });
  if (currentChannel.name) {
    channels.push(currentChannel);
  }
  return channels;
}
