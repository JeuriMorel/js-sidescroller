import { togglePause, isPaused } from "./app.js"
import { capFirstLetter, qs, qsa } from "./utils.js"

// modalSave.addEventListener("click", () => {
//     modal.close()
// })

export default class InputHandler {
    constructor(game) {
        this.lastKey = ""
        this.game = game
        this.canvas = qs("canvas")
        this.lastTap
        this.keypressController = new AbortController()
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
            pause: "p",
        }

        this.mobileTouches = {}

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
                if (
                    this.controlsInputs
                        .map(input => input.value)
                        .includes(newValue)
                )
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

        this.canvas.addEventListener(
            "touchstart",
            () => {
                let timeTap = new Date().getTime()
                let timeSinceLastTap = timeTap - this.lastTap

                if (timeSinceLastTap < 600) {
                    togglePause()
                    this.game.music.toggleMusicPlayback()
                }
                this.lastTap = timeTap
            },
            { signal: this.keypressController.signal }
        )

        this.controllerBtns = qsa("[data-controls]")

        this.controllerBtns?.forEach(btn => {
            btn.addEventListener(
                "touchstart",
                e => {
                    if (e.cancelable) e.preventDefault()
                    if (this.modal.open || this.game.isRecovering || isPaused)
                        return

                    let key =
                        e.targetTouches[0].target.closest("button").dataset
                            .controls

                    this.mobileTouches[key] = [key]

                    // if (key === "pause") {
                    //     togglePause()
                    //     this.game.music.toggleMusicPlayback()
                    //     return
                    // }

                    // if (this.game.isRecovering || isPaused) return
                    this.setKeyPress(key, btn)
                },
                { signal: this.keypressController.signal }
            )
            btn.addEventListener(
                "touchmove",
                e => {
                    if (e.cancelable) e.preventDefault()
                    if (this.modal.open || isPaused || this.game.isRecovering)
                        return
                    let targetButton =
                        e.targetTouches[0].target.closest("button")
                    let targetButtonKey = targetButton.dataset.controls
                    let touchesArray = this.mobileTouches[targetButtonKey]
                    let currentElement = document
                        .elementFromPoint(
                            e.touches[0].pageX,
                            e.touches[0].pageY
                        )
                        ?.closest("button")

                    if (
                        currentElement != targetButton &&
                        targetButton.hasAttribute("data-active")
                    ) {
                        this.setKeyRelease(targetButtonKey, targetButton)
                        this.removeKeyFromTouchesArray(
                            touchesArray,
                            targetButtonKey
                        )
                        // touchesArray =
                        //     touchesArray.filter(
                        //         key => key != targetButtonKey
                        //     )
                    }

                    if (!currentElement && touchesArray.length) {
                        touchesArray.forEach(btnKey => {
                            let button = qs(`[data-controls=${btnKey}]`)
                            this.setKeyRelease(btnKey, button)
                        })
                        touchesArray = []
                    }

                    // if (this.game.isRecovering) return
                    if (
                        currentElement &&
                        currentElement.hasAttribute("data-controls") &&
                        !currentElement.hasAttribute("data-active")
                    ) {
                        this.setKeyPress(
                            currentElement.dataset.controls,
                            currentElement
                        )
                        touchesArray.push(currentElement.dataset.controls)
                    }
                },
                { signal: this.keypressController.signal }
            )
            btn.addEventListener(
                "touchend",
                e => {
                    if (e.cancelable) e.preventDefault()
                    let changedKey =
                        e.changedTouches[0].target.closest("button")
                    let targetKey = e.target.dataset.controls
                    let touchesArray = this.mobileTouches[targetKey]

                    if (changedKey.hasAttribute("data-active")) {
                        this.setKeyRelease(changedKey.dataset.controls, btn)
                        this.removeKeyFromTouchesArray(
                            touchesArray,
                            changedKey.dataset.controls
                        )
                    }

                    touchesArray?.forEach(btnKey => {
                        let button = qs(`[data-controls=${btnKey}]`)
                        this.setKeyRelease(btnKey, button)
                    })
                    touchesArray = []
                },
                { signal: this.keypressController.signal }
            )
        })

        window.addEventListener(
            "keydown",
            ({ code, key }) => {
                const buttonPress = key === " " ? code : key
                if (this.modal.open) return
                if (buttonPress === this.keys.pause) {
                    togglePause()
                    this.game.music.toggleMusicPlayback()
                    return
                }

                if (this.game.isRecovering || isPaused) return
                this.setKeyPress(this.getButtonKeyCode(buttonPress))
            },
            { signal: this.keypressController.signal }
        )

        window.addEventListener(
            "keyup",
            ({ code, key }) => {
                const buttonRelease = key === " " ? code : key
                if (this.modal.open) return
                this.setKeyRelease(this.getButtonKeyCode(buttonRelease))
            },
            { signal: this.keypressController.signal }
        )
    }

    getButtonKeyCode(buttonPress) {
        switch (buttonPress) {
            case this.keys.left:
                return "left"
            case this.keys.up:
                return "up"
            case this.keys.right:
                return "right"
            case this.keys.down:
                return "down"
            case this.keys.action:
                return "action"
            case this.keys.jump:
                return "jump"
        }
    }

    setKeyPress(key, btn = null) {
        if (btn) btn.setAttribute("data-active", "")
        this.keysPressed[key] = true
        this.lastKey = `PRESS ${capFirstLetter(key)}`
    }
    setKeyRelease(key, btn = null) {
        if (btn) btn.removeAttribute("data-active")
        this.keysPressed[key] = false
        this.lastKey = `RELEASE ${capFirstLetter(key)}`
    }

    removeKeyFromTouchesArray(touchesArray, targetKey) {
        touchesArray = touchesArray?.filter(key => key != targetKey)
    }

    removeEventListeners() {
        this.keypressController.abort()
    }
    populateForm() {
        this.controlsInputs.forEach(input => {
            input.setAttribute("value", this.keys[input.id])
        })
    }
}
