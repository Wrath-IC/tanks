/**
 * @class SolidObject
 * Класс "твердых" объектов на поле боя. Сюда входят все нефоновые препятствия и танки.
 */

import {Location} from "../Types.ts";
import {Grid} from "../Grid.ts";
import {AbstractObject} from "./AbstractObject.ts";
import {Bullet} from "./projectiles/Bullet.ts";

export abstract class SolidObject extends AbstractObject {
    /**
     * Количество хитпоинтов объекта.
     */
    protected abstract hp:number;

    /**
     * Уничтожен ли объект.
     */
    protected destroyed:boolean = false;

    /**
     * Размещает объект на поле боя.
     */
    placeObject():void {
        this.grid.placeSolidObject(this);
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected abstract setIconCls():void;

    /**
     * Метод нанесения повреждений объекту.
     */
    public abstract hit(bullet:Bullet):void;

    /**
     * Уничтожает твердый объект.
     */
    public destroy():void {
        this.grid.removeSolidObject(this);
        this.destroyed = true;
    }
}