/**
 * @class Grid
 * Класс поля боя.
 */

import {Direction, FoeType, ControlsFirst} from "./Enums.ts";
import {Location} from "./Types.ts";
import {Helper} from "./Helper.ts";
import {Exception} from "./Exception.ts";
import {Map} from "./Map.ts";
import {SolidObject} from "./objects/SolidObject.ts";
import {BackgroundObject} from "./objects/BackgroundObject.ts";
import {AbstractTank} from "./objects/tanks/AbstractTank.ts";
import {Player} from "./objects/tanks/Player.ts";
import {Foe} from "./objects/tanks/Foe.ts";
import {Ceramic} from "./objects/obstacles/Ceramic.ts";
import {Brick} from "./objects/obstacles/Brick.ts";
import {Ice} from "./objects/bgobjects/Ice.ts";
import {Bullet} from "./objects/projectiles/Bullet.ts";
import {BulletManager} from "./objects/projectiles/BulletManager.ts";
import {PlayerSpawn} from "./objects/spawn/PlayerSpawn.ts";

export class Grid {
    /**
     * Ссылка на основной грид для быстрого доступа.
     */
    public readonly el:HTMLElement;

    /**
     * Количество ячеек по горизонтали.
     */
    public readonly x:number;

    /**
     * Количество ячеек по вертикали.
     */
    public readonly y:number;

    /**
     * Количество игроков.
     */
    public readonly playerNum:number;

    /**
     * Массив текущих твердых объектов.
     */
    private solidObjects:Array<Array<SolidObject|null>>;

    /**
     * Массив текущих твердых объектов.
     */
    private backgroundObjects:BackgroundObject[][][];

    /**
     * Конструктор.
     * @param mapNum Номер карты
     * @param playerNum Количество игроков.
     */
    public constructor(mapNum:number, playerNum:number) {
        // Устанавливаем количество игроков.
        this.playerNum = playerNum;

        // Создаем карту.
        const map = new Map(this, mapNum);

        // Устанавливаем размеры поля боя.
        const x = map.mapConfig.size.x;
        const y = map.mapConfig.size.y;
        this.x = x;
        this.y = y;

        // Создаем элемент поля боя для DOM-а.
        this.el = this.createGrid(x, y);

        // Заполняем двумерный массив твердых объектов null-ами.
        this.solidObjects = Array.from({length: x}, () => Array(y).fill(null));

        // Заполняем двумерный массив фоновых объектов пустыми массивами. В итоге
        // получаем трехмерный массив.
        this.backgroundObjects = Array.from({length: x}, () => Array.from({length: y}, () => []));

        // Заполняем поле боя объектами карты.
        map.fill();

        // Отрисовываем поле боя.
        Helper.fillBody(this.el);
    }

    /**
     * Создает основную таблицу.
     * @param x Количество ячеек по горизонтали.
     * @param y Количество ячеек по вертикали.
     */
    public createGrid(x:number, y:number):HTMLElement {
        const grid:HTMLElement = document.createElement('table');

        grid.setAttribute('id', 'battlefield');

        for (let i = 0; i < y; i++) {
            const tr:HTMLElement = this.createRow(x);
            grid.append(tr);
        }

        return grid;
    }

    /**
     * Создает строку для основной таблицы.
     * @param x Количество ячеек в строке.
     */
    private createRow(x:number):HTMLElement {
        const row:HTMLElement = document.createElement('tr');

        for (let i = 0; i < x; i++) {
            const td:HTMLElement = document.createElement('td');
            row.append(td);
        }

        return row;
    }

    /**
     * Размещает твердый объект на поле боя.
     * @param solidObject Сам объект.
     * @param silent Если параметр выставлен в true то не будет производиться\
     * запись в DOM.
     * @param location Местоположение объекта. Если не указано, будет
     * использоваться местоположение из самого объекта. Нужно в тех случаях, если
     * объект занимает более одной ячейки (например, при движении танка).
     */
    public placeSolidObject(solidObject:SolidObject, silent:boolean = false, location?:Location):void {
        if (!location) {
            location = solidObject.location;
        }

        // Проверка, что местоположение попадает в таблицу.
        if (!this.isInside(location)) {
            new Exception(`Данная локация не попадает в таблицу: x = ${location.x}, y = ${location.y}.`);
            return;
        }
        
        // Проверка, что в данной ячейке ничего нет.
        if (this.solidObjects[location.x][location.y]) {
            new Exception(`Данная ячейка занята: x = ${location.x}, y = ${location.y}.`);
            return;
        }

        // Записываем в таблицу объектов данный объект.
        this.solidObjects[location.x][location.y] = solidObject;

        if (!silent) {
            // Отрисовываем данный объект на поле боя.
            const table = this.el;
            const td = table.childNodes[location.y].childNodes[location.x] as HTMLElement;
            const icon = solidObject.icon;
            td.append(icon);
        }
    }

