/**
 * @class Player
 * Класс танка игрока.
 */

import {Config} from "../../Config.ts";
import {TankConfigPlayer, Location} from "../../Types.ts";
import {BulletType, ControlsFirst, ControlsSecond, Direction} from "../../Enums.ts";
import {Grid} from "../../Grid.ts";
import {Game} from "../../Game.ts";
import {AbstractTank} from "./AbstractTank.ts";
import {Bullet} from "../projectiles/Bullet.ts";
import {PlayerSpawn} from "../spawn/PlayerSpawn.ts";

export class Player extends AbstractTank {
    /**
     * Номер игрока.
     */
    public readonly playerNum:number = 0;

    /**
     * Настройки танка.
     */
    public readonly tankConfig:TankConfigPlayer;

    /**
     * Спаун игрока.
     */
    public readonly spawn:PlayerSpawn;

    /**
     * Количество хитпоинтов объекта.
     */
    protected hp:number;

    /**
     * Функция обработки нажития клавиш. Нужна, чтобы снять событие после
     * уничтожения танка.
     */
    private controlEvents:{keydown:(event:KeyboardEvent) => void, keyup:(event:KeyboardEvent) => void}|null = null;

    /**
     * Нажатые клавиши управления. Null соответствует ненажатой клавише управления,
     * number - времени, на протяжении которого клавиша была нажата.
     */
    private controlsPushed:Array<number|null> = [null, null, null, null];

    /**
     * Конструктор.
     * @param grid Ссылка на поле боя.
     * @param location Расположение объекта.
     * @param playerNum Номер игрока.
     */
    public constructor(grid:Grid, location:Location, spawn:PlayerSpawn, playerNum:number) {
        super(grid, location);
        this.spawn = spawn;
        this.playerNum = playerNum;
        this.tankConfig = Config.player[this.playerNum];
        // Начальное количество хп.
        this.hp = this.tankConfig.hitPoints;
        // Устанавливаем класс иконки танка.
        this.setIconCls();
        // Инициализируем управление танком.
        this.initControls();
    }

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', Config.player[this.playerNum].cls);
    }

    /**
     * Метод нанесения повреждений объекту.
     * @param bullet Снаряд.
     */
    public hit(bullet:Bullet):void {
        switch (bullet.bulletType) {
            case BulletType.player:
                // todo Реализовать френдли файер.
                // todo Если пуля своя, игнорировать ее.
                break;
            case BulletType.foe:
                this.hp--;
                if (this.hp <= 0) {
                    this.destroy();
                }
                break;
            default:
                break;
        }
    };

    /**
     * Уничтожает танк.
     * @param silent Если выставлено в true, то при уничтожении танка не будут
     * отниматься жизни и запускаться респаун. Эта опция нужна для уничтожения
     * танка при окончании уровня.
     */
    public destroy(silent:boolean = false):void {
        super.destroy(silent);
        this.removeControls();
        if (!silent) {
            Game.destroyTank(this.playerNum);
            this.spawn.spawn();
        }
    }

    /**
     * Инициализирует управление игроков.
     */
    private initControls():void {
        const me = this;
        const controlEventKeyDown = this.controlEventKeyDown.bind(this);
        const controlEventKeyUp = this.controlEventKeyUp.bind(this);

        // Событие нажатия на кнопку.
        window.addEventListener('keydown', controlEventKeyDown);
        window.addEventListener('keyup', controlEventKeyUp);
        this.controlEvents = {
            keydown: controlEventKeyDown,
            keyup: controlEventKeyUp
        };

        // Событие удержания кнопки движения.
        const intervalId = window.setInterval(function() {
            if (me.destroyed) {
                window.clearInterval(intervalId);
            } else {
                me.moveEvent.bind(me)();
            }
        }, 1000 / Config.fps);
    }

    /**
     * Снимает событие клавиш управления.
     */
    private removeControls():void {
        const controlEvents = this.controlEvents;
        controlEvents && window.removeEventListener('keydown', controlEvents.keydown);
        controlEvents && window.removeEventListener('keyup', controlEvents.keyup);
    }

    /**
     * Обработчик нажатий на кнопки. Разворот и выстрел обрабатываются сразу.
     * Данные для движения записываются здесь и обрабатываются в отдельной функции.
     * @param event Событие нажатия на клавишу.
     */
    private controlEventKeyDown(event:KeyboardEvent):void {
        const playerNum = this.playerNum;
        const keyCode = event.keyCode;
        const controls = playerNum ? ControlsSecond : ControlsFirst;

        switch (keyCode) {
            case controls.left:
                this.turn(Direction.left);
                if (this.controlsPushed[Direction.left] === null) {
                    this.controlsPushed[Direction.left] = 0;
                }
                event.preventDefault();
                break;
            case controls.right:
                this.turn(Direction.right);
                if (this.controlsPushed[Direction.right] === null) {
                    this.controlsPushed[Direction.right] = 0;
                }
                event.preventDefault();
                break;
            case controls.up:
                this.turn(Direction.top);
                if (this.controlsPushed[Direction.top] === null) {
                    this.controlsPushed[Direction.top] = 0;
                }
                event.preventDefault();
                break;
            case controls.down:
                this.turn(Direction.bottom);
                if (this.controlsPushed[Direction.bottom] === null) {
                    this.controlsPushed[Direction.bottom] = 0;
                }
                event.preventDefault();
                break;
            case controls.shoot:
                this.shoot();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /**
     * Обработчик отпускания кнопок. Если отпущена кнопка движения, записываем это.
     * @param event Событие нажатия на клавишу.
     */
    private controlEventKeyUp(event:KeyboardEvent):void {
        const playerNum = this.playerNum;
        const keyCode = event.keyCode;
        const controls = playerNum ? ControlsSecond : ControlsFirst;

        switch (keyCode) {
            case controls.left:
                this.controlsPushed[Direction.left] = null;
                event.preventDefault();
                break;
            case controls.right:
                this.controlsPushed[Direction.right] = null;
                event.preventDefault();
                break;
            case controls.up:
                this.controlsPushed[Direction.top] = null;
                event.preventDefault();
                break;
            case controls.down:
                this.controlsPushed[Direction.bottom] = null;
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /**
     * Обработчик удержания кнопок направления.
     */
    private moveEvent():void {
        const controlsPushed = this.controlsPushed;

        // Если какое-либо направление нажато достаточно долго, то двигаем танк.
        const filteredArray = controlsPushed.filter(item => item !== null);
        const maxTime = Math.max(...filteredArray);
        if (maxTime > Config.moveDelay) {
            const direction = controlsPushed.indexOf(maxTime);
            this.move(direction);
        }
        
        // Увеличиваем время нажатия каждого из направлений.
        controlsPushed.forEach(function (value, key) {
            if (controlsPushed[key] !== null) {
                controlsPushed[key] += 1000 / Config.fps;
            }
        });
    }
}