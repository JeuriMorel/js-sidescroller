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
    states
} from "./states.js"

export class Player {
    constructor(game) {
        this.game = game
        this.attackDamage = 20
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
            height: this.height,
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
            this.hitbox.height = this.height - 20
        } else if (this.isRollingDown() || this.isRollingUp()) {
            this.hitbox.isActive = true
            this.hitbox.xOffset = 20
            this.hitbox.yOffset = 15
            this.hitbox.width = this.width - 40
            this.hitbox.height = this.height - 25
        } else if (this.isDashAttacking() && this.frame >= 9) {
            this.hitbox.isActive = true
            this.hitbox.xOffset = 70
            this.hitbox.yOffset = 15
            this.hitbox.width = this.width - 70
            this.hitbox.height = this.height - 20
        } else if (this.isFalling()) {
            this.hitbox.isActive = true
            this.hitbox.xOffset = 20
            this.hitbox.yOffset = 40
            this.hitbox.width = this.width - 70
            this.hitbox.height = this.height - 40
        } else {
            this.hitbox.isActive = false
        }
        this.updateHitboxes()
        if(this.hitbox.isActive) this.checkAttackCollision()
        if(this.hurtbox.body.isActive || this.hurtbox.head.isActive) this.checkHitCollision()
    }
    draw(context) {
        if (this.hurtbox.body.isActive) {
            context.strokeStyle = 'black'
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
            context.strokeStyle = "#ff0000"
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
    isFalling() {
        return this.currentState === this.states[1]
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
    isDashAttacking() {
        return this.currentState === this.states[4]
    }
    checkAttackCollision() {
        this.game.enemies.forEach(enemy => {
            if (enemy.hurtbox.body.isActive && this.hitbox.x <= enemy.hurtbox.body.x + enemy.hurtbox.body.width && this.hitbox.x + this.hitbox.width >= enemy.hurtbox.body.x && this.hitbox.y <= enemy.hurtbox.body.y + enemy.hurtbox.body.height && this.hitbox.y + this.hitbox.height >= enemy.hurtbox.body.y) {
                enemy.healthPoints -= this.attackDamage
                enemy.hurtbox.body.isActive = false
                if(this.isFalling()) this.setState(states.JUMPING)
            }
        })
    }
    checkHitCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.hitbox.isActive &&
                (enemy.hitbox.x <=
                    this.hurtbox.body.x + this.hurtbox.body.width ||
                    enemy.hitbox.x <=
                        this.hurtbox.head.x + this.hurtbox.head.width) &&
                (enemy.hitbox.x + enemy.hitbox.width >= this.hurtbox.body.x ||
                    enemy.hitbox.x + enemy.hitbox.width >=
                        this.hurtbox.head.x) &&
                (enemy.hitbox.y <=
                    this.hurtbox.body.y + this.hurtbox.body.height ||
                    enemy.hitbox.y <=
                        this.hurtbox.head.y + this.hurtbox.head.height) &&
                (enemy.hitbox.y + enemy.hitbox.height >= this.hurtbox.body.y ||
                    enemy.hitbox.y + enemy.hitbox.height >= this.hurtbox.head.y)
            ) {
                this.setState(states.GET_HIT)
            }
        })
    }
}
