/**
 * @class Bullet
 * Класс снаряда.
 */

import {Config} from "../../Config.ts";
import {Direction, BulletType} from "../../Enums.ts";
import {Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";
import {Coordinates} from "../../Types.ts";
import {AbstractTank} from "../tanks/AbstractTank.ts";
import {Player} from "../tanks/Player.ts";
import {Foe} from "../tanks/Foe.ts";
import {Eagle} from "../eagle/Eagle.ts";
import {SolidObject} from "../SolidObject.ts";
import {AbstractObstacle} from "../obstacles/AbstractObstacle.ts";
import {Water} from "../obstacles/Water.ts";
import {BulletExplosion} from "../explosions/BulletExplosion.ts";
import {BulletManager} from "./BulletManager.ts";

export class Bullet {
    /**
     * Тип снаряда снаряда - снаряд игрока или снаряд противника.
     */
    public readonly bulletType:BulletType;

    /**
     * Координаты снаряда.
     */
    public coordinates:Coordinates;

    /**
     * Скорость снаряда.
     */
    private readonly speed:number;

    /**
     * Направление снаряда.
     */
    private readonly direction:Direction;

    /**
     * Класс иконки снаряда.
     */
    private readonly iconCls:string = 'bullet';

    /**
     * Идентификатор события просчета координат снаряда. Нужен, чтобы очистить
     * событие при удалении снаряда.
     */
    private readonly intervalId:number;

    /**
     * Иконка снаряда.
     */
    public readonly icon:HTMLElement;

    /**
     * Танк, выпустившимй снаряд.
     */
    public readonly tank:AbstractTank;

    /**
     * Конструктор.
     * @param tank Танк, выпустивший снаряд.
     */
    public constructor(tank:AbstractTank) {
        const me = this;

        // Обновляем количество снарядов, выпущенное танком.
        tank.bulletsShooted++;

        // Танк, выпустивший снаряд.
        this.tank = tank;

        // Тип снаряда.
        if (tank instanceof Player) {
            this.bulletType = BulletType.player;
        } else {
            this.bulletType = BulletType.foe;
        }

        // Вычисляем скорость снаряда.
        this.speed = Config.Bullet.basicSpeed / (tank.tankConfig.bulletSpeed || 1);

        // Вычисляем начальное положение снаряда.
        let x = Config.cellSize * tank.location.x + tank.icon.offsetLeft;
        let y = Config.cellSize * tank.location.y + tank.icon.offsetTop;
        switch (tank.direction) {
            case Direction.left:
                y += Config.cellSize / 2;
                break;
            case Direction.right:
                x += Config.cellSize;
                y += Config.cellSize / 2;
                break;
            case Direction.top:
                x += Config.cellSize / 2;
                break;
            case Direction.bottom:
                x += Config.cellSize / 2;
                y += Config.cellSize;
                break;
            default:
                break;
        }
        this.coordinates = {x:x, y:y};

        // Устанавливаем направление снаряда.
        this.direction = tank.direction;

        // Устанавливаем обновление координат.
        this.intervalId = window.setInterval(me.move.bind(me), 1000 / Config.fps);

        // Создаем иконку и размещаем на поле боя.
        const grid = tank.grid;
        const container = grid.el.parentNode;
        this.icon = this.createIcon();
        container && container.append(this.icon);
        this.refreshIcon();

        // Добавляем снаряд в менеджер.
        BulletManager.addBullet(this);
    }

    /**
     * Создает иконку снаряда.
     */
    private createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.setAttribute('class', this.iconCls);

        return icon;
    }

    /**
     * Передвигает снаряд на одну итерацию.
     */
    public move():void {
        const distance = 1000 * Config.cellSize / this.speed / Config.fps;
        switch (this.direction) {
            case Direction.left:
                this.coordinates.x -= distance;
                break;
            case Direction.right:
                this.coordinates.x += distance;
                break;
            case Direction.top:
                this.coordinates.y -= distance;
                break;
            case Direction.bottom:
                this.coordinates.y += distance;
                break;
            default:
                break;
        }

        const hitObject = this.isHit();
        if (!this.isInsideGrid()) {
            // Если снаряд вышел за пределы поля боя, уничтожаем его.
            this.destroy();
        } else if (hitObject && !(hitObject instanceof Water)) {
            // Если снаряд что-то задел, наносим урон (кроме воды, она пропускает
            // снаряды насквозь).
            hitObject.hit(this);
            this.destroy();
        } else {
            // Обновляем иконку.
            this.refreshIcon();
            // Запускаем событие менеджера.
            BulletManager.moveBullet(this);
        }
    }

    /**
     * Обновляет иконку в соответствии с координатами.
     */
    private refreshIcon():void {
        const icon = this.icon;
        icon.style.left = (Math.floor(this.coordinates.x) - (Config.bulletSize / 2)) + 'px';
        icon.style.top = (Math.floor(this.coordinates.y) - (Config.bulletSize / 2)) + 'px';
    }

    /**
     * Находится ли снаряд внутри поля боя.
     */
    private isInsideGrid():boolean {
        const x = this.coordinates.x;
        const y = this.coordinates.y;
        const maxX = Config.cellSize * this.tank.grid.x;
        const maxY = Config.cellSize * this.tank.grid.y;
        return x >=0 && x <= maxX && y >=0 && y <= maxY;
    }

    /**
     * Удаление снаряда.
     * @param silent Если установлено в true, то снаряд будет уничтожен без взрыва.
     */
    public destroy(silent:boolean = false):void {
        // Обновляем количество снарядов, выпущенное танком.
        this.tank.bulletsShooted--;

        // Снимаем событие обновления.
        window.clearInterval(this.intervalId);
        // Удаляем иконку из DOM-а.
        const icon = this.icon;
        const parentNode = icon.parentNode;
        parentNode && parentNode.removeChild(icon);
        
        // Запускаем анимацию взрыва снаряда (если нужно).
        !silent && new BulletExplosion(this.tank.grid, {x:0, y:0}, this.coordinates);
        
        // Удаляем снаряд из менеджера.
        BulletManager.removeBullet(this);
    }

    /**
     * Проверяет, попал ли снаряд в какой-либо твердый объект.
     */
    private isHit():SolidObject|null {
        // Координаты на поле боя.
        const locationX = Math.floor(this.coordinates.x / Config.cellSize);
        const locationY = Math.floor(this.coordinates.y / Config.cellSize);
        const grid = this.tank.grid;
        const solidObject = grid.getSolidObject({x:locationX, y:locationY});

        if (!solidObject || solidObject === this.tank) {
            // Если в ячейке ничего нет или если снаряд каким-либо образом попал
            // в выстреливший его танк.
            return null;
        } else if (
            solidObject instanceof AbstractObstacle ||
            solidObject instanceof Eagle
        ) {
            // Если в ячейке статичное препятствие или орел.
            return solidObject;
        } else if (solidObject instanceof AbstractTank) {
            // Если в ячейке танк.
            if (solidObject.isInsideHitbox(this.coordinates)) {
                // Возвращаем танк только в том случае, если снаряд внутри хитбокса.
                return solidObject;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}