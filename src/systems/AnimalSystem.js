const NAMES = ['Biscuit','Luna','Mochi','Pepper','Clover','Waffles','Maple','Pip','Juniper','Teddy','Olive','Bean'];
const TRAITS = ['Friendly','Shy','Playful','Calm','Energetic','Independent'];
const APPEARANCES = {
  Dog:[{id:'golden',coat:0xd59a45,mark:0xf5d99a,ears:'flop'},{id:'black',coat:0x34333b,mark:0xe7d5bd,ears:'flop'},{id:'brown',coat:0x8b5439,mark:0xc98a58,ears:'point'},{id:'spotted',coat:0xeee0c4,mark:0x65493d,ears:'flop'}],
  Cat:[{id:'tuxedo',coat:0x34343b,mark:0xf3ead5,ears:'point'},{id:'tabby',coat:0xd9853f,mark:0x8c4d32,ears:'point'},{id:'gray',coat:0x8b96a0,mark:0xc4cbd0,ears:'point'},{id:'calico',coat:0xf1dfbd,mark:0xc46f42,ears:'point'}],
  Rabbit:[{id:'white',coat:0xf1eee1,mark:0xd8b8ae,ears:'tall'},{id:'brown',coat:0x9b694b,mark:0xd3a47b,ears:'tall'},{id:'spotted',coat:0xeee2cc,mark:0x62544d,ears:'tall'},{id:'gray',coat:0xa5a6a0,mark:0xe4d8ca,ears:'lop'}]
};

export class AnimalSystem {
  constructor(random = Math.random) { this.random = random; this.animals = []; this.nextId = 1; }
  pick(list) { return list[Math.floor(this.random() * list.length)]; }
  create(species, enclosure) {
    const first = this.pick(TRAITS); let second = this.pick(TRAITS.filter(t => t !== first));
    const animal = { id:this.nextId++, name:this.pick(NAMES), species, age:1 + Math.floor(this.random()*9), traits:[first,second], hunger:65+Math.floor(this.random()*25), cleanliness:65+Math.floor(this.random()*25), happiness:60+Math.floor(this.random()*30), health:82+Math.floor(this.random()*18), enclosure, medicationNeeded:this.random()<.28, appearance:{...this.pick(APPEARANCES[species])}, enrichment:[] };
    if (animal.medicationNeeded) animal.health = 62;
    this.animals.push(animal); return animal;
  }
  seed() { this.animals=[]; this.create('Dog','dog'); this.create('Cat','cat'); const rabbit=this.create('Rabbit','rabbit'); rabbit.medicationNeeded=true; rabbit.health=62; return this.animals; }
  tick(amount=1) { this.animals.forEach(a=>{const puzzle=a.enrichment.includes('puzzle-feeder');const comfort=a.enrichment.some(i=>['animal-bed','tennis-ball','chew-toy','cat-toy','scratching-post','rabbit-tunnel','rabbit-chew'].includes(i));a.hunger=Math.max(0,a.hunger-(puzzle?.25:.45)*amount);a.cleanliness=Math.max(0,a.cleanliness-.25*amount);a.happiness=Math.max(0,a.happiness-(comfort?.08:.2)*amount);if(a.hunger<25||a.cleanliness<20)a.health=Math.max(0,a.health-.12*amount);}); }
  care(animal, action) {
    const effects={feed:['hunger',30],clean:['cleanliness',35],play:['happiness',30],medicate:['health',28]};
    const [stat,gain]=effects[action]; animal[stat]=Math.min(100,animal[stat]+gain); if(action==='medicate') animal.medicationNeeded=false; return stat;
  }
  remove(id) { this.animals=this.animals.filter(a=>a.id!==id); }
}

