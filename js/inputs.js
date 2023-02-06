import { togglePause, isPaused } from "./app.js"
import { DEFAULT_CONTROLS } from "./constants.js"
import { qs, qsa } from "./utils.js"

// modalSave.addEventListener("click", () => {
//     modal.close()
// })

export default class InputHandler {
    constructor(game, controls) {
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

        this.keys = controls
        // this.keys = {
        //     left: "ArrowLeft",
        //     right: "ArrowRight",
        //     up: "ArrowUp",
        //     down: "ArrowDown",
        //     jump: "d",
        //     action: "f",
        //     pause: "p",
        // }

        this.timeStampOfLastDownRelease
        this.canRoll = false

        this.mobileTouches = {}

        this.modal = qs("[data-modal='controls']")
        this.modalOpenBtn = qs("[data-btn='controls-modal-open']")
        this.modalSaveBtn = qs("[data-btn='controls-modal-save']")
        this.modalCancelBtn = qs("[data-btn='controls-modal-cancel']")
        this.modalResetDefaultBtn = qs("[data-btn='controls-modal-default']")
        this.controlsForm = qs("[data-form='controls']")
        this.controlsInputs = qsa("input", this.controlsForm)
        this.modalOpenBtn.disabled = false

        this.modalOpenBtn.addEventListener(
            "click",
            () => {
                this.modal.showModal()
                this.populateForm()
                if (!isPaused) togglePause()
            },
            { signal: this.keypressController.signal, passive: true }
        )

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
            localStorage.setItem("controls", JSON.stringify(updatedKeys))
            document.activeElement.blur()
        })

        this.modalCancelBtn.addEventListener(
            "click",
            () => {
                this.controlsForm.reset()
                this.modal.close()
                document.activeElement.blur()
            },
            { signal: this.keypressController.signal, passive: true }
        )
        this.modalResetDefaultBtn.addEventListener(
            "click",
            () => {
                localStorage.removeItem("controls")
                this.keys = DEFAULT_CONTROLS
                this.populateForm()
            },
            { signal: this.keypressController.signal, passive: true }
        )

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
            { signal: this.keypressController.signal, passive: true }
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
                    this.setKeyPress(key, e.timeStamp, btn)
                },
                { signal: this.keypressController.signal, passive: true }
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
                    let currentElement = document.elementFromPoint(
                        e.touches[0].pageX,
                        e.touches[0].pageY
                    )
                    // ?.closest("button")

                    if (
                        currentElement != targetButton &&
                        targetButton.hasAttribute("data-active")
                    ) {
                        this.setKeyRelease(
                            targetButtonKey,
                            e.timeStamp,
                            targetButton
                        )
                        this.removeKeyFromTouchesArray(
                            touchesArray,
                            targetButtonKey
                        )
                        return
                    }

                    if (!currentElement && touchesArray.length) {
                        touchesArray.forEach(btnKey => {
                            let button = qs(`[data-controls=${btnKey}]`)
                            this.setKeyRelease(btnKey, e.timeStamp, button)
                            // this.removeKeyFromTouchesArray(touchesArray, btnKey)
                        })
                        touchesArray = []
                        return
                    }

                    // if (this.game.isRecovering) return
                    if (
                        // currentElement &&
                        currentElement?.hasAttribute("data-controls") &&
                        !currentElement.hasAttribute("data-active")
                    ) {
                        this.setKeyPress(
                            currentElement.dataset.controls,
                            e.timeStamp,
                            currentElement
                        )
                        if (
                            !touchesArray.includes(
                                currentElement.dataset.controls
                            )
                        )
                            touchesArray.push(currentElement.dataset.controls)
                    }
                },
                { signal: this.keypressController.signal, passive: true }
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
                        this.setKeyRelease(
                            changedKey.dataset.controls,
                            e.timeStamp,
                            btn
                        )
                        this.removeKeyFromTouchesArray(
                            touchesArray,
                            changedKey.dataset.controls
                        )
                    }

                    touchesArray?.forEach(btnKey => {
                        let button = qs(`[data-controls=${btnKey}]`)
                        this.setKeyRelease(btnKey, e.timeStamp, button)
                        this.removeKeyFromTouchesArray(touchesArray, btnKey)
                    })
                    touchesArray = []
                },
                { signal: this.keypressController.signal }
            )
        })

        window.addEventListener(
            "keydown",
            ({ code, key, timeStamp }) => {
                const buttonPress = key === " " ? code : key
                if (this.modal.open) return
                if (buttonPress === this.keys.pause) {
                    togglePause()
                    this.game.music.toggleMusicPlayback()
                    return
                }

                if (this.game.isRecovering || isPaused) return
                this.setKeyPress(this.getButtonKeyCode(buttonPress), timeStamp)
            },
            { signal: this.keypressController.signal }
        )

        window.addEventListener(
            "keyup",
            ({ code, key, timeStamp }) => {
                const buttonRelease = key === " " ? code : key
                if (this.modal.open) return
                this.setKeyRelease(
                    this.getButtonKeyCode(buttonRelease),
                    timeStamp
                )
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

    setKeyPress(key, timeStamp, btn = null) {
        if (btn) btn.setAttribute("data-active", "")
        if (
            (this.lastKey =
                "RELEASE down" &&
                (key === "right" || key === "left") &&
                timeStamp - this.timeStampOfLastDownRelease < 50)
        )
            this.canRoll = true
        this.keysPressed[key] = true
        this.lastKey = `PRESS ${key}`
    }
    setKeyRelease(key, timeStamp, btn = null) {
        if (btn) {
            btn.removeAttribute("data-active")
        }
        if (key === "down") {
            this.timeStampOfLastDownRelease = timeStamp
        }
        this.keysPressed[key] = false
        this.lastKey = `RELEASE ${key}`
    }

    removeKeyFromTouchesArray(touchesArray, targetKey) {
        touchesArray = touchesArray?.filter(key => key != targetKey)
        // console.log(touchesArray, targetKey)
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
