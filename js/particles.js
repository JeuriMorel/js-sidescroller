import { qs } from './utils.js'
import {SOUND_CRACKS_1, SOUND_CRACKS_2, SOUND_GHOST_DIE, SOUND_SNARE} from './constants.js'

class Particles {
    constructor(game, sizeModifier) {
        this.game = game
        this.sizeModifier = sizeModifier
        this.frameTimer = 0
        this.fps = 60
        this.frameInterval = 1000 / this.fps
        this.frame = 0
        this.animationSheet = 0
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

export class Boom extends Particles{
    constructor(game, x, y, sizeModifier) {
        super(game, sizeModifier)
        this.image = qs('#boom')
        this.maxFrame = 5
        this.fps = 15
        this.spriteHeight = 179
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - (this.width * 0.5)
        this.y = y - (this.height * 0.5)
        // this.audio.src = SOUND_GHOST_DIE
    }
}
export class Smoke extends Particles{
    constructor(game, x, y, sizeModifier) {
        super(game, sizeModifier)
        this.image = qs('#smoke')
        this.maxFrame = 7
        this.spriteHeight = 200
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - (this.width * 0.5)
        this.y = y - (this.height * 0.5)
        this.audio.src = Math.random() > 0.5 ? SOUND_CRACKS_1 : SOUND_CRACKS_2
    }
}
export class Fire extends Particles{
    constructor(game, x, y, sizeModifier) {
        super(game, sizeModifier)
        this.image = qs('#fire')
        this.maxFrame = 7
        this.spriteHeight = 200
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - (this.width * 0.5)
        this.y = y - this.height
        this.audio.src = SOUND_SNARE
    }
}