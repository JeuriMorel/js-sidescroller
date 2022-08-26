import { qs, qsa } from "./utils.js"
import { Background } from "./background.js"
import { LAYER_HEIGHT, LAYER_WIDTH, DEFAULT_SCROLL_SPEED } from "./constants.js"
import { Player } from "./player.js"
import InputHandler from "./inputs.js"
import { AngryEgg} from "./enemies.js"

window.addEventListener("load", function () {
    const canvas = qs("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = LAYER_WIDTH * 0.5
    canvas.height = LAYER_HEIGHT

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 65
            this.scrollSpeed = DEFAULT_SCROLL_SPEED
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler()
            this.enemyFrequency = 1500
            this.enemyTimer = 0
            this.enemies = []
            this.maxEnemies = 5
        }
        update(deltaTime, input) {
            this.background.update()
            this.player.update(deltaTime, input)
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
            })
            this.enemies = this.enemies.filter(enemy => !enemy.deleteEnemy)
            if (this.enemyTimer > this.enemyFrequency && this.enemies.length < this.maxEnemies) {
                this.enemyTimer = 0
                if(Math.random() > 0.5) this.enemies.push(new AngryEgg(this))
            } else {
                this.enemyTimer += deltaTime
            }

        }

        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
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