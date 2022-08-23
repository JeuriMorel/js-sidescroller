import { qs, qsa } from "./utils.js"
import { Background } from "./background.js"
import { LAYER_HEIGHT, LAYER_WIDTH } from "./constants.js"

const canvas = qs("canvas")
const ctx = canvas.getContext("2d")
canvas.width = LAYER_WIDTH
canvas.height = LAYER_HEIGHT

class Game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.groundMargin = 65
        this.background = new Background(this)
        this.speed = 3
    }
    update() {
        this.background.update()
    }

    draw(context) {
        this.background.draw(context)
    }
}

const game = new Game(canvas.width, canvas.height)

function animate() {
    game.update()
    game.draw(ctx)
    requestAnimationFrame(animate)
}

animate()
console.log(game)
