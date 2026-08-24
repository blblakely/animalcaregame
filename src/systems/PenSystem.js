import {PENS,worldCenter,rectCells,isAnimalWalkable} from '../data/shelterGrid.js';
const LARGE=new Set(['dog-bed','cat-tower','rabbit-tunnel','rabbit-hideout']);
export const PEN_DEFINITIONS=Object.fromEntries(Object.entries(PENS).map(([species,p])=>{const xs=p.interior.map(t=>t.c),ys=p.interior.map(t=>t.r),a=worldCenter(Math.min(...xs),Math.min(...ys)),b=worldCenter(Math.max(...xs),Math.max(...ys));return[species,{id:species.toLowerCase(),label:`${species} Pen`,species,capacity:p.capacity,areaPerAnimal:p.areaPerAnimal,interiorCells:p.interior,fenceCells:p.fence,gateCells:p.gate,bounds:{x:a.x-16,y:a.y-16,width:b.x-a.x+32,height:b.y-a.y+32},gate:worldCenter(p.gate[0].c,p.gate[0].r),bowlSlots:p.bowls.map(q=>({...q,...worldCenter(q.c,q.r)})),enrichmentSlots:p.enrichment.map(q=>({...q,...worldCenter(q.c,q.r)}))}]}));
export class PenSystem{
 constructor(animalSystem,grid){this.animals=animalSystem;this.grid=grid;this.pens=Object.fromEntries(Object.entries(PEN_DEFINITIONS).map(([s,d])=>[s,{...d,installed:[],reservations:new Map(),occupied:new Set()}]))}
 penFor(species){return this.pens[species]}
 count(species){return this.animals.animals.filter(a=>a.species===species).length}
 hasSpace(species){const p=this.penFor(species);return Boolean(p)&&this.count(species)<p.capacity}
 capacityRows(){return Object.entries(this.pens).map(([species,p])=>({species,count:this.count(species),capacity:p.capacity,usableTiles:p.interiorCells.length,areaPerAnimal:p.areaPerAnimal,full:!this.hasSpace(species)}))}
 footprint(item,c,r){return rectCells(c,r,LARGE.has(item.id)?2:1,1)}
 nextOpenSlot(species,item={id:''}){const p=this.penFor(species);for(const slot of p.enrichmentSlots){const cells=this.footprint(item,slot.c,slot.r);if(cells.every(t=>isAnimalWalkable(species,t.c,t.r)&&!p.occupied.has(`${t.c},${t.r}`)&&(!this.grid||!this.grid.dynamic.has(`${t.c},${t.r}`))))return{...slot,cells}}return null}
 install(item){const species=item.species[0],pen=this.penFor(species),slot=this.nextOpenSlot(species,item);if(!pen||!slot)return null;slot.cells.forEach(t=>pen.occupied.add(`${t.c},${t.r}`));this.grid?.occupy(slot.cells,'enrichment');const interactionCell=pen.interiorCells.find(t=>Math.abs(t.c-slot.c)+Math.abs(t.r-slot.r)===1&&!pen.occupied.has(`${t.c},${t.r}`))||slot,center=worldCenter(slot.c,slot.r),interaction=worldCenter(interactionCell.c,interactionCell.r);const placed={instanceId:`${pen.id}-${Date.now()}-${pen.installed.length}`,itemId:item.id,kind:item.kind,species,c:slot.c,r:slot.r,cells:slot.cells,x:center.x,y:center.y,interaction:{...interaction,c:interactionCell.c,r:interactionCell.r}};pen.installed.push(placed);return placed}
 reserve(penId,pointId,animalId){const pen=Object.values(this.pens).find(p=>p.id===penId);if(!pen||pen.reservations.has(pointId))return false;pen.reservations.set(pointId,animalId);return true}
 release(penId,pointId,animalId){const pen=Object.values(this.pens).find(p=>p.id===penId);if(pen?.reservations.get(pointId)===animalId)pen.reservations.delete(pointId)}
 availablePoints(species){const pen=this.penFor(species);return[...pen.bowlSlots.map(p=>({...p,pointId:p.id})),...pen.installed.map(p=>({...p,pointId:p.instanceId,x:p.interaction.x,y:p.interaction.y,c:p.interaction.c,r:p.interaction.r}))].filter(p=>!pen.reservations.has(p.pointId))}
}

