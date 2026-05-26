/**
 * @class Helper
 * Статический класс с полезными методами.
 */

import {Direction} from "./Enums.ts";
import {Location} from "./Types.ts";
import {Config} from "./Config.ts";

export class Helper {
    private constructor () {}

    /**
     * Вычисляет следующее положение объекта исходя из направления движения.
     * @param oldLocation Изначальное положение.
     * @param direction Направление движения.
     */
    public static countNewLocation(oldLocation:Location, direction:Direction):Location {
        let newX = oldLocation.x;
        let newY = oldLocation.y;
        
        switch (direction) {
            case Direction.left:
                newX--;
                break;
            case Direction.right:
                newX++;
                break;
            case Direction.top:
                newY--;
                break;
            case Direction.bottom:
                newY++;
                break;
            default:
                break;
        }
        
        return {x:newX, y:newY};
    }

    /**
     * Размещает элемент в теге body.
     * @param el Размещаемый элемент.
     */
    public static fillBody (el:HTMLElement):void {
        const body:HTMLElement = document.getElementById('body') as HTMLElement;
        body.innerHTML = '';
        body.append(el);
    }
}