import { Armored_Frog } from "./boss.js"
import { AngryEgg, Bee, Crawler, Ghost, PumpKing } from "./enemies.js"

const ENEMY_TYPES = {
    ANGRY_EGG: 0,
    CRAWLER: 1,
    BEE: 2,
    GHOST: 3,
    PUMPKIN: 4,
    ARMORED_FROG: 5,
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
    BOSS: 9,
    WIN: 10,
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
    function (game) {
        return new Armored_Frog(game)
    },
]

class Wave {
    constructor(game) {
        this.game = game
        this.icons = this.game.UI.progressIcons
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
        this.icons[this.waveIndex].isCurrentWave = true
        this.resetPlayerAttackSettings()
        this.game.music.currentTheme.play()
    }
    exit() {
        this.icons[this.waveIndex].isCurrentWave = false
        this.icons[this.waveIndex].waveCompleted = true
        this.game.currentWave = this.game.waves[this.nextWave]
        this.game.currentWave.enter()
    }
    resetPlayerAttackSettings() {
        this.game.player.max_attack_bonus = this.waveIndex + 5
    }
}

export class Wave_One extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.ANGRY_EGG]
        this.enemiesToDefeat = 10
        this.maxEnemies = 1
        this.enemyFrequency = 200
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
        this.enemyFrequency = 500
        this.waveIndex = WAVES.TWO
        this.nextWave = WAVES.THREE
    }
}
export class Wave_Three extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.CRAWLER]
        this.enemiesToDefeat = 15
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
        this.enemyFrequency = 500
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
        this.enemyFrequency = 100
        this.waveIndex = WAVES.FIVE
        this.nextWave = WAVES.SIX
    }

    addEnemy() {
        let enemyRetrievalFunction = ENEMIES_FETCH_ARRAY[ENEMY_TYPES.PUMPKIN]
        this.game.enemies.push(enemyRetrievalFunction(this.game))
    }
    enter() {
        super.enter()
        this.game.music.currentTheme.loop = false
    }
}
export class Wave_Six extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.PUMPKIN, ENEMY_TYPES.GHOST]
        this.enemiesToDefeat = 50
        this.maxEnemies = 3
        this.enemyFrequency = 500
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
        this.enemyFrequency = 500
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
        this.enemiesToDefeat = 10 //40
        this.maxEnemies = 4
        this.enemyFrequency = 500
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
        this.enemiesToDefeat = 5 // 60
        this.maxEnemies = 1 // 5
        this.enemyFrequency = 500
        this.waveIndex = WAVES.NINE
        this.nextWave = WAVES.BOSS
    }

    exit() {
        this.game.music.currentTheme.pause()
        this.game.music.currentTheme = this.game.music.themes.boss
        this.icons[this.waveIndex].isCurrentWave = false
        this.icons[this.waveIndex].waveCompleted = true
        this.game.currentWave = this.game.waves[this.nextWave]
        this.game.currentWave.enter()
    }
}
export class Wave_Boss extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = [ENEMY_TYPES.ARMORED_FROG]
        this.enemiesToDefeat = 0
        this.maxEnemies = 1
        this.enemyFrequency = 500
        this.waveIndex = WAVES.BOSS
        this.nextWave = WAVES.WIN
    }
    enter() {
        this.resetPlayerAttackSettings()
        this.game.enemies.forEach(enemy => (enemy.healthPoints = 0))
        this.game.music.currentTheme.play()
    }
    exit() {
        this.game.currentWave = this.game.waves[this.nextWave]
        this.game.currentWave.enter()
    }
}
export class Wave_Win extends Wave {
    constructor(game) {
        super(game)
        this.availableEnemiesList = []
        this.enemiesToDefeat = 0 // 60
        this.maxEnemies = 0 // 5
        this.enemyFrequency = 0
        this.waveIndex = WAVES.WIN
        this.nextWave = null
    }
    enter() {
        this.resetPlayerAttackSettings()
    }
    exit() {}
}
