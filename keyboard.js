import {playSound} from "./sound";


export class KeyboardHandler {
    #pushPower = 0.05;
    #prevEvent = null;
    #prevCode = null;

    constructor(displayArea) {
        this.displayArea = displayArea;
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

                        this.#handleDisplayAreaValue(event.key);

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

    #handleDisplayAreaValue(eventKey) {
        if (eventKey.length === 1) {
            this.displayArea.value += eventKey;
        } else if (eventKey === 'Enter') {
            this.displayArea.value += '\n';
        } else if (eventKey === 'Backspace') {
            this.displayArea.value = this.displayArea.value.slice(0, -1);
        }
    }
}