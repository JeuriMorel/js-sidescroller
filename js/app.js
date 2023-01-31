import { qs, qsa, setSfxVolume } from "./utils.js"
import { Background } from "./background.js"
import {
    LAYER_HEIGHT,
    LAYER_WIDTH,
    DEFAULT_SCROLL_SPEED,
    SOUND_DEFENCE_UP,
    SOUND_DEFENCE_DOWN,
    BLUR_VALUE,
} from "./constants.js"
import { Player } from "./player.js"
import InputHandler from "./inputs.js"
import { UI } from "./UI.js"
import {
    Wave_Boss,
    Wave_Eight,
    Wave_Five,
    Wave_Four,
    Wave_Nine,
    Wave_One,
    Wave_Seven,
    Wave_Six,
    Wave_Three,
    Wave_Two,
    Wave_Win,
} from "./waves.js"
import MusicHandler from "./music.js"
import { Accordian } from "./accordian.js"
import { updateStats } from "./best_stats.js"

import { confirm } from "./custom_confirm_box.js"

export let isPaused = false
export function togglePause() {
    isPaused = !isPaused
    if (!isPaused) animate(0)
}

const body = qs("body")
const is_touch_device = "ontouchstart" in document.documentElement
if (is_touch_device) {
    body.classList.add("is_touch_device")
    const fullScreenToggleBtn = qs('[data-btn="full-screen"]')

    fullScreenToggleBtn.addEventListener("click", toggleFullScreen)
}

updateStats()

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        body.requestFullscreen()
            .then(() =>
                qs('[data-btn="full-screen"]').children[0].setAttribute(
                    "data-icon",
                    "compress"
                )
            )
            .catch(error =>
                alert(`Error, can't enable full-screen mode: ${error.message}`)
            )
    } else {
        document.exitFullscreen()
        qs('[data-btn="full-screen"]').children[0].setAttribute(
            "data-icon",
            "expand"
        )
    }
}

