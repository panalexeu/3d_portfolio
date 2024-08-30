const pushPower = 0.05;
let prevEvent, prevCode;

export function handleKeyEvent(event, keyboard_model) {
    /* The function will continue handling key events only after the initial key is released with the same event code.
    This helps to prevent issues with key spamming, which could otherwise result in incorrect y positions for the keys. */

    if (event.type === prevEvent || (event.code !== prevCode && prevCode !== undefined)) {
        return;
    }

    if (keyboard_model) {
        const key_model = keyboard_model.getObjectByName(event.code);

        if (key_model) {
            prevEvent = event.type;
            prevCode = event.code;

            switch (event.type) {
                case 'keydown':
                    key_model.position.y -= pushPower;
                    break;
                case 'keyup':
                    key_model.position.y += pushPower;
                    prevCode = undefined;
                    break;
            }

        }
    }
}