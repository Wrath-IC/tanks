/**
 * @class AbstractSpawn
 * Абстрактный спаунер танков.
 */

import {BackgroundObject} from "../BackgroundObject.ts";

export abstract class AbstractSpawn extends BackgroundObject {
    /**
     * Метод, создающий иконку объекта.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        return icon;
    };
}