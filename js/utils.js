import { SFX_VOLUME } from "./constants"

export function qs(selector, parent = document) {
    return parent.querySelector(selector)
}

export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}

export function getHealthBarColor(color, percentage) {
    const minHue = 2
    const minSaturation = 90
    const minLightness = 49

    let r = parseInt(color.substr(1, 2), 16) 
    let g = parseInt(color.substr(3, 2), 16)
    let b = parseInt(color.substr(5, 2), 16) 

    let {h, s, l } = RGBtoHSL(r, g, b)

    let returnHue = minHue + (h - minHue) * percentage
    let returnSaturation = +(
        minSaturation +
        (s - minSaturation) * percentage
    ).toFixed(1)
    let returnLightness = +(
        minLightness +
        (l - minLightness) * percentage
    ).toFixed(1)

    return HSLToHex(returnHue, returnSaturation, returnLightness)
}

function RGBtoHSL(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0

    if (delta == 0) h = 0
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2
    // Blue is max
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)

    // Make negative hues positive behind 360°
    if (h < 0) h += 360

    // Calculate lightness
    l = (cmax + cmin) / 2

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)

    return {h,s,l}
}

function HSLToHex(h, s, l) {
    s /= 100
    l /= 100

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0

    if (0 <= h && h < 60) {
        r = c
        g = x
        b = 0
    } else if (60 <= h && h < 120) {
        r = x
        g = c
        b = 0
    } else if (120 <= h && h < 180) {
        r = 0
        g = c
        b = x
    } else if (180 <= h && h < 240) {
        r = 0
        g = x
        b = c
    } else if (240 <= h && h < 300) {
        r = x
        g = 0
        b = c
    } else if (300 <= h && h < 360) {
        r = c
        g = 0
        b = x
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16)
    g = Math.round((g + m) * 255).toString(16)
    b = Math.round((b + m) * 255).toString(16)

    // Prepend 0s, if necessary
    if (r.length == 1) r = "0" + r
    if (g.length == 1) g = "0" + g
    if (b.length == 1) b = "0" + b

    return "#" + r + g + b
}


export function setSfxVolume(audioObject){
    for (const sfx in audioObject) {
        sfx.volume = SFX_VOLUME
    }
}
