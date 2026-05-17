/**
 * @class TankExplosion
 * Класс взрыва танка.
 */

import {BackgroundObject} from "../BackgroundObject.ts";
import {Grid} from "../../Grid.ts";
import {Location, Coordinates} from "../../Types.ts";
import {Config} from "../../Config.ts";

export class BulletExplosion extends BackgroundObject {
    /**
     * Размер взрыва.
     */
    private readonly explosionSize:number = 24;

    public constructor(grid:Grid, location:Location, coordinates:Coordinates) {
        super(grid, location);
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();
        
        // Устанавливаем те же отступы, что и снаряда.
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
        this.icon.setAttribute('class', 'explosion explosion-bullet');
    }

    /**
     * Анимирует иконку.
     */
    private animate():void {
        const icon = this.icon;
        const el = icon.childNodes[0] as HTMLElement;
        const explosionSize = this.explosionSize;
        
        el.animate({
            top: ['0', -explosionSize / 2 + 'px'],
            left: ['0', -explosionSize / 2 + 'px'],
            width: ['0', explosionSize + 'px'],
            height: ['0', explosionSize + 'px']
        }, {
            duration: 150,
            iterations: 1,
            fill: 'forwards'
        }).onfinish = function () {
            const animations = [];
            for (let i = 0; i <= 100; i+=10) {
                animations.push({mask: `radial-gradient(circle, transparent ${i}%, black 0%)`});
            }
            
            el.animate(animations, {
                duration: 150,
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