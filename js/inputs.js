import { togglePause, isPaused } from "./app.js"
import { qs, qsa } from "./utils.js"



    // modalSave.addEventListener("click", () => {
    //     modal.close()
    // })

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
            pause: "Enter",
        }

        this.modal = qs("[data-modal='controls']")
        this.modalOpen = qs("[data-btn='controls-modal-open']")
        this.modalSave = qs("[data-btn='controls-modal-save']")
        this.modalCancel = qs("[data-btn='controls-modal-cancel']")
        this.controlsForm = qs("[data-form='controls']")
        this.controlsInputs = qsa("input", this.controlsForm)
        this.modalOpen.disabled = false

        this.modalOpen.addEventListener("click", () => {
            this.modal.showModal()
            this.populateForm()
            if (!isPaused) togglePause()
        })

        this.controlsInputs.forEach(input => {
            input.addEventListener("keydown", e => {
                e.preventDefault()
                let newValue = e.key === " " ? e.code : e.key
                if (this.controlsInputs.map(input => input.value).includes(newValue))
                    return
                input.value = newValue
            })
        })

        this.controlsForm.addEventListener("submit", ({ target }) => {
            const [left, right, up, down, jump, action, pause] = target

            const updatedKeys = {
                left: left.value,
                right: right.value,
                up: up.value,
                down: down.value,
                jump: jump.value,
                action: action.value,
                pause: pause.value,
            }

            this.keys = updatedKeys
            document.activeElement.blur()
        })

        this.modalCancel.addEventListener("click", () => {
            this.controlsForm.reset()
            this.modal.close()
            document.activeElement.blur()
        })

        window.addEventListener("keydown", ({ code, key }) => {
            const buttonPress = key === " " ? code : key
            if (this.modal.open) return
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
            if (this.modal.open) return
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
    populateForm() {
        this.controlsInputs.forEach(input => {
            input.setAttribute("value", this.keys[input.id])
        })
    }
}
