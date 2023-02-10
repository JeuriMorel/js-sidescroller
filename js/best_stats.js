import { qs, formatTime, getStatsFromLocalStorage } from "./utils.js"

export let { bestTime, bestLives } = getStatsFromLocalStorage()

const timeStatSpan = qs("[data-stat='time']")
const livesStatSpan = qs("[data-stat='lives']")
const clearStorageBtn = qs('[data-btn="clear-storage"]')

export function updateStats() {
    if (bestTime != null) timeStatSpan.textContent = formatTime(bestTime)
    if (bestLives != null) livesStatSpan.textContent = bestLives
    setClearStorageBtnDisableAttr()
}

clearStorageBtn.addEventListener("click", () => {
    localStorage.clear()
    timeStatSpan.textContent = ""
    livesStatSpan.textContent = ""
    clearStorageBtn.disabled = true
})

function setClearStorageBtnDisableAttr() {
    clearStorageBtn.disabled = bestTime == null && bestLives == null
}

export function updateBestTime(newBest) {
    bestTime = newBest
}
export function updateBestLives(newBest) {
    bestLives = newBest
}

export function resetStats() {
    let { bestTime: newTime, bestLives: newLives } = getStatsFromLocalStorage()
    bestTime = newTime
    bestLives = newLives
    setClearStorageBtnDisableAttr()
}
