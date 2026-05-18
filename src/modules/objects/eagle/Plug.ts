/**
 * @class Plug
 * Заглушка, которая выводится при уничтожении орла.
 */

import {SolidObject} from "../SolidObject.ts";
import {Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";
import {Bullet} from "../projectiles/Bullet.ts";

export class Plug extends SolidObject {
    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number = Infinity;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     */
    public constructor(grid:Grid, location:Location, delay:number) {
        super(grid, location);
        // Устанавливаем класс иконки заглушки.
        this.setIconCls();
        
        this.animateIcon(delay);
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', 'eagle-plug');
    }

    /**
     * Метод нанесения повреждений объекту.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {
        // Объект неуязвим.
        return;
    };

    /**
     * Создает иконку.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        return icon;
    }
    
    /**
     * Анимация иконки.
     * @param delay Задержка перед отображением иконки.
     */
    private animateIcon(delay:number):void {
        const icon = this.icon;
        window.setTimeout(function () {
            icon.style.visibility = 'visible';
        }, delay);
    }
}