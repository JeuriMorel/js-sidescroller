import { FONT_FAMILY, DAMAGE_FONT_SIZE, BLACK_COLOR } from "./constants.js"
import { valuesToHSL } from "./utils.js"

export class DamageNumbers{
    constructor({value, x, y}) {
        this.value = value
        this.x = x
        this.y = y
        this.markedForDeletion = false
        this.timer = 0
        this.velocityY = 0
        this.weight = 5
        this.angle = 90
        this.curve = Math.random() * 10 + 80
    }
    update({x, y}) {
        this.x = x
        this.y = y + this.velocityY
        this.y += Math.sin(this.angle) * this.curve
        this.curve -= 2
        if(this.curve < 0) this.curve = 0
        this.angle += 0.2
        this.timer++
        if (this.timer > 100) this.markedForDeletion = true
    }
    draw({context, color}) {
        context.font = `${DAMAGE_FONT_SIZE}px ${FONT_FAMILY}`
        context.strokeStyle = valuesToHSL(BLACK_COLOR) //	hsl(0, 0%, 0%)
        context.lineWidth = 8
        context.strokeText(this.value, this.x, this.y)
        context.fillStyle = valuesToHSL(color)
        context.fillText(this.value, this.x, this.y)
    }

}