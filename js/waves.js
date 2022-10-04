import { AngryEgg, Bee, Crawler, Ghost, PumpKing } from "./enemies.js"

export const ENEMY_TYPES = {
    ANGRY_EGG: 0,
    CRAWLER: 1,
    BEE: 2,
    GHOST: 3,
    PUMPKIN: 4,
}

export const ENEMIES_FETCH_ARRAY = [
    function (game) {
        return new AngryEgg(game)
    },
    function (game) {
        return new Crawler(game)
    },
    function (game) {
        return new Bee(game)
    },
    function (game) {
        return new Ghost(game)
    },
    function (game) {
        return new PumpKing(game)
    },
]

export function getEnemy(enemyType) {
    return ENEMIES_FETCH_ARRAY[enemyType]
}

export class Wave_One {
    constructor(game) {
        this.game = game
        this.game.availableEnemiesList = [ENEMY_TYPES.ANGRY_EGG]
        this.game.maxEnemies = 1
        this.game.enemyFrequency = 3500
    }
}
