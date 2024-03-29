// import { SOUND_DIMENSION_SUCK } from "./constants.js"
import { Boom, Boom_V2, Smoke } from "./particles.js"

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
        this.spriteWidth = 304.5 //609
        this.spriteHeight = 196 //393
        this.width = this.spriteWidth * this.boss.sizeModifier * 2
        this.height = this.spriteHeight * this.boss.sizeModifier * 2
    }

    enter() {
        this.boss.frame = 0
        this.boss.resetBoxes()
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 30
        this.boss.image = this.boss.sprite_sheets.attack
        this.boss.horizontalSpeed = 0
        this.boss.x -= this.boss.attackOffsetX
        this.boss.hurtbox.body.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.body.xOffset += this.boss.attackOffsetX
        this.boss.hurtbox.tongue.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.tongue.xOffset += this.boss.attackOffsetX
        this.boss.hitbox.claws.xOffset += this.boss.attackOffsetX
        this.boss.hurtbox.tongue.isActive = true
        this.boss.hitbox.tongue.isActive = true
        this.boss.hitbox.claws.isActive = true
        this.boss.velocityY = 0
        this.boss.y =
            this.boss.game.height -
            this.boss.height * this.boss.spriteGroundOffsetModifier -
            this.boss.game.groundMargin
    }
    update() {
        this.boss.x -= this.boss.game.scrollSpeed

        if (this.boss.isFirstRefreshOnCurrentFrame()) {
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
            } else if (this.boss.frame === 15) {
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
            } else if (this.boss.frame === 17) {
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
            } else if (this.boss.frame === 18) {
                this.boss.hurtbox.tongue.xOffset =
                    this.boss.width *
                        this.boss.idleXOffsetModifier *
                        this.boss.sizeModifier +
                    this.boss.attackOffsetX
            }
        }

        this.boss.lastFinishedFrame = this.boss.frame

        if (this.boss.frame === this.boss.maxFrame) {
            this.boss.exitTongueAttack()
            this.boss.setState(STATES.IDLE)
        }
    }
}
export class Retreat extends Boss_State {
    constructor(boss) {
        super("RETREAT")
        this.boss = boss
        this.spriteWidth = 467
        this.spriteHeight = 393
        this.width = this.spriteWidth * this.boss.sizeModifier
        this.height = this.spriteHeight * this.boss.sizeModifier
    }
    enter() {
        this.boss.frame = 0
        this.boss.horizontalSpeed = 3
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 22
        this.boss.image = this.boss.sprite_sheets.retreat
        this.boss.resetBoxes()
        this.boss.audio.retreat.play()
    }
    update() {
        this.boss.x += this.boss.game.scrollSpeed + this.boss.horizontalSpeed
        if (this.boss.x >= this.boss.game.width - this.boss.width)
            this.boss.setState(STATES.IDLE)
    }
}
export class Idle extends Boss_State {
    constructor(boss) {
        super("IDLE")
        this.boss = boss
        this.spriteWidth = 446
        this.spriteHeight = 393
        this.width = this.spriteWidth * this.boss.sizeModifier
        this.height = this.spriteHeight * this.boss.sizeModifier
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 30
        this.boss.image = this.boss.sprite_sheets.idle
        this.boss.horizontalSpeed = 0
        this.boss.resetBoxes()
    }
    update() {
        this.boss.x -= this.boss.game.scrollSpeed
        if (this.boss.x <= this.boss.game.width * 0.4) {
            this.boss.setState(STATES.RETREAT)
        }
    }
}
export class Jump_Down extends Boss_State {
    constructor(boss) {
        super("JUMP_DOWN")
        this.boss = boss
        this.spriteWidth = 647
        this.spriteHeight = 432
        this.width = this.spriteWidth * this.boss.sizeModifier
        this.height = this.spriteHeight * this.boss.sizeModifier
        this.claws = {
            width: this.boss.width * 0.6 * this.boss.sizeModifier,
            yOffset: this.boss.height * 1.75 * this.boss.sizeModifier,
        }
    }
    enter() {
        this.boss.frame = 0
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 20
        this.boss.image = this.boss.sprite_sheets.jump_down
        this.boss.resetBoxes()
        if (this.boss.hitbox) {
            this.boss.hitbox.claws.width = this.claws.width
            this.boss.hitbox.claws.yOffset = this.claws.yOffset
        }
    }
    update() {
        if (this.boss.isOnGround()) {
            this.boss.audio.land.play()
            this.boss.setState(STATES.IDLE)
            this.boss.game.particles.push(
                new Smoke({
                    game: this.boss.game,
                    x: this.boss.x,
                    y: this.boss.game.height - this.boss.game.groundMargin,
                    sizeModifier: 1,
                    src: null,
                })
            )
            this.boss.game.particles.push(
                new Smoke({
                    game: this.boss.game,
                    x: this.boss.x + this.boss.width * 0.7,
                    y: this.boss.game.height - this.boss.game.groundMargin,
                    sizeModifier: 1.2,
                    src: null,
                })
            )
            this.boss.game.particles.push(
                new Smoke({
                    game: this.boss.game,
                    x: this.boss.x + this.boss.width * 0.9,
                    y: this.boss.game.height - this.boss.game.groundMargin,
                    sizeModifier: 0.5,
                    src: null,
                })
            )
            this.boss.game.particles.push(
                new Smoke({
                    game: this.boss.game,
                    x: this.boss.x + this.boss.width * 0.2,
                    y: this.boss.game.height - this.boss.game.groundMargin,
                    sizeModifier: 0.3,
                    src: null,
                })
            )
        }
    }
}
export class Jump_Forward extends Boss_State {
    constructor(boss) {
        super("JUMP_FORWARD")
        this.boss = boss
        this.spriteWidth = 707
        this.spriteHeight = 491
        this.width = this.spriteWidth * this.boss.sizeModifier
        this.height = this.spriteHeight * this.boss.sizeModifier
    }
    enter() {
        this.boss.frame = 0

        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 20
        this.boss.image = this.boss.sprite_sheets.jump_forward
        this.boss.velocityY -= 55
        this.boss.jumpTarget =
            this.boss.game.player.x < this.boss.x &&
            this.boss.game.player.currentState !==
                this.boss.game.player.states[3]
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
        this.spriteWidth = 494
        this.spriteHeight = 393
        this.width = this.spriteWidth * this.boss.sizeModifier
        this.height = this.spriteHeight * this.boss.sizeModifier
    }
    enter() {
        this.boss.frame = 0
        this.boss.horizontalSpeed = 35
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 16
        this.boss.image = this.boss.sprite_sheets.got_hit
        this.boss.hurtbox.body.isActive = false
        this.boss.hurtbox.tongue.isActive = false
        this.boss.hitbox.tongue.isActive = false
        this.boss.audio.damaged.play()
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
        this.spriteWidth = 261 //522
        this.spriteHeight = 237.5 //475
        this.width = this.spriteWidth * this.boss.sizeModifier * 2
        this.height = this.spriteHeight * this.boss.sizeModifier * 2
    }
    enter() {
        this.boss.frame = 0
        this.boss.horizontalSpeed = 0
        this.boss.spriteWidth = this.spriteWidth
        this.boss.spriteHeight = this.spriteHeight
        this.boss.width = this.width
        this.boss.height = this.height
        this.boss.maxFrame = 50
        this.boss.image = this.boss.sprite_sheets.defeated
        this.boss.hurtbox.body.isActive = false
        this.boss.hurtbox.tongue.isActive = false
        this.boss.hitbox.body.isActive = false
        this.boss.hitbox.tongue.isActive = false
        this.boss.hitbox.claws.isActive = false
        this.boss.isDefeated = true
        this.boss.game.music.currentTheme.pause()
        this.boss.audio.growl.play()
        this.boss.game.player.fps = 15
        this.boss.game.player.frameInterval = 1000 / this.boss.game.player.fps
        this.boss.game.player.stickyMultiplier = 0
    }
    update() {
        this.boss.x -= this.boss.horizontalSpeed + this.boss.game.scrollSpeed
        if (this.boss.frame === this.boss.maxFrame) {
            this.boss.deleteEnemy = true
            this.boss.audio.dematerialize.play()
            this.boss.game.particles.push(
                new Boom_V2({
                    game: this.boss.game,
                    x: this.boss.x + this.boss.width * 0.65,
                    y:
                        this.boss.game.height -
                        this.boss.game.groundMargin -
                        this.boss.height * 0.25,
                    sizeModifier: 3,
                })
            )
            this.boss.game.currentWave.exit()
        }
    }
}
