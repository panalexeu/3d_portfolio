import {playSound} from "./sound";


export class KeyboardHandler {
    #pushPower = 0.05;
    #prevEvent = null;
    #prevCode = null;

    constructor(displayDiv) {
        this.displayDiv = displayDiv;
    }

    handleKeyEvent(event, keyboardModel) {
        /* The method will continue handling key events only after the initial key is released with the same event code.
        This helps to prevent issues with key spamming, which could otherwise result in incorrect y positions for the keys. */
        if (event.type === this.#prevEvent || (event.code !== this.#prevCode && this.#prevCode !== null)) {
            return;
        }


        if (keyboardModel) {
            const key_model = keyboardModel.getObjectByName(event.code);

            if (key_model) {
                this.#prevEvent = event.type;
                this.#prevCode = event.code;

                switch (event.type) {
                    case 'keydown': {
                        key_model.position.y -= this.#pushPower;

                        // handling sound
                        if (event.code === 'Space') {
                            playSound('/sounds/spacebar_press.mp3');
                        } else {
                            playSound('/sounds/button_press.mp3');
                        }

                        this.#handleDisplayDivText(event.key);

                        break;
                    }
                    case 'keyup':
                        key_model.position.y += this.#pushPower;
                        this.#prevCode = null;
                        break;
                }
            }
        }
    }

    #handleDisplayDivText(eventKey) {
        if (eventKey.length === 1) {
            this.displayDiv.textContent += eventKey;
        } else if (eventKey === 'Enter') {
            this.displayDiv.textContent += '\n';
        } else if (eventKey === 'Backspace') {
            this.displayDiv.textContent = this.displayDiv.textContent.slice(0, -1);
        }
    }
}