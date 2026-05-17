/**
 * @class AbstractObject
 * Абстрактный класс объекта на поле боя. Сюда входят все препятствия, фоновые препятствия и танки.
 */

import {Location} from "../Types.ts";
import {Grid} from "../Grid.ts";

export abstract class AbstractObject {
    /**
     * Ячейка, на которой находится объект.
     */
    public location:Location;

    /**
     * Ссылка на поле боя.
     */
    public readonly grid:Grid;

    /**
     * Иконка объекта.
     */
    public readonly icon:HTMLElement;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     */
    constructor(grid:Grid, location:Location) {
        this.grid = grid;
        this.location = location;
        this.icon = this.createIcon();
        this.placeObject();
    }

    /**
     * Метод, создающий иконку объекта.
     */
    protected abstract createIcon():HTMLElement;

    /**
     * Метод, размещающий объект на поле боя.
     */
    protected abstract placeObject():void;
}