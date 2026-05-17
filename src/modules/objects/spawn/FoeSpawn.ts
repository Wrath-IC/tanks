/**
 * @class FoeSpawn
 * Спаунер танков противников.
 */

import {AbstractSpawn} from "./AbstractSpawn.ts";
import {Plug} from "./Plug.ts";
import {Grid} from "../../Grid.ts";
import {Location} from "../../Types.ts";
import {FoeType} from "../../Enums.ts";
import {Foe} from "../tanks/Foe.ts";
import {Config} from "../../Config.ts";

export class FoeSpawn extends AbstractSpawn {
    /**
     * Список текущих доступных спаунеров.
     */
    private static spawns:FoeSpawn[] = [];
    
    /**
     * Список текущих доступных спаунеров.
     */
    private static nextSpawnNum:number = 0;
    
    /**
     * Список текущих доступных спаунеров.
     */
    public static foes:FoeType[] = [];
    
    /**
     * Был ли запущен спаун противников.
     */
    public static spawnStarted:boolean = false;
    
    public constructor(grid:Grid, location:Location) {
        super(grid, location);
        // Устанавливаем класс иконки препятствия.
        this.setIconCls();

        // Записываем экземпляр в список доступных спаунеров. 
        FoeSpawn.addSpawn(this);

        // Если еще не был запущен спаун противников, запускаем его.
        if (!FoeSpawn.spawnStarted) {
            FoeSpawn.initSpawning();
            FoeSpawn.spawnStarted = true;
        }
    }
    
    /**
     * Запускает спаун противников.
     */
    private static initSpawning():void {
        const spawn = function () {
            // Первый спаун запускается без задержки.
            FoeSpawn.spawn();

            FoeSpawn.foes.length && window.setTimeout(function () {
                spawn();
            }, Config.Spawn.foeSpawnFrequency);
        };

        FoeSpawn.foes.length && spawn();
    }
    
    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', 'spawn spawn-foe');
    }

    /**
     * Записывает экземпляр в список доступных спаунеров.
     * @param spawn Спаунер, который нужно записать.
     */
    private static addSpawn(spawn:FoeSpawn) {
        if (FoeSpawn.spawns.indexOf(spawn) === -1) {
            FoeSpawn.spawns.push(spawn);
        }
    }

    /**
     * Удаляет экземпляр из списка доступных спаунеров.
     * @param spawn Спаунер, который нужно удалить.
     */
    private static removeSpawn(spawn:FoeSpawn) {
        const index = FoeSpawn.spawns.indexOf(spawn);
        FoeSpawn.spawns.splice(index, 1);
    }

    /**
     * Подготавливает класс спаунера. Очищает статические переменные, заполняет
     * список противников.
     */
    public static prepareSpawner(foes:FoeType[]) {
        FoeSpawn.spawns = [];
        FoeSpawn.nextSpawnNum = 0;
        FoeSpawn.foes = foes;
        FoeSpawn.spawnStarted = false;
    }

    /**
     * Метод, запускающий процесс спауна танка.
     */
    private static spawn():void {
        const me = this;

        // Если не осталось танков для призыва, прерываем выполнение.
        if (!FoeSpawn.foes.length) {
            return;
        }

        // Берем первый танк из спаска танков противника.
        const foeType:FoeType = FoeSpawn.foes.splice(0, 1)[0];

        window.setTimeout(function () {
            // Создаем событие: оно вызовет создание заглушки как только хоть одна
            // клетка будет свободна.
            const intervalId = window.setInterval(function () {
                const spawn = FoeSpawn.getNextSpawn();
                if (spawn) {
                    window.clearInterval(intervalId);
                    // Создаем заглушку.
                    const plug = new Plug(spawn.grid, spawn.location);
                    window.setTimeout(function () {
                        // Убираем заглушку.
                        plug.destroy();
                        // Создаем танк.
                        new Foe(spawn.grid, spawn.location, foeType);
                    }, Config.Spawn.plugTime);
                }
            }, 1000 / Config.fps);
        }, Config.Spawn.delay);
    }

    /**
     * Проверяет, есть ли свободный спаун для создания противника.
     */
    private static hasEmptySpawn():boolean {
        const spawns = FoeSpawn.spawns;
        let allowed = false;

        spawns.forEach(function (spawn) {
            const grid = spawn.grid;
            // isMoveAllowed
            if (grid.isMoveAllowed(spawn.location)) {
                // Если найден спаунер, на месте которого нет твердого объекта,
                // возвращаем true.
                allowed = true;
            }
        });
        
        // Если не найден спаунер, на месте которого нет твердого объекта,
        // возвращаем false.
        return allowed;
    }

    private static getNextSpawn():FoeSpawn|null {
        // Проверяем, что есть пустой спаунер.
        if(!FoeSpawn.hasEmptySpawn()) {
            return null;
        }

        let spawn:FoeSpawn|null = null;
        // Ищем пустой спаунер, пока не найдем.
        while (!spawn) {
            // Спаунер, который проверяем в данный момент.
            const currentSpawn = FoeSpawn.spawns[FoeSpawn.nextSpawnNum];
            if(currentSpawn.grid.isMoveAllowed(currentSpawn.location)) {
                // Если клетка проверяемого спаунера пустая, то записываем данный
                // спаунер как итоговый.
                spawn = currentSpawn;
            }
            // Увеличиваем номер текущего спаунера независимо от того, пропустили
            // мы спаунер или выбрали его для спауна следующего танка.
            FoeSpawn.nextSpawnNum++;
            // Если при увеличении номера спаунера вышли за пределы количества
            // спаунеров то сбрасываем счетчик в ноль.
            if (FoeSpawn.nextSpawnNum >= FoeSpawn.spawns.length) {
                FoeSpawn.nextSpawnNum = 0;
            }
        }

        return spawn;
    }
}