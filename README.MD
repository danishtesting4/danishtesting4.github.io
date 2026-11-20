## A fully open-source site inspired by guns.lol and fakecrime.bio.

## 🎨 Customize it your way
If you want to change the **music**, **background**, or **cursor**, just replace the corresponding files in the `assets/` folder.  
Make sure to keep the **same file format** (e.g. `.mp3`, `.png`, `.cur`) to avoid issues.

You can fully edit the script, change styles, add features, or fix bugs — go wild.  
Have fun creating your own version!

## 🛠 How to use
Just open `index.html` in your browser with a live server. No setup required.

## ✏️ Quick customization
Almost everything you want to change lives in **`config.js`**:

- `name` and `bioMessages` — the profile name and rotating bio text
- `socials` — your social links and their icon files
- `badges` — badges shown next to your name
- `appearance` and `media` — the single accent color, background video, and optional music
- `visitorCountBase` — the starting number for the cosmetic visitor counter
- `discord` — your Discord user ID, activity display, avatar toggle, and refresh rate

Media files go in `assets/` (see `assets/README.md` for the expected filenames).
Missing images fall back to generated placeholders, and a missing background video
falls back to a gradient, so the page still works before you add your own files.

> Note: `style.css` is included but is not currently linked — the active styles
> are inline in `index.html`.

The site uses one fixed look.

## 🟢 Discord status

A live Discord status badge is included in `discord-status.js`. It shows:

- **Online** — green
- **Sleeping (Idle)** — yellow — Discord calls this "Idle"
- **Do Not Disturb** — red
- **Offline** — grey

It also shows your Discord avatar, display name (`Danish •_•`), and your current
activity (game, custom status, or music) when available.

### One-time setup

Discord does not offer a public status API for arbitrary users, so this uses the
free [Lanyard](https://github.com/Phineas/lanyard) service:

1. Join the Lanyard Discord server: https://discord.gg/UrXF2cfJ7F
2. Your Discord user ID is already set in `config.js` under `discord.userId`.
3. Refresh your site — the status should appear and update live.

If the badge says "Join Lanyard to show status", the account has not been picked
up by Lanyard yet. Make sure you joined with the same account and wait a minute.

![Image](https://github.com/user-attachments/assets/157b3b78-a61a-446b-8fd1-4f96ffaa532e)

## 🎨 Add Your Own Assets

To keep this repository lightweight, no music, videos, fonts, or GIFs are included.

If you want your site to work and look like the preview, you need to **add your own media files** (from YouTube, music libraries, etc.) into the `assets/` folder using the **exact same filenames and formats** listed below.

This is just a simplified setup — feel free to change the filenames, add more, or completely rewrite the script to match your own style and preferences.

--> Youtube Tutorial: https://www.youtube.com/watch?v=t6dMfxc8u5g
---

### 📥 Required Files to Add (Default Setup)

Place your files into the `assets/` folder with these exact filenames:

#### 🎧 Music (MP3)
- `anime_music.mp3`
- `background_music.mp3`
- `car_music.mp3`
- `hacker_music.mp3`
- `rain_music.mp3`

#### 🎥 Background Videos (MP4 / MOV)
- `anime_background.mp4`
- `background.mp4`
- `car_background.mp4`
- `hacker_background.mp4`
- `hacker_overlay.mp4`
- `rain_background.mov`
- `snow_overlay.mp4`

> 🎬 Use tools like [ClipConverter.cc](https://www.clipconverter.cc/) or [YTMP3.cc](https://ytmp3.cc/) to convert YouTube videos into `.mp4` or `.mov`.

#### 🖼️ Icons & Cursors (PNG)
- `custom_cursor.png`
- `github.png`
- `discord.png`
- `youtube.png`
- `tiktok.png`
- `python.png`
- `cpp.png`
- `csharp.png`
- `developer.png`

#### 🔤 Fonts
- `Angel_wish.ttf`  
  *(You can use any font, just rename it to match this file)*

#### 🎞️ Profile / Role GIFs (GIF)
- `profile.gif`
- `hated_guns.gif`
- `hated_fakecrime.gif`
- `hated_fakecrime1.gif`
- `owner.gif`
- `partner.gif`
- `staff.gif`
- `rule_maker.gif`
- `verified.gif`

---
✅ **Important:**  
- File extensions and names must match exactly for the current code to recognize them  
- Of course, you are free to **change the script**, **use your own filenames**, **add/remove anything**, or fully customize how assets are loaded — this is just a working default

🧠 Have fun building your own style! ![Image](https://github.com/user-attachments/assets/a0ba6f75-bcab-4560-9671-e3e87a6e2c06)

## 🌐 Community & Support
- 💬 Join our Discord: [discord.gg/motiongoats](https://discord.gg/motiongoats)
- ☕ Like the project? Buy me a coffee BTC: bc1qzu5sdzydwh3sulsd25rs57rpn4czyrctm4neph
- ⭐ If you enjoy this, consider leaving a star on the repo!

![Image](https://github.com/user-attachments/assets/feed39df-8b60-46d5-9bf8-b12a5bb70395)
![Image](https://github.com/user-attachments/assets/8ee03242-3c84-400f-8d6d-2b376f49ab4f)


