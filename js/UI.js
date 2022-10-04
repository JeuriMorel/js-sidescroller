import { PROGRESS_ICON_X } from "./constants.js"
import { Heart } from "./icon.js"


export class UI {
    constructor(game) {
        this.game = game
        this.progessIcons = [
            new Heart({
                game: this.game,
                x: PROGRESS_ICON_X * 0 + 10,
                transparency: 1,
                sizeModifier: 0.25,
            }),
            new Heart({
                game: this.game,
                x: PROGRESS_ICON_X * 1 + 10,
                transparency: 0.2,
                sizeModifier: 0.25,
            }),
            new Heart({
                game: this.game,
                x: PROGRESS_ICON_X * 2 + 10,
                transparency: 0.1,
                sizeModifier: 0.25,
            }),
        ]
    }
    draw(context) {
        this.progessIcons.forEach(icon => icon.draw(context))
    }
}
