/**
 * @class Brick
 * Препятствие "кирпичи".
 */

import {Config} from "../../Config.ts";
import {AbstractObstacle} from "./AbstractObstacle.ts";
import {ObstacleType} from "../../Enums.ts";
import {Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";
import {Bullet} from "../projectiles/Bullet.ts";

export class Brick extends AbstractObstacle {
    /**
     * Тип препятствия.
     */
    public readonly obstacleType:ObstacleType = ObstacleType.brick;

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
        const tr = '<tr><td></td><td></td><td></td><td></td></tr>';
        icon.innerHTML = '<table>' + tr + tr + tr + tr + '</table>';
        return icon;
    }

    /**
     * Метод нанесения повреждений объекту.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {
        this.hp--;
        if (this.hp <= 0) {
            this.destroy();
        } else {
            const icon = this.icon;

            // Удадяем старые классы, отображающие повреждения.
            const removeCls:string[] = [];
            icon.classList.forEach(function (cls) {
                cls.match(/^hit-\d+$/) && removeCls.push(cls);
            });
            removeCls.forEach(function (cls) {
                icon.classList.remove(cls);
            });
            // Добавляем новый класс, отображающий повреждения.
            icon.classList.add('hit-' + this.hp);
        }
    }
}
