/**
 * @class Game
 * Класс, отвечающий за геймплей: подсчет жизней, смену уровня, геймовер.
 */

import {Player} from "./objects/tanks/Player.ts";
import {Config} from "./Config.ts";
import {Grid} from "./Grid.ts";

export class Game {
    private constructor() {};

    /**
     * Количество жизней у игроков.
     */
    private static lives:Array<number>|null = null;

    /**
     * Текущий уровень.
     */
    private static level:Grid|null = null;

    /**
     * Получен ли геймовер.
     */
    private static isGameOver:boolean = false;

    /**
     * Запускает новую игру.
     * @param level Номер начального уровня.
     * @param players Количество игроков.
     */
    public static newGame(level:number, players:number):void {
        // Добавляем игрокам жизни.
        Game.lives = Array(players).fill(Config.lives);
        // Записываем, что еще не наступил геймовер.
        Game.isGameOver = false;
        // Создаем поле боя.
        Game.level = new Grid(level, players);
    }

    /**
     * Обрабатывает уничтожение танка - уменьшает количество жизней.
     * @param playerNum Номер игрока.
     */
    public static destroyTank(playerNum:number):void {
        if (Game.lives && playerNum < Game.lives.length) {
            Game.lives[playerNum]--;
        }

        if (Game.lives) {
            const livesSum = Game.lives
                // Если вдруг у какого-либо игрока меньше нуля жизней, приводим к нулю.
                .map((lives) => lives < 0 ? 0 : lives)
                // Считаем сумму.
                .reduce((acc, curr) => acc + curr, 0);

            // Если в сумме у игроков осталось ноль жизней, обявляем геймовер.
            !livesSum && Game.gameOver();
        }
    }

    /**
     * Проверяет, есть ли у игрока еще жизни.
     * @param playerNum Номер игрока.
     */
    public static hasLifes(playerNum:number):boolean {
        return !!(Game.lives && playerNum < Game.lives.length && Game.lives[playerNum] > 0);
    }

    /**
     * Проверяет, является ли переданный уровень текущим. Нужно для некоторых
     * отложенных действий чтобы проверить, не перешли ли мы на следующий уровень.
     * @param level Уровень.
     */
    public static isLevel(level:Grid):boolean {
        return level === this.level;
    }

    /**
     * Обрабатывает уничтожение орла.
     */
    public static destroyEagle():void {
        Game.gameOver();
    }

    /**
     * Обработка геймовера.
     */
    private static gameOver():void {
        if (!Game.isGameOver) {
            Game.isGameOver = true;
            console.log('gameOver');
            // todo Реализовать геймовер.
        }
    }
}