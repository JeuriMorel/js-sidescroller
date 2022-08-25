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
        this.frame = 0
        this.player.maxFrame = 13
    }
    handleInput() {
        return
    }
}
export class Falling extends State {
    constructor(player) {
        super("FALLING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 1
        this.frame = 0
        this.player.maxFrame = 9
    }
    handleInput(input) {
        if (input === "PRESS Attack") this.player.setState(states.ROLL)
        if (this.player.isOnGround()) this.player.setState(states.RUNNING)
    }
}
export class Game_Over extends State {
    constructor(player) {
        super("GAME_OVER")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 2
        this.frame = 0
        this.player.maxFrame = 24
        this.game.scrollSpeed = 0
    }
    handleInput(input) {
        if (input === "PRESS Down") this.player.setState(states.IDLE)
    }
}
export class Get_Hit extends State {
    constructor(player) {
        super("GET_HIT")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 3
        this.frame = 0
        this.game.scrollSpeed = 2
        this.player.maxFrame = 7
    }
    handleInput(input) {
        if (input === "PRESS Down") this.player.setState(states.IDLE)
    }
}
export class Attacking_Dash extends State {
    constructor(player) {
        super("DASH_ATTACK")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 4
        this.frame = 0
        this.player.maxFrame = 14
    }
    handleInput(input) {
        if (input === "PRESS Down") this.player.setState(states.IDLE)
    }
}
export class Idle extends State {
    constructor(player) {
        super("IDLE")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 5
        this.frame = 0
        this.game.scrollSpeed = 0
        this.player.maxFrame = 19
    }
    handleInput(input) {
        if (input === "RELEASE Left" || input === "PRESS Right")
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
        this.frame = 0
        this.player.velocityY -= 20
        this.player.maxFrame = 9
        //adjust scroll speed
        this.game.scrollSpeed = this.game.scrollSpeed * 0.5
    }
    handleInput(input) {
        if (input === "PRESS Attack") this.player.setState(states.CLAW_ATTACK)
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
        this.frame = 0
        this.game.scrollSpeed = 0
        this.player.maxFrame = 13
    }
    handleInput(input) {
        if (input === "PRESS Attack") this.player.setState(states.ROLL)
        else if (input === "RELEASE Down") this.player.setState(states.RUNNING)
    }
}
export class Rolling extends State {
    constructor(player) {
        super("ROLL")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 8
        this.frame = 0
        this.player.maxFrame = 8
    }
    handleInput(input) {
        if (input === "PRESS Down") this.player.setState(states.IDLE)
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
        this.frame = 0
        this.game.scrollSpeed = DEFAULT_SCROLL_SPEED
        this.player.maxFrame = 11
    }
    handleInput(input) {
        if (input === "PRESS Left") this.player.setState(states.IDLE)
        else if (input === "PRESS Up") this.player.setState(states.RUNNING)
        else if (input === "PRESS Right")
            this.player.setState(states.DASH_ATTACK)
        else if (input === "PRESS Down") this.player.setState(states.RESTING)
    }
}
export class Sleeping extends State {
    constructor(player) {
        super("SLEEPING")
        this.player = player
    }
    enter() {
        this.player.animationSheet = 10
        this.frame = 0
        this.game.scrollSpeed = 0
        this.player.maxFrame = 19
    }
    handleInput(input) {
        if (input === "PRESS Left") this.player.setState(states.IDLE)
    }
}
