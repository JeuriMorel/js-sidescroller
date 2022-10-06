import { AngryEgg, Bee, Crawler, Ghost, PumpKing } from "./enemies.js"

const ENEMY_TYPES = {
    ANGRY_EGG: 0,
    CRAWLER: 1,
    BEE: 2,
    GHOST: 3,
    PUMPKIN: 4,
}

const WAVES = {
    ONE: 0,
    TWO: 1,
    THREE: 2,
    FOUR: 3,
    FIVE: 4,
    SIX: 5,
    SEVEN: 6,
    EIGHT: 7,
    NINE: 8,
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
            this.availableEnemiesList[
                Math.floor(Math.random() * this.availableEnemiesList.length)
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
    
    enter() {
        let { UI } = this.game
        console.log(UI.progressIcons)
    }
    exit() {
        console.log(this.game.UI.progressIcons, this.waveIndex)
        this.game.currentWave = this.game.waves[this.nextWave]
        this.game.currentWave.enter()
        // this.game.UI.progressIcons[this.waveIndex].waveCompleted = true
    }
}

export class Wave_One extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.ANGRY_EGG]
        this.enemiesToDefeat = 10
        this.maxEnemies = 1
        this.enemyFrequency = 500
        this.waveIndex = WAVES.ONE
        this.nextWave = WAVES.TWO
        
    }
    
}
export class Wave_Two extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.ANGRY_EGG, ENEMY_TYPES.GHOST]
        this.enemiesToDefeat = 10 //30
        this.maxEnemies = 2
        this.enemyFrequency = 1000
        this.waveIndex = WAVES.TWO
        this.nextWave = WAVES.THREE
        
    }
}
export class Wave_Three extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.CRAWLER]
        this.enemiesToDefeat = 30
        this.maxEnemies = 1
        this.enemyFrequency = 500
        this.waveIndex = WAVES.THREE
        this.nextWave = WAVES.FOUR
        
    }

    addEnemy() {
        let enemyRetrievalFunction = ENEMIES_FETCH_ARRAY[ENEMY_TYPES.CRAWLER]
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
}
export class Wave_Four extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [
            ENEMY_TYPES.CRAWLER,
            ENEMY_TYPES.ANGRY_EGG,
            ENEMY_TYPES.GHOST,
        ]
        this.enemiesToDefeat = 45
        this.maxEnemies = 4
        this.enemyFrequency = 1500
        this.waveIndex = WAVES.FOUR
        this.nextWave = WAVES.FIVE
        
    }
}
export class Wave_Five extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.PUMPKIN]
        this.enemiesToDefeat = 40
        this.maxEnemies = 1
        this.enemyFrequency = 500
        this.waveIndex = WAVES.FIVE
        this.nextWave = WAVES.SIX
        
    }

    addEnemy() {
        let enemyRetrievalFunction = ENEMIES_FETCH_ARRAY[ENEMY_TYPES.PUMPKIN]
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
}
export class Wave_Six extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.PUMPKIN, ENEMY_TYPES.GHOST]
        this.enemiesToDefeat = 50
        this.maxEnemies = 3
        this.enemyFrequency = 2500
        this.waveIndex = WAVES.SIX
        this.nextWave = WAVES.SEVEN
        
    }
}
export class Wave_Seven extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.PUMPKIN, ENEMY_TYPES.CRAWLER]
        this.enemiesToDefeat = 40
        this.maxEnemies = 3
        this.enemyFrequency = 2500
        this.waveIndex = WAVES.SEVEN
        this.nextWave = WAVES.EIGHT
        
    }
}
export class Wave_Eight extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.BEE,
            ENEMY_TYPES.GHOST,
        ]
        this.enemiesToDefeat = 40
        this.maxEnemies = 4
        this.enemyFrequency = 2500
        this.waveIndex = WAVES.EIGHT
        this.nextWave = WAVES.NINE
        
    }
}
export class Wave_Nine extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [
            ENEMY_TYPES.PUMPKIN,
            ENEMY_TYPES.BEE,
            ENEMY_TYPES.CRAWLER,
        ]
        this.enemiesToDefeat = 60
        this.maxEnemies = 5
        this.enemyFrequency = 2500
        this.waveIndex = WAVES.NINE
        this.nextWave = WAVES.TWO
        
    }
    exit() {
        console.log("time to fight the bossy boss")
    }
}
