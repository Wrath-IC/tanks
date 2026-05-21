/**
 * @class PlayerSpawn
 * Спаунер танков игроков.
 */

import {AbstractSpawn} from "./AbstractSpawn.ts";
import {Plug} from "./Plug.ts";
import {Player} from "../tanks/Player.ts";
import {Grid} from "../../Grid.ts";
import {Location} from "../../Types.ts";
import {Config} from "../../Config.ts";
import {Game} from "../../Game.ts";

export class PlayerSpawn extends AbstractSpawn {
    /**
     * Номер игрока.
     */
    public readonly playerNum:number = 0;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     * @param playerNum Номер игрока.
     */
    public constructor(grid:Grid, location:Location, playerNum:number) {
        super(grid, location);
        this.playerNum = playerNum;
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();

        this.spawn();
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', Config.player[this.playerNum].spawnCls || '');
    }

    /**
     * Метод, запускающий процесс спауна танка.
     */
    public spawn():void {
        const me = this;

        // Если у игрока не осталось жизней, прерываем спаун.
        if (!Game.hasLifes(me.playerNum)) {
            return;
        }

        window.setTimeout(function () {
            // Создаем событие: оно вызовет создание заглушки как только нужная
            // клетка будет свободна.
            const intervalId = window.setInterval(function () {
                if (!Game.isLevelPlaying(me.grid)) {
                    // Если уже запущен другой уровень или получили геймовер,
                    // прерываем выполнение.
                    window.clearInterval(intervalId);
                } else if (!me.grid.getSolidObject(me.location)) {
                    window.clearInterval(intervalId);
                    // Создаем заглушку.
                    const plug = new Plug(me.grid, me.location);
                    window.setTimeout(function () {
                        // Если еще не перешли на следующий уровень и не получили
                        // геймовер.
                        if (Game.isLevelPlaying(me.grid)) {
                            // Убираем заглушку.
                            plug.destroy();
                            // Создаем танк.
                            new Player(me.grid, me.location, me, me.playerNum);
                        }
                    }, Config.Spawn.plugTime);
                }
            }, 1000 / Config.fps);
        }, Config.Spawn.delay);
    }
}