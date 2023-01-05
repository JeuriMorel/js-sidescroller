import { qs } from "./utils.js"
import {
    SFX_VOLUME,
} from "./constants.js"

class Particles {
    constructor(game, sizeModifier, src) {
        this.game = game
        this.sizeModifier = sizeModifier
        this.frameTimer = 0
        this.fps = 60
        this.frameInterval = 1000 / this.fps
        this.frame = 0
        this.frameX = 0
        this.frameY = 0
        if (src) this.audio = new Audio(src)
        if(this.audio) this.audio.volume = SFX_VOLUME
    }

    update(deltaTime) {
        this.x -= this.game.scrollSpeed
        if (this.frame === 0) this.audio?.play()
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
            (this.frame % this.framesPerRow) * this.spriteWidth,
            Math.floor(this.frame / this.framesPerRow) * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

export class Boom extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#boom")
        this.maxFrame = 5
        this.framesPerRow = 5
        this.fps = 15
        this.spriteHeight = 179
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
}
export class Smoke extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#smoke")
        this.maxFrame = 7
        this.framesPerRow = 7
        this.spriteHeight = 200
        this.spriteWidth = 200
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
}

export class Hit_V1 extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#hit_one")
        this.maxFrame = 16
        this.framesPerRow = 4
        this.fps = 60
        this.spriteHeight = 256
        this.spriteWidth = 256
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
    
}
export class Hit_V2 extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#hit_two")
        this.maxFrame = 16
        this.framesPerRow = 4
        this.fps = 60
        this.spriteHeight = 256
        this.spriteWidth = 256
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
}

export class Red_Hit_V1 extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#red_hit_V1")
        this.maxFrame = 16
        this.framesPerRow = 4
        this.fps = 20
        this.spriteHeight = 256
        this.spriteWidth = 256
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
}
export class Red_Hit_V2 extends Particles {
    constructor({ game, x, y, sizeModifier, src }) {
        super(game, sizeModifier, src)
        this.image = qs("#red_hit_V2")
        this.maxFrame = 16
        this.framesPerRow = 4
        this.fps = 20
        this.spriteHeight = 256
        this.spriteWidth = 256
        this.height = this.spriteHeight * this.sizeModifier
        this.width = this.spriteWidth * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
    }
}
