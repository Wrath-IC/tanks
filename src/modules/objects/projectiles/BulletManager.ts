/**
 * @class BulletManager
 * Класс, управляющий взаимодействием снарядов.
 */

import {Bullet} from "./Bullet.ts";
import {BulletType} from "../../Enums.ts";

export class BulletManager {
    private constructor() {};

    /**
     * Максимальная дальность, при которой пули отменяют друг друга.
     */
    private static bulletCollapseRadius:number = 3;

    /**
     * Список всех зарегистрированных снарядов.
     */
    private static bullets:Bullet[] = [];
    
    /**
     * Обработчик добавления снаряда.
     * @param bullet Снаряд.
     */
    public static addBullet(bullet:Bullet):void {
        if (BulletManager.bullets.indexOf(bullet) === -1) {
            BulletManager.bullets.push(bullet);
        }
    }

    /**
     * Обработчик уничтожения снаряда.
     * @param bullet Снаряд.
     */
    public static removeBullet(bullet:Bullet):void {
        const index = BulletManager.bullets.indexOf(bullet);
        
        if (index !== -1) {
            BulletManager.bullets.splice(index, 1);
        }
    }

    /**
     * Уничтожает все снаряды.
     * @param bullet Снаряд.
     */
    public static removeAllBullets():void {
        const bullets = [...this.bullets];
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].destroy(true);
        }
    }

    /**
     * Обработчик передвижения снаряда.
     * @param bullet Снаряд.
     */
    public static moveBullet(bullet:Bullet):void {
        const bulletType:BulletType = bullet.bulletType;
        const bullets:Bullet[] = BulletManager.bullets;
        const collapseBullets:Bullet[] = [];
        
        // Находим все снаряды, не относящиеся к данному типу снаряда и
        // располагающиеся достаточно близко к данному снаряду.
        bullets.forEach(function (testBullet) {
            const diffX = bullet.coordinates.x - testBullet.coordinates.x;
            const diffY = bullet.coordinates.y - testBullet.coordinates.y;
            if (
                testBullet.bulletType !== bulletType &&
                Math.abs(diffX) + Math.abs(diffY) <= BulletManager.bulletCollapseRadius
            ) {
                collapseBullets.push(testBullet);
            }
        });
        
        // Если найдены близкие пули, уничтожаем их все.
        if (collapseBullets.length) {
            bullet.destroy(true);
            collapseBullets.forEach(function (bullet) {
                bullet.destroy(true);
            });
        }
    }
}