/**
 * @class AbstractTank
 * Абстрактный класс танка.
 */

import {Direction} from "../../Enums.ts";
import {Location, TankConfig, Coordinates} from "../../Types.ts";
import {Config} from "../../Config.ts";
import {Grid} from "../../Grid.ts";
import {Helper} from "../../Helper.ts";
import {SolidObject} from "../SolidObject.ts";
import {Bullet} from "../projectiles/Bullet.ts";
import {Ice} from "../bgobjects/Ice.ts";
import {TankExplosion} from "../explosions/TankExplosion.ts";

export abstract class AbstractTank extends SolidObject {
    /**
     * Ячейка, в которую танк движется.
     */
    public moveLocation:Location | null = null;

    /**
     * Направление, в котором танк повернут.
     */
    public direction:Direction = Direction.top;

    /**
     * Настройки танка.
     */
    public abstract readonly tankConfig:TankConfig;

    /**
     * Текущее количество снарядов на поле боя.
     */
    public bulletsShooted:number = 0;

    /**
     * Создает иконку танка. Каждая иконка состоит из двух гусениц, тела, дула и декора.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        
        this.createTankPart(icon, 'lwheel');
        this.createTankPart(icon, 'rwheel');
        this.createTankPart(icon, 'body');
        this.createTankPart(icon, 'barrel');
        this.createTankPart(icon, 'decor');
        
        return icon;
    }

    /**
     * Создает часть танка.
     * @param icon Иконка танка.
     * @param cls CSS-класс для элемента.
     */
    private createTankPart(icon:HTMLElement, cls:string):void {
        const elem = document.createElement('div');
        elem.setAttribute('class', cls);
        icon.append(elem);
    }

    /**
     * Поворачивает танк.
     * @param direction Направление, куда танк должен повернуться.
     */
    public turn(direction:Direction):void {
        // Если танк движется, то запрещаем поворот.
        if (this.isMoving()) {
            return;
        }
        
        // Поворачиваем иконку.
        this.icon.style.transform = `rotate(${direction * 90}deg)`;
        
        // Записываем направление.
        this.direction = direction;
    }

    /**
     * Передвигает танк в заданном направлении.
     * @param direction Направление, куда танк должен поехать.
     * @param callback Коллбэк
     */
    public move(direction:Direction, callback?:() => void):void {
        const me = this;
        const grid = me.grid;
        const oldLocation = {...me.location};
        const moveLocation = Helper.countNewLocation(oldLocation, direction);

        if (this.isMoving()) {
            // Если объект уже движется, то игнорируем попытки его двигать.
            return;
        }
        
        // Проверяет, не запрещено ли перемещение в данном направлении. Если
        // запрещено, то танк все равно нужно развернуть по направлению.
        if (!grid.isMoveAllowed(moveLocation)) {
            me.turn(direction);
            return;
        }

        // Поворачиваем танк по направлению движения.
        this.turn(direction);

        let animateConfig:{left?:string[], top?:string[]} = {};
        const cellSize = Config.cellSize;
        switch (direction) {
            case Direction.left:
                animateConfig = {left: ['0', `-${cellSize}px`]};
                break;
            case Direction.right:
                animateConfig = {left: ['0', `${cellSize}px`]};
                break;
            case Direction.top:
                animateConfig = {top: ['0', `-${cellSize}px`]};
                break;
            case Direction.bottom:
                animateConfig = {top: ['0', `${cellSize}px`]};
                break;
            default:
                break;
        }

        this.moveLocation = moveLocation;

        // Фиксируем в списке объектов поля боя наличие танка в новой ячейке.
        grid.placeSolidObject(me, true, moveLocation);

        // Итоговая скорость танка (количество милисекунд, за которое он должен
        // переместиться на одну клетку).
        const basicSpeed = Config.basicSpeed;
        const tankSpeed = this.tankConfig.speed;
        // Модификатор скорости, который накладывает лед (если он есть).
        const hasIce = grid.hasIce(oldLocation) || grid.hasIce(moveLocation);
        const iceModificator = hasIce ? Ice.speedModificator : 1;
        const duration = basicSpeed / tankSpeed / iceModificator;
        // Анимация перемещения.
        const el = this.icon;
        el.animate(animateConfig, {duration:duration, iterations: 1}).onfinish = function () {
            // После завершения анимации.

            // Если танк уже уничтожен, то прерываем.
            if (me.destroyed) {
                return;
            }

            // Удаляем танк с поля боя.
            grid.removeSolidObject(me);

            // Устанавливаем новую локацию танка и очищаем локацию, куда танк
            // движется.
            me.location = moveLocation;
            me.moveLocation = null;

            // Размещаем танк на поле боя (будет использоваться новая локация).
            grid.placeSolidObject(me);

            // Выполняем коллбэк, если он передан.
            callback && callback();
        };
    }

    /**
     * Возвращает признак, двигается ли танк.
     */
    public isMoving():boolean {
        return this.moveLocation !== null;
    }

    /**
     * Проверяет, находится ли указанные координаты внутри хитбокса танка.
     * @param coordinates Координаты.
     */
    public isInsideHitbox(coordinates:Coordinates):boolean {
        const cellSize = Config.cellSize;
        const location = this.location;
        const offsetTop = this.icon.offsetTop;
        const offsetLeft = this.icon.offsetLeft;

        return coordinates.x > offsetLeft + cellSize * location.x &&
            coordinates.x < offsetLeft + cellSize * (location.x + 1) &&
            coordinates.y > offsetTop + cellSize * location.y &&
            coordinates.y < offsetTop + cellSize * (location.y + 1);
    }

    /**
     * Размещает снаряд на поле боя.
     */
    shoot():void {
        // Проверяем, что танком выпущено меньше снарядов, чем допустимо конфигом.
        if (this.bulletsShooted < this.tankConfig.bullets) {
            new Bullet(this);
        }
    }

    /**
     * Уничтожает танк.
     */
    public destroy():void {
        const coordinates = {x:this.icon.offsetLeft, y:this.icon.offsetTop};
        super.destroy();
        new TankExplosion(this.grid, this.location, coordinates);
    }
}