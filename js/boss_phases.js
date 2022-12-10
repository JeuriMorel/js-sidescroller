class Boss_Phase {
    constructor(phase) {
        this.phase = phase
    }
}

export class Phase_One extends Boss_Phase {
    constructor(boss) {
        super("Phase_One")
        this.boss = boss
        this.boss.attacks = ["TONGUE_ATTACK"]
        this.boss.defence = 10
    }
}
export class Phase_Two extends Boss_Phase {
    constructor(boss) {
        super("Phase_Two")
        this.boss = boss
        this.boss.attackIntervals = [1000, 2000, 1500]
        this.boss.attacks = ["TONGUE_ATTACK", "JUMP_ATTACK"]
        this.boss.defence = 12
    }
}
export class Phase_Three extends Boss_Phase {
    constructor(boss) {
        super("Phase_Three")
        this.boss = boss
        this.boss.attacks = ["TONGUE_ATTACK", "JUMP_ATTACK"]
        this.boss.attackIntervals = [500, 1000, 750]
        this.boss.defence = 15
    }
}
