import { isPaused } from "./app.js"
import {
    FLOATING_DEFAULT_FONT_SIZE,
    FONT_FAMILY,
    LIGHT_GRAY_COLOR,
    MAX_LIVES,
    PROGRESS_ICON_X,
    RED_TEXT_COLOR,
} from "./constants.js"
import { Heart } from "./icon.js"
import { valuesToHSL } from "./utils.js"

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
        this.floatingMessages = this.floatingMessages.filter(
            message => !message.markedForDeletion
        )
        this.floatingMessages.forEach(message => message.update(deltaTime))
    }
    draw(context) {
        let numerator = this.game.player.enemiesDefeated
        let denominator = this.game.currentWave.enemiesToDefeat
        if (denominator) {
            context.font = `30px ${FONT_FAMILY}`
            context.strokeStyle = valuesToHSL(RED_TEXT_COLOR)
            context.lineWidth = 7
            context.textAlign = "left"
            context.fillStyle = valuesToHSL(LIGHT_GRAY_COLOR) // 	hsl(0, 0%, 93%) "#eeeeee"
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

        if (isPaused) {
            context.filter = "none"
            context.font = `100px ${FONT_FAMILY}`
            context.strokeStyle = valuesToHSL(RED_TEXT_COLOR)
            context.lineWidth = 7
            context.textAlign = "center"
            context.textBaseline = "middle"
            context.fillStyle = valuesToHSL(LIGHT_GRAY_COLOR) // 0, 0%, 93%
            context.strokeText(
                "PAUSED",
                this.game.width * 0.5,
                this.game.height * 0.5
            )
            context.fillText(
                "PAUSED",
                this.game.width * 0.5,
                this.game.height * 0.5
            )
        }
        if (this.game.currentWave.waveIndex === 10) {
            context.filter = "none"
            context.font = `44px ${FONT_FAMILY}`
            context.strokeStyle = valuesToHSL(RED_TEXT_COLOR)
            context.lineWidth = 7
            context.textAlign = "center"
            context.textBaseline = "middle"
            context.fillStyle = valuesToHSL(LIGHT_GRAY_COLOR)
            context.strokeText(
                `CONGRATULATIONS`,
                this.game.width * 0.5,
                this.game.height * 0.4
            )
            context.fillText(
                `CONGRATULATIONS`,
                this.game.width * 0.5,
                this.game.height * 0.4
            )
            context.font = `32px ${FONT_FAMILY}`

            context.strokeText(
                `LIVES REMAINING: ${this.progressIcons.length}`,
                this.game.width * 0.5,
                this.game.height * 0.5
            )
            context.fillText(
                `LIVES REMAINING: ${this.progressIcons.length}`,
                this.game.width * 0.5,
                this.game.height * 0.5
            )
            context.strokeText(
                `Completed in: ${this.game.currentWave.totalTime}`,
                this.game.width * 0.5,
                this.game.height * 0.6
            )
            context.fillText(
                `Completed in: ${this.game.currentWave.totalTime}`,
                this.game.width * 0.5,
                this.game.height * 0.6
            )
        }
    }
}

export class FloatingMessage {
    constructor({ value, x, y, targetX = 30, targetY = 80, sizeModifier = 0 }) {
        this.value = value
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.markedForDeletion = false
        this.timer = 0
        this.opacity = 1
        this.sizeModifier = sizeModifier
        this.fontBonus = 0
    }
    update(deltaTime) {
        this.x += (this.targetX - this.x) * 0.03
        this.y += (this.targetY - this.y) * 0.03
        this.timer += deltaTime
        if (this.timer > 1000) this.markedForDeletion = true
        if (this.timer > 900) {
            this.opacity = 0.3
            this.fontBonus = this.sizeModifier * 4
        } else if (this.timer > 700) {
            this.opacity = 0.6
            this.fontBonus = this.sizeModifier * 2
        } else if (this.timer > 600) {
            this.opacity = 0.8
            this.fontBonus = this.sizeModifier
        }
    }
    draw(context) {
        context.save()
        context.globalAlpha = this.opacity
        context.font = `${
            FLOATING_DEFAULT_FONT_SIZE + this.fontBonus
        }px ${FONT_FAMILY}`
        context.strokeText(`${this.value}`, this.x, this.y)
        context.fillText(`${this.value}`, this.x, this.y)
        context.restore()
    }
}
