import {qs} from './utils.js'

class Particles {
    constructor(game, sizeModifier, enemyType) {
        this.game = game
        this.sizeModifier = sizeModifier
        this.frameTimer = 0
        this.fps = 40
        this.frameInterval = 1000 / this.fps
        this.frame = 0
        this.animationSheet = 0
        this.enemyType = enemyType
        this.audio = new Audio();

    }

    update(deltaTime) {
        if (this.frame === 0) this.audio.play()
        if (this.frame >= this.maxFrame) this.markedForDeletion = true
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            this.frame++
        } else {
            this.frameTimer += deltaTime
        }
    }

    draw(context) {
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

export class Explosion extends Particles{
    constructor(game, x, y, sizeModifier, enemyType) {
        super(game, sizeModifier, enemyType)
        this.image = qs('#boom')
        this.maxFrame = 5
        this.spriteHeight = 179
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - (this.width * 0.5)
        this.y = y - (this.height * 0.5)
        this.audio.src = this.enemyType == 'Ghost' ? './audio/ghost_die.wav' : this.enemyType == 'AngryEgg' ? './audio/multiple_cracks_1.wav' : './audio/multiple_cracks_2.wav'
    }
}