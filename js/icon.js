class Icon {
    constructor(game) {
        this.game = game
        this.transparency = 1
    }
    draw(context) {
        context.save()
        context.globalAlpha = this.transparency
        context.drawImage(
            this.image,
            0,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x + this.spriteWidth * 0.5,
            this.y,
            this.width,
            this.height
        )
        context.restore()
    }
}

export class Egg extends Icon {
    constructor({ game, image, x, transparency, sizeModifier }) {
        super(game)
        this.image = image
        this.spriteHeight = 150
        this.spriteWidth = 150
        
        this.sizeModifier = sizeModifier
        this.width = this.spriteHeight * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.transparency = transparency
        this.x = x
        this.y = this.spriteHeight * 0.5 - this.height * 0.5
    }
}
