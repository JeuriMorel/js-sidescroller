import { PROGRESS_ICON_X } from "./constants.js"
import { Egg } from "./icon.js"
import { qs } from "./utils.js"

export class UI {
    constructor(game) {
        this.game = game
        this.progessIcons = [
            new Egg({
                game: this.game,
                image: qs("#eggs_01"),
                x: PROGRESS_ICON_X * 0,
                transparency: 0.2,
                sizeModifier: 0.5,
            }),
            new Egg({
                game: this.game,
                image: qs("#eggs_02"),
                x: PROGRESS_ICON_X * 1,
                transparency: 0.2,
                sizeModifier: 0.5,
            }),
            new Egg({
                game: this.game,
                image: qs("#eggs_03"),
                x: PROGRESS_ICON_X * 2,
                transparency: 0.2,
                sizeModifier: 0.5,
            }),
        ]
    }
    draw(context) {
        this.progessIcons.forEach(icon => icon.draw(context))
    }
}