    /**
     * Удаляет твердый объект с поля боя.
     * @param solidObject Сам объект.
     */
    public removeSolidObject(solidObject:SolidObject):void {
        const location = solidObject.location;
        // Удаляем из таблицы объектов данный объект.
        this.solidObjects[location.x][location.y] = null;

        // Если объект является танком, удаляем его также из ячейки, в которую
        // он двигается (если нужно).
        if (solidObject instanceof AbstractTank) {
            const moveLocation = solidObject.moveLocation;
            if (moveLocation) {
                this.solidObjects[moveLocation.x][moveLocation.y] = null;
            }
        }

        // Удаляем объект из DOM-а.
        const icon = solidObject.icon;
        const parentNode = icon.parentNode;
        parentNode && parentNode.removeChild(icon);
    }

    /**
     * Размещает фоновый объект на поле боя.
     * @param backgroundObject Сам объект.
     */
    public placeBackgroundObject(backgroundObject:BackgroundObject):void {
        const location = backgroundObject.location;
        
        // Проверка, что местоположение попадает в таблицу.
        if (!this.isInside(location)) {
            new Exception(`Данная локация не попадает в таблицу: x = ${location.x}, y = ${location.y}.`);
            return;
        }

        // Записываем в таблицу объектов данный объект.
        this.backgroundObjects[location.x][location.y].push(backgroundObject);
        
        // Отрисовываем данный объект на поле боя.
        const table = this.el;
        const td = table.childNodes[location.y].childNodes[location.x] as HTMLElement;
        const icon = backgroundObject.icon;
        td.append(icon);
    }

    /**
     * Проверяет, можно ли переместить танк в данном направлении: не выйдет ли
     * он за пределы поля боя и нет ли объектов в данной клетке.
     * @param location Предполагаемое новое положение танка.
     */
    public isMoveAllowed(location:Location):boolean {
        const maxX = this.x - 1;
        const maxY = this.y - 1;
        const newX = location.x;
        const newY = location.y;
        const isFree = !this.solidObjects[newX] || !this.solidObjects[newX][newY];
        
        return isFree && newX <= maxX && newX >= 0 && newY <= maxY && newY >= 0;
    }

    /**
     * Возвращает твердый объект, нахлдящийся в заданной ячейке.
     * @param location Ячейка, на которой находится объект.
     */
    public getSolidObject(location:Location):SolidObject|null {
        if (this.isInside(location)) {
            return this.solidObjects[location.x][location.y];
        } else {
            // За пределами поля боя.
            return null;
        }
    }

    /**
     * Проверяет, находится ли локация внутри поля боя.
     * @param location Проверяемая локация.
     */
    public isInside(location:Location):boolean {
        return location.x >= 0 && location.x < this.x &&
            location.y >= 0 && location.y < this.y;
    }

    /**
     * Проверяет, находится ли на данной клетке лед.
     * @param location Проверяемая локация.
     */
    public hasIce(location:Location):boolean {
        // Если локация не в таблице, просто возвращаем false.
        if (!this.isInside) {
            return false;
        }

        let hasIce = false;
        const objects:BackgroundObject[] = this.backgroundObjects[location.x][location.y];
        objects.forEach(function (item) {
            if (item instanceof Ice) {
                hasIce = true;
            }
        });

        return hasIce;
    }

    /**
     * Окончание уровня.
     */
    public destroy():void {
        // Уничтожаем все танки: танки игроков чтобы снять управление, танки
        // противников чтобы отключить ИИ.
        const solidObjects = this.solidObjects;
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                const item = solidObjects[x][y];
                if (item && item instanceof AbstractTank) {
                    item.destroy(true);
                }
            }
        }

        // Уничтожаем все пули.
        BulletManager.removeAllBullets();

        // Удаляем поле боя из DOM-а.
        const el = this.el;
        const parent = el.parentNode;
        parent && parent.removeChild(el);
    }
}