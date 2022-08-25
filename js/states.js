import { DEFAULT_SCROLL_SPEED } from "./constants.js"

export const states = {
    CLAW_ATTACK: 0,
    FALLING: 1,
    GAME_OVER: 2,
    GET_HIT: 3,
    DASH_ATTACK: 4,
    IDLE: 5,
    JUMPING: 6,
    RESTING: 7,
    ROLL: 8,
    RUNNING: 9,
    SLEEPING: 10,
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

        this.player.game.scrollSpeed = 0
    }
    handleInput() {
        if (this.player.frame > 8 && this.player.frame < 11) this.player.x += 2
        if (this.player.frame == this.player.maxFrame)
            this.player.setState(states.IDLE)

        // if (!this.player.isAtStartingPosition())
        //     this.player.x -= this.player.game.scrollSpeed
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
    }
    handleInput({ lastKey }) {
        if (this.player.isOnGround()) this.player.setState(states.RUNNING)
        if (lastKey === "PRESS Attack") this.player.setState(states.ROLL)
        else if (lastKey === "PRESS Left")
            this.player.x -= this.player.game.scrollSpeed
        else if (lastKey === "PRESS Right")
            this.player.x += this.player.game.scrollSpeed
        else this.player.x += this.player.game.scrollSpeed * 0.3
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
    }
    handleInput({ lastKey }) {
        if (lastKey === "PRESS Down") this.player.setState(states.IDLE)
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
    }
    handleInput({ lastKey }) {
        if (this.player.frame === 8 && lastKey === "PRESS Attack")
            this.player.frame = 7
        else if (lastKey === "PRESS Left") this.player.setState(states.IDLE)
        if (this.player.frame > 10) this.player.x += 20
        if (this.player.frame == this.player.maxFrame)
            this.player.setState(states.RUNNING)
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

        this.player.game.scrollSpeed = 0
    }
    handleInput({ lastKey, lastTimeKeyPressed }) {
        if (lastKey === "PRESS Attack") this.player.setState(states.CLAW_ATTACK)
        else if (lastKey === "PRESS Up") this.player.setState(states.JUMPING)
        else if (
            lastKey === "PRESS Down" &&
            Date.now() - lastTimeKeyPressed < 250
        )
            this.player.setState(states.SLEEPING)
        else if (lastKey === "PRESS Down") this.player.setState(states.RESTING)
        else if (lastKey === "RELEASE Left" || lastKey === "PRESS Right")
            this.player.setState(states.RUNNING)

        // if (this.player.isAtStartingPosition()) this.player.game.scrollSpeed = 0
        // else this.player.x -= this.player.game.scrollSpeed
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
        this.player.velocityY -= 15
        this.player.maxFrame = 9
        //adjust scroll speed
        // this.player.game.scrollSpeed = this.player.game.scrollSpeed * 0.5
    }
    handleInput({ lastKey }) {
        if (lastKey === "PRESS Left")
            this.player.x -= this.player.game.scrollSpeed
        else if (lastKey === "PRESS Right")
            this.player.x += this.player.game.scrollSpeed
        else this.player.x += this.player.game.scrollSpeed * 0.3

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

        this.player.game.scrollSpeed = 0
    }
    handleInput({ lastKey }) {
        if (lastKey === "RELEASE Down") this.player.setState(states.IDLE)
        else if (lastKey === "PRESS Right") this.player.setState(states.RUNNING)
        else if (lastKey === "PRESS Up") this.player.setState(states.JUMPING)

        // if (this.player.isAtStartingPosition()) this.player.game.scrollSpeed = 0
        // else this.player.x -= this.player.game.scrollSpeed
    }
}
export class Rolling extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.player.frame = 0
        this.player.maxFrame = 8
    }
    handleInput({ lastKey }) {
        if (this.player.isOnGround()) this.player.setState(states.RESTING)
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
        // this.player.game.scrollSpeed = DEFAULT_SCROLL_SPEED
        this.player.maxFrame = 11
    }
    handleInput({ lastKey }) {
        if (this.player.game.scrollSpeed < DEFAULT_SCROLL_SPEED)
            this.player.game.scrollSpeed += 0.05
        if (lastKey === "PRESS Left") this.player.setState(states.IDLE)
        else if (lastKey === "PRESS Up") this.player.setState(states.JUMPING)
        else if (lastKey === "PRESS Down") this.player.setState(states.RESTING)
        else if (
            lastKey === "PRESS Attack" &&
            this.player.game.scrollSpeed >= DEFAULT_SCROLL_SPEED
        )
            this.player.setState(states.DASH_ATTACK)

        if (!this.player.isAtStartingPosition())
            this.player.x -= this.player.game.scrollSpeed * 0.5
        // else if (input === "PRESS Attack")
        //     this.player.setState(states.CLAW_ATTACK)
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

        this.player.game.scrollSpeed = 0
    }
    handleInput({ lastKey }) {
        if (lastKey === "PRESS Left") this.player.setState(states.IDLE)
        else if (lastKey === "PRESS Right") this.player.setState(states.RUNNING)
        // if (this.player.isAtStartingPosition()) this.player.game.scrollSpeed = 0
        // else this.player.x -= this.player.game.scrollSpeed
    }
}
