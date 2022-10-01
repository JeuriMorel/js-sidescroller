import {
    ANGRY_EGG_HEIGHT,
    ANGRY_EGG_WIDTH,
    GHOST_WIDTH,
    GHOST_HEIGHT,
    CRAWLER_WIDTH,
    CRAWLER_HEIGHT,
    SOUND_CRACKS_1,
    SOUND_CRACKS_2,
    SOUND_GHOST_DIE,
    BEE_WIDTH,
    BEE_HEIGHT,
    SOUND_CLAW_STRIKE,
} from "./constants.js"
import { qs } from "./utils.js"

import { Boom, Smoke } from "./particles.js"
import { HealthBar } from "./health_bar.js"

class Enemy {
    constructor(game) {
        this.game = game
        this.animationSheet = 0
        this.frame = 0
        this.deleteEnemy = false
        this.invulnerabilityTime = 0
        this.markedForRecoil = false
        this.recoilSpeeds = {
            Claw: 35,
            Dash: 15,
            Jump: 10,
            Up_Roll: 15,
            Down_Roll: 20,
            Bite: 20,
        }
    }
    get enemyName() {
        return this.constructor.name
    }
    isOnGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    tossInAir() {
        this.velocityY -= 45 * this.sizeModifier
    }
    update(deltaTime) {
        this.x -= this.horizontalSpeed + this.game.scrollSpeed
        if (this.x < -this.game.width - this.width) this.deleteEnemy = true
        //
        // if (this.frameTimer > this.frameInterval && this.markedForRecoil) {
        //     this.horizontalSpeed -= 35
        //     this.markedForRecoil = false
        // }
        // if (this.horizontalSpeed <= 0) this.horizontalSpeed += this.weight
        // if (this.horizontalSpeed > this.defaultHorizontalSpeed)
        //     this.horizontalSpeed = this.defaultHorizontalSpeed
        //
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime
        }
        if (this.healthPoints <= 0) this.deleteEnemy = true
        this.updateHitboxes()
        if (this.invulnerabilityTime > 0) {
            this.invulnerabilityTime -= deltaTime
            this.hitbox.body.isActive = false
        } else {
            this.hurtbox.body.isActive = true
            this.hitbox.body.isActive = true
        }

