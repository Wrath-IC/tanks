/**
 * @class BackgroundObject
 * Класс фоновых объектов на поле боя. Сюда входят все фоновые препятствия и спауны.
 */

import {AbstractObject} from "./AbstractObject.ts";

export abstract class BackgroundObject extends AbstractObject {
    /**
     * Размещает объект на поле боя.
     */
    placeObject():void {
        this.grid.placeBackgroundObject(this);
    }
}