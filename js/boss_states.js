import { Boom } from "./particles.js"
import { qs } from "./utils.js"

export const STATES = {
    RETREAT: 0,
    ATTACK: 1,
    IDLE: 2,
    JUMP_DOWN: 3,
    JUMP_FORWARD: 4,
    GOT_HIT: 5,
    DEFEATED: 6,
}

class Boss_State {
    constructor(state) {
        this.state = state
    }
}

export class Attack extends Boss_State {
    constructor(boss) {
        super("ATTACK")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = 609
        this.boss.spriteHeight = 393
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 30
        this.boss.image = qs("#attack")
        this.boss.horizontalSpeed = 0
        this.boss.x -= this.boss.attackOffsetX
        this.boss.hurtbox.body.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.body.xOffset += this.boss.attackOffsetX
        this.boss.hurtbox.tongue.xOffset += this.boss.attackOffsetX
        this.boss.hurtbox.tongue.isActive = true
        this.boss.hitbox.tongue.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.tongue.isActive = true
        this.boss.hitbox.claws.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.claws.isActive = true
    }
    update() {
        this.boss.x -= this.boss.horizontalSpeed + this.boss.game.scrollSpeed
        if (this.boss.frame === 14) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX -
                75
            this.boss.audio.tongue.play()
            this.boss.hitbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX -
                75
        }
        if (this.boss.frame === 15) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX -
                145
            this.boss.hitbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX -
                145
        }
        if (this.boss.frame === 17) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX -
                80
            this.boss.hitbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX
        }
        if (this.boss.frame === 18) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width *
                    this.boss.idleXOffsetModifier *
                    this.boss.sizeModifier +
                this.boss.attackOffsetX
        }

        if (this.boss.frame === this.boss.maxFrame) {
            this.boss.hurtbox.tongue.isActive = false
            this.boss.hitbox.tongue.isActive = false
            this.boss.x += this.boss.attackOffsetX
            this.boss.setState(2)
        }
    }
}
export class Retreat extends Boss_State {
    constructor(boss) {
        super("RETREAT")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.horizontalSpeed = 3
        this.boss.spriteWidth = 467
        this.boss.spriteHeight = 393
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 22
        this.boss.image = qs("#retreat")
        this.boss.resetBoxes()
        this.boss.audio.retreat.play()
    }
    update() {
        this.boss.x += this.boss.game.scrollSpeed + this.boss.horizontalSpeed
        if (this.boss.frame % 5 === 0)
            this.boss.game.particles.push(
                new Boom({
                    game: this.boss.game,
                    x:
                        this.boss.x +
                        this.boss.width * Math.random() * 0.5 +
                        0.5,
                    y: this.boss.game.height - this.boss.game.groundMargin,
                    sizeModifier: 0.2,
                    src: null,
                })
            )
        if (this.boss.x >= this.boss.game.width - this.boss.width)
            this.boss.setState(2)
    }
}
export class Idle extends Boss_State {
    constructor(boss) {
        super("IDLE")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = 446
        this.boss.spriteHeight = 395
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 30
        this.boss.image = qs("#idle")
        this.boss.horizontalSpeed = 0
        this.boss.resetBoxes()
    }
    update() {
        this.boss.x -= this.boss.horizontalSpeed + this.boss.game.scrollSpeed
        if (this.boss.x <= this.boss.game.width * 0.5) this.boss.setState(0)
    }
}
export class Jump_Down extends Boss_State {
    constructor(boss) {
        super("JUMP_DOWN")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = 647
        this.boss.spriteHeight = 432
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 20
        this.boss.image = qs("#jump_down")
        this.boss.hitbox.claws.width =
            this.boss.width * 0.6 * this.boss.sizeModifier
        this.boss.hitbox.claws.yOffset =
            this.boss.height * 1.75 * this.boss.sizeModifier
    }
    update() {
        if (this.boss.isOnGround()) this.boss.setState(STATES.IDLE)
    }
}
export class Jump_Forward extends Boss_State {
    constructor(boss) {
        super("JUMP_FORWARD")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = 707
        this.boss.spriteHeight = 491
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 20
        this.boss.image = qs("#jump_up")
        this.boss.velocityY -= 55
        this.boss.jumpTarget =
            this.boss.game.player.x < this.boss.x
                ? this.boss.game.player.x
                : this.boss.game.width - this.boss.width
        this.boss.hitbox.claws.width *= 1.5
        this.boss.audio.jump.play()
        this.boss.game.particles.push(
            new Boom({
                game: this.boss.game,
                x: this.boss.x + this.boss.width * 0.5,
                y: this.boss.game.height - this.boss.game.groundMargin,
                sizeModifier: 2,
                src: null,
            })
        )
    }
    update() {
        if (this.boss.velocityY > 0) this.boss.setState(STATES.JUMP_DOWN)
    }
}
export class Got_Hit extends Boss_State {
    constructor(boss) {
        super("GOT_HIT")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.horizontalSpeed = 35
        this.boss.spriteWidth = 494
        this.boss.spriteHeight = 396
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 16
        this.boss.image = qs("#got_hit")
        this.boss.hurtbox.body.isActive = false
        this.boss.hurtbox.tongue.isActive = false
        this.boss.hitbox.tongue.isActive = false
    }
    update() {
        this.boss.x += this.boss.horizontalSpeed + this.boss.game.scrollSpeed

        if (this.boss.x > this.boss.game.width - this.boss.width)
            this.boss.x = this.boss.game.width - this.boss.width

        if (this.boss.frame === this.boss.maxFrame) {
            this.boss.hurtbox.body.isActive = true
            this.boss.hurtbox.tongue.isActive = true
            this.boss.setState(STATES.RETREAT)
        }
    }
}
export class Defeated extends Boss_State {
    constructor(boss) {
        super("DEFEATED")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = 522
        this.boss.spriteHeight = 475
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 50
        this.boss.image = qs("#defeated")
    }
    update() {}
}