        if (this.healthBar) this.healthBar.updatePosition(this.x, this.y)
    }
    draw(context) {
        if (this.healthBar) this.healthBar.draw(context)
        // if (this.hurtbox.body.isActive) {
        //     context.strokeStyle = "black"
        //     context.beginPath()
        //     context.rect(
        //         this.hurtbox.body.x,
        //         this.hurtbox.body.y,
        //         this.hurtbox.body.width,
        //         this.hurtbox.body.height
        //     )
        //     context.stroke()
        // }
        // if (this.hitbox.body.isActive) {
        //     context.strokeStyle = "#ff0000"
        //     context.beginPath()
        //     context.rect(
        //         this.hitbox.body.x,
        //         this.hitbox.body.y,
        //         this.hitbox.body.width,
        //         this.hitbox.body.height
        //     )
        //     context.stroke()
        // }
        if (this.invulnerabilityTime > 0) {
            context.save()
            context.globalAlpha = Math.random() * 0.5 + 0.4
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
        context.restore()
    }
    updateHitboxes() {
        this.hurtbox.body.x = this.x + this.hurtbox.body.xOffset
        this.hurtbox.body.y = this.y + this.hurtbox.body.yOffset
        this.hitbox.body.x = this.x + this.hitbox.body.xOffset
        this.hitbox.body.y = this.y + this.hitbox.body.yOffset
    }
    resolveCollision({ target, attackDamage }) {
        if (target === "enemy is attacked") {
            this.healthPoints -= attackDamage - this.defence
            this.markedForRecoil = true
        }
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
        this.healthPoints = 50 * this.sizeModifier
        this.spriteWidth = ANGRY_EGG_WIDTH
        this.spriteHeight = ANGRY_EGG_HEIGHT
        this.width = ANGRY_EGG_WIDTH * this.sizeModifier
        this.height = ANGRY_EGG_HEIGHT * this.sizeModifier
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.defaultHorizontalSpeed = 0
        this.horizontalSpeed = 0
        this.defence = Math.round(5 * this.sizeModifier + 2)
        // this.markedForRecoil = false
        this.attackDirection
        this.image = qs("#angryEgg")
        this.src = Math.random() > 0.5 ? SOUND_CRACKS_1 : SOUND_CRACKS_2
        this.weight = 3 * this.sizeModifier
        this.velocityY = 0
        this.healthBar = new HealthBar({
            x: this.x,
            y: this.y,
            width: this.width,
            height: 15 * this.sizeModifier,
            maxhealth: this.healthPoints,
        })
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
            body: {
                isActive: true,
                xOffset: this.width * 0.2,
                yOffset: this.height * 0.35,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.3,
                height: this.height * 0.5,
            },
        }
    }
    update(deltaTime) {
        if (
            this.frameTimer + deltaTime > this.frameInterval &&
            this.markedForRecoil
        ) {
            this.horizontalSpeed -= this.recoilSpeeds[this.attackType]
            if (this.healthBar) this.healthBar.updateBar(this.healthPoints)
            this.markedForRecoil = false
        }
        super.update(deltaTime)
        if (this.horizontalSpeed <= 0) this.horizontalSpeed += this.weight
        if (this.horizontalSpeed > this.defaultHorizontalSpeed)
            this.horizontalSpeed = this.defaultHorizontalSpeed
        if (this.healthPoints <= 0) {
            this.game.particles.push(
                new Smoke({
                    game: this.game,
                    x: this.x + this.width * 0.5,
                    y: this.y + this.height * 0.5,
                    sizeModifier: this.sizeModifier,
                    src: this.src,
                })
            )
            this.deleteEnemy = true
        }

        //vertical movement
        this.y += this.velocityY
        if (!this.isOnGround()) {
            this.velocityY += this.weight
        } else {
            this.velocityY = 0
        }
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.y = this.game.height - this.height - this.game.groundMargin
    }
    resolveCollision({ target, attackDamage, attackType }) {
        super.resolveCollision({ target, attackDamage })
        this.attackType = attackType
        if (this.attackType === "Dash") this.tossInAir()

        if (target === "player is attacked") {
            this.attackType = "Bite"
            this.markedForRecoil = true
        }
    }
}
export class Crawler extends Enemy {
    constructor(game) {
        super(game)

        this.transparency = 0.95
        this.teleportAudio = new Audio()
        this.teleportAudio.src = "./audio/teleport.wav"
        this.animationSheet = 1
        this.maxFrame = 12
        this.fps = 15
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sizeModifier = Math.random() * 0.4 + 0.5
        this.healthPoints = 75 * this.sizeModifier
        this.spriteWidth = CRAWLER_WIDTH
        this.spriteHeight = CRAWLER_HEIGHT
        this.width = CRAWLER_WIDTH * this.sizeModifier
        this.height = CRAWLER_HEIGHT * this.sizeModifier
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.leftBound =
            this.game.player.width * 0.5 + this.game.player.starting_x
        this.rightBound = this.game.width - this.width * 0.5
        this.defaultHorizontalSpeed = 0.5
        this.horizontalSpeed = 0.5
        this.defence = Math.round(10 * this.sizeModifier + 2)
        this.weight = 5 * this.sizeModifier
        this.image = qs("#crawler")
        this.src = Math.random() > 0.5 ? SOUND_CRACKS_1 : SOUND_CRACKS_2
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
            body: {
                isActive: true,
                xOffset: this.width * 0.06,
                yOffset: this.width * 0.65,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.9,
                height: this.height * 0.25,
            },
        }
        this.healthBar = new HealthBar({
            x: this.x,
            y: this.y,
            width: this.width,
            height: 20 * this.sizeModifier,
            maxhealth: this.healthPoints,
        })
        this.turnsUntilSpawn = 3
    }
    update(deltaTime) {
        if (
            this.frameTimer + deltaTime > this.frameInterval &&
            this.markedForRecoil
        ) {
            this.returnToRightBound()
            if (this.healthBar) this.healthBar.updateBar(this.healthPoints)
            this.markedForRecoil = false
        }
        super.update(deltaTime)
        if (this.x < this.leftBound) {
            this.returnToRightBound()
        } else if (this.x > this.rightBound) {
            this.x = this.game.width - this.width * 0.5
            if (this.turnsUntilSpawn > 0) {
                this.turnsUntilSpawn--
            } else {
                this.turnsUntilSpawn = 3
                this.switchToIdle()
            }
            this.transparency = 0.95

            if (this.animationSheet === 1) {
                this.horizontalSpeed = this.defaultHorizontalSpeed
                this.fps = 15
                this.hurtbox.body.isActive = true
                this.hitbox.body.isActive = true
            }
        }
        if (this.frame === this.maxFrame && this.animationSheet === 0) {
            this.spawn()
        }

        if (this.healthPoints <= 0)
            this.game.particles.push(
                new Smoke({
                    game: this.game,
                    x: this.x + this.width * 0.5,
                    y: this.y + this.height * 0.5,
                    sizeModifier: this.sizeModifier,
                    src: this.src,
                })
            )
    }
    draw(context) {
        context.save()
        context.globalAlpha = this.transparency
        super.draw(context)
        context.restore()
    }

    returnToRightBound() {
        this.teleportAudio.play()
        this.horizontalSpeed = -25
        this.fps = 60
        this.transparency = 0.075
        this.hurtbox.body.isActive = false
        this.hitbox.body.isActive = false
    }
    spawn() {
        let numberOfSpawns = Math.floor(Math.random() * 7 + 3)
        for (let i = 0; i <= numberOfSpawns; i++) {
            this.game.enemies.push(
                new Spawn(this.game, this.x + this.width * 0.5)
            )
        }
        this.switchToWalking()
    }
    switchToIdle() {
        this.animationSheet = 0
        this.maxFrame = 7
        this.horizontalSpeed = 0
    }
    switchToWalking() {
        this.animationSheet = 1
        this.maxFrame = 12
        this.transparency = 0.95
        this.horizontalSpeed = 0.5
    }
}
export class Spawn extends Enemy {
    constructor(game, x) {
        super(game)

        this.transparency = 0.95
        this.healthPoints = 20
        this.animationSheet = 1

        this.maxFrame = 12
        this.fps = 15
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sizeModifier = 0.2
        this.spriteWidth = CRAWLER_WIDTH
        this.spriteHeight = CRAWLER_HEIGHT
        this.width = CRAWLER_WIDTH * this.sizeModifier
        this.height = CRAWLER_HEIGHT * this.sizeModifier
        this.x = x
        this.y = this.game.height - this.height - this.game.groundMargin
        this.horizontalSpeed = Math.random() * 1 + 1
        this.image = qs("#crawler")
        this.src = Math.random() > 0.5 ? SOUND_CRACKS_1 : SOUND_CRACKS_2
        this.defence = 1
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
            body: {
                isActive: true,
                xOffset: this.width * 0.06,
                yOffset: this.width * 0.65,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.9,
                height: this.height * 0.25,
            },
        }
        this.healthBar = new HealthBar({
            x: this.x,
            y: this.y,
            width: this.width,
            height: 15 * this.sizeModifier,
            maxhealth: this.healthPoints,
        })
    }
    update(deltaTime) {
        super.update(deltaTime)
        if (this.healthPoints <= 0)
            this.game.particles.push(
                new Smoke({
                    game: this.game,
                    x: this.x + this.width * 0.5,
                    y: this.y + this.height * 0.5,
                    sizeModifier: this.sizeModifier,
                    src: this.src,
                })
            )
    }
    resolveCollision() {
        this.healthPoints = 0
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
        this.defence = 0
        //Flying Pattern
        this.angle = 0
        this.curve = Math.random() * 6
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: this.width * 0.1,
                yOffset: this.width * 0.1,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.9,
                height: this.height * 0.7,
            },
        }
        this.hitbox = {
            body: {
                isActive: true,
                xOffset: this.width * 0.15,
                yOffset: this.height * 0.1,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8,
                height: this.height * 0.65,
            },
        }
    }
    update(deltaTime) {
        super.update(deltaTime)
        if (this.healthPoints <= 0)
            this.game.particles.push(
                new Boom({
                    game: this.game,
                    x: this.x + this.width * 0.5,
                    y: this.y + this.height * 0.5,
                    sizeModifier: this.sizeModifier,
                    src: SOUND_GHOST_DIE,
                })
            )
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
    resolveCollision({ target }) {
        if (target === "enemy is attacked") {
            this.healthPoints = 0
        }
    }
}
export class Bee extends Enemy {
    constructor(game) {
        super(game)

        this.healthPoints = 20
        this.transparency = Math.random() * 0.2 + 0.3
        this.maxFrame = 12
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.sizeModifier = Math.random() * 0.4 + 0.2
        this.spriteWidth = BEE_WIDTH
        this.spriteHeight = BEE_HEIGHT
        this.width = BEE_WIDTH * this.sizeModifier
        this.height = BEE_HEIGHT * this.sizeModifier
        this.horizontalSpeed = 2
        this.attackTimer = 0
        this.attackInterval = 4000
        this.isAttacking = false
        this.isReturning = false
        this.target = {
            x: 0,
            y: 0,
        }
        this.previousPosition = {
            x: 0,
            y: 0,
        }
        this.x = this.game.width
        this.y =
            (this.game.height - this.height - this.game.groundMargin) *
            Math.random()
        this.image = qs("#bee")
        this.defence = 0
        //Flying Pattern
        this.angle = 0
        this.curve = Math.random() * 6
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: this.width * 0.1,
                yOffset: this.width * 0.1,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.9,
                height: this.height * 0.7,
            },
        }
        this.hitbox = {
            body: {
                isActive: true,
                xOffset: this.width * 0.15,
                yOffset: this.height * 0.1,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8,
                height: this.height * 0.65,
            },
        }
    }

    update(deltaTime) {
        super.update(deltaTime)
        if (!this.isAttacking) {
            this.x += Math.random() * 3 - 1.5
            this.y += Math.random() * 5 - 2.5
        } else {
            this.x += (this.target.x - this.x) * 0.05
            this.y += (this.target.y - this.y) * 0.05
        }
        //RETURN TO POSITION
        if (this.x <= this.target.x + 10) {
            this.isReturning = true
            this.attackTimer = 0
        }
        if (this.isReturning) {
            this.x += (this.previousPosition.x - this.x) * 0.1
            this.y += (this.previousPosition.y - this.y) * 0.1
            this.isAttacking = false
        }

        //ATTACk
        if (this.attackTimer >= this.attackInterval) {
            this.isReturning = false
            this.isAttacking = true
            this.attackTimer = 0
            this.target.x = this.game.player.x
            this.target.y = this.game.player.y
            this.previousPosition.x = this.x
            this.previousPosition.y = this.y + this.game.player.height
        } else if (!this.isAttacking && this.x > this.game.width * 0.3)
            this.attackTimer += deltaTime

        //HEALTH
        if (this.healthPoints <= 0)
            this.game.particles.push(
                new Boom({
                    game: this.game,
                    x: this.x + this.width * 0.5,
                    y: this.y + this.height * 0.5,
                    sizeModifier: this.sizeModifier,
                    src: SOUND_CLAW_STRIKE,
                })
            )

        // this.y += Math.sin(this.angle) * this.curve
        // this.angle += 0.05
    }

    // draw(context) {
    //     context.save()
    //     if (this.frame % 4 == 0) {
    //         context.globalAlpha = this.transparency
    //     } else context.globalAlpha = this.transparency - 0.1
    //     super.draw(context)
    //     context.restore()
    // }
    resolveCollision({ target }) {
        if (target === "enemy is attacked") {
            this.healthPoints = 0
        }
    }
}
