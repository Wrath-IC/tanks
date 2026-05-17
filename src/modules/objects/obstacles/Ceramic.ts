/**
 * @class Ceramic
 * Препятствие "кафельки".
 */

import {Config} from "../../Config.ts";
import {AbstractObstacle} from "./AbstractObstacle.ts";
import {ObstacleType} from "../../Enums.ts";
import {Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";
import {Bullet} from "../projectiles/Bullet.ts";

export class Ceramic extends AbstractObstacle {
    /**
     * Тип препятствия.
     */
    public readonly obstacleType:ObstacleType = ObstacleType.ceramic;

    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     */
    public constructor(grid:Grid, location:Location) {
        super(grid, location);
        // Начальное количество хп.
        this.hp = Config.obstacle[this.obstacleType].hitPoints;
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();
    }

    /**
     * Создает иконку кафелек.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.innerHTML = '<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>';
        return icon;
    }

    /**
     * Метод нанесения повреждений объекту.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {
        // На данный момент кафелькам урон не наносится.
        return;
    };
}
