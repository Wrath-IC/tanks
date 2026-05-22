/**
 * @class Game
 * Класс, отвечающий за геймплей: подсчет жизней, смену уровня, геймовер.
 */

import {Player} from "./objects/tanks/Player.ts";
import {Config} from "./Config.ts";
import {Grid} from "./Grid.ts";
import {StartScreen} from "./StartScreen.ts";

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
        
        // Обновляем экран статистики на уровне.
        this.level && this.level.refreshStat();
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
    private static isLevel(level:Grid):boolean {
        return level === this.level;
    }

    /**
     * Проверяет, играется ли в данный момент переданный уровень. Считаем, что
     * уровень играется, если не перешли на другой уровень и не получили геймовер.
     * @param level Уровень.
     */
    public static isLevelPlaying(level:Grid):boolean {
        return Game.isLevel(level) && !Game.isGameOver;
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
            Game.gameOverScreen();
        }
    }

    /**
     * Вывод экрана геймовера.
     */
    private static gameOverScreen():void {
        const screen:HTMLElement = document.createElement('div');
        screen.classList.add('gameover');
        const screenInner = document.createElement('div');
        screenInner.innerHTML = '<p>GAME</p><p>OVER</p>';
        screen.append(screenInner);
        
        const grid = this.level && this.level.el;
        if (!grid) {
            return;
        }
        screen.style.width = `${grid.offsetWidth}px`;
        screen.style.height = `${grid.offsetHeight}px`;
        grid.parentNode && grid.parentNode.append(screen);
        
        // Анимация экрана.
        // Отступ слева.
        const left = (grid.offsetWidth - screenInner.offsetWidth) / 2;
        // Отступ сверху в начале анимации.
        const topStart = grid.offsetHeight;
        // Отступ сверху в конце анимации.
        const topEnd = (grid.offsetHeight - screenInner.offsetHeight) / 2;
        const animateConfig = { top: [`${topStart}px`, `${topEnd}px`] };
        const duration = Config.gameOverScreenDuration;
        screenInner.style.left = `${left}px`;
        screenInner.animate(animateConfig, {
            duration: duration,
            iterations: 1,
            fill: 'forwards'
        }).onfinish = function () {
            // Завершение уровня после геймовера.
            window.setTimeout(function () {
                // Убираем экран геймовера.
                const parent = screen.parentNode;
                parent && parent.removeChild(screen);
                // Запускаем процедуру перехода к стартовому экрану.
                Game.startScreen();
            }, Config.gameOverScreenTime);
        };
    }

    /**
     * Возвращение на стартовый экран.
     */
    private static startScreen():void {
        // Уничтожаем уровень.
        Game.level && Game.level.destroy();

        // Открываем стартовый экран.
        new StartScreen();
    }

    /**
     * Возвращает текущее количество игроков.
     */
    public static getPlayerNum():number {
        return Game.lives ? Game.lives.length : 1;
    }

    /**
     * Возвращает текущее количество жизней у игрока.
     * @param {player} Номер игрока.
     */
    public static getPlayerLives(player:number):number {
        return Game.lives && Game.lives.length > player ? Game.lives[player] : 0;
    }
}