window.addEventListener("load", function () {
    const canvas = qs("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = LAYER_WIDTH * 0.5
    canvas.height = LAYER_HEIGHT

    const newGameBtn = qs('[data-btn="new-game"]')
    const restartGameBtn = qs('[data-btn="restart-game"]')
    const creditsModal = qs("[data-modal='credits']")
    const creditsOpenBtn = qs('[data-btn="credits-open"]')
    const creditsCloseBtn = qs('[data-btn="credits-close"]')
    const howToPlayModal = qs("[data-modal='how-to-play']")
    const howToPlayOpenBtn = qs('[data-btn="how-to-play-open"]')
    const howToPlayCloseBtn = qs('[data-btn="how-to-play-close"]')
    const editContolsBtn = qs("[data-btn='controls-modal-open']")
    const mainMenu = qs("[data-list='main-menu']")
    const menuConfirmAudio = qs("#menu_confirm")
    const confirmBtns = qsa("[data-sfx='menu-confirm']")

    confirmBtns.forEach(button =>
        button.addEventListener("click", () => menuConfirmAudio.play())
    )

    creditsOpenBtn.addEventListener("click", () => {
        creditsModal.showModal()
        if (!isPaused) togglePause()
    })
    creditsCloseBtn.addEventListener("click", () => {
        creditsModal.close()
    })
    howToPlayOpenBtn.addEventListener("click", () => {
        howToPlayModal.showModal()
        if (!isPaused) togglePause()
    })
    howToPlayCloseBtn.addEventListener("click", () => {
        howToPlayModal.close()
    })

    restartGameBtn.addEventListener("click", confirmGameRestart)

    const details = qs("details")
    new Accordian(details)

    class Game {
        constructor(width, height) {
            this.isOn = true
            this.width = width
            this.height = height
            this.groundMargin = 60
            this.scrollSpeed = DEFAULT_SCROLL_SPEED
            this.maxBarWidth = DEFAULT_SCROLL_SPEED * 30
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.UI = new UI(this)
            this.enemyTimer = 0
            this.enemies = []
            this.particles = []
            this.recoveryTime = 0
            this.isRecovering = false
            this.deltaTime = 0
            this.gameIsStarting = false
            this.music = new MusicHandler(this)
            this.sfx = {
                defenceUpSFX: new Audio(SOUND_DEFENCE_UP),
                defenceDownSFX: new Audio(SOUND_DEFENCE_DOWN),
            }

            this.waves = [
                new Wave_One(this),
                new Wave_Two(this),
                new Wave_Three(this),
                new Wave_Four(this),
                new Wave_Five(this),
                new Wave_Six(this),
                new Wave_Seven(this),
                new Wave_Eight(this),
                new Wave_Nine(this),
                new Wave_Boss(this),
                new Wave_Win(this),
            ]
            this.currentWave = this.waves[8] //DEBUG PURPOSES CHANGE LATER
            this.currentWave.enter()

            setSfxVolume(this.sfx)
            this.startingTime = performance.now()
            this.totalTimePlaying = 0
        }

        get formattedTime() {
            let time = new Date(Math.floor(this.totalTimePlaying))
            let minutes = time.getMinutes()
            let seconds = time.getSeconds()

            return `${
                minutes > 0 ? minutes : ""
            } ${minutes ? "minute" + (minutes > 1 ? "s" : "") : ""} ${seconds} ${"second" + (seconds > 1 ? "s" : "")}`
        }

        handleTimer() {
            if (isPaused || this.currentWave.waveIndex === 10) {
                const timer = performance.now() - this.startingTime
                this.totalTimePlaying += timer
            } else this.startingTime = performance.now()
        }

        update(deltaTime, input) {
            this.background.update()
            this.music.update(deltaTime)
            if (!this.player.isGameOver) {
                this.player.update(deltaTime, input)
            }

            if (this.scrollSpeed > DEFAULT_SCROLL_SPEED)
                this.scrollSpeed -= 0.03
            if (this.recoveryTime > 0 && this.isRecovering)
                this.recoveryTime -= deltaTime
            else if (this.recoveryTime <= 0) {
                this.recoveryTime = 0
                this.isRecovering = false
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
            })
            this.enemies = this.enemies.filter(enemy => !enemy.deleteEnemy)
            if (
                this.currentWave.enemyFrequency &&
                this.enemyTimer > this.currentWave.enemyFrequency &&
                this.enemies.length < this.currentWave.maxEnemies
            ) {
                this.enemyTimer = 0
                this.currentWave.addEnemy()
            } else {
                this.enemyTimer += deltaTime
            }

            //SWITCH WAVES
            if (
                this.currentWave.enemiesToDefeat &&
                this.player.enemiesDefeated >= this.currentWave.enemiesToDefeat
            ) {
                this.player.enemiesDefeated = 0
                this.currentWave.exit()
            }

            this.particles = this.particles.filter(
                particle => !particle.markedForDeletion
            )
            this.particles.forEach(particle => particle.update(deltaTime))
            this.UI.update(deltaTime)
            if (isPaused) {
                this.handleTimer()
            }
        }

        draw(context) {
            if (isPaused) context.filter = `blur(${BLUR_VALUE})`
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.particles.forEach(particle => particle.draw(context))
            this.UI.draw(context)
        }

        stickyFriction(stickyMultiplier) {
            const sticky = this.deltaTime * -3 * stickyMultiplier
            if (this.player.frameTimer >= 0) this.player.frameTimer += sticky
            this.enemies.forEach(enemy => {
                if (enemy.state?.state === "EXPLODE") return
                if (enemy.frameTimer >= 0) enemy.frameTimer += sticky
            })
            this.enemyTimer += sticky
        }

        endGame() {
            this.music.currentTheme.pause()
            this.music.currentTheme.currentTime = 0
            isPaused = false
            this.isOn = false
            lastTime = 0
            this.input.removeEventListeners()
            cancelAnimationFrame(gameRequestId)
            this.gameIsStarting = false

            mainMenu.classList.remove("game-is-on")
        }
    }

    let game
    let lastTime = 0
    let gameRequestId

    const GameButtonText = {
        NEW: "New Game",
        QUIT: "Quit Game",
    }

    this.animate = function animate(timestamp) {
        if (timestamp === 0) game.handleTimer()
        let deltaTime = timestamp - lastTime
        lastTime = timestamp
        game.deltaTime = deltaTime

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime, game.input)
        game.draw(ctx)
        if (isPaused) cancelAnimationFrame(gameRequestId)
        else gameRequestId = requestAnimationFrame(animate)
    }

    newGameBtn.addEventListener("click", () => {
        game?.isOn ? confirmGameEnd() : startNewGame()
    })

    function confirmGameEnd() {
        isPaused = true
        confirm("quit", quitGame)
    }
    function confirmGameRestart() {
        isPaused = true
        confirm('restart', restartGame)
    }

    function quitGame() {
        game.endGame()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        newGameBtn.textContent = GameButtonText.NEW
        restartGameBtn.disabled = true
        editContolsBtn.disabled = true
    }

    function startNewGame() {
        game = new Game(canvas.width, canvas.height)
        newGameBtn.textContent = GameButtonText.QUIT
        restartGameBtn.disabled = false
        document.activeElement.blur()
        lastTime = 0
        isPaused = false
        mainMenu.classList.add("game-is-on")
        game.gameIsStarting = true

        animate(0)
    }
    function restartGame() {
        quitGame()
        startNewGame()
    }
})
