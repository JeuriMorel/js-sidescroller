import { DamageNumbers } from "./damageNumbers.js"
import { getHealthBarColor } from "./utils.js"

export class HealthBar {
    constructor({
        x,
        y,
        width,
        height,
        maxhealth,
        borderColor = "black",
        defaultbarColor = "#abff2e",
        showDamage = true,
    }) {
        this.barOffset = 2
        this.x = x
        this.y = y
        this.width = width - this.barOffset * 2
        this.maxWidth = width
        this.height = height
        this.radius = this.height * 0.25
        this.barRadius = Math.max(this.radius - this.barOffset, 1)
        this.barX = this.x + this.barOffset
        this.barY = this.y + this.barOffset
        this.barheight = this.height - this.barOffset * 2
        this.health = maxhealth
        this.maxhealth = maxhealth
        this.borderColor = borderColor
        this.defaultbarColor = defaultbarColor
        this.fillColor = defaultbarColor
        this.damageNumbers = []
        this.showDamage = showDamage
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
        this.barX = x + this.barOffset
        this.barY = y + this.barOffset
        this.damageNumbers = this.damageNumbers.filter(
            numbers => !numbers.markedForDeletion
        )
        this.damageNumbers.forEach(numbers =>
            numbers.update({ x: this.x + this.width, y: this.y - this.height })
        )
    }

    updateBar(healthPoints) {
        const damageTaken = this.health - healthPoints
        this.health = healthPoints
        this.width =
            (this.health / this.maxhealth) * this.maxWidth - this.barOffset * 2
        this.fillColor = getHealthBarColor(
            this.defaultbarColor,
            this.health / this.maxhealth
        )
        if (this.showDamage)
            this.damageNumbers.push(
                new DamageNumbers({
                    value: damageTaken,
                    x: this.x + this.width,
                    y: this.y - this.height,
                })
            )
    }

    draw(context) {
        context.strokeStyle = this.borderColor
        context.fillStyle = this.fillColor
        context.lineWidth = 2

        // const border = new Path2D()
        const bar = new Path2D()

        bar.moveTo(this.barX + this.barRadius, this.barY)
        bar.arcTo(
            this.barX + this.width,
            this.barY,
            this.barX + this.width,
            this.barY + this.barheight,
            this.barRadius
        )
        bar.arcTo(
            this.barX + this.width,
            this.barY + this.barheight,
            this.barX,
            this.barY + this.barheight,
            this.barRadius
        )
        bar.arcTo(
            this.barX,
            this.barY + this.barheight,
            this.barX,
            this.barY,
            this.barRadius
        )
        bar.arcTo(
            this.barX,
            this.barY,
            this.barX + this.width,
            this.barY,
            this.barRadius
        )
        bar.closePath()

        context.beginPath()
        context.moveTo(this.x + this.radius, this.y)
        context.arcTo(
            this.x + this.maxWidth,
            this.y,
            this.x + this.maxWidth,
            this.y + this.height,
            this.radius
        )
        context.arcTo(
            this.x + this.maxWidth,
            this.y + this.height,
            this.x,
            this.y + this.height,
            this.radius
        )
        context.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius)
        context.arcTo(
            this.x,
            this.y,
            this.x + this.maxWidth,
            this.y,
            this.radius
        )
        context.closePath()
        context.stroke()
        context.fill(bar)
        this.damageNumbers.forEach(numbers =>
            numbers.draw({ context, color: this.fillColor })
        )
    }
}
