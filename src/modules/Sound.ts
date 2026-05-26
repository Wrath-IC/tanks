/**
 * @class Sound
 * Статический класс, отвечающий за воспроизведение звука.
 */

import {Config} from "./Config.ts";
import {SoundType} from "./Enums.ts";

export class Sound {
    private constructor () {}

    /**
     * Воспроизводит звук.
     * @param sound Тип воспроизводимого звука.
     */
    public static play(soundType:SoundType) {
        const dir = Config.Sound.dir;
        const {file, repeat, volume} = Config.Sound.config[soundType];
        
        const sound = new Audio(dir + file);
        sound.loop = repeat;
        sound.volume = volume;
        sound.play();
    }
}