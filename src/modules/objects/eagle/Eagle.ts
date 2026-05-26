/**
 * @class Eagle
 * Класс орла.
 */

import {Plug} from "./Plug.ts";
import {SolidObject} from "../SolidObject.ts";
import {Location} from "../../Types.ts";
import {SoundType} from "../../Enums.ts";
import {Grid} from "../../Grid.ts";
import {Game} from "../../Game.ts";
import {Bullet} from "../projectiles/Bullet.ts";
import {TankExplosion} from "../explosions/TankExplosion.ts";
import {Sound} from "../../Sound.ts";

export class Eagle extends SolidObject {
    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number = 1;

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
     * Создает иконку орла.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        return icon;
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', 'eagle');
    }

    /**
     * Метод нанесения повреждений объекту.
     */
    public hit(bullet:Bullet):void {
        this.hp--;
        if (this.hp <= 0) {
            this.destroy();
        }
    };

    /**
     * Уничтожает орла.
     */
    destroy():void {
        super.destroy();
        // Производисм взрыв на месте орла.
        const explosion = new TankExplosion(this.grid, this.location, {x:0, y:0});
        // Задержку перед отображением затычки делаем такой же, как первая фаза
        // взрыва. Таким образом будет выглядеть, что затычки нет пока взрыв
        // распространяется, но когда он будет развеиваться затычка уже будет на
        // месте.
        const delay = explosion.animationDurationFirstPhase;
        new Plug(this.grid, this.location, delay);2

        // Оповещаем класс геймплея о том, что орел уничтожен.
        Game.destroyEagle();

        // Воспроизводим звук.
        Sound.play(SoundType.eagle);
    }
}