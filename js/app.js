import { qs, qsa } from "./utils.js"
import { Background } from "./background.js"
import {
    LAYER_HEIGHT,
    LAYER_WIDTH,
    DEFAULT_SCROLL_SPEED,
    MUSIC_MAIN_THEME,
    MUSIC_FOREST_PATH,
    MUSIC_BOSS_FIGHT,
} from "./constants.js"
import { Player } from "./player.js"
import InputHandler from "./inputs.js"
import { AngryEgg, Ghost, Crawler, Bee, PumpKing } from "./enemies.js"
import { Armored_Frog } from "./boss.js"
import { HealthBar } from "./health_bar.js"
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

window.addEventListener("load", function () {
    const canvas = qs("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = LAYER_WIDTH * 0.5
    canvas.height = LAYER_HEIGHT

    class Game {
        constructor(width, height) {
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
            this.mainTheme = new Audio(MUSIC_MAIN_THEME)
            this.mainTheme.loop = true
            this.mainTheme.volume = 0.1
            this.forestTheme = new Audio(MUSIC_FOREST_PATH)
            this.bossTheme = new Audio(MUSIC_BOSS_FIGHT)
            this.bossTheme.volume = 0.1
            this.bossTheme.loop = true
            this.forestTheme.addEventListener("loadedmetadata", () => {
                this.forestThemeFadeOutPoint = this.forestTheme.duration - 5
            })
            this.themeTimer = 0
            this.themeInterval = 200
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
            this.currentWave = this.waves[0] //DEBUG PURPOSES CHANGE LATER
            this.currentWave.enter()
        }

        update(deltaTime, input) {
            this.background.update()
            if (!this.player.isGameOver) {
                this.player.update(deltaTime, input)
            }
            //FADE OUT FOREST PATH THEME
            if (
                !this.forestTheme.paused &&
                this.forestTheme.currentTime >= this.forestThemeFadeOutPoint &&
                this.forestTheme.volume > 0.2 &&
                !this.forestTheme.ended
            ) {
                if (this.themeTimer > this.themeInterval) {
                    this.forestTheme.volume -= 0.1
                    this.themeTimer = 0
                } else this.themeTimer += deltaTime
            }
            //FADE IN MAIN THEME
            if (
                !this.mainTheme.paused &&
                !this.mainTheme.ended &&
                this.mainTheme.currentTime > 0 &&
                this.mainTheme.volume < 1
            ) {
                if (this.themeTimer > this.themeInterval) {
                    this.mainTheme.volume = Math.min(
                        this.mainTheme.volume + 0.01,
                        1
                    )
                    this.themeTimer = 0
                } else this.themeTimer += deltaTime
            }
            //FADE IN BOSS THEME
            if (
                !this.bossTheme.paused &&
                !this.bossTheme.ended &&
                this.bossTheme.currentTime > 0 &&
                this.bossTheme.volume < 1
            ) {
                if (this.themeTimer > this.themeInterval) {
                    this.bossTheme.volume = Math.min(
                        this.bossTheme.volume + 0.01,
                        1
                    )
                    this.themeTimer = 0
                } else this.themeTimer += deltaTime
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
    }

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0

    function animate(timestamp) {
        let deltaTime = timestamp - lastTime
        lastTime = timestamp
        game.deltaTime = deltaTime
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime, game.input)
        game.draw(ctx)
        requestAnimationFrame(animate)
    }

    animate(0)
})
