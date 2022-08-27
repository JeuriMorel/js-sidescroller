import {
    ANGRY_EGG_HEIGHT,
    ANGRY_EGG_WIDTH,
    GHOST_WIDTH,
    GHOST_HEIGHT,
} from "./constants.js"
import { qs } from "./utils.js"

class Enemy {
    constructor(game) {
        this.game = game
        this.animationSheet = 0
        this.frame = 0
        this.deleteEnemy = false
    }
    update(deltaTime) {
        this.x -= this.horizontalSpeed + this.game.scrollSpeed
        if (this.x < -this.game.width - this.width) this.deleteEnemy = true
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
            this.frame * this.spriteWidth,
            this.animationSheet * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
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
        this.sizeModifier = Math.random() * 0.4 + 0.5
        this.spriteWidth = ANGRY_EGG_WIDTH 
        this.spriteHeight = ANGRY_EGG_HEIGHT 
        this.width = ANGRY_EGG_WIDTH * this.sizeModifier
        this.height = ANGRY_EGG_HEIGHT * this.sizeModifier
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.horizontalSpeed = 0
        this.image = qs("#angryEgg")
    }
}
export class Ghost extends Enemy {
    constructor(game) {
        super(game)
        this.transparancy = Math.random() * 0.2 + 0.3
        this.maxFrame = 10
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sizeModifier = Math.random() * 0.5 + 0.2
        this.spriteWidth = GHOST_WIDTH
        this.spriteHeight = GHOST_HEIGHT
        this.width = GHOST_WIDTH * this.sizeModifier
        this.height = GHOST_HEIGHT * this.sizeModifier
        this.horizontalSpeed = 2
        this.x = this.game.width
        this.y =
            (this.game.height - this.height - this.game.groundMargin) *
            Math.random()
        this.image = qs("#ghost")
        //Flying Pattern
        this.angle = 0
        this.curve = Math.random() * 6
    }
    update(deltaTime) {
        super.update(deltaTime)
        this.y += Math.sin(this.angle) * this.curve
        this.angle += 0.05
    }

    draw(context) {
        context.save()
        context.globalAlpha = this.transparancy
        context.drawImage(
            this.image,
            this.frame * this.spriteWidth,
            this.animationSheet * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        )
        context.restore()
    }
}
