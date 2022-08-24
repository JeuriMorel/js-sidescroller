const States = {
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
