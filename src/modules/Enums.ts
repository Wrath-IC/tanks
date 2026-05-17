/**
 * Общие списки.
 */
// Пункты меню на стартовом экране.
export enum StartMenu {
    onePlayer = 0,
    twoPlayers = 1
}
// Направление. Порядок строго фиксированный, поскольку используется для css-вращений.
export enum Direction {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
}
// Тип противника.
export enum FoeType {
    simple,
    fast,
    rapid,
    armor
}
// Тип препятствия.
export enum ObstacleType {
    ceramic,
    brick,
    water
}
// Тип снаряда.
export enum BulletType {
    player,
    foe
}
// Клавиши управления первого игрока.
export enum ControlsFirst {
    left = 65,
    right = 68,
    up = 87,
    down = 83,
    shoot = 32
}
// Клавиши управления второго игрока.
export enum ControlsSecond {
    left = 75,
    right = 186,
    up = 79,
    down = 76,
    shoot = 13
}
// Тип спаунера.
export enum SpawnType {
    foe,
    firstPlayer,
    secondPlayer
}
// Типы объектов карты.
export enum MapObjectType {
    spawnFoe,
    spawnFirstPlayer,
    spawnSecondPlayer,
    brick,
    ceramic,
    water
}