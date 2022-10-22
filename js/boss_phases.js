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
        this.boss.attacks = ["TONGUE_ATTACK"]
        this.boss.sizeModifier = 0.6
        this.boss.defence = 10
    }
}
export class Phase_Two extends Boss_Phase {
    constructor(boss) {
        super("Phase_Two")
        this.boss = boss
        this.boss.fps = 30
        this.boss.frameInterval = 1000 / this.boss.fps
        this.boss.attackIntervals = [2000, 3000]
        this.boss.attacks = ["TONGUE_ATTACK", "JUMP_ATTACK"]
        this.boss.defence = 12
    }
}
export class Phase_Three extends Boss_Phase {
    constructor(boss) {
        super("Phase_Three")
        this.boss = boss
        this.boss.fps = 60
        this.boss.frameInterval = 1000 / this.boss.fps
        this.boss.attacks = ["TONGUE_ATTACK", "JUMP_ATTACK"]
        this.boss.defence = 15
    }
}
