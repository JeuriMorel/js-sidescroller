import { qs } from "./utils.js"
import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants.js"

export class Player {
    constructor(game) {
        this.game = game
        this.width = SPRITE_WIDTH
        this.height = SPRITE_HEIGHT
        this.x = 100
        this.y = this.game.height - this.height - this.game.groundMargin
        this.image = qs("#player")
        this.frame = 0
        this.maxFrame = 11
        this.state = 9
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
    }
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime
        }
    }
    draw(context) {
        context.drawImage(
            this.image,
            this.state * this.width,
            this.frame * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}
