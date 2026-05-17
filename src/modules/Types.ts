/**
 * Типы.
 */

import {FoeType, MapObjectType} from "./Enums.ts";

// Настройки танков.
export type TankConfig = {
    name: string; // Имя.
    cls: string; // Класс иконки.
    speed: number; // Множитель скорости. При единице будет базовая скорость.
    bulletSpeed: number; // Множитель скорости пули.
    hitPoints: number; // Количество хп танка.
    bullets: number; // Количество снарядов, которые могут быть на поле боя одновременно.
    spawnCls?: string; // Класс спаунера.
};

// Настройки препятствий.
export type ObstacleConfig = {
    name: string; // Имя.
    cls: string; // Класс иконки.
    hitPoints: number; // Количество хп препятствия.
}

// Местоположение объекта на поле боя.
export type Location = {
    x: number,
    y: number
}

// Координаты объекта.
export type Coordinates = {
    x: number,
    y: number
}

// Настройки объекта для карты поля боя.
export type MapObjectConfig = {
    objectType:MapObjectType, // Тип объекта
    location:Location
}
// Настройки карты поля боя.
export type MapConfig = {
    size: {x:number, y:number},
    objects:MapObjectConfig[],
    foes:FoeType[]
}