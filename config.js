/*
 * ============================================================
 * EDIT THIS FILE TO CUSTOMIZE YOUR PROFILE
 * ------------------------------------------------------------
 * You normally do NOT need to touch index.html or script.js.
 * Change the values below, save, and refresh the page.
 *
 * Media files go in the assets/ folder (see assets/README.md).
 * ============================================================
 */

const SITE_CONFIG = {
  // Text typed on the click-to-enter screen
  startMessage: "Cʟɪᴄᴋ ᴛᴏ ᴇɴᴛᴇʀ",

  // Display name shown on the profile (typed out with an effect)
  name: "Danish",

  // Bio lines. The site cycles through these automatically.
  bioMessages: [
    "Hello!",
    "\"I Make things configurable\""
  ],

  // Browser tab title animation. Leave messages empty to use the name and bio lines.
  tabTitle: {
    messages: [],
    typeSpeed: 90,
    eraseSpeed: 45,
    holdTime: 1600
  },

  // Social links. Icons are loaded from assets/.
  socials: [
    { label: "Discord", href: "https://discord.com/users/1346745954342015069", icon: "assets/discord.svg" },
    { label: "GitHub", href: "https://github.com/danishtesting4", icon: "assets/github.svg" },
  ],

  // Badges shown next to the name. Add or remove entries freely.
  badges: [
    { label: "Owner", icon: "assets/owner.svg" },
    { label: "Hated by Guns.lol", icon: "assets/hated.svg" },
  ],

  // Discord status via Lanyard (https://github.com/Phineas/lanyard)
  discord: {
    // Your Discord user ID (numeric). Already taken from your Discord link.
    userId: "1346745954342015069",

    // Show your current activity (game, app, or custom status) under the status.
    showActivity: true,

    // Use your Discord avatar as the main profile picture on the bio.
    useAsProfilePicture: true,

    // Fallback polling interval in milliseconds if the live socket disconnects.
    refreshInterval: 30000
  },

  // One fixed look — theme switching has been removed.
  appearance: {
    accentColor: "#00CED1"
  },

  // Background media. Add tracks to enable the music player.
  media: {
    backgroundVideo: "assets/background.mp4",
    tracks: [
      {
        title: "The One That Got Away",
        artist: "Katy Perry",
        src: "assets/Katy Perry - The One That Got Away (Official Music Video).mp3",
        cover: "assets/the-one-that-got-away-cover.png"
      },
      {
        title: "Just The Way You Are",
        artist: "Milky",
        src: "assets/Milky - Just The Way You Are.mp3",
        cover: "assets/just-the-way-you-are-cover.jpg"
      }
    ]
  }
};
