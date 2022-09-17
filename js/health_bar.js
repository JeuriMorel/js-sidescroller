import { getHealthBarColor } from "./utils.js"

export class HealthBar {
    constructor({
        x,
        y,
        width,
        height,
        maxhealth,
        borderColor = "black",
        fillColor = "#abff2e",
    }) {
        this.barOffset = 2
        this.x = x
        this.y = y
        this.width = width - this.barOffset * 2
        this.maxWidth = width
        this.height = height
        this.radius = this.height * 0.5
        this.barRadius = this.radius - this.barOffset
        this.barX = this.x + this.barOffset
        this.barY = this.y + this.barOffset
        this.barheight = this.height - this.barOffset * 2
        this.health = maxhealth
        this.maxhealth = maxhealth
        this.borderColor = borderColor
        this.fillColor = fillColor
    }

    update(healthPoints, x, y) {
        this.x = x
        this.y = y
        this.barX = x + this.barOffset
        this.barY = y + this.barOffset
        this.health = healthPoints

        this.width =
            (this.health / this.maxhealth) * this.maxWidth - this.barOffset * 2
    }

    draw(context) {
        context.strokeStyle = this.borderColor
        context.fillStyle = getHealthBarColor(
            this.fillColor,
            this.health / this.maxhealth
        )
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
    }
}
