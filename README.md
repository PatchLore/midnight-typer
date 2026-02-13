# midnight-typer
Turn keystrokes into constellation art. An ASMR typing experience with mechanical keyboard sounds, particle effects, and exportable artwork. Built with Next.js &amp; Phaser.
# Midnight Typer

Turn your thoughts into constellation art. A mindful typing experience where every keystroke creates fading, colorful letters with particle trails.

![Midnight Typer Screenshot](screenshot.png)

## ✨ Features

- **Type Anywhere** - Click anywhere on the canvas to position your cursor
- **ASMR Audio** - Mechanical keyboard sounds on every keystroke (placeholder audio for MVP)
- **Visual Effects** - Particle bursts and color variations for each letter
- **Fade to Black** - Letters gracefully fade after 8 seconds, creating ephemeral art
- **Export Art** - Press `Ctrl+E` to download your constellation as PNG
- **Zen Mode** - Clean, distraction-free dark interface

## 🚀 Tech Stack

- **Framework:** Next.js 14 + React 18
- **Game Engine:** Phaser 3.70
- **Audio:** Howler.js
- **Styling:** Tailwind CSS
- **Font:** JetBrains Mono

## 🎮 Controls

| Key | Action |
|-----|--------|
| `A-Z` | Type letters at cursor position |
| `Click` | Move cursor to new position |
| `Ctrl+E` | Export canvas as PNG |
| `ESC` | Clear all letters |

## 🛠 Installation

```bash
git clone https://github.com/YOUR_USERNAME/midnight-typer.git
cd midnight-typer
npm install
npm run dev
