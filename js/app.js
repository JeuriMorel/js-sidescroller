import { qs, qsa } from "./utils.js"
import { Background } from "./background.js"
import { LAYER_HEIGHT, LAYER_WIDTH } from "./constants.js"
import { Player } from "./player.js"

const canvas = qs("canvas")
const ctx = canvas.getContext("2d")
canvas.width = LAYER_WIDTH * 0.5
canvas.height = LAYER_HEIGHT

class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.groundMargin = 65
        this.speed = 3
        this.background = new Background(this)
        this.player = new Player(this)
    }
    update(deltaTime) {
        this.background.update()
        this.player.update(deltaTime)
    }

    draw(context) {
        this.background.draw(context)
        this.player.draw(context)
    }
}

const game = new Game(canvas.width, canvas.height)
let lastTime = 0

function animate(timestamp) {
    let deltaTime = timestamp - lastTime
    lastTime = timestamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update(deltaTime)
    game.draw(ctx)
    requestAnimationFrame(animate)
}

animate(0)
