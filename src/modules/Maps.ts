/**
 * Карты поля боя.
 */

import {MapConfig} from "./Types.ts";
import {MapObjectType as o, FoeType as f} from "./Enums.ts";

export const Maps:Readonly<MapConfig[]> = [
    {
        size: {x:13, y:13},
        objects: [
            {objectType:o.spawnFoe, location:{x:0, y:0}},
            {objectType:o.spawnFoe, location:{x:6, y:0}},
            {objectType:o.spawnFoe, location:{x:12, y:0}},
            {objectType:o.spawnFirstPlayer, location:{x:4, y:12}},
            {objectType:o.spawnSecondPlayer, location:{x:8, y:12}},
            {objectType:o.eagle, location:{x:6, y:12}},

            {objectType:o.brick, location:{x:5, y:12}},
            {objectType:o.brick, location:{x:5, y:11}},
            {objectType:o.brick, location:{x:6, y:11}},
            {objectType:o.brick, location:{x:7, y:11}},
            {objectType:o.brick, location:{x:7, y:12}},

            {objectType:o.brick, location:{x:1, y:1}},
            {objectType:o.brick, location:{x:1, y:2}},
            {objectType:o.brick, location:{x:1, y:3}},
            {objectType:o.brick, location:{x:1, y:4}},
            {objectType:o.brick, location:{x:3, y:1}},
            {objectType:o.brick, location:{x:3, y:2}},
            {objectType:o.brick, location:{x:3, y:3}},
            {objectType:o.brick, location:{x:3, y:4}},
            {objectType:o.brick, location:{x:5, y:1}},
            {objectType:o.brick, location:{x:5, y:2}},
            {objectType:o.brick, location:{x:5, y:3}},
            {objectType:o.ceramic, location:{x:6, y:3}},
            {objectType:o.brick, location:{x:7, y:1}},
            {objectType:o.brick, location:{x:7, y:2}},
            {objectType:o.brick, location:{x:7, y:3}},
            {objectType:o.brick, location:{x:9, y:1}},
            {objectType:o.brick, location:{x:9, y:2}},
            {objectType:o.brick, location:{x:9, y:3}},
            {objectType:o.brick, location:{x:9, y:4}},
            {objectType:o.brick, location:{x:11, y:1}},
            {objectType:o.brick, location:{x:11, y:2}},
            {objectType:o.brick, location:{x:11, y:3}},
            {objectType:o.brick, location:{x:11, y:4}},
            {objectType:o.ceramic, location:{x:0, y:6}},
            {objectType:o.ceramic, location:{x:12, y:6}},
            {objectType:o.brick, location:{x:2, y:6}},
            {objectType:o.brick, location:{x:3, y:6}},
            {objectType:o.brick, location:{x:9, y:6}},
            {objectType:o.brick, location:{x:10, y:6}},
            {objectType:o.brick, location:{x:1, y:8}},
            {objectType:o.brick, location:{x:1, y:9}},
            {objectType:o.brick, location:{x:1, y:10}},
            {objectType:o.brick, location:{x:1, y:11}},
            {objectType:o.brick, location:{x:3, y:8}},
            {objectType:o.brick, location:{x:3, y:9}},
            {objectType:o.brick, location:{x:3, y:10}},
            {objectType:o.brick, location:{x:3, y:11}},
            {objectType:o.brick, location:{x:9, y:8}},
            {objectType:o.brick, location:{x:9, y:9}},
            {objectType:o.brick, location:{x:9, y:10}},
            {objectType:o.brick, location:{x:9, y:11}},
            {objectType:o.brick, location:{x:11, y:8}},
            {objectType:o.brick, location:{x:11, y:9}},
            {objectType:o.brick, location:{x:11, y:10}},
            {objectType:o.brick, location:{x:11, y:11}},
            {objectType:o.brick, location:{x:5, y:7}},
            {objectType:o.brick, location:{x:5, y:8}},
            {objectType:o.brick, location:{x:5, y:9}},
            {objectType:o.brick, location:{x:7, y:7}},
            {objectType:o.brick, location:{x:7, y:8}},
            {objectType:o.brick, location:{x:7, y:9}},
            {objectType:o.brick, location:{x:6, y:8}}
        ],
        foes: [
            f.simple, f.simple, f.simple, f.fast, f.fast,
            f.simple, f.simple, f.simple, f.rapid, f.rapid,
            f.simple, f.fast, f.simple, f.armor, f.simple,
            f.fast, f.rapid, f.fast, f.armor, f.armor,
        ]
    },
    {
        size: {x:13, y:13},
        objects: [
            {objectType:o.spawnFoe, location:{x:0, y:0}},
            {objectType:o.spawnFoe, location:{x:6, y:0}},
            {objectType:o.spawnFoe, location:{x:12, y:0}},
            {objectType:o.spawnFirstPlayer, location:{x:4, y:12}},
            {objectType:o.spawnSecondPlayer, location:{x:8, y:12}},
            {objectType:o.eagle, location:{x:6, y:12}},

            {objectType:o.brick, location:{x:5, y:12}},
            {objectType:o.brick, location:{x:5, y:11}},
            {objectType:o.brick, location:{x:6, y:11}},
            {objectType:o.brick, location:{x:7, y:11}},
            {objectType:o.brick, location:{x:7, y:12}},

            {objectType:o.water, location:{x:4, y:4}},
            {objectType:o.water, location:{x:5, y:4}},
            {objectType:o.water, location:{x:4, y:5}},
            {objectType:o.water, location:{x:5, y:5}},
        ],
        foes: [
            f.simple, f.simple, f.simple, f.fast, f.fast,
            f.simple, f.simple, f.simple, f.rapid, f.rapid,
            f.simple, f.fast, f.simple, f.armor, f.simple,
            f.fast, f.rapid, f.fast, f.armor, f.armor,
        ]
    },
    {
        size: {x:13, y:13},
        objects: [
            {objectType:o.spawnFoe, location:{x:0, y:0}},
            {objectType:o.spawnFoe, location:{x:6, y:0}},
            {objectType:o.spawnFoe, location:{x:12, y:0}},
            {objectType:o.spawnFirstPlayer, location:{x:4, y:12}},
            {objectType:o.spawnSecondPlayer, location:{x:8, y:12}},
            {objectType:o.eagle, location:{x:6, y:12}},

            {objectType:o.brick, location:{x:5, y:12}},
            {objectType:o.brick, location:{x:5, y:11}},
            {objectType:o.brick, location:{x:6, y:11}},
            {objectType:o.brick, location:{x:7, y:11}},
            {objectType:o.brick, location:{x:7, y:12}},

            {objectType:o.water, location:{x:4, y:4}},
            {objectType:o.water, location:{x:5, y:4}},
            {objectType:o.water, location:{x:4, y:5}},
            {objectType:o.water, location:{x:5, y:5}},
            {objectType:o.bush, location:{x:6, y:6}},
            {objectType:o.bush, location:{x:6, y:7}},
            {objectType:o.bush, location:{x:7, y:6}},
            {objectType:o.bush, location:{x:7, y:7}},
        ],
        foes: [
        
        ]
    }
];