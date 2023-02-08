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
    DEFAULT_BOSS_BAR_COLOR,
    DEFAULT_BOSS_BORDER_COLOR,
    DEFENCE_DEBUFF,
    SOUND_BOSS_JUMP,
    SOUND_BOSS_RETREAT,
    SOUND_TONGUE,
    INVULNERABILITY_TIME,
    AttackTarget,
    SOUND_DIMENSION_SUCK,
    BOSS_LAND,
} from "./constants.js"
import { HealthBar } from "./health_bar.js"
import { FloatingMessage } from "./UI.js"
import { setSfxVolume } from "./utils.js"

export class Armored_Frog {
    constructor(game) {
        this.game = game
        this.sprite_sheets = game.sprite_sheets.boss
        this.healthPoints = 15 //100
        this.animationSheet = 0
        this.frame = 0
        this.lastFinishedFrame = null
        this.maxFrame = 11
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.defence = 10
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
        this.attackIntervals = [1000, 2000, 2500]
        this.attackOffsetX = 95
        this.got_hitOffsetX = 48
        this.hitOffsetX = 0
        this.attackInterval = 6000
        this.attackTimer = 0
        this.idleXOffsetModifier = 0.25
        this.sizeModifier = 0.6
        this.canBeDebuffed = true
        this.hasBeenDebuffed = false
        this.isDebuffed = false
        this.debuffTimer = 0
        this.debuffInterval = 4500

        this.musicIsPlaying = false

        this.audio = {
            damaged: new Audio(BOSS_DAMAGED),
            retreat: new Audio(SOUND_BOSS_RETREAT),
            jump: new Audio(SOUND_BOSS_JUMP),
            tongue: new Audio(SOUND_TONGUE),
            growl: new Audio(BOSS_GROWL),
            dematerialize: new Audio(SOUND_DIMENSION_SUCK),
            land: new Audio(BOSS_LAND)
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

        // this.x = this.game.width - this.width
        this.x = this.game.width * 0.5
        this.y = this.game.height * -6

        this.currentState = this.states[STATES.JUMP_DOWN]
        this.currentState.enter()


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
        this.velocityY = -30
        // this.velocityY = 0
        this.weight = 3

        this.healthBarPadding = 20
        this.healthBarY = this.game.height - this.game.groundMargin * 0.5

        this.healthBar = new HealthBar({
            x: this.healthBarPadding,
            y: this.healthBarY,
            width: this.game.width - this.healthBarPadding * 2,
            height: 20,
            maxhealth: this.healthPoints,
            defaultbarColor: DEFAULT_BOSS_BAR_COLOR,
            borderColor: DEFAULT_BOSS_BORDER_COLOR,
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

        if (this.isDebuffed) {
            if (this.debuffTimer > this.debuffInterval) {
                this.defence += DEFENCE_DEBUFF
                this.game.UI.floatingMessages.push(
                    new FloatingMessage({
                        value: "+ defence RESTORED",
                        x: this.x,
                        y: this.y + 100,
                        targetX: this.x,
                        targetY: this.y,
                    })
                )
                this.isDebuffed = false
                this.canBeDebuffed = true
                this.debuffTimer = 0
                this.game.sfx.defenceUpSFX.play()
            } else this.debuffTimer += deltaTime
        }
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
            this.currentState !== this.states[STATES.ATTACK] &&
            this.isOnGround() &&
            this.game.player.currentState.state != "GAME_OVER"
        ) {
            if (
                this.attackTimer > this.attackInterval &&
                !this.isDefeated &&
                !this.game.player.isDashAttacking()
            ) {
                this.attackTimer = 0
                this.attackInterval =
                    this.attackIntervals[
                        Math.floor(Math.random() * this.attackIntervals.length)
                    ]
                this.attack()
                if (!this.musicIsPlaying) {
                    this.game.music.currentTheme.play()
                    this.musicIsPlaying = true
                }
            } else {
                this.attackTimer += deltaTime
            }
        }

        this.currentState.update()
        this.updateHitboxes()
        if (this.invulnerabilityTime > 0) this.invulnerabilityTime -= deltaTime
        else if (!this.isDefeated) {
            this.hurtbox.body.isActive = true
            this.hurtbox.tongue.isActive = true
        }

        // //horizontal jumping arc
        if (this.jumpTarget) this.jumpTarget -= this.game.scrollSpeed
        if (!this.isOnGround() && this.jumpTarget)
            this.x += (this.jumpTarget - this.x) * 0.15

        if (
            this.isOnGround() &&
            !this.isDefeated &&
            this.currentState.state != "ATTACK" &&
            this.game.player.x > this.x + this.width
        ) {
            this.setState(STATES.JUMP_FORWARD)
        }
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
    }
    attack() {
        let attackToPerform =
            this.attacks[Math.floor(Math.random() * this.attacks.length)]
        if (attackToPerform === "TONGUE_ATTACK") this.setState(STATES.ATTACK)
        if (attackToPerform === "JUMP_ATTACK")
            this.setState(STATES.JUMP_FORWARD)
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
    exitTongueAttack() {
        this.hurtbox.tongue.isActive = false
        this.hitbox.tongue.isActive = false
        this.x += this.attackOffsetX
    }
    resolveCollision({ target, attackDamage }) {
        if (target === AttackTarget.ENEMY) {
            if (this.currentState.state === "ATTACK") this.exitTongueAttack()
            this.healthPoints -= Math.max(attackDamage - this.defence, 0)
            if (this.healthPoints < 0) this.healthPoints = 0
            this.healthBar.updateBar(this.healthPoints)
            this.setState(
                this.healthPoints <= 0 ? STATES.DEFEATED : STATES.GOT_HIT
            )
            this.setPhase()
        }

        if (target === AttackTarget.PLAYER) {
            if (this.currentState.state === "ATTACK") this.exitTongueAttack()
            this.invulnerabilityTime = INVULNERABILITY_TIME
        }
    }
    setPhase() {
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

    isFirstRefreshOnCurrentFrame() {
        return this.frame !== this.lastFinishedFrame
    }
}
