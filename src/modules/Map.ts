/**
 * @class Map
 * Класс для формирования карты поля боя.
 */

import {Grid} from "./Grid.ts";
import {Maps} from "./Maps.ts";
import {MapObjectConfig, MapConfig} from "./Types.ts";
import {MapObjectType} from "./Enums.ts";
import {AbstractObject} from "./objects/AbstractObject.ts";
import {PlayerSpawn} from "./objects/spawn/PlayerSpawn.ts";
import {FoeSpawn} from "./objects/spawn/FoeSpawn.ts";
import {Eagle} from "./objects/eagle/Eagle.ts";
import {Brick} from "./objects/obstacles/Brick.ts";
import {Ceramic} from "./objects/obstacles/Ceramic.ts";
import {Water} from "./objects/obstacles/Water.ts";

export class Map {
    /**
     * Ссылка на поле боя.
     */
    public readonly grid:Grid;

    /**
     * Ссылка на поле боя.
     */
    public readonly mapConfig:MapConfig;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param mapNum Номер карты.
     */
    public constructor(grid:Grid, mapNum:number) {
        this.grid = grid;
        this.mapConfig = Maps[mapNum];

        // Подготавливаем спаунер противников.
        FoeSpawn.prepareSpawner(this.mapConfig.foes);
    }

    /**
     * Заполняет поле боя исходя из номера карты.
     */
    public fill():void {
        const mapConfig:MapConfig = this.mapConfig;
        const objects:MapObjectConfig[] = mapConfig.objects;
        
        for (let i = 0; i < objects.length; i++) {
            this.createObject(objects[i]);
        }
    }

    /**
     * Создает объект на поле боя.
     * @param config Конфигурация объекта.
     */
    private createObject(config:MapObjectConfig):void {
        const grid = this.grid;
        const location = config.location;
        
        switch (config.objectType) {
            case MapObjectType.spawnFoe:
                new FoeSpawn(grid, location);
                break;
            case MapObjectType.spawnFirstPlayer:
                new PlayerSpawn(grid, location, 0);
                break;
            case MapObjectType.spawnSecondPlayer:
                if (grid.playerNum > 1) {
                    // Добавляем спаунер второго игрока только в том случае, если
                    // игра запущена хотя бы на двоих.
                    new PlayerSpawn(grid, location, 1);
                }
                break;
            case MapObjectType.eagle:
                new Eagle(grid, location);
                break;
            case MapObjectType.brick:
                new Brick(grid, location);
                break;
            case MapObjectType.ceramic:
                new Ceramic(grid, location);
                break;
            case MapObjectType.water:
                new Water(grid, location);
                break;
            default:
                break;
        }
    }
}