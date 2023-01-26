import { formatTime, getStatsFromLocalStorage } from "./utils.js"
import { qs } from "./utils.js"

export let { bestTime, bestLives } = getStatsFromLocalStorage()

const timeStatSpan = qs("[data-stat='time']")
const livesStatSpan = qs("[data-stat='lives']")
const clearStorageBtn = qs('[data-btn="clear-storage"]')

export function updateStats() {
    if (bestTime != null) timeStatSpan.textContent = formatTime(bestTime)
    if (bestLives != null) livesStatSpan.textContent = bestLives
    clearStorageBtn.disabled = bestTime == null && bestLives == null
}

clearStorageBtn.addEventListener("click", () => {
    localStorage.clear()
    timeStatSpan.textContent = ""
    livesStatSpan.textContent = ""
    clearStorageBtn.disabled = true
})

export function updateBestTime(newBest) {
    bestTime = newBest
}
export function updateBestLives(newBest) {
    bestLives = newBest
}
