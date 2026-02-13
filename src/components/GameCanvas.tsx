'use client'

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { Howl } from 'howler'
import html2canvas from 'html2canvas'

class AudioManager {
  private sound: Howl | null = null
  private ambient: Howl | null = null
  
  constructor() {
    // Map letters to [startMs, durationMs] from the config.json
    const sprite: Record<string, [number, number]> = {
      'A': [4540, 188], 'B': [4903, 193], 'C': [5296, 193], 
      'D': [5666, 183], 'E': [6818, 167], 'F': [7187, 183],
      'G': [15156, 180], 'H': [15526, 204], 'I': [15893, 157],
      'J': [13988, 186], 'K': [22116, 179], 'L': [22513, 173],
      'M': [22862, 158], 'N': [14748, 212], 'O': [39220, 169],
      'P': [39589, 179], 'Q': [39954, 183], 'R': [34215, 180],
      'S': [34704, 159], 'T': [6054, 180], 'U': [6425, 182],
      'V': [6425, 182], 'W': [6054, 180], 'X': [7583, 193],
      'Y': [9749, 195], 'Z': [2222, 186]
    }
    
    this.sound = new Howl({
      src: ['/assets/sounds/keyboards/sound.ogg'],
      sprite: sprite,
      volume: 0.6,
      format: ['ogg']
    })
    
    // Add ambient sound
    this.ambient = new Howl({
      src: ['/assets/sounds/night-ambience.mp3'], // Or use synth
      volume: 0.15,
      loop: true
    })
    this.ambient.play()
  }
  
  playKey(char: string) {
    if (!this.sound) return
    const upper = char.toUpperCase()
    this.sound.play(upper)
  }
  
  playDelete() {
    if (!this.sound) return
    // Use a different key sound at lower pitch for delete
    // Using 'N' or 'M' (deeper sounds) at 0.7 pitch
    this.sound.play('N')
    this.sound.rate(0.7) // Lower pitch for delete feel
  }
}

class Letter extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, char: string, color: string) {
    super(scene, x, y, char, {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: color,
    })
    scene.add.existing(this)
    this.setOrigin(0.5)
    this.setAlpha(0)
    
