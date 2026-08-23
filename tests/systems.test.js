import {describe,it,expect} from 'vitest';
import {AnimalSystem} from '../src/systems/AnimalSystem.js';import {EconomySystem} from '../src/systems/EconomySystem.js';import {AdoptionSystem} from '../src/systems/AdoptionSystem.js';import {IntakeSystem} from '../src/systems/IntakeSystem.js';import {EnrichmentSystem} from '../src/systems/EnrichmentSystem.js';import {PenSystem,PEN_DEFINITIONS} from '../src/systems/PenSystem.js';
const setup=()=>{const animals=new AnimalSystem(()=>.1);animals.seed();const pens=new PenSystem(animals);return{animals,pens}};
describe('core systems',()=>{
 it('creates starter species with unique traits',()=>{const{animals}=setup();expect(animals.animals.map(a=>a.species)).toEqual(['Dog','Cat','Rabbit']);animals.animals.forEach(a=>expect(new Set(a.traits).size).toBe(2))});
 it('care and economy still work',()=>{const s=new AnimalSystem(()=>.2),a=s.create('Dog','dog'),e=new EconomySystem();a.hunger=90;s.care(a,'feed');expect(a.hunger).toBe(100);expect(e.spend(3)).toBe(true);expect(e.adoption(100)).toBe(70)});
 it('adopter preferences never duplicate and either one scores',()=>{for(let n=0;n<30;n++){const sys=new AdoptionSystem(()=>((n*7)%29)/29),v=sys.generate();expect(v.activity).not.toBe(v.wish);expect(sys.score({species:v.species,traits:[v.wish]},v)).toBeGreaterThan(65)}});
});
describe('pen management',()=>{
 it('uses independent editable species capacities',()=>{const{animals,pens}=setup();expect(pens.capacityRows().map(r=>r.capacity)).toEqual([4,4,5]);while(pens.hasSpace('Dog'))animals.create('Dog','dog');expect(pens.hasSpace('Dog')).toBe(false);expect(pens.hasSpace('Rabbit')).toBe(true)});
 it('intake checks only the candidate species',()=>{const{animals,pens}=setup();while(pens.hasSpace('Dog'))animals.create('Dog','dog');const i=new IntakeSystem(animals,pens,()=>.01),dog=i.generate();dog.species='Dog';expect(i.accept(dog.id)).toBeNull();const rabbit=i.generate();rabbit.species='Rabbit';expect(i.accept(rabbit.id)).not.toBeNull()});
 it('starts empty and keeps compatible enrichment after adoption',()=>{const{animals,pens}=setup(),shop=new EnrichmentSystem(new EconomySystem(),pens);Object.values(pens.pens).forEach(p=>expect(p.installed).toEqual([]));shop.purchase('tennis-ball');const placed=shop.install('tennis-ball','Dog');animals.remove(1);expect(pens.penFor('Dog').installed).toContain(placed);shop.purchase('scratching-post');expect(shop.install('scratching-post','Dog')).toBeNull()});
 it('reserves interaction points for one animal',()=>{const{pens}=setup();expect(pens.reserve('dog','dog-food',1)).toBe(true);expect(pens.reserve('dog','dog-food',2)).toBe(false);pens.release('dog','dog-food',1);expect(pens.reserve('dog','dog-food',2)).toBe(true)});
 it('keeps bounds and slots in data for future build mode',()=>{Object.values(PEN_DEFINITIONS).forEach(p=>{expect(p.bounds.width).toBeGreaterThan(250);expect(p.enrichmentSlots.length).toBe(p.capacity)})});
});

