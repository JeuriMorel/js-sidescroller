class Boss_Phase {
    constructor(phase) {
        this.phase = phase
    }
}

export class Phase_One extends Boss_Phase {
    constructor(boss) {
        super("Phase_One")
        this.boss = boss
        this.boss.fps = 20
        this.boss.frameInterval = 1000 / this.boss.fps
        this.boss.attacks = ["TONGUE_ATTACK", "JUMP_ATTACK"]
        this.boss.sizeModifier = 0.6
    }
}
export class Phase_Two extends Boss_Phase {
    constructor(boss) {
        super("Phase_Two")
        this.boss = boss
        this.boss.fps = 30
        this.boss.frameInterval = 1000 / this.boss.fps
        this.boss.attacks = ["TONGUE_ATTACK"]
        this.boss.sizeModifier = 0.8
        this.boss.width = this.boss.spriteWidth * this.boss.sizeModifier
        this.boss.height = this.boss.spriteHeight * this.boss.sizeModifier
        this.boss.idleXOffsetModifier = 0.25
        this.boss.y =
            this.boss.game.height -
            this.boss.height * this.boss.spriteGroundOffsetModifier -
            this.boss.game.groundMargin
    }
}
