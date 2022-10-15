import { Phase_One, Phase_Three, Phase_Two } from "./boss_phases.js"
import {
    Attack,
    Defeated,
    Got_Hit,
    Idle,
    Jump_Down,
    Jump_Forward,
    Retreat,
    STATES,
} from "./boss_states.js"
import {
    BOSS_DAMAGED,
    BOSS_GROWL,
    SOUND_BOSS_JUMP,
    SOUND_BOSS_RETREAT,
    SOUND_TONGUE,
} from "./constants.js"
import { HealthBar } from "./health_bar.js"
import { setSfxVolume } from "./utils.js"

export class Armored_Frog {
    constructor(game) {
        this.game = game
        this.healthPoints = 100
        this.animationSheet = 0
        this.frame = 0
        this.maxFrame = 11
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.deleteEnemy = false
        this.isDefeated = false
        this.invulnerabilityTime = 0
        this.phase = new Phase_One(this)
        this.phase2Threshold = 60
        this.phase3Threshold = 20
        this.spriteHeight = 0
        this.spriteWidth = 0
        this.width = 0
        this.height = 0
        this.horizontalSpeed = 0
        this.spriteGroundOffsetModifier = 0.9
        this.attackIntervals = [4000, 3000, 5000]
        this.attackOffsetX = 95
        this.got_hitOffsetX = 48
        this.hitOffsetX = 0
        this.attackInterval = 6000
        this.attackTimer = 0
        this.idleXOffsetModifier = 0.25

        this.audio = {
            damaged: new Audio(BOSS_DAMAGED),
            retreat: new Audio(SOUND_BOSS_RETREAT),
            jump: new Audio(SOUND_BOSS_JUMP),
            tongue: new Audio(SOUND_TONGUE),
            growl: new Audio(BOSS_GROWL),
        }

        setSfxVolume(this.audio)

        this.states = [
            new Retreat(this),
            new Attack(this),
            new Idle(this),
            new Jump_Down(this),
            new Jump_Forward(this),
            new Got_Hit(this),
            new Defeated(this),
        ]

        this.currentState = this.states[2]
        this.currentState.enter()

        this.x = this.game.width - this.width
        // this.y =
        //     this.game.height -
        //     this.height * this.spriteGroundOffsetModifier -
        //     this.game.groundMargin
        this.y = this.game.height * -4
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier * this.sizeModifier,
                yOffset: this.height * 0.95 * this.sizeModifier,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 1.4 * this.sizeModifier,
                height: this.height * 0.6 * this.sizeModifier,
            },
            tongue: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier * this.sizeModifier,
                yOffset: this.height * 1.1 * this.sizeModifier,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8 * this.sizeModifier,
                height: this.height * 0.15 * this.sizeModifier,
            },
        }
        this.hitbox = {
            body: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier * this.sizeModifier,
                yOffset: this.height * 0.3 * this.sizeModifier,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 1.25 * this.sizeModifier,
                height: this.height * 0.2 * this.sizeModifier,
            },
            tongue: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier * this.sizeModifier,
                yOffset: this.height * 1.1 * this.sizeModifier,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8 * this.sizeModifier,
                height: this.height * 0.15 * this.sizeModifier,
            },
            claws: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier * this.sizeModifier,
                yOffset: this.height * 1.4 * this.sizeModifier,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 1.4 * this.sizeModifier,
                height: this.height * 0.15 * this.sizeModifier,
            },
        }
        //vertical
        this.velocityY = 0
        this.weight = 3

        this.healthBarPadding = 20
        this.healthBarY = this.game.height - this.game.groundMargin * 0.5

        this.healthBar = new HealthBar({
            x: this.healthBarPadding,
            y: this.healthBarY,
            width: this.game.width - this.healthBarPadding * 2,
            height: 20,
            maxhealth: this.healthPoints,
            defaultbarColor: "#e95e27",
            borderColor: "#e9e0b3",
        })
    }

    get enemyName() {
        return this.constructor.name
    }

    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
    }
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime
        }

        this.healthBar.updatePosition(this.healthBarPadding, this.healthBarY)

        //Attack
        if (
            this.attackTimer > this.attackInterval &&
            this.isOnGround() &&
            !this.isDefeated &&
            !this.game.player.isDashAttacking()
        ) {
            this.attackTimer = 0
            this.attackInterval =
                this.attackIntervals[
                    Math.floor(Math.random() * this.attackIntervals.length)
                ]
            this.attack()
        } else {
            this.attackTimer += deltaTime
        }

        this.currentState.update()
        this.updateHitboxes()
        if (this.invulnerabilityTime > 0) this.invulnerabilityTime -= deltaTime
        else if (!this.isDefeated) {
            this.hurtbox.body.isActive = true
            this.hurtbox.tongue.isActive = true
        }

        //vertical
        this.y += this.velocityY
        if (
            this.y >
            this.game.height -
                this.height * this.spriteGroundOffsetModifier -
                this.game.groundMargin
        )
            this.y =
                this.game.height -
                this.height * this.spriteGroundOffsetModifier -
                this.game.groundMargin

        if (!this.isOnGround()) this.velocityY += this.weight
        else this.velocityY = 0

        // //horizontal jumping arc
        if (this.jumpTarget) this.jumpTarget -= this.game.scrollSpeed
        if (!this.isOnGround() && this.jumpTarget)
            this.x += (this.jumpTarget - this.x) * 0.15

        if (
            this.isOnGround() &&
            !this.isDefeated &&
            this.currentState != STATES.ATTACK &&
            this.game.player.x > this.x + this.width
        )
            this.setState(STATES.JUMP_FORWARD)
    }
    isOnGround() {
        return (
            this.y >=
            this.game.height -
                this.height * this.spriteGroundOffsetModifier -
                this.game.groundMargin
        )
    }
    draw(context) {
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
        this.healthBar.draw(context)
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
        // if (this.hurtbox.tongue.isActive) {
        //     context.strokeStyle = "red"
        //     context.beginPath()
        //     context.rect(
        //         this.hurtbox.tongue.x,
        //         this.hurtbox.tongue.y,
        //         this.hurtbox.tongue.width,
        //         this.hurtbox.tongue.height
        //     )
        //     context.stroke()
        // }
        // if (this.hitbox.tongue.isActive) {
        //     context.strokeStyle = "#ff0000"
        //     context.beginPath()
        //     context.rect(
        //         this.hitbox.tongue.x,
        //         this.hitbox.tongue.y,
        //         this.hitbox.tongue.width,
        //         this.hitbox.tongue.height
        //     )
        //     context.stroke()
        // }
        // context.strokeStyle = "yellow"
        // context.beginPath()
        // context.rect(this.x, this.y, this.width, this.height)
        // context.stroke()
        // if (this.hitbox.claws.isActive) {
        //     context.strokeStyle = "#ff0000"
        //     context.beginPath()
        //     context.rect(
        //         this.hitbox.claws.x,
        //         this.hitbox.claws.y,
        //         this.hitbox.claws.width,
        //         this.hitbox.claws.height
        //     )
        //     context.stroke()
        // }
    }
    attack() {
        let attackToPerform =
            this.attacks[Math.floor(Math.random() * this.attacks.length)]
        if (attackToPerform === "TONGUE_ATTACK") this.setState(1)
        if (attackToPerform === "JUMP_ATTACK") this.setState(4)
    }
    updateHitboxes() {
        this.hurtbox.body.x = this.x + this.hurtbox.body.xOffset
        this.hurtbox.body.y = this.y + this.hurtbox.body.yOffset
        this.hurtbox.tongue.x = this.x + this.hurtbox.tongue.xOffset
        this.hurtbox.tongue.y = this.y + this.hurtbox.tongue.yOffset
        this.hitbox.tongue.x = this.x + this.hitbox.tongue.xOffset
        this.hitbox.tongue.y = this.y + this.hitbox.tongue.yOffset
        this.hitbox.body.x = this.x + this.hitbox.body.xOffset
        this.hitbox.body.y = this.y + this.hitbox.body.yOffset
        this.hitbox.claws.x = this.x + this.hitbox.claws.xOffset
        this.hitbox.claws.y = this.y + this.hitbox.claws.yOffset
    }
    resolveCollision({ target, attackDamage }) {
        if (target === "Attacked: ENEMY") {
            if (this.currentState.state === "ATTACK") {
                this.x += this.attackOffsetX
            }
            this.healthPoints -= attackDamage
            if (this.healthPoints < 0) this.healthPoints = 0
            this.healthBar.updateBar(this.healthPoints)
            this.setState(
                this.healthPoints <= 0 ? STATES.DEFEATED : STATES.GOT_HIT
            )
        }

        if (
            this.phase.phase === "Phase_One" &&
            this.healthPoints <= this.phase2Threshold
        ) {
            this.phase = new Phase_Two(this)
        } else if (
            this.phase.phase === "Phase_Two" &&
            this.healthPoints <= this.phase3Threshold
        ) {
            this.phase = new Phase_Three(this)
        }

        if (target === "Attacked: PLAYER") {
            if (this.currentState === "ATTACK") this.x += this.attackOffsetX
            this.setState(STATES.JUMP_FORWARD)
        }
    }

    resetBoxes() {
        if (this.hurtbox) {
            this.hurtbox.body.xOffset =
                this.width * this.idleXOffsetModifier * this.sizeModifier
            this.hurtbox.tongue.xOffset =
                this.width * this.idleXOffsetModifier * this.sizeModifier
        }

        if (this.hitbox) {
            this.hitbox.body.xOffset =
                this.width * this.idleXOffsetModifier * this.sizeModifier

            this.hitbox.tongue.xOffset =
                this.width * this.idleXOffsetModifier * this.sizeModifier

            this.hitbox.claws.xOffset =
                this.width * this.idleXOffsetModifier * this.sizeModifier

            this.hitbox.claws.width = this.width * 1.4 * this.sizeModifier
            this.hitbox.claws.yOffset = this.height * 1.4 * this.sizeModifier
        }
    }
}
