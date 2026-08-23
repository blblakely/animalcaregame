export class EconomySystem {
  constructor(){ this.money=120; this.reputation=1; this.adoptions=0; }
  canAfford(cost){ return this.money>=cost; }
  spend(cost){ if(!this.canAfford(cost)) return false; this.money-=cost; return true; }
  adoption(score){ const reward=Math.round(28+score*.42); this.money+=reward; this.adoptions++; this.reputation=Math.min(5,+(this.reputation+(score>=75?.25:score>=50?.12:.04)).toFixed(2)); return reward; }
}

