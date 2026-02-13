'use client'

import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { Howl } from 'howler'
import html2canvas from 'html2canvas'

class AudioManager {
  private keySound: Howl
  
  constructor() {
    // Placeholder: using a generic click sound
    // Replace with actual mechvibes files later
    this.keySound = new Howl({
      src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
      volume: 0.3,
      // For real implementation, use 26 individual key files:
      // src: [`/assets/sounds/key-${char}.mp3`]
    })
  }
  
  playKey() {
    // Randomize pitch slightly for variety
    this.keySound.rate(0.9 + Math.random() * 0.2)
    this.keySound.play()
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
      scene: {
        create() {
          const audioManager = new AudioManager()
          let cursorX = 960, cursorY = 540
          const cursor = this.add.text(cursorX, cursorY, '|', { fontSize: '32px', color: '#fff' }).setOrigin(0.5)
          const colors = ['#ffffff', '#a5b4fc', '#c7d2fe', '#fcd34d', '#f9a8d4', '#6ee7b7']
          
          // Create particle texture
          const graphics = this.add.graphics()
          graphics.fillStyle(0xffffff, 1)
          graphics.fillCircle(8, 8, 8)
          graphics.generateTexture('particle', 16, 16)
          graphics.destroy()
          
          this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
            if (/[a-zA-Z]/.test(e.key)) {
              audioManager.playKey() // PLAY SOUND
              
              const color = colors[Math.floor(Math.random() * colors.length)]
              new Letter(this, cursorX, cursorY, e.key.toUpperCase(), color)
              
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
              
              cursorX += 50
              if (cursorX > 1800) { cursorX = 100; cursorY += 60 }
              if (cursorY > 1000) cursorY = 100
              cursor.setPosition(cursorX, cursorY)
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

  return <div ref={containerRef} className="w-full h-screen bg-midnight-950" />
}
