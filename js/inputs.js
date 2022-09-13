export default class InputHandler {
    constructor(game) {
        this.lastKey = ""
        this.game = game
        this.keysPressed = {
            right: false,
            down: false,
            left: false,
            up: false,
            attack: false,
        }

        window.addEventListener("keydown", e => {
            if (this.game.isRecovering) return
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "PRESS Left"
                    this.keysPressed.left = true
                    break
                case "ArrowUp":
                    this.lastKey = "PRESS Up"
                    this.keysPressed.up = true
                    break
                case "ArrowRight":
                    this.lastKey = "PRESS Right"
                    this.keysPressed.right = true
                    break
                case "ArrowDown":
                    this.lastKey = "PRESS Down"
                    this.keysPressed.down = true
                    break
                case "d":
                    this.lastKey = "PRESS Attack"
                    this.keysPressed.attack = true
                    break
            }
        })
        window.addEventListener("keyup", e => {
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "RELEASE Left"
                    this.keysPressed.left = false
                    break
                case "ArrowUp":
                    this.lastKey = "RELEASE Up"
                    this.keysPressed.up = false

                    break
                case "ArrowRight":
                    this.lastKey = "RELEASE Right"
                    this.keysPressed.right = false

                    break
                case "ArrowDown":
                    this.lastKey = "RELEASE Down"
                    this.lastTimeKeyPressed = Date.now()
                    this.keysPressed.down = false

                    break
                case "d":
                    this.lastKey = "RELEASE Attack"
                    this.keysPressed.attack = false

                    break
            }
        })
    }
}
