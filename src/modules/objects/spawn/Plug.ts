/**
 * @class Plug
 * Заглушка, которая выводится перед спауном танка.
 */

import {AbstractSpawn} from "./AbstractSpawn.ts";
import {SolidObject} from "../SolidObject.ts";
import {Grid} from "../../Grid.ts";
import {Location} from "../../Types.ts";
import {Config} from "../../Config.ts";
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
    public constructor(grid:Grid, location:Location) {
        super(grid, location);
        // Устанавливаем класс иконки заглушки.
        this.setIconCls();
        this.animateIcon();
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', Config.Spawn.plugCls);
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
        icon.innerHTML = '<div></div><div></div>';
        return icon;
    }

    /**
     * Анимирует иконку. Анимация прекращается после уничтожения объекта.
     */
    private animateIcon():void {
        const me = this;

        /**
         * Цикл смены иконки.
         * @param animationPhase Фаза анимации, переключается туда-обратно с true на false.
         */
        const loop = function (animationPhase:boolean) {
            setTimeout(function () {
                if (!me.destroyed) {
                    (me.icon.childNodes[0] as HTMLElement).style.opacity = animationPhase ? '0.5' : '1';
                    (me.icon.childNodes[1] as HTMLElement).style.opacity = animationPhase ? '1' : '0.5';
                    loop(!animationPhase);
                }
            }, 1000 / Config.Spawn.plugAnimationFps);
        };

        loop(false);
    }
}