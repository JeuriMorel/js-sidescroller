import { togglePause } from "./app.js"
import { qs } from "./utils.js"

const modal = qs("[data-modal]")

export default class InputHandler {
    constructor(game) {
        this.lastKey = ""
        this.game = game
        this.keysPressed = {
            right: false,
            down: false,
            left: false,
            up: false,
            action: false,
            jump: false,
        }

        this.keys = {
            left: "ArrowLeft",
            right: "ArrowRight",
            up: "ArrowUp",
            down: "ArrowDown",
            jump: "d",
            action: "f",
            pause: "Space"
        }

        window.addEventListener("keydown", ({ code, key }) => {
            const buttonPress = key === " " ? code : key 
            if(modal.open) return
            if (buttonPress === this.keys.pause) {
                togglePause()
                this.game.music.toggleMusicPlayback()
                return
            }
            if (this.game.isRecovering) return
            switch (buttonPress) {
                case this.keys.left:
                    this.lastKey = "PRESS Left"
                    this.keysPressed.left = true
                    break
                case this.keys.up:
                    this.lastKey = "PRESS Up"
                    this.keysPressed.up = true
                    break
                case this.keys.right:
                    this.lastKey = "PRESS Right"
                    this.keysPressed.right = true
                    break
                case this.keys.down:
                    this.lastKey = "PRESS Down"
                    this.keysPressed.down = true
                    break
                case this.keys.action:
                    this.lastKey = "PRESS Attack"
                    this.keysPressed.action = true
                    break
                case this.keys.jump:
                    this.lastKey = "PRESS Jump"
                    this.keysPressed.jump = true
                    break
            }
        })
        window.addEventListener("keyup", ({ code, key }) => {
            const buttonRelease = key === " " ? code : key
            if (modal.open) return
            if (this.game.isRecovering) return
            switch (buttonRelease) {
                case this.keys.left:
                    this.lastKey = "RELEASE Left"
                    this.keysPressed.left = false
                    break
                case this.keys.up:
                    this.lastKey = "RELEASE Up"
                    this.keysPressed.up = false

                    break
                case this.keys.right:
                    this.lastKey = "RELEASE Right"
                    this.keysPressed.right = false

                    break
                case this.keys.down:
                    this.lastKey = "RELEASE Down"
                    this.keysPressed.down = false
                    break
                case this.keys.action:
                    this.lastKey = "RELEASE Attack"
                    this.keysPressed.action = false
                    break
                case this.keys.jump:
                    this.lastKey = "RELEASE Jump"
                    this.keysPressed.jump = false
                    break
            }
        })
    }
}
