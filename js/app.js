import { qs, qsa } from "./utils.js"
import { Background } from "./background.js"
import { LAYER_HEIGHT, LAYER_WIDTH, DEFAULT_SCROLL_SPEED } from "./constants.js"
import { Player } from "./player.js"
import InputHandler from "./inputs.js"
import { AngryEgg, Ghost, Crawler } from "./enemies.js"
import { Armored_Frog } from "./boss.js"

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
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.enemyFrequency = 2500
            this.enemyTimer = 0
            this.enemies = [new Armored_Frog(this)]
            this.particles = []
            this.maxEnemies = 5
            this.recoveryTime = 0
            this.isRecovering = false
        }
        update(deltaTime, input) {
            this.background.update()
            this.player.update(deltaTime, input)
            if (this.scrollSpeed > DEFAULT_SCROLL_SPEED) this.scrollSpeed -= 0.03
            if (this.recoveryTime > 0 && this.isRecovering) this.recoveryTime -= deltaTime
            else if (this.recoveryTime <= 0) {
                this.recoveryTime = 0
                this.isRecovering = false
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
            })
            this.enemies = this.enemies.filter(enemy => !enemy.deleteEnemy)
            // if (this.enemyTimer > this.enemyFrequency && this.enemies.length < this.maxEnemies) {
            //     this.enemyTimer = 0
            //     this.addEnemy()
            // } else {
            //     this.enemyTimer += deltaTime
            // }

            this.particles = this.particles.filter(particle => !particle.markedForDeletion)
            this.particles.forEach(particle => particle.update(deltaTime))

        }

        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.particles.forEach(particle => particle.draw(context))
        }

        addEnemy() {
            if (Math.random() > 0.7) this.enemies.push(new Ghost(this))
            else if (Math.random() > 0.4 && !this.enemies.some(obj => obj instanceof Crawler)) this.enemies.push(new Crawler(this))
            else this.enemies.push(new AngryEgg(this))

        }
    }

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0

    function animate(timestamp) {
        let deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime, game.input)
        game.draw(ctx)
        requestAnimationFrame(animate)
    }

    animate(0)
})