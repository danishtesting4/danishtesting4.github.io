/*
 * Live Discord status using Lanyard.
 * https://github.com/Phineas/lanyard
 *
 * Your Discord user ID goes in config.js (discord.userId).
 * The status only appears after that account has joined the Lanyard server:
 * https://discord.gg/UrXF2cfJ7F
 */
(function () {
  const cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.discord) ? SITE_CONFIG.discord : {};
  const userId = String(cfg.userId || '').trim();
  const LANYARD_INVITE = 'https://discord.gg/UrXF2cfJ7F';
  const STATUS_LABELS = {
    online: 'Online',
    idle: 'Sleeping (Idle)',
    dnd: 'Do Not Disturb',
    offline: 'Offline'
  };

  const panel = document.getElementById('discord-status');
  const dot = document.getElementById('discord-status-dot');
  const name = document.getElementById('discord-status-name');
  const text = document.getElementById('discord-status-text');
  const activity = document.getElementById('discord-status-activity');
  const avatar = document.getElementById('discord-avatar-img');
  const profilePicture = document.querySelector('.profile-picture');

  if (!panel || !dot || !name || !text || !activity || !avatar || !userId) return;

  let socket = null;
  let heartbeatTimer = null;
  let pollingTimer = null;

  const profileUrl = 'https://discord.com/users/' + userId;

  function defaultAvatarUrl(id) {
    let index = 0;
    try {
      index = Number(BigInt(id) % 5n);
    } catch (err) {
      index = 0;
    }
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  function avatarUrl(user) {
    if (user.avatar) {
      const extension = user.avatar.indexOf('a_') === 0 ? 'gif' : 'png';
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
    }
    return defaultAvatarUrl(user.id || userId);
  }

  function activityText(data) {
    if (!cfg.showActivity || !Array.isArray(data.activities)) return '';

    const custom = data.activities.find(item => item.type === 4 && item.state);
    const game = data.activities.find(item => item.type === 0);
    const listening = data.activities.find(item => item.type === 2);

    if (custom) return custom.state;
    if (game) return game.name + (game.details ? ' — ' + game.details : '');
    if (listening) {
      const song = listening.details || listening.name || 'Music';
      const artist = listening.state ? ' — ' + listening.state : '';
      return 'Listening to ' + song + artist;
    }
    return '';
  }

  function render(data) {
    const status = data.discord_status || 'offline';
    dot.className = 'discord-status-dot ' + status;
    dot.title = status;
    text.textContent = STATUS_LABELS[status] || 'Offline';
    text.title = status;

    if (data.discord_user) {
      const user = data.discord_user;
      const displayName = user.display_name || user.global_name || user.username || 'Discord user';
      name.textContent = displayName;
      avatar.src = avatarUrl(user);

      if (cfg.useAsProfilePicture && profilePicture) {
        profilePicture.src = avatarUrl(user);
        profilePicture.alt = displayName + "'s Discord avatar";
      }
    }

    const details = activityText(data);
    activity.textContent = details;
    activity.href = profileUrl;
    activity.style.display = details ? '' : 'none';
  }

  function showNotTracked() {
    dot.className = 'discord-status-dot offline';
    name.textContent = 'Discord user';
    text.textContent = 'Offline';
    activity.textContent = 'Join Lanyard to show status';
    activity.href = LANYARD_INVITE;
    activity.style.display = '';
  }

  async function poll() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      if (response.status === 404) {
        showNotTracked();
        return;
      }
      if (!response.ok) throw new Error('Lanyard returned ' + response.status);

      const result = await response.json();
      if (!result.success || !result.data) {
        showNotTracked();
        return;
      }
      render(result.data);
    } catch (err) {
      console.error('Discord status update failed:', err);
    }
  }

  function startPolling() {
    if (pollingTimer) return;
    const interval = Number(cfg.refreshInterval) || 30000;
    poll();
    pollingTimer = window.setInterval(poll, interval);
  }

  function stopPolling() {
    if (!pollingTimer) return;
    window.clearInterval(pollingTimer);
    pollingTimer = null;
  }

  function connectSocket() {
    if (!window.WebSocket) return;

    try {
      socket = new WebSocket('wss://api.lanyard.rest/socket');
    } catch (err) {
      return;
    }

    socket.addEventListener('message', event => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch (err) {
        return;
      }

      if (message.op === 1) {
        const interval = (message.d && message.d.heartbeat_interval) || 30000;
        socket.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [userId] } }));
        window.clearInterval(heartbeatTimer);
        heartbeatTimer = window.setInterval(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, interval);
        return;
      }

      if (message.op === 0 && message.e === 'INIT_STATE') {
        const data = message.d && message.d[userId];
        if (data) {
          stopPolling();
          render(data);
        } else {
          showNotTracked();
        }
        return;
      }

      if (message.op === 0 && message.e === 'PRESENCE_UPDATE' && message.d) {
        if (String(message.d.user_id) === userId) render(message.d);
      }
    });

    socket.addEventListener('close', () => {
      window.clearInterval(heartbeatTimer);
      heartbeatTimer = null;
      startPolling();
    });

    socket.addEventListener('error', () => {
      if (socket) socket.close();
    });
  }

  function init() {
    panel.classList.remove('hidden');
    activity.href = profileUrl;
    avatar.src = defaultAvatarUrl(userId);
    if (cfg.useAsProfilePicture && profilePicture) {
      profilePicture.src = defaultAvatarUrl(userId);
      profilePicture.alt = "Discord avatar";
    }
    showNotTracked();
    startPolling();
    connectSocket();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
