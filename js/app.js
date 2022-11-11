import { qs, setSfxVolume } from "./utils.js"
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

export let isPaused = false
export function togglePause() {
    isPaused = !isPaused
    if (!isPaused) animate(0)
}

window.addEventListener("load", function () {
    const canvas = qs("canvas")
    const ctx = canvas.getContext("2d")
    const newGameBtn = qs('[data-btn="new-game"]')
    canvas.width = LAYER_WIDTH * 0.5
    canvas.height = LAYER_HEIGHT

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
            this.currentWave = this.waves[9] //DEBUG PURPOSES CHANGE LATER
            this.currentWave.enter()

            setSfxVolume(this.sfx)
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
        if (confirm("Are you sure you want to quit the game?")) quitGame()
    }

    function quitGame() {
        game.endGame()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        newGameBtn.textContent = GameButtonText.NEW
    }

    function startNewGame() {
        game = new Game(canvas.width, canvas.height)
        newGameBtn.textContent = GameButtonText.QUIT
        document.activeElement.blur()
        animate(0)
    }

    // window.addEventListener('keydown', e => {
    //     if (e.key === 'i') {
    //         console.table(game.input.keysPressed)
    //     }
    // })
})
