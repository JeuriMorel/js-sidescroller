import { isPaused } from "./app.js"
import { qs } from "./utils.js"

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
        this.themes.forest.dataset.fadeOut = this.themes.forest.duration - 5
        this.themes.forest.addEventListener("ended", () => {
            this.currentTheme = this.themes.main
            this.currentTheme.play()
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
        this.themes.forest.volume = 1
        this.currentTheme = this.themes.forest
    }

    toggleMusicPlayback() {
        if (isPaused) this.currentTheme.pause()
        else this.currentTheme.play()
    }
    fadeOutTheme(theme, deltaTime) {
        if (
            !theme.paused &&
            theme.volume > 0.2 &&
            theme.currentTime >= theme.dataset.fadeOut &&
            !theme.ended
        ) {
            if (this.themeTimer > this.themeInterval) {
                theme.volume -= 0.1
                this.themeTimer = 0
            } else this.themeTimer += deltaTime
        }
    }

    update(deltaTime) {
        //FADE OUT FOREST PATH THEME

        if (!this.currentTheme.loop) {
            this.fadeOutTheme(this.currentTheme, deltaTime)
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
