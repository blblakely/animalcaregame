import {describe,it,expect} from 'vitest';
import {AnimalSystem} from '../src/systems/AnimalSystem.js';import {EconomySystem} from '../src/systems/EconomySystem.js';import {AdoptionSystem} from '../src/systems/AdoptionSystem.js';import {IntakeSystem} from '../src/systems/IntakeSystem.js';import {EnrichmentSystem} from '../src/systems/EnrichmentSystem.js';import {PenSystem,PEN_DEFINITIONS} from '../src/systems/PenSystem.js';
import {PENS,VIEWING,SAFE_WAIT,DESTINATIONS,OBJECTS,isPlayerWalkable,isPublicWalkable,isNpcWalkable} from '../src/data/shelterGrid.js';
import {GridSystem} from '../src/systems/GridSystem.js';
import {animalWalkColumn} from '../src/systems/AnimationSystem.js';
import {FurnitureSystem,FURNITURE_CATALOG} from '../src/systems/FurnitureSystem.js';
const setup=()=>{const animals=new AnimalSystem(()=>.1);animals.seed();const pens=new PenSystem(animals);return{animals,pens}};
describe('core systems',()=>{
 it('creates starter species with unique traits',()=>{const{animals}=setup();expect(animals.animals.map(a=>a.species)).toEqual(['Dog','Cat','Rabbit']);animals.animals.forEach(a=>expect(new Set(a.traits).size).toBe(2))});
 it('care and economy still work',()=>{const s=new AnimalSystem(()=>.2),a=s.create('Dog','dog'),e=new EconomySystem();a.hunger=90;s.care(a,'feed');expect(a.hunger).toBe(100);expect(e.spend(3)).toBe(true);expect(e.adoption(100)).toBe(70)});
 it('adopter preferences never duplicate and either one scores',()=>{for(let n=0;n<30;n++){const sys=new AdoptionSystem(()=>((n*7)%29)/29),v=sys.generate();expect(v.activity).not.toBe(v.wish);expect(sys.score({species:v.species,traits:[v.wish]},v)).toBeGreaterThan(65)}});
});
describe('rebuilt shelter map',()=>{
 it('finds A* routes from entrance to every public destination',()=>{const grid=new GridSystem();for(const goal of Object.values(DESTINATIONS).filter(g=>g.r<22))expect(grid.path(DESTINATIONS.entrance,goal).length).toBeGreaterThan(0)});
 it('makes gates player-walkable while keeping NPCs out of pens',()=>{for(const p of Object.values(PENS)){for(const g of p.gate){expect(isPlayerWalkable(g.c,g.r)).toBe(true);expect(isPublicWalkable(g.c,g.r)).toBe(false)}for(const t of p.interior)expect(isPublicWalkable(t.c,t.r)).toBe(false)}});
 it('provides multiple valid viewing positions per species',()=>{expect(Object.values(VIEWING).every(spots=>spots.length>=3&&spots.every(t=>isPublicWalkable(t.c,t.r)))).toBe(true)});
 it('keeps NPC routes on defined lanes and away from furniture',()=>{const grid=new GridSystem();for(const spots of Object.values(VIEWING))for(const goal of spots){const path=grid.path(DESTINATIONS.entrance,goal,(c,r)=>grid.npcWalkable(c,r));expect(path.length).toBeGreaterThan(0);expect(path.every(t=>isNpcWalkable(t.c,t.r))).toBe(true)}for(const o of OBJECTS)expect(isNpcWalkable(o.c,o.r)).toBe(false)});
 it('keeps every NPC fallback waiting tile reachable',()=>{const grid=new GridSystem();for(const goal of SAFE_WAIT)expect(grid.path(DESTINATIONS.entrance,goal,(c,r)=>grid.npcWalkable(c,r)).length).toBeGreaterThan(0)});
 it('uses two dedicated side-walk frames for dogs and cats',()=>{expect([animalWalkColumn('Dog',1,0,0),animalWalkColumn('Dog',1,0,1)]).toEqual([6,7]);expect([animalWalkColumn('Cat',1,0,0),animalWalkColumn('Cat',1,0,1)]).toEqual([6,7])});
 it('faces rabbit side frames toward travel direction',()=>{expect(animalWalkColumn('Rabbit',1,0,0)).toBe(7);expect(animalWalkColumn('Rabbit',1,0,1)).toBe(8)});
});
describe('furniture build mode data',()=>{
 it('defines a manageable priced catalog with footprints',()=>{expect(FURNITURE_CATALOG.length).toBeGreaterThanOrEqual(10);for(const i of FURNITURE_CATALOG){expect(i.price).toBeGreaterThan(0);expect(i.w*i.h).toBeGreaterThan(0)}});
 it('uses the shared grid for placement occupancy and storage',()=>{const grid=new GridSystem(),economy=new EconomySystem(),f=new FurnitureSystem(grid,economy);f.inventory['wooden-chair']=1;const p=f.createPlacement('wooden-chair',2,16);expect(f.canPlace(p)).toBe(true);expect(f.place(p)).toBe(true);expect(grid.playerWalkable(2,16)).toBe(false);const held=f.pickUp(p.instanceId);expect(grid.playerWalkable(2,16)).toBe(true);f.store(held);expect(f.count('wooden-chair')).toBe(1)});
 it('rejects walls, pens, door-critical points and overlapping furniture',()=>{const grid=new GridSystem(),f=new FurnitureSystem(grid,new EconomySystem());for(const [c,r] of [[0,0],[2,2],[19,21]])expect(f.canPlace(f.createPlacement('wooden-chair',c,r))).toBe(false);expect(f.canPlace(f.createPlacement('wooden-chair',1,18))).toBe(false)});
 it('re-routes NPC A* around newly placed furniture occupancy',()=>{const grid=new GridSystem(),f=new FurnitureSystem(grid,new EconomySystem());f.inventory['cozy-sofa']=1;const sofa=f.createPlacement('cozy-sofa',22,11);expect(f.place(sofa)).toBe(true);const occupied=new Set(f.cells(sofa).map(t=>`${t.c},${t.r}`)),path=grid.path(DESTINATIONS.entrance,VIEWING.Rabbit[0],(c,r)=>grid.npcWalkable(c,r));expect(path.length).toBeGreaterThan(0);expect(path.every(t=>!occupied.has(`${t.c},${t.r}`))).toBe(true)});
});
describe('pen management',()=>{
 it('uses independent editable species capacities',()=>{const{animals,pens}=setup();expect(pens.capacityRows().map(r=>r.capacity)).toEqual([4,4,5]);while(pens.hasSpace('Dog'))animals.create('Dog','dog');expect(pens.hasSpace('Dog')).toBe(false);expect(pens.hasSpace('Rabbit')).toBe(true)});
 it('intake checks only the candidate species',()=>{const{animals,pens}=setup();while(pens.hasSpace('Dog'))animals.create('Dog','dog');const i=new IntakeSystem(animals,pens,()=>.01),dog=i.generate();dog.species='Dog';expect(i.accept(dog.id)).toBeNull();const rabbit=i.generate();rabbit.species='Rabbit';expect(i.accept(rabbit.id)).not.toBeNull()});
 it('starts empty and keeps compatible enrichment after adoption',()=>{const{animals,pens}=setup(),shop=new EnrichmentSystem(new EconomySystem(),pens);Object.values(pens.pens).forEach(p=>expect(p.installed).toEqual([]));shop.purchase('tennis-ball');const placed=shop.install('tennis-ball','Dog');animals.remove(1);expect(pens.penFor('Dog').installed).toContain(placed);shop.purchase('scratching-post');expect(shop.install('scratching-post','Dog')).toBeNull()});
 it('reserves interaction points for one animal',()=>{const{pens}=setup();expect(pens.reserve('dog','dog-food',1)).toBe(true);expect(pens.reserve('dog','dog-food',2)).toBe(false);pens.release('dog','dog-food',1);expect(pens.reserve('dog','dog-food',2)).toBe(true)});
 it('keeps bounds and slots in data for future build mode',()=>{Object.values(PEN_DEFINITIONS).forEach(p=>{expect(p.bounds.width).toBeGreaterThan(250);expect(p.enrichmentSlots.length).toBe(p.capacity)})});
});

