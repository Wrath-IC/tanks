/**
 * @class Bush
 * Фоновое препятствие "кусты".
 */

// import {Config} from "../../Config.ts";
import {BackgroundObject} from "../BackgroundObject.ts";
// import {ObstacleType} from "../../Enums.ts";
// import {Location} from "../../Types.ts";
// import {Grid} from "../../Grid.ts";
// import {Bullet} from "../projectiles/Bullet.ts";

export class Bush extends BackgroundObject {
    /**
     * Создает иконку кустов.
     */
    protected createIcon():HTMLElement {
        const icon:HTMLElement = document.createElement('div');
        icon.classList.add('bush');
        icon.innerHTML = '<div></div><div></div><div></div><div></div>';
        return icon;
    }
}