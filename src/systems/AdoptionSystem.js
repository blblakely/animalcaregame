const PEOPLE=['Morgan','Priya','Elliot','Sam','Casey','Jordan'];
const SPECIES=['Dog','Cat','Rabbit'];
const STYLES=['Energetic','Calm','Playful'];
export class AdoptionSystem {
  constructor(random=Math.random){this.random=random;this.visitor=null;}
  pick(a){return a[Math.floor(this.random()*a.length)]}
  generate(){this.visitor={name:this.pick(PEOPLE),species:this.pick(SPECIES),activity:this.pick(STYLES),wish:this.pick(['Friendly','Calm','Playful','Independent'])};return this.visitor}
  score(animal,visitor=this.visitor){let score=25;if(animal.species===visitor.species)score+=40;if(animal.traits.includes(visitor.activity))score+=20;if(animal.traits.includes(visitor.wish))score+=15;return Math.min(100,score)}
}
