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

class Armored_Frog {
    constructor(game) {
        this.game = game
        this.healthPoints = 200
        this.animationSheet = 0
        this.frame = 0
        this.maxFrame = 11
        this.fps = 30
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.deleteEnemy = false
        this.invulnerabilityTime = 0
        this.spriteHeight = 0
        this.spriteWidth = 0
        this.width = 0
        this.height = 0

        this.states = [
            new Walking(this),
            new Attack(this),
            new Idle(this),
            new Jump_Down(this),
            new Jump_Up(this),
            new Got_Hit(this),
            new Defeated(this),
        ]
        this.currentState = this.setState(states.IDLE)
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
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
        if (this.healthPoints <= 0) this.deleteEnemy = true
        // this.updateHitboxes()
        // if (this.invulnerabilityTime > 0) this.invulnerabilityTime -= deltaTime
        // else this.hurtbox.body.isActive = true
    }
    draw(context) {
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
        // if (this.hitbox.isActive) {
        //     context.strokeStyle = "#ff0000"
        //     context.beginPath()
        //     context.rect(
        //         this.hitbox.x,
        //         this.hitbox.y,
        //         this.hitbox.width,
        //         this.hitbox.height
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
        this.boss.spriteWidth = 609
        this.boss.spriteHeight = 393
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 30
        this.boss.image = qs("#attack")
    }
}
class Walking extends Boss_State {
    constructor(boss) {
        super("WALKING")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 467
        this.boss.spriteHeight = 393
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 22
        this.boss.image = qs("#walking")
    }
}
class Idle extends Boss_State {
    constructor(boss) {
        super("IDLE")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 446
        this.boss.spriteHeight = 395
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 30
        this.boss.image = qs("#idle")
    }
}
class Jump_Down extends Boss_State {
    constructor(boss) {
        super("JUMP_DOWN")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 647
        this.boss.spriteHeight = 432
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 20
        this.boss.image = qs("#jump_down")
    }
}
class Jump_Up extends Boss_State {
    constructor(boss) {
        super("JUMP_UP")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 707
        this.boss.spriteHeight = 491
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 20
        this.boss.image = qs("#jump_up")
    }
}
class Got_Hit extends Boss_State {
    constructor(boss) {
        super("GOT_HIT")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 494
        this.boss.spriteHeight = 396
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 16
        this.boss.image = qs("#got_hit")
    }
}
class Defeated extends Boss_State {
    constructor(boss) {
        super("DEFEATED")
        this.boss = boss
    }
    enter() {
        this.boss.spriteWidth = 522
        this.boss.spriteHeight = 475
        this.boss.width = this.boss.spriteWidth
        this.boss.height = this.boss.spriteHeight
        this.boss.maxFrame = 50
        this.boss.image = qs("#defeated")
    }
}
