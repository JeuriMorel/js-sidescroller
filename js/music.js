import { isPaused } from "./app.js"
import {
    MUSIC_BOSS_FIGHT,
    MUSIC_FOREST_PATH,
    MUSIC_MAIN_THEME,
} from "./constants.js"
import { qs } from "./utils.js"

const themes = {
    MAIN: 0,
    FOREST: 1,
    BOSS: 2,
}

export default class MusicHandler {
    constructor(game) {
        this.game = game
        this.themes = {
            main: qs("#main_theme"),
            forest: qs("#forest_theme"),
            boss: qs("#boss_theme"),
        }
        this.themeTimer = 0
        this.themeInterval = 200
        this.forestThemeFadeOutPoint = this.themes.forest.duration - 5
        // this.themes.forest.addEventListener("loadedmetadata", () => {
        //     console.log(this.forestThemeFadeOutPoint)
        // })
        this.themes.forest.addEventListener("ended", () => {
            this.currentTheme = this.themes.main
            // this.currentTheme.play()
        })
        this.themes.main.addEventListener("timeupdate", () => {
            const loopTimeStamp = 42
            const buffer = 0.3
            if (
                this.themes.main.currentTime >
                this.themes.main.duration - buffer
            ) {
                this.themes.main.currentTime = loopTimeStamp
                this.themes.main.play()
            }
        })
        this.themes.main.volume = 0.1
        this.themes.boss.volume = 0.1
        this.currentTheme = this.themes.forest
    }

    toggleMusicPlayback() {
        if (isPaused) this.currentTheme.pause()
        else this.currentTheme.play()
    }

    update(deltaTime) {
        //FADE OUT FOREST PATH THEME
        if (
            !this.themes.forest.paused &&
            this.themes.forest.currentTime >= this.forestThemeFadeOutPoint &&
            this.themes.forest.volume > 0.2 &&
            !this.themes.forest.ended
        ) {
            if (this.themeTimer > this.themeInterval) {
                this.themes.forest.volume -= 0.1
                this.themeTimer = 0
                console.log(this.themes.forest.volume)
            } else this.themeTimer += deltaTime
        }
        //FADE IN THEME
        if (
            this.currentTheme.loop &&
            !this.currentTheme.paused &&
            !this.currentTheme.ended &&
            this.currentTheme.currentTime > 0 &&
            this.currentTheme.volume < 1
        ) {
            if (this.themeTimer > this.themeInterval) {
                this.currentTheme.volume = Math.min(
                    this.currentTheme.volume + 0.01,
                    1
                )
                this.themeTimer = 0
            } else this.themeTimer += deltaTime
        }
    }
}
