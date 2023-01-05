import { qs } from "./utils.js"

export const PUMPKIN_STATES = {
    IDLE: 0,
    WALK: 1,
    EXPLODE: 2,
}

class Pumpkin_State {
    constructor(state) {
        this.state = state
    }
}

export class Pumpkin_Idle extends Pumpkin_State {
    constructor(self) {
        super("IDLE")
        this.self = self
    }
    enter() {
        this.self.frame = 0
        this.self.spriteWidth = 236
        this.self.spriteHeight = 291
        this.self.width = this.self.spriteWidth * this.self.sizeModifier
        this.self.height = this.self.spriteHeight * this.self.sizeModifier
        this.self.maxFrame = 28
        this.self.image = qs("#pumpkin_idle")
        this.self.defaultHorizontalSpeed = 0
        this.self.horizontalSpeed = 0
        this.self.resetBoxes()
    }
    update() {
        if (this.self.frame === this.self.maxFrame) {
            this.self.setState(PUMPKIN_STATES.WALK)
        }
    }
}
export class Pumpkin_Walk extends Pumpkin_State {
    constructor(self) {
        super("WALK")
        this.self = self
    }
    enter() {
        this.self.frame = 0
        this.self.spriteWidth = 260
        this.self.spriteHeight = 359
        this.self.width = this.self.spriteWidth * this.self.sizeModifier
        this.self.height = this.self.spriteHeight * this.self.sizeModifier
        this.self.maxFrame = 15
        this.self.image = qs("#pumpkin_walk")
        this.self.horizontalSpeed = this.self.isWithinRetreatingRange() ? -2 : 2
        this.self.defaultHorizontalSpeed = this.self.horizontalSpeed
        this.self.resetBoxes()
    }
    update() {
        if (this.self.frame === this.self.maxFrame) {
            this.self.setState(PUMPKIN_STATES.IDLE)
        }
    }
}
export class Pumpkin_Explode extends Pumpkin_State {
    constructor(self) {
        super("EXPLODE")
        this.self = self
    }
    enter() {
        this.self.frame = 0
        this.self.spriteWidth = 720
        this.self.spriteHeight = 377
        this.self.width = this.self.spriteWidth * this.self.sizeModifier
        this.self.height = this.self.spriteHeight * this.self.sizeModifier
        this.self.maxFrame = 25
        this.self.image = qs("#pumpkin_explode")
        this.self.horizontalSpeed = 0
        this.self.defaultHorizontalSpeed = 0
        this.self.hitbox.body.isActive = false
        this.self.hurtbox.body.isActive = false
        this.self.x += this.self.explodeXOffset
        this.self.resetBoxes()
        this.self.game.player.stickyMultiplier = 0
    }
    update() {
        if (this.self.y < this.self.game.height - this.self.height - this.self.game.groundMargin)
            this.self.y = this.self.game.height - this.self.height - this.self.game.groundMargin
        if (this.self.frame === this.self.maxFrame) {
            this.self.deleteEnemy = true
        }
    }
}
