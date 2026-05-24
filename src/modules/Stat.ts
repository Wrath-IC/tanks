/**
 * @class Stat
 * Панель статистики.
 */

import {Game} from "./Game.ts";
import {FoeSpawn} from "./objects/spawn/FoeSpawn.ts";

export class Stat {
    /**
     * Основной DOM-элемент.
     */
    public readonly el:HTMLElement;

    /**
     * Конструктор.
     * @param mapNum Номер карты
     * @param playerNum Количество игроков.
     */
    public constructor() {
        this.el = this.createPanel();
    }

    /**
     * Создает DOM-элемент панели.
     */
    private createPanel():HTMLElement {
        const panel:HTMLElement = document.createElement('div');
        panel.setAttribute('class', 'stat-panel');
        
        let html = '';
        // Танки противников.
        html += '<div class="foes"></div>';
        // Жизни игроков.
        html += '<div class="lives-block">';
        for (let i = 0; i < Game.getPlayerNum(); i++) {
            html += `<div class="lives lives-${i}"><div class="icon"></div><div class="num"></div></div>`;
        }
        html += '</div>';
        panel.innerHTML = html;

        return panel;
    }

    /**
     * Обновляет экран статистики.
     */
    public refresh():void {
        // Добавляем иконки противников.
        const el = this.el;
        const foesArray = el.getElementsByClassName('foes');
        const foes = foesArray.length ? foesArray[0] : null;
        const foesNum = FoeSpawn.getFoesLeft();
        if (foes) {
            foes.innerHTML = '';
            for (let i = 0; i < foesNum; i++) {
                foes.append(document.createElement('div'));
            }
        }

        // Добавляем жизни игроков.
        const playerNum = Game.getPlayerNum();
        for (let i = 0; i < playerNum; i++) {
            const el = this.el;
            const rowArray = el.getElementsByClassName(`lives-${i}`);
            const row = rowArray.length && rowArray[0];
            if (row) {
                const numArray = row.getElementsByClassName('num');
                const num = numArray.length && numArray[0];
                if (num) {
                    const lives = Game.getPlayerLives(i);
                    num.innerHTML = `<p>${lives > 0 ? lives - 1 : 0}</p>`;
                }
            }
        }
    }
}