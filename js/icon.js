class Icon {
    constructor(game) {
        this.game = game
        this.transparency = 0
        this.sprite_sheets = game.sprite_sheets.icons
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
            this.x,
            this.y,
            this.width,
            this.height
        )
        context.restore()
    }
}

export class Heart extends Icon {
    constructor({ game, x, transparency, sizeModifier }) {
        super(game)
        this.image = this.sprite_sheets.heart
        this.spriteWidth = 158
        this.spriteHeight = 130

        this.sizeModifier = sizeModifier
        this.width = this.spriteHeight * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.transparency = transparency
        this.x = x
        this.y = 20
        this.waveCompleted = false
        this.isCurrentWave = false
    }
}
