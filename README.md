# Super Kabuki Cat - A JavaScript game

## Table of Contents

-   [Overview](#overview)
-   [My Process](#my-process)
-   [Code Examples](#code-examples)
-   [Useful Links](#useful-links)
-   [Author](#author)

## Overview

-   The Project

    The basic core of this project is based on ideas taken from [Frank's Laboratory's JS Game Developement Masterclass](https://www.youtube.com/playlist?list=PLYElE_rzEw_uryBrrzu2E626MY4zoXvx2).

    I greatly expanded on the core concepts and tied them together to create a cohesive game.

-   Screenshots
    -   Desktop
        ![Desktop](/screenshots/Super-Kabuki-Cat-desktop.png)
    -   Mobile
        ![Mobile](/screenshots/Super-Kabuki-Cat-mobile-1.jpg)
-   Links
    -   [Live Site](https://super-kabuki-cat.vercel.app/)

## My Process

-   Built With:
    -   HTML5
        -   `<canvas>`
        -   `<dialog>` for displaying modals
        -   `<details>` and `<summary>` for basic accordian menu.
    -   Vanilla JS
        -   Modules, for keeping code clean by breaking it into multiple files
        -   Extensive use of Classes
        -   Drawing context for rendering the game on the screen using the HTML5 `<canvas>` Element.
    -   CSS
        -   CUBE methodology. Still getting the hang of it, and I can't say I fully understand how to "think" in CUBE, but I find it rather appealing.
        -   Custom Properties (variables).
        -   Grid
            -   `grid-template-areas`
        -   Flexbox
        -   `:has()` pseudo-class
        -   `@media` queries
    -   Font Awesome
    -   Google Fonts

## Code Examples

-   The `:has()` pseudo-class

    Here I use the so-called "parent selector" to slide the main menu which houses the Options sub menu, a `<details>` tag, in and out of view.

    ```css
    [data-list="main-menu"] {
        --button-height: calc(var(--btn-font-size) * 2 + var(--border-btn) * 2);
        --top-offset: calc(
            calc(var(--button-height) * 2 + var(--gap-menu)) * -1
        );
        --main-menu-padding: var(--padding-menu);

        top: var(--main-menu-padding);
        right: var(--main-menu-padding);

        transition: 300ms var(--easing);
        transition-property: top, right;
    }

    [data-list="main-menu"]:has(details[open]) {
        top: var(--top-offset);
        right: var(--padding-menu);
    }
    ```

    When the Options menu is `[open]`, the parent (main-menu), slides up giving the sub menu more room.

    ![gif showing the menu sliding in and out of view when its child element opens and closes](/screenshots/chrome-capture-2023-1-14.gif)

    The `:has()` pseudo-class isn't fully supported in all browsers yet, so I included a fallback to achieve a similar effect on browsers that don't yet support it.

    ```css
    @supports not selector(div:has(img)) {
        details {
            transition: 300ms var(--easing);
            transition-property: top, right;
            top: 0;
            right: 0;
        }

        details[open] {
            top: var(--top-offset);
            right: var(--padding-menu);
        }
    }
    ```

    [Back to Table of Contents](#table-of-contents)

-   Custom Confirm Box

    I was using the standard browser confirmation dialog box to handle the quitting and restarting of the game. But I wanted control over how it looked, so I decided to create my own.

    ```html
    <dialog
        class="[ ] [ padding-sm ] [ modal ]"
        data-modal="confirm"
        data-confirm=""
    >
        <p class="[] [ bg-gradient ]">
            Are you sure you want to
            <span class="[][ accent-text | text-shadow--100 ] []"></span>
            the game?
        </p>
        <div class="[ button-wrapper ] [] []">
            <button
                class="[ ] [ ] [ btn ] modal-close"
                data-btn="cancel"
                data-btn-type="clear"
                data-sfx="menu-cancel"
                type="button"
            >
                no
            </button>
            <button
                class="[ ] [ ] [ btn ] modal-close"
                data-btn="confirm"
                data-btn-type="confirm"
                data-sfx="menu-confirm"
                type="button"
            >
                yes
            </button>
        </div>
    </dialog>
    ```

    The same confirmation box is used for both quitting & restarting; depending on which button triggers it the message and resultling effect will be different.

    ![confirm box](/screenshots/confirm.png)

    ```js
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

    function confirm(message, func) {
        handleConfirm(message)
            .then(() => func())
            .catch(() => void 0)
    }

    function confirmGameEnd() {
        confirm("quit", quitGame)
    }
    function confirmGameRestart() {
        confirm("restart", restartGame)
    }
    ```

    Clicking the "Quit Game" or "Restart Game" buttons opens the modal and returns a `Promise`. Confirming "Yes" resolves the `Promise` and calls either the `quitGame()` or `restartGame()` function. Clicking "No" rejects the `Promise` and does nothing. The modal is then closed after the `Promise` is handled.

    [Back to Table of Contents](#table-of-contents)

-   The `:is()`, `:where()` pseudo-classes.

    You can simplify repetitive selectors by using either of these pseudo-classes to group them.

    Instead of this:

    ```css
    .btn:hover:not(:disabled),
    .btn:focus-visible:not(:disabled) {
        /* styles */
    }
    ```

    You can write this instead:

    ```css
    .btn:is(:hover, :focus-visible):not(:disabled) {
        /* styles */
    }
    ```

-   `grid-template-areas`

    Something I've been doing lately is using `grid-template-areas` to more easily shift complicated layout around when at different screen sizes.

    ```css
    [data-list="how-to-play-controls"] {
        display: grid;
        grid-template-areas:
            "up action"
            "down jump"
            "left ."
            "right pause";
    }
    @media (min-width: 750px) {
        [data-list="how-to-play-controls"] {
            grid-template-areas:
                ". up . . fistup action"
                "left . right fistleft jump fistright"
                ". down . pause . fistdown";
        }
    }
    ```

    On narrow screens:

    ![controls image on narrow screens](/screenshots/controls-desktop-narrow.png)

    On screens wider than 750px:

    ![controls image on wide screens](/screenshots/controls-desktop.png)

    [Back to Table of Contents](#table-of-contents)

-   `<canvas>`

    Most of this project works by rendering graphics on the page through the `<canvas>` element. An "animate" `function` in called every frame with the `window.requestAnimationFrame()` method.

    ```javascript
    function animate(timestamp) {
        // Calculate how much time has passed between function calls
        let deltaTime = timestamp - lastTime
        lastTime = timestamp

        // Clear the canvas & prepare it for a fresh new render
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // Pass relevant info to the game Object to update all elements
        game.update(deltaTime, game.input)
        // Draw elements based on their new info
        game.draw(ctx)
        // Prevents function from calling itself when game is paused
        if (isPaused) cancelAnimationFrame(gameRequestId)
        else gameRequestId = requestAnimationFrame(animate)
    }
    ```

    The parts of the game visuals can be broken down into four types of elements:

    -   Background
    -   Player and Enemy enemies
    -   Impermanent visual elements, such as particle effects
    -   More permanent on-screen elements, such as health bars and icons

        The Background is made up of several images layered on top of each other that scroll at different speeds creating an illusion of depth. This is known as Parallax scrolling.

        ![Parallax Scrolling](/screenshots/parallax.gif)

        The player and enemies are rendered from sprite sheets that continuously cycle through each sprite, returning to the beginning upon reaching the end. Unlike the player and enemies, particle effects disappear once they reach the end of their sprite sheet.

        ![Particle Effects](/screenshots/particles.gif)

        Health bars and text are drawn using `canvas` methods suct as `rect()`, `stroke()`, `strokeText()` and `Path2D()` objects.

        ```javascript
        // If enemy's health is above 0, draw a bar with an outline and fill it with color. The bar's width is relative to the perventage of health remaining with the outline representing 100%
        const bar = new Path2D()
        if (this.health > 0) {
            bar.moveTo(this.barX + this.barRadius, this.barY)
            bar.arcTo(
                this.barX + this.width,
                this.barY,
                this.barX + this.width,
                this.barY + this.barheight,
                this.barRadius
            )
            bar.arcTo(
                this.barX + this.width,
                this.barY + this.barheight,
                this.barX,
                this.barY + this.barheight,
                this.barRadius
            )
            bar.arcTo(
                this.barX,
                this.barY + this.barheight,
                this.barX,
                this.barY,
                this.barRadius
            )
            bar.arcTo(
                this.barX,
                this.barY,
                this.barX + this.width,
                this.barY,
                this.barRadius
            )
            bar.closePath()
        }

        context.beginPath()
        context.moveTo(this.x + this.radius, this.y)
        context.arcTo(
            this.x + this.maxWidth,
            this.y,
            this.x + this.maxWidth,
            this.y + this.height,
            this.radius
        )
        context.arcTo(
            this.x + this.maxWidth,
            this.y + this.height,
            this.x,
            this.y + this.height,
            this.radius
        )
        context.arcTo(this.x, this.y + this.height, this.x, this.y, this.radius)
        context.arcTo(
            this.x,
            this.y,
            this.x + this.maxWidth,
            this.y,
            this.radius
        )
        context.closePath()
        context.stroke()
        context.fill(bar)
        ```

        ![Enemy health bar change on hit](/screenshots/health_bars.gif)

## Useful Links

-   [JavaScript Game Development Masterclass 2022](https://www.youtube.com/playlist?list=PLYElE_rzEw_uryBrrzu2E626MY4zoXvx2)
-   [Neumorphism](https://css-tricks.com/neumorphism-and-css/)
-   [Open Game Art](https://opengameart.org/)
-   [Font Awesome](https://fontawesome.com/)

## Author

-   [My Portfolio](https://jeurimorel.com/)
-   [Twitter](https://twitter.com/codeToPerdition)
-   [LinkedIn](https://www.linkedin.com/in/jeuri-morel-9b0b39235/)
-   [Frontend Mentor](https://www.frontendmentor.io/profile/JeuriMorel)
-   [freeCodeCamp](https://www.freecodecamp.org/jeuri)

[Back to Table of Contents](#table-of-contents)
