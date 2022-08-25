import { qs, qsa } from "./utils.js"
import { LAYER_HEIGHT, LAYER_WIDTH } from "./constants.js"

class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game
        this.width = width
        this.height = height
        this.speedModifier = speedModifier
        this.image = image
        this.x = 0
        this.y = 0
    }
    update() {
        if (this.x < -this.width) this.x = 0
        else this.x -= this.game.scrollSpeed * this.speedModifier
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(
            this.image,
            this.x + this.width,
            this.y,
            this.width,
            this.height
        )
    }
}

export class Background {
    constructor(game) {
        this.game = game
        this.width = LAYER_WIDTH
        this.height = LAYER_HEIGHT
        this.layer7image = qs("#bgLayer7")
        this.layer6image = qs("#bgLayer6")
        this.layer5image = qs("#bgLayer5")
        this.layer4image = qs("#bgLayer4")
        this.layer3image = qs("#bgLayer3")
        this.layer2image = qs("#bgLayer2")
        this.layer1image = qs("#bgLayer1")
        this.layer1 = new Layer(
            this.game,
            this.width,
            this.height,
            0.14,
            this.layer1image
        )
        this.layer2 = new Layer(
            this.game,
            this.width,
            this.height,
            0.28,
            this.layer2image
        )
        this.layer3 = new Layer(
            this.game,
            this.width,
            this.height,
            0.42,
            this.layer3image
        )
        this.layer4 = new Layer(
            this.game,
            this.width,
            this.height,
            0.56,
            this.layer4image
        )
        this.layer5 = new Layer(
            this.game,
            this.width,
            this.height,
            0.7,
            this.layer5image
        )
        this.layer6 = new Layer(
            this.game,
            this.width,
            this.height,
            0.86,
            this.layer6image
        )
        this.layer7 = new Layer(
            this.game,
            this.width,
            this.height,
            1,
            this.layer7image
        )

        this.bgLayers = [
            this.layer1,
            this.layer2,
            this.layer3,
            this.layer4,
            this.layer5,
            this.layer6,
            this.layer7,
        ]
    }
    update() {
        this.bgLayers.forEach(layer => {
            layer.update()
        })
    }

    draw(context) {
        this.bgLayers.forEach(layer => {
            layer.draw(context)
        })
    }
}