    // Scale up then settle
    this.setScale(0)
    scene.tweens.add({
      targets: this,
      scale: 1.2,
      duration: 100,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: this,
          scale: 1,
          duration: 200
        })
      }
    })
    
    scene.tweens.add({ targets: this, alpha: 1, duration: 200 })
    scene.time.delayedCall(8000, () => {
      scene.tweens.add({ targets: this, alpha: 0, duration: 2000, onComplete: () => this.destroy() })
    })
  }
}

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  const handleExport = () => {
    if (!gameRef.current) return
    
    const game = gameRef.current
    
    // Use Phaser's built-in snapshot
    game.renderer.snapshot((image: HTMLImageElement) => {
      const link = document.createElement('a')
      link.download = `midnight-typer-${Date.now()}.png`
      link.href = image.src
      link.click()
    })
  }

  useEffect(() => {
    if (!containerRef.current) return
    
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      parent: containerRef.current,
      backgroundColor: '#0a0e27',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: {
        antialias: true,
        pixelArt: false
      },
      scene: {
        create() {
          const audioManager = new AudioManager()
          
          // In create() method, add array to track letters:
          const letters: { sprite: Letter; char: string; x: number; y: number }[] = []

          // Shift background color slowly over time
          let hue = 230 // Start at blue
          this.time.addEvent({
            delay: 50,
            callback: () => {
              hue += 0.1
              if (hue > 280) hue = 230 // Cycle between blue-purple
              const color = Phaser.Display.Color.HSLToColor(hue/360, 0.6, 0.1)
              this.cameras.main.setBackgroundColor(color.color)
            },
            loop: true
          })
          
          // Create twinkling stars
          for (let i = 0; i < 300; i++) {
            const star = this.add.circle(
              Phaser.Math.Between(0, 1920),
              Phaser.Math.Between(0, 1080),
              Phaser.Math.FloatBetween(0.5, 2),
              0xffffff,
              Phaser.Math.FloatBetween(0.1, 0.8)
            )
            
            // Twinkle effect
            this.tweens.add({
              targets: star,
              alpha: { from: star.alpha, to: star.alpha * 0.3 },
              duration: Phaser.Math.Between(1000, 3000),
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            })
          }
          
          let cursorX = 960, cursorY = 540
          const cursor = this.add.text(cursorX, cursorY, '|', { fontSize: '32px', color: '#fff' }).setOrigin(0.5)
          
          // Create trail that follows cursor
          const trail = this.add.particles(0, 0, 'particle', {
            follow: cursor,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 600,
            quantity: 1,
            frequency: 50,
            tint: 0x6366f1
          })
          
          const colors = ['#ffffff', '#a5b4fc', '#c7d2fe', '#fcd34d', '#f9a8d4', '#6ee7b7']
          
          // Create particle texture
          const graphics = this.add.graphics()
          graphics.fillStyle(0xffffff, 1)
          graphics.fillCircle(8, 8, 8)
          graphics.generateTexture('particle', 16, 16)
          graphics.destroy()
          
          // Modify the letter spawn section:
          this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
            if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
              const color = colors[Math.floor(Math.random() * colors.length)]
              const letter = new Letter(this, cursorX, cursorY, e.key.toUpperCase(), color)
              
              // Track for backspace
              letters.push({ 
                sprite: letter, 
                char: e.key.toUpperCase(),
                x: cursorX, 
                y: cursorY 
              })
              
              // Play regular key sound
              audioManager.playKey(e.key)
              
              // Spawn particles...
              const particles = this.add.particles(cursorX, cursorY, 'particle', {
                speed: { min: 50, max: 150 },
                lifespan: 1000,
                scale: { start: 0.6, end: 0 },
                alpha: { start: 0.8, end: 0 },
                tint: parseInt(color.replace('#', '0x')),
                quantity: 3,
                blendMode: 'ADD'
              })
              this.time.delayedCall(1000, () => particles.destroy())
              
              // Move cursor forward
              cursorX += 50
              if (cursorX > 1800) { cursorX = 100; cursorY += 60 }
              if (cursorY > 1000) cursorY = 100
              cursor.setPosition(cursorX, cursorY)
            }
          })

          // Add Backspace handler:
          this.input.keyboard?.on('keydown-BACKSPACE', () => {
            if (letters.length > 0) {
              // Remove last letter from array
              const lastEntry = letters.pop()
              if (lastEntry) {
                // Fade out fast then destroy
                this.tweens.add({
                  targets: lastEntry.sprite,
                  alpha: 0,
                  scale: 0.5,
                  duration: 150,
                  onComplete: () => lastEntry.sprite.destroy()
                })
                
                // Play delete sound (lower pitch)
                audioManager.playDelete()
                
                // Move cursor back to that position
                cursorX = lastEntry.x
                cursorY = lastEntry.y
                cursor.setPosition(cursorX, cursorY)
              }
            }
          })
          
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            cursorX = pointer.x
            cursorY = pointer.y
            cursor.setPosition(cursorX, cursorY)
          })
          
          // Export shortcut (Ctrl+E or Cmd+E)
          this.input.keyboard?.on('keydown-CTRL-E', () => {
            handleExport()
          })
          
          // Clear canvas with Escape key
          this.input.keyboard?.on('keydown-ESC', () => {
            // Remove all Letter objects
            this.children.list
              .filter(child => child instanceof Letter)
              .forEach(letter => letter.destroy())
            
            // Reset cursor to center
            cursorX = 960
            cursorY = 540
            cursor.setPosition(cursorX, cursorY)
          })
          
          // Also add on-screen button (optional for now, keyboard shortcut is faster)
          const exportText = this.add.text(1800, 50, '[Ctrl+E] Export', {
            fontSize: '16px',
            color: '#64748b',
            fontFamily: 'monospace'
          }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
          
          exportText.on('pointerdown', () => {
            handleExport()
          })
          
          // Add clear button on screen (next to export)
          const clearText = this.add.text(1800, 80, '[ESC] Clear', {
            fontSize: '16px',
            color: '#64748b',
            fontFamily: 'monospace'
          }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
          
          clearText.on('pointerdown', () => {
            this.input.keyboard?.emit('keydown-ESC')
          })
          
          const instructions = this.add.text(960, 1000, 'Click to move • Type A-Z • ASMR Mode', {
            fontSize: '20px',
            color: '#64748b',
            fontFamily: 'monospace'
          }).setOrigin(0.5)
          
          this.time.delayedCall(5000, () => {
            this.tweens.add({ targets: instructions, alpha: 0, duration: 1000, onComplete: () => instructions.destroy() })
          })
        }
      }
    })
    
    gameRef.current = game
    
    return () => {
      gameRef.current = null
      game.destroy(true)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen bg-midnight-950" style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' }} />
}
