import { qs } from "./utils.js"
import { SPRITE_HEIGHT, SPRITE_WIDTH, STARTING_X } from "./constants.js"
import { Attacking_Claw, Falling, Game_Over, Get_Hit, Attacking_Dash, Idle, Jumping, Resting, Rolling, Running, Sleeping } from "./states.js"


export class Player {
    constructor(game) {
        this.game = game
        this.width = SPRITE_WIDTH
        this.height = SPRITE_HEIGHT
        this.x = STARTING_X
        this.y = this.game.height - this.height - this.game.groundMargin
        this.image = qs("#player")
        this.frame = 0
        this.maxFrame = 11
        this.animationSheet = 9
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.maxSpeed = 10
        //vertical
        this.velocityY = 0
        this.weight = 0.5

        //state management
        this.states = [
            new Attacking_Claw(this),
            new Falling(this),
            new Game_Over(this),
            new Get_Hit(this),
            new Attacking_Dash(this),
            new Idle(this),
            new Jumping(this),
            new Resting(this),
            new Rolling(this),
            new Running(this),
            new Sleeping(this),
        ]
        this.currentState = this.states[9]
    }
    update(deltaTime, input) {
        this.currentState.handleInput(input)
        //keep player within gamebox
        if (this.x < STARTING_X) this.x = STARTING_X
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width
        //vertical movement
        this.y += this.velocityY
        if (!this.isOnGround() && this.currentState === this.states[8]) {
            this.velocityY += this.weight * 8
            // this.x+= this.game.scrollSpeed * 3
        }else if (!this.isOnGround()) {
            this.velocityY += this.weight
            this.x += this.game.scrollSpeed * 0.2
        } else {
            this.velocityY = 0
        }
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin

        
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime 
        }
    }
    draw(context) {
        context.drawImage(
            this.image,
            this.animationSheet * this.width,
            this.frame * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
    }
    isOnGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    isAtStartingPosition() {
        return this.x <= STARTING_X
    }
}
