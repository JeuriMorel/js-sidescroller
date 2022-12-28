import { qs } from "./utils.js"

const accordianAnimationOptions = {
    duration: 400,
    easing: "cubic-bezier(.22,1.73,.27,.83)",
}

export class Accordian {
    constructor(element) {
        this.element = element
        this.summary = qs("summary", element)
        this.content = qs(".menu", element)
        this.animation = null
        this.isClosing = false
        this.isExpanding = false

        this.summary, addEventListener("click", e => this.onClick(e))
    }

    onClick(event) {
        if (event.target != this.summary) return
        event.preventDefault()
        this.element.style.overflow = "hidden"
        if (this.isClosing || !this.element.open) {
            this.open()
        } else if (this.isExpanding || this.element.open) {
            this.shrink()
        }
    }

    shrink() {
        this.closing = true
        const startHeight = `${this.element.offsetHeight}px`
        const endHeight = `${this.summary.offsetHeight}px`

        if (this.animation) {
            this.animation.cancel()
        }

        this.animation = this.element.animate(
            {
                height: [startHeight, endHeight],
            },
            accordianAnimationOptions
        )

        this.animation.onfinish = () => this.onAnimationFinish(false)
        this.animation.oncancel = () => (this.isClosing = false)
    }

    open() {
        this.element.style.height = `${this.element.offsetHeight}px`
        this.element.open = true
        requestAnimationFrame(() => this.expand())
    }

    expand() {
        this.isExpanding = true
        const startHeight = `${this.element.offsetHeight}px`
        const endHeight = `${
            this.summary.offsetHeight + this.content.offsetHeight
        }px`

        if (this.animation) {
            this.animation.cancel()
        }

        this.animation = this.element.animate(
            {
                height: [startHeight, endHeight],
            },
            accordianAnimationOptions
        )

        this.animation.onfinish = () => this.onAnimationFinish(true)
        this.animation.oncancel = () => (this.isExpanding = false)
    }

    // Callback when the shrink or expand animations are done
    onAnimationFinish(open) {
        this.element.open = open
        this.animation = null
        this.isClosing = false
        this.isExpanding = false
        this.element.style.height = this.element.style.overflow = ""
    }
}
