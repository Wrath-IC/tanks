/**
 * @class Water
 * Препятствие "вода".
 */

import {Config} from "../../Config.ts";
import {AbstractObstacle} from "./AbstractObstacle.ts";
import {ObstacleType} from "../../Enums.ts";
import {Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";
import {Bullet} from "../projectiles/Bullet.ts";

export class Water extends AbstractObstacle {
    /**
     * Тип препятствия.
     */
    public readonly obstacleType:ObstacleType = ObstacleType.water;

    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number = Infinity;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     */
    public constructor(grid:Grid, location:Location) {
        super(grid, location);
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();
    }

    /**
     * Создает иконку кафелек.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        const div = '<div><div></div><div></div><div></div><div></div><div></div></div>';
        icon.innerHTML = div + div + div + div;
        return icon;
    }

    /**
     * Метод нанесения повреждений объекту. Пустой метод, поскольку объект
     * неуязвим.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {}
}