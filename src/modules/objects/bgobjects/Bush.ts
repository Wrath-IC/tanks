/**
 * @class Bush
 * Фоновое препятствие "кусты".
 */

import {BackgroundObject} from "../BackgroundObject.ts";

export class Bush extends BackgroundObject {
    /**
     * Создает иконку кустов.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.classList.add('bush');
        icon.innerHTML = '<div></div><div></div><div></div><div></div>';
        return icon;
    }
}