/**
 * @class AbstractObstacle
 * Абстрактный класс препятствия.
 */

import {SolidObject} from "../SolidObject.ts";
import {Config} from "../../Config.ts";
import {ObstacleType} from "../../Enums.ts";
import {ObstacleConfig, Location} from "../../Types.ts";
import {Grid} from "../../Grid.ts";

export abstract class AbstractObstacle extends SolidObject {
    /**
     * Тип препятствия.
     */
    public abstract readonly obstacleType:ObstacleType;

    /**
     * Метод, устанавливающий CSS-класс для иконки.
     */
    protected setIconCls():void {
        this.icon.setAttribute('class', Config.obstacle[this.obstacleType].cls);
    }
}
