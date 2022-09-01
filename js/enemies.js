import {
    ANGRY_EGG_HEIGHT,
    ANGRY_EGG_WIDTH,
    GHOST_WIDTH,
    GHOST_HEIGHT,
    CRAWLER_WIDTH,
    CRAWLER_HEIGHT,
} from "./constants.js"
import { qs } from "./utils.js"

import { Explosion } from "./particles.js"

class Enemy {
    constructor(game) {
        this.game = game
        this.animationSheet = 0
        this.frame = 0
        this.deleteEnemy = false
        this.invulnerabilityTime = 0
    }
    update(deltaTime) {
        this.x -= this.horizontalSpeed + this.game.scrollSpeed
        if (this.x < -this.game.width - this.width) this.deleteEnemy = true
        if (this.healthPoints <= 0)
            this.game.particles.push(
                new Explosion(
                    this.game,
                    this.x + (this.width * 0.5),
                    this.y + (this.height * 0.5),
                    this.sizeModifier,
                    this.constructor.name
                )
            )
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime
        }
        if (this.healthPoints <= 0) this.deleteEnemy = true
        this.updateHitboxes()
        if (this.invulnerabilityTime > 0) this.invulnerabilityTime -= deltaTime
        else this.hurtbox.body.isActive = true
    }
    draw(context) {
        if (this.hurtbox.body.isActive) {
            context.strokeStyle = "black"
            context.beginPath()
            context.rect(
                this.hurtbox.body.x,
                this.hurtbox.body.y,
                this.hurtbox.body.width,
                this.hurtbox.body.height
            )
            context.stroke()
        }
        if (this.hitbox.isActive) {
            context.strokeStyle = "#ff0000"
            context.beginPath()
            context.rect(
                this.hitbox.x,
                this.hitbox.y,
                this.hitbox.width,
                this.hitbox.height
            )
            context.stroke()
        }
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
    updateHitboxes() {
        this.hurtbox.body.x = this.x + this.hurtbox.body.xOffset
        this.hurtbox.body.y = this.y + this.hurtbox.body.yOffset
        this.hitbox.x = this.x + this.hitbox.xOffset
        this.hitbox.y = this.y + this.hitbox.yOffset
    }
}

export class AngryEgg extends Enemy {
    constructor(game) {
        super(game)

        this.healthPoints = 20
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
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: this.width * 0.17,
                yOffset: this.height * 0.2,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.6,
                height: this.height * 0.75,
            },
        }
        this.hitbox = {
            isActive: true,
            xOffset: this.width * 0.1,
            yOffset: this.height * 0.35,
            x: this.x + this.xOffset,
            y: this.y + this.yOffset,
            width: this.width * 0.3,
            height: this.height * 0.5,
        }
    }
}
export class Crawler extends Enemy {
    constructor(game) {
        super(game)

        this.transparency = 0.95
        this.healthPoints = 50

        this.maxFrame = 12
        this.fps = 15
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sizeModifier = Math.random() * 0.4 + 0.5
        this.spriteWidth = CRAWLER_WIDTH
        this.spriteHeight = CRAWLER_HEIGHT
        this.width = CRAWLER_WIDTH * this.sizeModifier
        this.height = CRAWLER_HEIGHT * this.sizeModifier
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.leftBound =
            this.game.player.width * 0.5 + this.game.player.starting_x
        this.horizontalSpeed = 0.5
        this.image = qs("#crawler")
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: 0,
                yOffset: this.width * 0.5,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width,
                height: this.height * 0.45,
            },
        }
        this.hitbox = {
            isActive: true,
            xOffset: this.width * 0.06,
            yOffset: this.width * 0.65,
            x: this.x + this.xOffset,
            y: this.y + this.yOffset,
            width: this.width * 0.9,
            height: this.height * 0.25,
        }
    }
    update(deltaTime) {
        if (this.x < this.leftBound) {
            this.horizontalSpeed = -25
            this.fps = 60
            this.transparency = 0.075
            this.hurtbox.body.isActive = false
            this.hitbox.isActive = false
        } else if (this.x > this.game.width - this.width * 0.5) {
            this.horizontalSpeed = 0.5
            this.fps = 15
            this.transparency = 0.95
            this.hurtbox.body.isActive = true
            this.hitbox.isActive = true
        }
        super.update(deltaTime)
    }
    draw(context) {
        context.save()
        context.globalAlpha = this.transparency
        super.draw(context)
        context.restore()
    }
}
export class Ghost extends Enemy {
    constructor(game) {
        super(game)

        this.healthPoints = 20
        this.transparency = Math.random() * 0.2 + 0.3
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
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: 0,
                yOffset: this.width * 0.1,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.9,
                height: this.height * 0.7,
            },
        }
        this.hitbox = {
            isActive: true,
            xOffset: 0,
            yOffset: this.width * 0.1,
            x: this.x + this.xOffset,
            y: this.y + this.yOffset,
            width: this.width * 0.9,
            height: this.height * 0.7,
        }
    }
    update(deltaTime) {
        super.update(deltaTime)
        this.y += Math.sin(this.angle) * this.curve
        this.angle += 0.05
    }

    draw(context) {
        context.save()
        if (this.frame % 4 == 0) {
            context.globalAlpha = this.transparency
        } else context.globalAlpha = this.transparency - 0.1
        super.draw(context)
        context.restore()
    }
}
