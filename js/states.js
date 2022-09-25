import {
    DEFAULT_SCROLL_SPEED,
    SOUND_SNARE,
    DEFAULT_WEIGHT,
    FALLING_WEIGHT,
    FLOATING_WEIGHT,
} from "./constants.js"
import { Boom, Explosion_V1, Explosion_V2, Fire } from "./particles.js"

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
        // this.player.hitbox.isActive = true
        // this.player.hitbox.xOffset = 70
        // this.player.hitbox.yOffset = 15
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
        if (lastKey == "PRESS Left") this.player.setState(states.ROLL_BACK)
        if (this.player.frame > 5 && this.player.frame < 8 && this.player.frameTimer >= 0) this.player.y -= 6
        if (
            this.player.frame > 8 &&
            this.player.frame < 10 &&
            this.player.frameTimer >= 0
        )
            this.player.x += 5
        if (this.player.frame === 12) {
            if (this.player.isWhiffing) this.player.audio.slash.play()
            else this.player.audio.claw_strike.play()
        }
        if (this.player.frame == this.player.maxFrame) {
            this.player.setState(states.IDLE)
            this.player.isWhiffing = true
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
        if(!keysPressed.up && !keysPressed.right && !keysPressed.down && !keysPressed.left) this.player.game.scrollSpeed = 0
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
    handleInput({ lastKey }) {
        if (lastKey === "PRESS Down") this.player.setState(states.IDLE)
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
        this.player.game.scrollSpeed = 2
        this.player.maxFrame = 7
        this.player.hurtbox.head.isActive = false
        this.player.hurtbox.body.isActive = false
        this.player.x -= 15
        this.player.y -= 10
    }
    handleInput({ lastKey }) {
        this.player.x -= 15
        if (this.player.frame == this.player.maxFrame)
            this.player.setState(states.IDLE)
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
        if (this.player.frame === 8 && lastKey === "PRESS Attack") {
            this.player.frame = 7
            if (this.player.dash_bonus < 5) this.player.dash_bonus++
            if (this.player.game.recoveryTime < 300)
                this.player.game.recoveryTime += 50
        } else if (lastKey === "PRESS Left")
            this.player.setState(states.ROLL_BACK)
        if (this.player.frame > 10) {
            this.player.x += 25
            this.player.audio.dash.play()
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
        if (lastKey === "PRESS Attack")
            this.player.setState(states.CLAW_ATTACK)
        else if (lastKey === "PRESS Up") this.player.setState(states.JUMPING)
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
        this.player.velocityY -=  16 + this.player.game.scrollSpeed * 0.5
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
            this.player.x -= this.player.game.scrollSpeed * 2 + 2
        } else if (keysPressed.right)
            this.player.x++
        else if (lastKey === "RELEASE Up") this.player.velocityY += 1
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
        
        if (keysPressed.down) {
            if (lastKey === "PRESS Right")
                this.player.setState(states.ROLL_ACROSS)
            else if (lastKey === "PRESS Left")
                this.player.setState(states.ROLL_BACK)
        } else if (
            lastKey === "PRESS Up" ||
            lastKey == "RELEASE Down" ||
            lastKey === "PRESS Right" ||
            lastKey === "PRESS Left"
        )
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
        this.player.hurtbox.head.isActive = false
    }
    handleInput() {
        if (this.player.isOnGround()) {
            this.player.game.particles.push(
                new Fire({
                    game: this.player.game,
                    x: this.player.x + this.player.width * 0.5,
                    y:
                        this.player.game.height -
                        this.player.game.groundMargin +
                        this.player.height * 0.5,
                    sizeModifier: 1,
                    src: SOUND_SNARE,
                })
            )
            this.player.setState(states.RESTING)
            this.player.game.recoveryTime += 300
            this.player.game.isRecovering = true
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
        this.player.audio.dodge.play()
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
        this.player.audio.dodge.play()
    }
    handleInput() {
        this.player.x -= this.player.maxFrame - this.player.frame
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
    handleInput({ lastKey,keysPressed }) {
        if (this.player.game.scrollSpeed < DEFAULT_SCROLL_SPEED) {
            this.player.game.scrollSpeed += 0.4
        }

        
        if (lastKey === "PRESS Up") this.player.setState(states.JUMPING)
        else if (lastKey === "PRESS Down") {
            if (!keysPressed.right) this.player.setState(states.RESTING)
            if (keysPressed.right) this.player.setState(states.ROLL_ACROSS)
        }
        else if (
            lastKey === "PRESS Attack" &&
            this.player.game.scrollSpeed >= DEFAULT_SCROLL_SPEED
        )
            this.player.setState(states.DASH_ATTACK)
        
        if (!keysPressed.right)
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
    }
    handleInput({ lastKey }) {
        if (
            lastKey === "PRESS Up" ||
            lastKey === "PRESS Right" ||
            lastKey === "PRESS Left" ||
            lastKey === "PRESS Right" ||
            lastKey === "RELEASE Down"
        )
            this.player.setState(states.IDLE)
    }
}
