export default class InputHandler {
    constructor(game) {
        this.lastKey = ""
        this.lastTimeKeyPressed = 0
        this.game = game
        window.addEventListener("keydown", e => {
            if(this.game.recoveryTime > 0) return
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "PRESS Left"
                    break
                case "ArrowUp":
                    this.lastKey = "PRESS Up"
                    break
                case "ArrowRight":
                    this.lastKey = "PRESS Right"
                    break
                case "ArrowDown":
                    this.lastKey = "PRESS Down"
                    break
                case "d":
                    this.lastKey = "PRESS Attack"
                    break
            }
        })
        window.addEventListener("keyup", e => {
            switch (e.key) {
                case "ArrowLeft":
                    this.lastKey = "RELEASE Left"
                    break
                case "ArrowUp":
                    this.lastKey = "RELEASE Up"
                    break
                case "ArrowRight":
                    this.lastKey = "RELEASE Right"
                    break
                case "ArrowDown":
                    this.lastKey = "RELEASE Down"
                    this.lastTimeKeyPressed = Date.now()
                    break
                case "d":
                    this.lastKey = "RELEASE Attack"
                    break
            }
        })
    }
}
