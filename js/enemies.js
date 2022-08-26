import { ANGRY_EGG_HEIGHT, ANGRY_EGG_WIDTH } from "./constants.js"
import {qs} from "./utils.js"

class Enemy {
    constructor(game) {
        this.game = game
        this.animationSheet = 0
        this.frame = 0
        this.deleteEnemy = false
    }
    update(deltaTime) {
        this.x -= this.game.scrollSpeed
        if(this.x < -this.game.width - this.width) this.deleteEnemy = true
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
            this.frame * this.width,
            this.animationSheet * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

export class AngryEgg extends Enemy {
    constructor(game) {
        super(game)
        
        this.maxFrame = 38
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.width = ANGRY_EGG_WIDTH
        this.height = ANGRY_EGG_HEIGHT
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.image = qs('#angryEgg')
    }
}
