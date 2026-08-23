const NAMES = ['Biscuit','Luna','Mochi','Pepper','Clover','Waffles','Maple','Pip','Juniper','Teddy','Olive','Bean'];
const TRAITS = ['Friendly','Shy','Playful','Calm','Energetic','Independent'];

export class AnimalSystem {
  constructor(random = Math.random) { this.random = random; this.animals = []; this.nextId = 1; }
  pick(list) { return list[Math.floor(this.random() * list.length)]; }
  create(species, enclosure) {
    const first = this.pick(TRAITS); let second = this.pick(TRAITS.filter(t => t !== first));
    const animal = { id:this.nextId++, name:this.pick(NAMES), species, age:1 + Math.floor(this.random()*9), traits:[first,second], hunger:65+Math.floor(this.random()*25), cleanliness:65+Math.floor(this.random()*25), happiness:60+Math.floor(this.random()*30), health:82+Math.floor(this.random()*18), enclosure, medicationNeeded:this.random()<.28 };
    if (animal.medicationNeeded) animal.health = 62;
    this.animals.push(animal); return animal;
  }
  seed() { this.animals=[]; this.create('Dog','dog'); this.create('Cat','cat'); const rabbit=this.create('Rabbit','rabbit'); rabbit.medicationNeeded=true; rabbit.health=62; return this.animals; }
  tick(amount=1) { this.animals.forEach(a=>{ a.hunger=Math.max(0,a.hunger-.45*amount); a.cleanliness=Math.max(0,a.cleanliness-.25*amount); a.happiness=Math.max(0,a.happiness-.2*amount); if(a.hunger<25||a.cleanliness<20) a.health=Math.max(0,a.health-.12*amount); }); }
  care(animal, action) {
    const effects={feed:['hunger',30],clean:['cleanliness',35],play:['happiness',30],medicate:['health',28]};
    const [stat,gain]=effects[action]; animal[stat]=Math.min(100,animal[stat]+gain); if(action==='medicate') animal.medicationNeeded=false; return stat;
  }
  remove(id) { this.animals=this.animals.filter(a=>a.id!==id); }
}

