// Pen geometry and progression live in data so a future build mode can replace
// bounds, capacity, slots, and gates without rewriting animal logic.
export const PEN_DEFINITIONS = {
  Dog: {
    id:'dog', label:'Dog Pen', capacity:4,
    bounds:{x:56,y:122,width:355,height:78}, gate:{x:246,y:214},
    bowlSlots:[{id:'dog-food',kind:'food',x:377,y:188},{id:'dog-water',kind:'water',x:72,y:188}],
    enrichmentSlots:[{x:120,y:166},{x:190,y:152},{x:270,y:170},{x:335,y:150}]
  },
  Rabbit: {
    id:'rabbit', label:'Rabbit Pen', capacity:4,
    bounds:{x:452,y:122,width:314,height:78}, gate:{x:598,y:214},
    bowlSlots:[{id:'rabbit-food',kind:'food',x:735,y:188},{id:'rabbit-water',kind:'water',x:468,y:188}],
    enrichmentSlots:[{x:510,y:166},{x:565,y:148},{x:630,y:170},{x:690,y:150}]
  },
  Cat: {
    id:'cat', label:'Cat Pen', capacity:5,
    bounds:{x:804,y:122,width:350,height:78}, gate:{x:958,y:214},
    bowlSlots:[{id:'cat-food',kind:'food',x:1130,y:188},{id:'cat-water',kind:'water',x:820,y:188}],
    enrichmentSlots:[{x:860,y:166},{x:915,y:148},{x:985,y:170},{x:1045,y:148},{x:1100,y:168}]
  }
};

export class PenSystem {
  constructor(animalSystem){
    this.animals=animalSystem;
    this.pens=Object.fromEntries(Object.entries(PEN_DEFINITIONS).map(([species,d])=>[species,{...d,installed:[],reservations:new Map()}]));
  }
  penFor(species){return this.pens[species]}
  count(species){return this.animals.animals.filter(a=>a.species===species).length}
  hasSpace(species){const p=this.penFor(species);return Boolean(p)&&this.count(species)<p.capacity}
  capacityRows(){return Object.entries(this.pens).map(([species,p])=>({species,count:this.count(species),capacity:p.capacity,full:!this.hasSpace(species)}))}
  nextOpenSlot(species){const pen=this.penFor(species);return pen.enrichmentSlots[pen.installed.length]||null}
  install(item){const pen=this.penFor(item.species[0]);const slot=this.nextOpenSlot(item.species[0]);if(!pen||!slot)return null;const placed={instanceId:`${pen.id}-${Date.now()}-${pen.installed.length}`,itemId:item.id,kind:item.kind,species:item.species[0],x:slot.x,y:slot.y,interaction:{x:slot.x,y:slot.y+16}};pen.installed.push(placed);return placed}
  reserve(penId,pointId,animalId){const pen=Object.values(this.pens).find(p=>p.id===penId);if(!pen||pen.reservations.has(pointId))return false;pen.reservations.set(pointId,animalId);return true}
  release(penId,pointId,animalId){const pen=Object.values(this.pens).find(p=>p.id===penId);if(pen?.reservations.get(pointId)===animalId)pen.reservations.delete(pointId)}
  availablePoints(species){const pen=this.penFor(species);return [...pen.bowlSlots.map(p=>({...p,pointId:p.id,x:p.x,y:p.y})),...pen.installed.map(p=>({...p,pointId:p.instanceId,x:p.interaction.x,y:p.interaction.y}))].filter(p=>!pen.reservations.has(p.pointId))}
}

