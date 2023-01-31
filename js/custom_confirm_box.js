import { qs } from "./utils.js"

const confirmModal = qs("[data-modal='confirm'")
const confirmBtn = qs("[data-btn='confirm']")
const cancelBtn = qs("[data-btn='cancel']")
const querySpan = qs("span", confirmModal)

function handleConfirm(message) {
    confirmModal.showModal()
    querySpan.textContent = message
    return new Promise((resolve, reject) => {
        confirmBtn.onclick = () => {
            resolve()
            confirmModal.close()
        }
        cancelBtn.onclick = () => {
            reject()
            confirmModal.close()
        }
    })
}

export function confirm(message, func) {
    handleConfirm(message)
        .then(() => func())
        .catch(() => void 0)
}
