/**
 * @class TankExplosion
 * Класс взрыва танка.
 */

import {BackgroundObject} from "../BackgroundObject.ts";
import {AbstractTank} from "../tanks/AbstractTank.ts";
import {Grid} from "../../Grid.ts";
import {Location, Coordinates} from "../../Types.ts";
import {Config} from "../../Config.ts";

export class TankExplosion extends BackgroundObject {
    /**
     * Длина анимации первой фазы.
     */
    public animationDurationFirstPhase:number = 200;

    /**
     * Длина анимации второй фазы.
     */
    public animationDurationSecondPhase:number = 200;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     * @param coordinates Координаты взрыва внутри переданной ячейки.
     */
    public constructor(grid:Grid, location:Location, coordinates:Coordinates) {
        super(grid, location);
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();
        
        // Устанавливаем те же отступы, что и у танка, чтобы изображение
        // появилось в том же месте.
        this.icon.style.left = coordinates.x + 'px';
        this.icon.style.top = coordinates.y + 'px';
        
        // Запускаем анимацию иконки.
        this.animate();
    }

    /**
     * Метод, создающий иконку объекта.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.append(document.createElement('div'));
        return icon;
    };

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    private setIconCls():void {
        this.icon.setAttribute('class', 'explosion explosion-tank');
    }

    /**
     * Анимирует иконку.
     */
    private animate():void {
        const me = this;
        const icon = this.icon;
        const el = icon.childNodes[0] as HTMLElement;
        const cellSize = Config.cellSize;
        
        el.animate({
            top: [cellSize / 2 + 'px', '0'],
            left: [cellSize / 2 + 'px', '0'],
            width: ['0', cellSize + 'px'],
            height: ['0', cellSize + 'px']
        }, {
            duration: me.animationDurationFirstPhase,
            iterations: 1,
            fill: 'forwards'
        }).onfinish = function () {
            const animations = [];
            for (let i = 0; i <= 100; i+=10) {
                animations.push({mask: `radial-gradient(circle, transparent ${i}%, black 0%)`});
            }
            
            el.animate(animations, {
                duration: me.animationDurationSecondPhase,
                iterations: 1,
                fill: 'forwards'
            }).onfinish = function () {
                // По окончании анимации удаляем иконку из DOM-а.
                const parentNode = icon.parentNode;
                parentNode && parentNode.removeChild(icon);
            };
        };
    }
}