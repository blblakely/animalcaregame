export const ENRICHMENT_ITEMS=[
 {id:'tennis-ball',name:'Tennis Ball',icon:'●',price:8,species:['Dog'],benefit:'Happiness falls more slowly'},
 {id:'chew-toy',name:'Chew Toy',icon:'◆',price:10,species:['Dog'],benefit:'Happiness falls more slowly'},
 {id:'scratching-post',name:'Scratching Post',icon:'╫',price:18,species:['Cat'],benefit:'Happiness falls more slowly'},
 {id:'cat-toy',name:'Feather Toy',icon:'✦',price:9,species:['Cat'],benefit:'Happiness falls more slowly'},
 {id:'rabbit-tunnel',name:'Rabbit Tunnel',icon:'◉',price:16,species:['Rabbit'],benefit:'Happiness falls more slowly'},
 {id:'rabbit-chew',name:'Willow Chew',icon:'≋',price:8,species:['Rabbit'],benefit:'Happiness falls more slowly'},
 {id:'animal-bed',name:'Cozy Bed',icon:'▰',price:20,species:['Dog','Cat','Rabbit'],benefit:'Happiness falls more slowly'},
 {id:'puzzle-feeder',name:'Puzzle Feeder',icon:'⊞',price:22,species:['Dog','Cat','Rabbit'],benefit:'Slows hunger loss'}
];
export class EnrichmentSystem{
 constructor(economy){this.economy=economy;this.inventory=[];}
 purchase(itemId){const item=ENRICHMENT_ITEMS.find(i=>i.id===itemId);if(!item||!this.economy.spend(item.price))return null;this.inventory.push(itemId);return item}
 place(itemId,animal){const item=ENRICHMENT_ITEMS.find(i=>i.id===itemId);const index=this.inventory.indexOf(itemId);if(!item||index<0||!item.species.includes(animal.species)||animal.enrichment.length>=2)return false;this.inventory.splice(index,1);animal.enrichment.push(itemId);animal.happiness=Math.min(100,animal.happiness+12);return true}
}

