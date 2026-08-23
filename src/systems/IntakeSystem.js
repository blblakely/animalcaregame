const REASONS=['Owner surrender','Found stray','Previous shelter transfer','Owner unable to provide care'];
const HEALTH=['Healthy; routine check recommended','Minor skin irritation','Underweight but alert','Healthy; vaccines current'];
export class IntakeSystem{
  constructor(animalSystem,random=Math.random){this.animals=animalSystem;this.random=random;this.capacity=8;this.pending=[];}
  get count(){return this.animals.animals.length}
  get full(){return this.count>=this.capacity}
  generate(){const species=['Dog','Cat','Rabbit'][Math.floor(this.random()*3)];const candidate=this.animals.create(species,'pending');this.animals.remove(candidate.id);candidate.reason=REASONS[Math.floor(this.random()*REASONS.length)];candidate.healthNote=HEALTH[Math.floor(this.random()*HEALTH.length)];this.pending.push(candidate);return candidate}
  accept(id){if(this.full)return null;const index=this.pending.findIndex(a=>a.id===id);if(index<0)return null;const [animal]=this.pending.splice(index,1);animal.enclosure=animal.species.toLowerCase();this.animals.animals.push(animal);return animal}
  decline(id){const index=this.pending.findIndex(a=>a.id===id);if(index<0)return false;this.pending.splice(index,1);return true}
}

