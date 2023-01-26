import { qs } from "./utils.js"

const confirmModal = qs("[data-modal='confirm'")
const confirmBtn = qs("[data-btn='confirm']")
const cancelBtn = qs("[data-btn='cancel']")

export function customConfirm(message) {
    confirmModal.showModal()
    qs("span", confirmModal).textContent = message
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
