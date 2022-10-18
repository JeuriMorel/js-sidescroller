import { FONT_FAMILY, MAX_LIVES, PROGRESS_ICON_X } from "./constants.js"
import { Heart } from "./icon.js"

export class UI {
    constructor(game) {
        this.game = game
        this.progressIcons = []
        this.floatingMessages = []
        this.numerator = 0
        this.denominator = 0

        for (let i = 0; i < MAX_LIVES; i++) {
            this.progressIcons.push(
                new Heart({
                    game: this.game,
                    x: PROGRESS_ICON_X * i + 10,
                    transparency: 0.1,
                    sizeModifier: 0.2,
                })
            )
        }
    }
    update(deltaTime) {
        this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion)
        this.floatingMessages.forEach(message => message.update(deltaTime))
    }
    draw(context) {
        let numerator = this.game.player.enemiesDefeated
        let denominator = this.game.currentWave.enemiesToDefeat
        if (denominator) {
            context.font = `30px ${FONT_FAMILY}`
            context.strokeStyle = "#333333"
            context.lineWidth = 7
            context.textAlign = 'left'
            context.fillStyle = '#cccccc'
            context.strokeText(`${numerator} / ${denominator}`, 20, 80)
            context.fillText(`${numerator} / ${denominator}`, 20, 80)
        }
        this.floatingMessages.forEach(message => message.draw(context))
        this.progressIcons.forEach(icon => {
            if (icon.waveCompleted) icon.transparency = 1
            else if (icon.isCurrentWave)
                icon.transparency = Math.max(numerator / denominator, 0.1)

            if (icon.isCurrentWave || icon.waveCompleted)
                icon.sizeModifier = 0.25

            icon.draw(context)
        })
    }
}

export class FloatingMessage{
    constructor({value, x, y, targetX = 30, targetY = 80}) {
        this.value = value
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.markedForDeletion = false
        this.timer = 0
    }
    update(deltaTime) {
        this.x +=(this.targetX - this.x) * 0.03
        this.y += (this.targetY - this.y) * 0.03
        this.timer+= deltaTime
        if(this.timer > 1000) this.markedForDeletion = true
    }
    draw(context) {
        context.font = `28px ${FONT_FAMILY}`
        context.strokeText(`${this.value}`, this.x, this.y)
        context.fillColor = '#333333'
        context.fillText(`${this.value}`, this.x, this.y)
    }
}
