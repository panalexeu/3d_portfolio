import {playSound} from "./sound";

const clickPower = 0.05;

export function handleMouseEvent(event, mouseModel) {
    if (mouseModel) {
        const buttonModel = mouseModel.getObjectByName('button');

        if (buttonModel) {
            switch (event.type) {
                case 'mousedown':
                    buttonModel.position.y -= clickPower;
                    playSound('./sounds/mouse_click_down.mp3');
                    break;
                case 'mouseup':
                    buttonModel.position.y += clickPower;
                    playSound('./sounds/mouse_click_up.mp3');
                    break;
            }
        }
    }

    console.log(event);
}