// Pen geometry and progression live in data so a future build mode can replace
// bounds, capacity, slots, and gates without rewriting animal logic.
import { PEN_LAYOUT } from '../data/shelterLayout.js';

export const PEN_DEFINITIONS = Object.fromEntries(Object.entries(PEN_LAYOUT).map(([species,p])=>[species,{
  id:species.toLowerCase(),label:`${species} Pen`,capacity:p.capacity,bounds:p.bounds,gate:p.gate,
  bowlSlots:p.bowls,enrichmentSlots:p.enrichment.map(([x,y])=>({x,y}))
}]));

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

