import {
    DEFAULT_SCROLL_SPEED,
    DEFAULT_WEIGHT,
    DEFENCE_DEBUFF,
    FALLING_WEIGHT,
    FLOATING_WEIGHT,
} from "./constants.js"
import { Red_Hit_V1 } from "./particles.js"
import { FloatingMessage } from "./UI.js"

export const states = {
    CLAW_ATTACK: 0,
    FALLING: 1,
    GAME_OVER: 2,
    GET_HIT: 3,
    DASH_ATTACK: 4,
    IDLE: 5,
    JUMPING: 6,
    RESTING: 7,
    ROLL_UP: 8,
    ROLL_DOWN: 9,
    ROLL_ACROSS: 10,
    ROLL_BACK: 11,
    RUNNING: 12,
    SLEEPING: 13,
}

class State {
    constructor(state) {
        this.state = state
    }
}

export class Attacking_Claw extends State {
    constructor(player) {
        super("CLAW_ATTACK")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 0
        this.player.frame = 0
        this.player.maxFrame = 13
        this.player.hitbox.width = this.player.width - 60
        this.player.hitbox.height = this.player.height - 25
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 38
        this.player.hurtbox.head.yOffset = 15
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 40
        this.player.game.scrollSpeed = 0
    }
    handleInput({ lastKey }) {
        if (
            this.player.frame > 5 &&
            this.player.frame < 8 &&
            this.player.frameTimer >= 0
        )
            this.player.y -= 6
        if (
            this.player.frame > 8 &&
            this.player.frame < 10 &&
            this.player.frameTimer >= 0
        )
            this.player.x += 5
        if (this.player.frame === 12 && this.player.isWhiffing)
            this.player.audio.slash.play()

        if (this.player.frame == this.player.maxFrame) {
            this.player.setState(states.IDLE)
            this.player.isWhiffing = true
        }
        if (!this.player.isWhiffing && lastKey == "PRESS Left") {
            this.player.setState(states.ROLL_BACK)
        }
        if (!this.player.isWhiffing && lastKey == "PRESS Right") {
            this.player.setState(states.ROLL_ACROSS)
        }
        // if (!this.player.isWhiffing && lastKey == "PRESS Attack") {
        //     this.player.frame = 6
        //     this.player.x += 5
        //     this.player.isWhiffing = true
        // }
    }
}
export class Falling extends State {
    constructor(player) {
        super("FALLING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 1
        this.player.frame = 0
        this.player.maxFrame = 9
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 45
        this.player.hurtbox.head.yOffset = 23
        this.player.hurtbox.body.xOffset = 20
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 70
        this.player.hurtbox.body.height = this.player.height - 40
    }
    handleInput({ lastKey, keysPressed }) {
        if (keysPressed.up) {
            this.player.weight = FLOATING_WEIGHT
        }
        if (lastKey === "RELEASE Up") this.player.weight = FALLING_WEIGHT
        if (
            !keysPressed.up &&
            !keysPressed.right &&
            !keysPressed.down &&
            !keysPressed.left
        )
            this.player.game.scrollSpeed = 0
        if (this.player.isOnGround()) this.player.setState(states.IDLE)
        if (lastKey === "PRESS Attack") this.player.setState(states.ROLL_DOWN)
        else if (lastKey === "PRESS Left")
            this.player.x -= this.player.game.scrollSpeed + 2
        else if (lastKey === "PRESS Right")
            this.player.x += this.player.game.scrollSpeed * 0.3 + 2
        else this.player.x += this.player.game.scrollSpeed * 0.15 + 1
    }
}
export class Game_Over extends State {
    constructor(player) {
        super("GAME_OVER")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 2
        this.player.frame = 0
        this.player.maxFrame = 24
        this.player.game.scrollSpeed = 0
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
    }
    handleInput() {
        if (this.player.frame == this.player.maxFrame) {
            this.player.isGameOver = true
            this.player.game.particles.push(
                new Red_Hit_V1({
                    game: this.player.game,
                    x: this.player.x + this.player.width * 0.5,
                    y: this.player.y + this.player.height,
                    sizeModifier: 2,
                    src: null,
                })
            )
        }
    }
}
export class Get_Hit extends State {
    constructor(player) {
        super("GET_HIT")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 3
        this.player.frame = 0
        this.player.game.scrollSpeed = 0
        this.player.maxFrame = 7
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
        this.player.x -= 35
        this.player.velocityY = -10
        this.player.stickyMultiplier = 3
        this.player.enemiesDefeated = 0
        this.player.audio.get_hit.play()
        this.player.attack_bonus = this.player.min_attack_bonus
    }
    handleInput({ lastKey }) {
        this.player.x -= 15
        if (this.player.frame == this.player.maxFrame) {
            if (this.player.isOnGround()) this.player.setState(states.IDLE)
            else this.player.setState(states.FALLING)
        }
    }
}
export class Attacking_Dash extends State {
    constructor(player) {
        super("DASH_ATTACK")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 4
        this.player.frame = 0
        this.player.maxFrame = 14
        this.player.game.scrollSpeed = 0
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 38
        this.player.hurtbox.head.yOffset = 25
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 60
        this.player.hurtbox.body.height = this.player.height - 40
    }
    handleInput({ lastKey, keysPressed }) {
        if (this.player.frame === 8 && keysPressed.action) {
            this.player.frame = 7
            if (this.player.dash_bonus < this.player.max_attack_bonus) {
                this.player.dash_bonus++
                this.player.game.recoveryTime += 50
            }
        } else if (lastKey === "PRESS Left")
            this.player.setState(states.ROLL_BACK)
        if (this.player.frame > 10) {
            this.player.x += 25
            if (this.player.game.scrollSpeed < DEFAULT_SCROLL_SPEED)
                this.player.game.scrollSpeed += 1
        }

        if (this.player.frame >= 9) {
            this.player.hurtbox.head.isActive = false
            this.player.hurtbox.body.isActive = false
        }

        if (this.player.frame == this.player.maxFrame) {
            this.player.game.recoveryTime += 300
            this.player.game.isRecovering = true
            this.player.dash_bonus = 0
            this.player.setState(states.IDLE)
        }
    }
}
export class Idle extends State {
    constructor(player) {
        super("IDLE")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 5
        this.player.frame = 0
        this.player.maxFrame = 19
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 38
        this.player.hurtbox.head.yOffset = 20
        this.player.hurtbox.body.xOffset = 28
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 65
        this.player.hurtbox.body.height = this.player.height - 40
    }
    handleInput({ lastKey, keysPressed }) {
        if (this.player.isAtStartingPosition()) {
            this.player.game.scrollSpeed = 0
        } else {
            this.player.game.scrollSpeed = DEFAULT_SCROLL_SPEED
            this.player.x -= this.player.game.scrollSpeed
        }
        if (lastKey === "PRESS Attack") this.player.setState(states.CLAW_ATTACK)
        else if (lastKey === "PRESS Up" || lastKey === "PRESS Jump")
            this.player.setState(states.JUMPING)
        else if (lastKey === "PRESS Down") this.player.setState(states.RESTING)
        else if (lastKey === "PRESS Right" || keysPressed.right)
            this.player.setState(states.RUNNING)
    }
}
export class Jumping extends State {
    constructor(player) {
        super("JUMPING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 6
        this.player.frame = 0
        this.player.velocityY -= 16 + this.player.game.scrollSpeed * 0.5
        this.player.maxFrame = 9
        this.player.weight = DEFAULT_WEIGHT
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 38
        this.player.hurtbox.head.yOffset = 15
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 70
        this.player.hurtbox.body.height = this.player.height - 40
    }
    handleInput({ lastKey, keysPressed }) {
        if (keysPressed.left) {
            if (this.player.game.scrollSpeed > 1)
                this.player.game.scrollSpeed -= 0.4
            this.player.x -= Math.max(this.player.game.scrollSpeed * 2, 2)
        } else if (keysPressed.right) this.player.x++
        if (lastKey === "RELEASE Up" || lastKey === "RELEASE Jump")
            this.player.velocityY += 1
        else if (lastKey === "PRESS Attack") {
            this.player.stickyMultiplier = 3
            this.player.setState(states.ROLL_UP)
        } else this.player.x += this.player.game.scrollSpeed * 0.3

        if (this.player.velocityY > 0) this.player.setState(states.FALLING)
    }
}
export class Resting extends State {
    constructor(player) {
        super("RESTING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 7
        this.player.frame = 0
        this.player.maxFrame = 13
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 30
        this.player.hurtbox.head.yOffset = 20
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 60
        this.player.hurtbox.body.height = this.player.height - 40

        this.player.game.scrollSpeed = 0
    }
    handleInput({ lastKey, keysPressed }) {
        if (keysPressed.down && keysPressed.action)
            this.player.setState(states.SLEEPING)
        else if (keysPressed.right) this.player.setState(states.ROLL_ACROSS)
        else if (keysPressed.left) this.player.setState(states.ROLL_BACK)
        else if (lastKey === "PRESS Up" || lastKey === "RELEASE Down" || lastKey === "RELEASE Up")
            this.player.setState(states.IDLE)
    }
}
export class Roll_Down extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.player.frame = 0
        this.player.maxFrame = 8
        this.player.hurtbox.body.isActive = false
    }
    handleInput() {
        if (this.player.isOnGround()) {
            this.player.setState(states.RESTING)
            this.player.game.recoveryTime += 300
            this.player.game.isRecovering = true
            this.player.audio.down_roll.play()
        }
    }
}
export class Roll_Up extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.player.frame = 0
        this.player.maxFrame = 8
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
        this.player.audio.up_roll.play()
        if (this.player.velocityY < 0) this.player.velocityY -= 15
    }
    handleInput() {
        if (this.player.velocityY > 0) {
            this.player.setState(states.FALLING)
            this.player.game.recoveryTime += 700
            this.player.game.isRecovering = true
        }
    }
}
export class Roll_Across extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.player.frame = 0
        this.player.maxFrame = 8
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
    }
    handleInput({ lastKey }) {
        this.player.x += this.player.maxFrame - this.player.frame
        if (lastKey === "PRESS Attack") {
            this.player.velocityY -= 10 + this.player.game.scrollSpeed
            this.player.setState(states.ROLL_UP)
        }
        if (this.player.game.scrollSpeed < DEFAULT_SCROLL_SPEED)
            this.player.game.scrollSpeed += 0.3
        if (this.player.frame == this.player.maxFrame)
            this.player.setState(states.RUNNING)
    }
}
export class Roll_Back extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.player.frame = 0
        this.player.maxFrame = 8
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
    }
    handleInput({ lastKey }) {
        this.player.x -= this.player.maxFrame - this.player.frame
        if (lastKey === "PRESS Attack") {
            this.player.velocityY -= 10 + this.player.game.scrollSpeed
            this.player.setState(states.ROLL_UP)
        }
        this.player.game.scrollSpeed = 0
        if (this.player.frame == this.player.maxFrame)
            this.player.setState(states.IDLE)
    }
}
export class Running extends State {
    constructor(player) {
        super("RUNNING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 9
        this.player.frame = 0
        this.player.maxFrame = 11
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 38
        this.player.hurtbox.head.yOffset = 20
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 40
        this.player.hurtbox.head.width = this.player.width - 65
        this.player.hurtbox.head.height = this.player.height - 40
        this.player.hurtbox.body.width = this.player.width - 60
        this.player.hurtbox.body.height = this.player.height - 40
    }
    handleInput({ lastKey, keysPressed }) {
        if (this.player.game.scrollSpeed < DEFAULT_SCROLL_SPEED) {
            this.player.game.scrollSpeed += 0.4
        }

        if (lastKey === "PRESS Up" || lastKey === "PRESS Jump")
            this.player.setState(states.JUMPING)
        else if (lastKey === "PRESS Down") {
            if (!keysPressed.right) this.player.setState(states.RESTING)
            if (keysPressed.right) this.player.setState(states.ROLL_ACROSS)
        } else if (
            lastKey === "PRESS Attack" &&
            this.player.game.scrollSpeed >= DEFAULT_SCROLL_SPEED
        )
            this.player.setState(states.DASH_ATTACK)

        if (!keysPressed.right || lastKey === "PRESS Left")
            this.player.setState(states.IDLE)

        if (!this.player.isAtStartingPosition())
            this.player.x -= this.player.game.scrollSpeed * 0.5
    }
}
export class Sleeping extends State {
    constructor(player) {
        super("SLEEPING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 10
        this.player.frame = 0
        this.player.maxFrame = 19
        this.player.hurtbox.head.isActive = true
        this.player.hurtbox.body.isActive = true
        this.player.hurtbox.head.xOffset = 55
        this.player.hurtbox.head.yOffset = 45
        this.player.hurtbox.body.xOffset = 25
        this.player.hurtbox.body.yOffset = 55
        this.player.hurtbox.head.width = this.player.width - 70
        this.player.hurtbox.head.height = this.player.height - 50
        this.player.hurtbox.body.width = this.player.width - 50
        this.player.hurtbox.body.height = this.player.height - 55
        this.player.game.scrollSpeed = 0
        this.tauntInterval = 1500
        this.tauntTimer = 0
        this.zInterval = 400
        this.zTimer = 0
    }
    handleInput({ keysPressed }, deltaTime) {
        if (!keysPressed.action) this.player.setState(states.RESTING)
        if (!keysPressed.down) this.player.setState(states.IDLE)

        if (this.zTimer > this.zInterval) {
            this.player.game.UI.floatingMessages.push(
                new FloatingMessage({
                    value: "Z",
                    x: this.player.x + this.player.width - 10,
                    y: this.player.y + this.player.height - 10,
                    targetX: this.player.x + 150,
                    targetY: this.player.y,
                    sizeModifier: 3,
                })
            )
            this.zTimer = 0
        } else {
            this.zTimer += deltaTime
        }

        if (this.tauntTimer > this.tauntInterval) {
            this.player.game.enemies.forEach(enemy => {
                if (enemy.canBeDebuffed) {
                    enemy.defence -= DEFENCE_DEBUFF
                    enemy.canBeDebuffed = false
                    enemy.hasBeenDebuffed = true
                    enemy.isDebuffed = true
                    this.player.game.UI.floatingMessages.push(
                        new FloatingMessage({
                            value: "- defence DOWN",
                            x: enemy.x,
                            y: enemy.y,
                            targetX: enemy.x,
                            targetY: enemy.y + 100,
                        })
                    )
                    this.player.game.sfx.defenceDownSFX.play()
                }
            })
            this.tauntTimer = 0
        } else {
            this.tauntTimer += deltaTime
        }
    }
}
