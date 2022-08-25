export default class InputHandler {
    constructor() {
        this.lastKey = ""
        window.addEventListener("keydown", e => {
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
                case "D":
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
                    break
                case "D":
                    this.lastKey = "RELEASE Attack"
                    break
            }
        })
    }
}
