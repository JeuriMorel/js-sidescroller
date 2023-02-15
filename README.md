
# Super Kabuki Cat - A JavaScript game

The basic core of this project is based on lessons learned from [Frank's Laboratory's JS Game Developement Masterclass](https://www.youtube.com/playlist?list=PLYElE_rzEw_uryBrrzu2E626MY4zoXvx2). 

I greatly expanded on the core concepts and tied them together to create a cohesive game.

## Table of Contents

- [Overview](#overview)
- [My Process](#my-process)
- [Code Examples](#code-examples)
- [What I Learned](#what-i-learned)
- [Useful Links](#useful-links)
- [Author](#author)

## Overview

- The Project

    //to do

- Screenshots
    - Desktop
    ![Desktop](/screenshots/Super-Kabuki-Cat-desktop.png)
    - Mobile
    ![Mobile](/screenshots/Super-Kabuki-Cat-mobile-1.jpg)
- Links
    - [Live Site](https://super-kabuki-cat.vercel.app/)

## My Process

- Built With:
    - HTML5
        - `<canvas>`
        - `<dialog>` for displaying modals
        - `<details>` and `<summary>` for basic accordian menu. 
    - Vanilla JS
        - Modules, for keeping code clean by breaking it into multiple files
        - Extensive use of Classes
        - Drawing context for rendering the game on the screen using the HTML5 `<canvas>` Element.
    - CSS
        - CUBE methodology. Still getting the hang of it.
        - Custom Properties (variables)
        - Grid
            - `grid-template-areas`
        - Flexbox
        - `:has()` pseudo-class
        - `@media` queries
    - Font Awesome
    - Google Fonts


## Code Examples

- I love the `:has()` pseudo class!

    Here I use the so-called "parent selector" to slide the main menu which houses the Options sub menu, a `<details>` tag, in and out of view.

    ```css
        [data-list="main-menu"] {
        --button-height: calc(var(--btn-font-size) * 2 + 
            var(--border-btn) * 2);
        --top-offset: calc(calc(var(--button-height) * 2 + 
            var(--gap-menu)) * -1);
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

    When the Options menu is `[open]`, the parent (main-menu), slides up giving the sub menu more space. 

    ![gif showing the menu sliding in and out of view when its child element opens and closes](/screenshots/chrome-capture-2023-1-14.gif)

- Custom Confirm Box

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

- The `:is()`, `:where()` pseudo-classes.

    You can simplify repetitive selectors by using either of these pseudo-classes to group them.

    Instead of this: 

    ```css
        .btn:hover:not(:disabled),
        .btn:focus-visible:not(:disabled){
            /* styles */
        }
    ```

    You can write this instead:

    ```css
        .btn:is(:hover, :focus-visible):not(:disabled) {
            /* styles */
        }

    ```



## What I learned

//TO DO

## Useful Links

- [JavaScript Game Development Masterclass 2022](https://www.youtube.com/playlist?list=PLYElE_rzEw_uryBrrzu2E626MY4zoXvx2)
- [Neumorphism](https://css-tricks.com/neumorphism-and-css/)

## Author

- [My Portfolio](https://jeurimorel.com/)
- Socials
    - [Twitter](https://twitter.com/codeToPerdition)
    - [LinkedIn](https://www.linkedin.com/in/jeuri-morel-9b0b39235/)
    - [Frontend Mentor](https://www.frontendmentor.io/profile/JeuriMorel)
    - [freeCodeCamp](https://www.freecodecamp.org/jeuri)