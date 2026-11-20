# Assets folder

Put your media files here. The filenames below are the ones referenced by
`config.js`. If a file is missing, the site falls back to a placeholder image or
a plain gradient background instead of breaking.

## Music (MP3)
- `background_music.mp3` (optional — only used when `media.backgroundMusic` is set)

## Background videos
- `background.mp4` (themes and their extra videos/overlays have been removed)

## Images / icons
Included SVG icons used by `config.js`:
- `discord.svg`
- `github.svg`
- `owner.svg`
- `hated.svg`

The main profile picture is loaded from your Discord account via `discord-status.js`.

## Custom cursor
The `chroma/` folder contains the Chroma cursor set from RW-Designer:
- `normal-select.ani` — original animated default cursor
- `link-select.ani` — original animated link cursor
- `normal-select-sheet.png` — 30-frame sprite rendered by the site as the default cursor
- `link-select-sheet.png` — 30-frame sprite rendered by the site for links and buttons
- `handwriting.cur` — original static cursor from the set

Chrome does not reliably animate `.ani` CSS cursors, so the site renders frames from the original `.ani` files as a cursor sprite.

Source: https://www.rw-designer.com/cursor-downloadset/chroma.zip

Tip: you can change any of these filenames in `config.js` if you prefer your own names.
