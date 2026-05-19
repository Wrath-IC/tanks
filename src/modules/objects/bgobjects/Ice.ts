/**
 * @class Ice
 * Фоновое препятствие "лед".
 */

import {BackgroundObject} from "../BackgroundObject.ts";

export class Ice extends BackgroundObject {
    /**
     * Модификатор скорости танка, проезжающего по льду.
     */
    public static speedModificator:number = 2;

    /**
     * Создает иконку кустов.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.innerHTML = '<div></div>';
        icon.classList.add('ice');
        return icon;
    }
}