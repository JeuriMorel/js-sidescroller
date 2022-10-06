import { MAX_LIVES, PROGRESS_ICON_X } from "./constants.js"
import { Heart } from "./icon.js"

export class UI {
    constructor(game) {
        this.game = game
        this.progessIcons = []

        for (let i = 0; i < MAX_LIVES; i++) {
            this.progessIcons.push(
                new Heart({
                    game: this.game,
                    x: PROGRESS_ICON_X * i + 10,
                    transparency: 0.1,
                    sizeModifier: 0.2,
                })
            )
        }
    }
    draw(context) {
        this.progessIcons.forEach(icon => {
            let numerator = icon.game.player.enemiesDefeated
            if (icon.waveCompleted) icon.transparency = 1
            else if (icon.isCurrentWave)
                icon.transparency = Math.max(
                    numerator / icon.game.currentWave.enemiesToDefeat,
                    0.1
                )

            if (icon.isCurrentWave || icon.waveCompleted)
                icon.sizeModifier = 0.25

            icon.draw(context)
        })
    }
}
