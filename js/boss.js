import { Phase_One, Phase_Two } from "./boss_phases.js"
import { BOSS_DAMAGED } from "./constants.js"
import { qs } from "./utils.js"

const states = {
    WALKING: 0,
    ATTACK: 1,
    IDLE: 2,
    JUMP_DOWN: 3,
    JUMP_UP: 4,
    GOT_HIT: 5,
    DEFEATED: 6,
}

export class Armored_Frog {
    constructor(game) {
        this.game = game
        this.healthPoints = 200
        this.animationSheet = 0
        this.frame = 0
        this.maxFrame = 11
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.deleteEnemy = false
        this.invulnerabilityTime = 0
        this.phase = new Phase_One(this)
        this.phase2Threshold = 150
        this.spriteHeight = 0
        this.spriteWidth = 0
        this.width = 0
        this.height = 0
        this.horizontalSpeed = 0
        this.spriteGroundOffsetModifier = 0.9
        this.attackIntervals = [6000, 3000, 8000]
        this.attackOffsetX = 95
        this.hitOffsetX = 0
        this.attackInterval = 6000
        this.attackTimer = 0
        this.idleXOffsetModifier = 0.15
        this.damaged_audio = new Audio(BOSS_DAMAGED)

        this.states = [
            new Walking(this),
            new Attack(this),
            new Idle(this),
            new Jump_Down(this),
            new Jump_Up(this),
            new Got_Hit(this),
            new Defeated(this),
        ]
        this.currentState = this.states[2]
        this.currentState.enter()

        this.x = this.game.width - this.width
        this.y =
            this.game.height -
            this.height * this.spriteGroundOffsetModifier -
            this.game.groundMargin
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: this.width * this.idleXOffsetModifier,
                yOffset: this.height * 0.55,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8,
                height: this.height * 0.4,
            },
            tongue: {
                isActive: true,
                xOffset: this.width * this.idleXOffsetModifier,
                yOffset: this.height * 0.65,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8,
                height: this.height * 0.1,
            },
        }
        this.hitbox = {
            body: {
                isActive: true,
                xOffset:
                    this.width * this.idleXOffsetModifier - this.width * 0.025,
                yOffset: this.height * 0.09,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.85,
                height: this.height * 0.4,
            },
            tongue: {
                isActive: true,
                xOffset: this.width * this.idleXOffsetModifier,
                yOffset: this.height * 0.65,
                x: this.x + this.xOffset,
                y: this.y + this.yOffset,
                width: this.width * 0.8,
                height: this.height * 0.1,
            },
        }
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

        //Attack
        if (this.attackTimer > this.attackInterval) {
            this.attackTimer = 0
            this.attackInterval =
                this.attackIntervals[
                    Math.floor(Math.random() * this.attackIntervals.length)
                ]
            this.attack()
        } else {
            this.attackTimer += deltaTime
        }
        if (this.healthPoints <= 0) this.deleteEnemy = true
        this.currentState.update()
        this.updateHitboxes()
        if (this.invulnerabilityTime > 0) this.invulnerabilityTime -= deltaTime
        else {
            this.hurtbox.body.isActive = true
            this.hurtbox.tongue.isActive = true
        }
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
        //     context.strokeStyle = "black"
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
    }
    resolveCollision(type) {
        if (type === "attacked") {
            if (this.currentState.state === "ATTACK") {
                this.x += this.attackOffsetX
            }
            this.setState(states.GOT_HIT)
            this.damaged_audio.play()
        }
        if (
            this.phase.phase === "Phase_One" &&
            this.healthPoints <= this.phase2Threshold
        ) {
            this.phase = new Phase_Two(this)
        }
    }
}

class Boss_State {
    constructor(state) {
        this.state = state
    }
}

class Attack extends Boss_State {
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
    }
    update() {
        this.boss.x -= this.boss.horizontalSpeed + this.boss.game.scrollSpeed
        if (this.boss.frame === 14) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX -
                75
            this.boss.hitbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX -
                75
        }
        if (this.boss.frame === 15) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX -
                145
            this.boss.hitbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX -
                145
        }
        if (this.boss.frame === 17) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX -
                80
            this.boss.hitbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
                this.boss.attackOffsetX
        }
        if (this.boss.frame === 18) {
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier +
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
class Walking extends Boss_State {
    constructor(boss) {
        super("WALKING")
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
        this.boss.image = qs("#walking")
        this.boss.hurtbox.body.xOffset =
            this.boss.width * this.boss.idleXOffsetModifier
    }
    update() {
        this.boss.x += this.boss.game.scrollSpeed + this.boss.horizontalSpeed
        if (this.boss.x >= this.boss.game.width - this.boss.width)
            this.boss.setState(2)
    }
}
class Idle extends Boss_State {
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
        if (this.boss.hurtbox) {
            this.boss.hurtbox.body.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier
            this.boss.hurtbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier
        }

        if (this.boss.hitbox) {
            this.boss.hitbox.body.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier -
                this.boss.width * 0.025

            this.boss.hitbox.tongue.xOffset =
                this.boss.width * this.boss.idleXOffsetModifier
        }
    }
    update() {
        this.boss.x -= this.boss.horizontalSpeed + this.boss.game.scrollSpeed
        if (this.boss.x <= this.boss.game.width * 0.5) this.boss.setState(0)
    }
}
class Jump_Down extends Boss_State {
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
    }
    update() {}
}
class Jump_Up extends Boss_State {
    constructor(boss) {
        super("JUMP_UP")
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
    }
    update() {}
}
class Got_Hit extends Boss_State {
    constructor(boss) {
        super("GOT_HIT")
        this.boss = boss
    }
    enter() {
        this.boss.frame = 0
        this.horizontalSpeed = 0
        this.boss.spriteWidth = 494
        this.boss.spriteHeight = 396
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.maxFrame = 16
        this.boss.image = qs("#got_hit")
        this.boss.hurtbox.body.isActive = false
        this.boss.hurtbox.tongue.isActive = false
        this.boss.hitbox.tongue.isActive = false
        this.boss.x = this.boss.game.width - this.boss.width
    }
    update() {
        if (this.boss.frame === this.boss.maxFrame) {
            this.boss.hurtbox.body.isActive = true
            this.boss.hurtbox.tongue.isActive = true
            this.boss.setState(2)
        }
    }
}
class Defeated extends Boss_State {
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
