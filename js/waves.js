import { AngryEgg, Bee, Crawler, Ghost, PumpKing } from "./enemies.js"

const ENEMY_TYPES = {
    ANGRY_EGG: 0,
    CRAWLER: 1,
    BEE: 2,
    GHOST: 3,
    PUMPKIN: 4,
}

const ENEMIES_FETCH_ARRAY = [
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


class Wave {
    constructor(game) {
        this.game = game
    }

    getEnemy(enemyType) {
        return ENEMIES_FETCH_ARRAY[enemyType]
    }

    enemyToGetIsBee(enemy) {
        return enemy === ENEMY_TYPES.BEE
    }
    enemyToGetIsCrawler(enemy) {
        return enemy === ENEMY_TYPES.CRAWLER
    }

    addBees() {
        let numberOfBees = Math.floor(Math.random() * 3 + 1)
        for (let i = 0; i <= numberOfBees; i++) {
            this.game.enemies.push(new Bee(this.game))
        }
    }

    crawlerIsInArray() {
        return this.game.enemies.some(enemy => enemy.enemyName === "Crawler")
    }

    addEnemy() {
        let enemyToGet =
            this.game.availableEnemiesList[
                Math.floor(
                    Math.random() * this.game.availableEnemiesList.length
                )
            ]

        if (this.enemyToGetIsBee(enemyToGet)) {
            this.addBees()
            return
        }
        if (this.enemyToGetIsCrawler(enemyToGet) && this.crawlerIsInArray()) {
            this.addEnemy()
            return
        }
        let enemyRetrievalFunction = this.getEnemy(enemyToGet)
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
    
}

export class Wave_One extends Wave{
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [ENEMY_TYPES.ANGRY_EGG]
        this.game.maxEnemies = 1
        this.game.enemyFrequency = 2000
    }
}
export class Wave_Two extends Wave{
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.ANGRY_EGG,
            ENEMY_TYPES.GHOST,
        ]
        this.game.maxEnemies = 2
        this.game.enemyFrequency = 2000
    }
}
export class Wave_Three extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [ENEMY_TYPES.CRAWLER]
        this.game.maxEnemies = 1
        this.game.enemyFrequency = 2000
    }

    addEnemy() {
        let enemyRetrievalFunction = ENEMIES_FETCH_ARRAY[ENEMY_TYPES.CRAWLER]
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
}
export class Wave_Four extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.CRAWLER,
            ENEMY_TYPES.ANGRY_EGG,
            ENEMY_TYPES.GHOST,
        ]
        this.game.maxEnemies = 4
        this.game.enemyFrequency = 3500
    }
}
export class Wave_Five extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [ENEMY_TYPES.PUMPKIN]
        this.game.maxEnemies = 1
        this.game.enemyFrequency = 2000
    }

    addEnemy() {
        let enemyRetrievalFunction = ENEMIES_FETCH_ARRAY[ENEMY_TYPES.PUMPKIN]
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
}
export class Wave_Six extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.GHOST,
        ]
        this.game.maxEnemies = 3
        this.game.enemyFrequency = 2500
    }
}
export class Wave_Seven extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.CRAWLER,
        ]
        this.game.maxEnemies = 3
        this.game.enemyFrequency = 2500
    }
}
export class Wave_Eight extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.BEE,
            ENEMY_TYPES.GHOST,
        ]
        this.game.maxEnemies = 4
        this.game.enemyFrequency = 2500
    }
}
export class Wave_Nine extends Wave {
    constructor(game) {
        super(game)
        this.game.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.BEE,
            ENEMY_TYPES.CRAWLER,
        ]
        this.game.maxEnemies = 45
        this.game.enemyFrequency = 2500
    }
}
