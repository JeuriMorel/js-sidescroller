import { qs } from "./utils.js"
import {
    DEFAULT_SCROLL_SPEED,
    SPRITE_HEIGHT,
    SPRITE_WIDTH,
    STARTING_X,
} from "./constants.js"
import {
    Attacking_Claw,
    Falling,
    Game_Over,
    Get_Hit,
    Attacking_Dash,
    Idle,
    Jumping,
    Resting,
    Roll_Down,
    Roll_Up,
    Roll_Across,
    Roll_Back,
    Running,
    Sleeping,
} from "./states.js"

export class Player {
    constructor(game) {
        this.game = game
        this.width = SPRITE_WIDTH
        this.height = SPRITE_HEIGHT
        this.x = STARTING_X
        this.y = this.game.height - this.height - this.game.groundMargin
        this.starting_x = STARTING_X
        this.image = qs("#player")
        this.frame = 0
        this.maxFrame = 11
        this.animationSheet = 9
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.maxSpeed = 10
        this.hurtbox = {
            body: {
                isActive: true,
                xOffset: 25,
                yOffset: 40,
                x: this.x + 25,
                y: this.y + 40,
                width: this.width - 60,
                height: this.height - 40,
            },
            head: {
                isActive: true,
                xOffset: 38,
                yOffset: 20,
                x: this.x + 38,
                y: this.y + 20,
                width: this.width - 65,
                height: this.height - 40,
            },
        }
        this.hitbox = {
            isActive: false,
            xOffset: 40,
            yOffset: 50,
            x: this.x + this.xOffset,
            y: this.y + this.yOffset,
            width: this.width,
            height: this.height
        }
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
            new Roll_Up(this),
            new Roll_Down(this),
            new Roll_Across(this),
            new Roll_Back(this),
            new Running(this),
            new Sleeping(this),
        ]
        this.currentState = this.states[12]
    }
    update(deltaTime, input) {
        this.currentState.handleInput(input)
        //keep player within gamebox
        if (this.x < STARTING_X) this.x = STARTING_X
        else if (this.x > this.game.width - this.width * 3) {
            this.x = this.game.width - this.width * 3
            this.game.scrollSpeed = DEFAULT_SCROLL_SPEED * 2
        }
        //vertical movement
        this.y += this.velocityY
        if (!this.isOnGround() && this.isRollingDown()) {
            this.velocityY += this.weight * 8
        } else if (!this.isOnGround() && this.isRollingUp()) {
            this.velocityY += this.weight * 2
        } else if (!this.isOnGround()) {
            this.velocityY += this.weight
            this.x += this.game.scrollSpeed * 0.02
        } else {
            this.velocityY = 0
        }
        if (this.y > this.game.height - this.height - this.game.groundMargin)
            this.y = this.game.height - this.height - this.game.groundMargin

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frame < this.maxFrame) this.frame++
            else this.frame = 0
        } else {
            this.frameTimer += deltaTime
        }
        //player hitboxes
        if (this.isClawing() && this.frame >= 8) {
            this.hitbox.isActive = true
            this.hitbox.xOffset = 70
            this.hitbox.yOffset = 15
            this.hitbox.width = this.width - 70
            this.hitbox.height = this.height - 25
        } else {
            this.hitbox.isActive = false
        }
        this.updateHitboxes()
    }
    draw(context) {
        if (this.hurtbox.body.isActive) {
            context.beginPath()
            context.rect(
                this.hurtbox.body.x,
                this.hurtbox.body.y,
                this.hurtbox.body.width,
                this.hurtbox.body.height
            )
            context.stroke()
        }
        if (this.hurtbox.head.isActive) {
            context.beginPath()
            context.rect(
                this.hurtbox.head.x,
                this.hurtbox.head.y,
                this.hurtbox.head.width,
                this.hurtbox.head.height
            )
            context.stroke()
        }
        if (this.hitbox.isActive) {
            context.beginPath()
            context.rect(
                this.hitbox.x,
                this.hitbox.y,
                this.hitbox.width,
                this.hitbox.height
            )
            context.stroke()
        }
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
    updateHitboxes() {
        this.hurtbox.body.x = this.x + this.hurtbox.body.xOffset
        this.hurtbox.body.y = this.y + this.hurtbox.body.yOffset
        this.hurtbox.head.x = this.x + this.hurtbox.head.xOffset
        this.hurtbox.head.y = this.y + this.hurtbox.head.yOffset
        this.hitbox.x = this.x + this.hitbox.xOffset
        this.hitbox.y = this.y + this.hitbox.yOffset
    }
    setState(state) {
        this.currentState = this.states[state]
        this.currentState.enter()
    }
    isOnGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    isRollingUp() {
        return this.currentState === this.states[8]
    }
    isRollingDown() {
        return this.currentState === this.states[9]
    }
    isRollingBack() {
        return this.currentState === this.states[11]
    }
    isAtStartingPosition() {
        return this.x <= STARTING_X
    }
    isClawing() {
        return this.currentState === this.states[0]
    }
}
