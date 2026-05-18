/**
 * @class Foe
 * Класс танка противника.
 */

import {Config} from "../../Config.ts";
import {TankConfig, Location} from "../../Types.ts";
import {FoeType, BulletType, Direction} from "../../Enums.ts";
import {Grid} from "../../Grid.ts";
import {AbstractTank} from "./AbstractTank.ts";
import {Player} from "./Player.ts";
import {Eagle} from "../eagle/Eagle.ts";
import {Bullet} from "../projectiles/Bullet.ts";
import {Ceramic} from "../obstacles/Ceramic.ts";
import {Water} from "../obstacles/Water.ts";
import {Helper} from "../../Helper.ts";

export class Foe extends AbstractTank {
    /**
     * Тип противника.
     */
    private readonly foeType:FoeType = FoeType.simple;

    /**
     * Настройки танка.
     */
    public readonly tankConfig:TankConfig;

    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number;

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     * @param foeType Номер типа танка.
     */
    public constructor(grid:Grid, location:Location, foeType:FoeType) {
        super(grid, location);
        this.foeType = foeType;
        this.tankConfig = Config.foe[this.foeType];
        // Начальное количество хп.
        this.hp = this.tankConfig.hitPoints;
        // Устанавливаем класс иконки танка.
        this.setIconCls();

        // Инициализируем передвижение и стрельбу танка.
        this.initMoving();
        this.initShooting();
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', Config.foe[this.foeType].cls);
    }

    /**
     * Метод нанесения повреждений объекту.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {
        if (bullet.bulletType === BulletType.player) {
            this.hp--;
            if (this.hp <= 0) {
                this.destroy();
            }
        }
    }

    /**
     * Вычисляет оптимальное направление движения к ближайшей цели.
     */
    findOptimalDirection():Direction {
        const grid = this.grid;
        const x = grid.x;
        const y = grid.y;
        const map = Array.from({length: x}, () => Array(y).fill(null));
        // Объекты, от которых будем строить путь.
        const growCells:Location[] = [];
        const directions:Direction[] = [
            Direction.left,
            Direction.right,
            Direction.top,
            Direction.bottom
        ];
        // Заполняем карту объектов. Для непреодолимых препятствий (кафельки, вода)
        // ставим -1, для целей (игроки, птица) ставим 0, для остальных (кирпичи,
        // другие танки противника) оставляем null.
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                const object = grid.getSolidObject({x:i, y:j});
                if (object) {
                    if (
                        object instanceof Player ||
                        object instanceof Eagle
                    ) {
                        map[i][j] = 0;
                        growCells.push({x:i, y:j});
                    } else if (
                        object instanceof Ceramic ||
                        object instanceof Water
                    ) {
                        map[i][j] = -1;
                    }
                }
            }
        }

        // Вычисляем дальности для каждой возможной клетки.
        while (growCells.length) {
            const cell = growCells.splice(0, 1)[0];
            const cellValue = map[cell.x][cell.y];
            const checkCell = function (direction:Direction) {
                const newCell:Location = Helper.countNewLocation(cell, direction);
                
                if (grid.isInside(newCell)) {
                    const newCellValue = map[newCell.x][newCell.y];
                    if (newCellValue === null || newCellValue > cellValue + 1) {
                        // Если для проверяемой ячейки еще нет пути или путь
                        // длиннее найденного.
                        map[newCell.x][newCell.y] = cellValue + 1;
                        growCells.push(newCell);
                    }
                }
            }
            
            directions.forEach(function (direction) {
                checkCell(direction);
            });
        }

        // Выбираем направление.
        const cell = this.location;
        // Длина пути до цели в зависимости от направления.
        const paths:number[] = directions.map(function (direction) {
            const newCell:Location = Helper.countNewLocation(cell, direction);
            if (
                !grid.isInside(newCell) ||
                map[newCell.x][newCell.y] === null ||
                map[newCell.x][newCell.y] < 0
            ) {
                return Infinity;
            } else {
                return map[newCell.x][newCell.y];
            }
        });
        // Самый короткий путь.
        const minPath:number = Math.min(...paths);
        // Направления с самым коротким путем.
        const shortPaths:Direction[] = [];
        for (let i = 0; i < paths.length; i++) {
            paths[i] === minPath && shortPaths.push(directions[i]);
        }

        return shortPaths[Math.floor(Math.random() * shortPaths.length)];
    }

    /**
     * Инициализирует передвижение танка.
     */
    initMoving():void {
        const me = this;
        const basicSpeed = Config.basicSpeed;
        const tankSpeed = this.tankConfig.speed;
        const duration = basicSpeed / tankSpeed;
        const moveFn:() => void = function () {
            const direction = me.findOptimalDirection();
            !me.destroyed && me.move(direction);
        }

        const intervalId = window.setInterval(function () {
            me.destroyed ? window.clearInterval(intervalId) : moveFn();
        }, duration + 1000 / Config.fps);
        
        !me.destroyed && moveFn();
    }

    /**
     * Инициализирует стрельбу танка.
     */
    initShooting():void {
        const me = this;
        const intervalId = window.setInterval(function () {
            me.destroyed ? window.clearInterval(intervalId) : me.shoot();
        }, Config.Bullet.basicSpeed * 4);
    }
}