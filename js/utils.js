import { SFX_VOLUME } from "./constants.js"

export function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

export function getHealthBarColor({ hue, saturation, lightness }, percentage) {
    const minHue = 2
    const minSaturation = 90
    const minLightness = 49

    let returnHue = minHue + (hue - minHue) * percentage
    let returnSaturation = +(
        minSaturation +
        (saturation - minSaturation) * percentage
    ).toFixed(1)
    let returnLightness = +(
        minLightness +
        (lightness - minLightness) * percentage
    ).toFixed(1)

    return {
        hue: returnHue,
        saturation: returnSaturation,
        lightness: returnLightness,
    }
}

export function valuesToHSL({ hue, saturation, lightness }) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function setSfxVolume(audioObject, volume = SFX_VOLUME) {
    for (const sfx in audioObject) {
        audioObject[sfx].volume = volume
    }
}

export function getStatsFromLocalStorage() {
    let bestTime = JSON.parse(localStorage.getItem("best-time"))
    let bestLives = JSON.parse(localStorage.getItem("best-lives"))

    return { bestTime, bestLives }
}

export function formatTime(time) {
    if (time == null) return

    let newTime = new Date(time)
    let minutes = newTime.getMinutes()
    let seconds = newTime.getSeconds()
    return `${minutes}: ${seconds}`
}