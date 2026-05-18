/**
 * @class StartScreen
 * Стартовый экран.
 */

import {StartMenu, ControlsFirst, ControlsSecond} from "./Enums.ts";
import {Grid} from "./Grid.ts";
import {Helper} from "./Helper.ts";
import {Maps} from "./Maps.ts";

export class StartScreen {
    /**
     * Основной DOM-элемент.
     */
    public readonly el:HTMLElement;

    /**
     * Функция обработки нажития клавиш.
     */
    private controlEvent:((event:KeyboardEvent) => void)|null = null;

    /**
     * Количество пунктов меню.
     */
    // todo Вычислить на основе emun StartMenu.
    private itemsNum:number = 2;

    /**
     * Выбранный уровень.
     */
    private level:number = 0;

    /**
     * Количество уровней.
     */
    private levelsNum:number;

    /**
     * Выбранный пункт меню.
     */
    private selectedItem:StartMenu|null = null;

    /**
     * Конструктор.
     */
    public constructor() {
        this.el = this.createElement();

        // Выбирает первый пункт меню.
        this.select(StartMenu.onePlayer);

        // Инициализируем управление.
        this.initControls();

        // Записываем общее количество уровней.
        this.levelsNum = Maps.length;
        // Отображаем количиство уровней.
        this.levelApply();

        // Размещаем элемент в DOM-е.
        Helper.fillBody(this.el);
        
        // todo destroy: deinitControls
    }

    /**
     * Создает основной DOM-элемент.
     */
    private createElement():HTMLElement {
        const el:HTMLElement = document.createElement('div');
        const icon:string = this.createIcon();
        el.setAttribute('id', 'startscreen');

        el.innerHTML = '<div class="title"><p>Танчики</p></div>' +
            '<div class="level"><p>Уровень 1</p></div>' +
            '<div class="row">' + icon + '<div class="text"><p>1 игрок</p></div></div>' +
            '<div class="row">' + icon + '<div class="text"><p>2 игрока</p></div></div>';

        return el;
    }

    /**
     * Создает иконку танка. Иконка состоит из двух гусениц, тела, дула и декора.
     */
    private createIcon():string {
        return '<div class="icon">' +
            '<div class="lwheel"></div>' +
            '<div class="rwheel"></div>' +
            '<div class="body"></div>' +
            '<div class="barrel"></div>' +
            '<div class="decor"></div>' +
            '</div>';
    }

    /**
     * Выбирает активным пункт меню.
     * @param num Номер пункта меню.
     */
    private select(num:StartMenu):void {
        const el = this.el;
        const rows = [...el.childNodes]
            .map((item) => item as HTMLElement)
            .filter((item) => item.classList.contains('row'));
        
        if (num < rows.length) {
            // Убираем у всех элементов класс выбранного пункта меню.
            rows.forEach((row) => {row.classList.remove('selected');});
            // Добавляем нужному элементу класс выбранного пункта меню.
            rows[num].classList.add('selected');
            // Фиксируем выбранный пункт меню в объекте.
            this.selectedItem = num;
        }
    }

    /**
     * Инициализирует управление.
     */
    private initControls():void {
        const me = this;
        const controlEventKeyDown = this.controlEventKeyDown.bind(this);

        // Событие нажатия на кнопку.
        window.addEventListener('keydown', controlEventKeyDown);
        this.controlEvent = controlEventKeyDown;
    }

    /**
     * Снимает событие клавиш управления.
     */
    private removeControls():void {
        const controlEvent = this.controlEvent;
        controlEvent && window.removeEventListener('keydown', controlEvent);
    }

    /**
     * Обработчик нажатий на кнопки.
     * @param event Событие нажатия на клавишу.
     */
    private controlEventKeyDown(event:KeyboardEvent):void {
        const keyCode = event.keyCode;

        switch (keyCode) {
            case ControlsFirst.up:
            case ControlsSecond.up:
                this.previousItem();
                event.preventDefault();
                break;
            case ControlsFirst.down:
            case ControlsSecond.down:
                this.nextItem();
                event.preventDefault();
                break;
            case ControlsFirst.left:
            case ControlsSecond.left:
                this.previousLevel();
                event.preventDefault();
                break;
            case ControlsFirst.right:
            case ControlsSecond.right:
                this.nextLevel();
                event.preventDefault();
                break;
            case ControlsFirst.shoot:
            case ControlsSecond.shoot:
                this.selectItem();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /**
     * Переход к следующему пункту меню.
     */
    private nextItem():void {
        let next = (this.selectedItem as number) + 1;
        if (next >= this.itemsNum) {
            next = 0;
        }

        this.select(next);
    }

    /**
     * Переход к предыдущему пункту меню.
     */
    private previousItem():void {
        let previous = (this.selectedItem as number) - 1;
        if (previous < 0) {
            previous = this.itemsNum - 1;
        }

        this.select(previous);
    }

    /**
     * Отображает номер уровня на экране.
     */
    private levelApply():void {
        const el = this.el.getElementsByClassName('level')[0];
        el.innerHTML = '<p>Уровень ' + (this.level + 1) + '</p>'
    }

    /**
     * Переключает на следующий уровень.
     */
    private nextLevel():void {
        this.level++;
        if (this.level >= this.levelsNum) {
            this.level = 0;
        }
        this.levelApply();
    }

    /**
     * Переключает на предыдущий уровень.
     */
    private previousLevel():void {
        this.level--;
        if (this.level < 0) {
            this.level = this.levelsNum - 1;
        }
        this.levelApply();
    }

    /**
     * Выбор пункта меню игроком.
     */
    private selectItem():void {
        switch (this.selectedItem) {
            case StartMenu.onePlayer:
                this.startGame(1);
                this.destroy();
                break;
            case StartMenu.twoPlayers:
                this.startGame(2);
                this.destroy();
                break;
            default:
                break;
        }
    }

    /**
     * Начинает игру.
     * @param palyers Количество игроков.
     */
    private startGame(palyers:number):void {
        new Grid(this.level, palyers);
    }

    /**
     * Деструктор компонента.
     */
    private destroy() {
        this.removeControls();
    }
}