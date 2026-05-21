/**
 * Список конфигураций.
 */

import {TankConfig, ObstacleConfig} from "./Types.ts";

export namespace Config {
    // Базовое время, за которое танк преодолевает одну клетку.
    export const basicSpeed = 1000;

    // Размер ячейки поля боя в пикселях.
    export const cellSize = 64;

    // Размер снаряда.
    export const bulletSize = 4;

    // Частота просчета событий.
    export const fps = 50;

    // Задержка после нажития кнопки и началом движения танка игрока.
    export const moveDelay = 100;

    // Количество жизней у игрока.
    export const lives = 3;

    // Время, за которое выезжает стартовый экран.
    export const startScreenDuration = 3000;

    // Время, за которое выезжает надпись "Game over".
    export const gameOverScreenDuration = 2000;

    // Время, которое надпись "Game over" будет оставаться на экране.
    export const gameOverScreenTime = 7000;

    // Настройки игроков.
    export const player:TankConfig[] = [
        {
            name: "Первый игрок",
            cls: "player first-player",
            spawnCls: "spawn spawn-first-player",
            speed: 1,
            bulletSpeed: 1,
            hitPoints: 1,
            bullets: 1
        },
        {
            name: "Второй игрок",
            cls: "player second-player",
            spawnCls: "spawn spawn-second-player",
            speed: 1,
            bulletSpeed: 1,
            hitPoints: 1,
            bullets: 1
        }
    ];

    // Настройки противников.
    export const foe:TankConfig[] = [
        {
            name: "Обычный танк",
            cls: "foe foe-simple",
            speed: 1,
            bulletSpeed: 1,
            hitPoints: 1,
            bullets: 1
        },
        {
            name: "Быстрый танк",
            cls: "foe foe-fast",
            speed: 2,
            bulletSpeed: 1,
            hitPoints: 1,
            bullets: 1
        },
        {
            name: "Скорострельный танк",
            cls: "foe foe-rapid",
            speed: 1,
            bulletSpeed: 2,
            hitPoints: 1,
            bullets: 1
        },
        {
            name: "Бронированный танк",
            cls: "foe foe-armor",
            speed: 1,
            bulletSpeed: 1,
            hitPoints: 4,
            bullets: 1
        }
    ];
    
    export const obstacle:ObstacleConfig[] = [
        {
            name: "Кафельки",
            cls: "obstacle obstacle-ceramic",
            hitPoints: 4
        },
        {
            name: "Кирпичи",
            cls: "obstacle obstacle-brick",
            hitPoints: 4
        },
        {
            name: "Вода",
            cls: "obstacle obstacle-water",
            hitPoints: Infinity
        }
    ];

    export namespace Bullet {
        // Базовое время, за которое снаряд преодолевает одну клетку.
        export const basicSpeed = 500;
    }

    export namespace Spawn {
        // Максимальное количество танков противника.
        export const maxFoes = 4;

        // Частота спауна танков противника.
        export const foeSpawnFrequency = 5000;

        // Здержка перед спауном танка.
        export const delay = 2000;

        // Время отображения заглушки перед спауном.
        export const plugTime = 5000;

        // Класс иконки заглушки.
        export const plugCls = 'plug';
        // Количество fps при анимации иконки.
        export const plugAnimationFps = 5;
    }
}