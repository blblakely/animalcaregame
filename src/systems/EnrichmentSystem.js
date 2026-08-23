export const ENRICHMENT_ITEMS=[
 {id:'tennis-ball',name:'Tennis Ball',icon:'●',price:8,species:['Dog'],kind:'play',benefit:'Play and happiness'},
 {id:'dog-chew',name:'Dog Chew Toy',icon:'◆',price:10,species:['Dog'],kind:'play',benefit:'Chewing and happiness'},
 {id:'dog-bed',name:'Dog Bed',icon:'▰',price:20,species:['Dog'],kind:'bed',benefit:'Comfort and rest'},
 {id:'dog-puzzle',name:'Dog Puzzle Feeder',icon:'⊞',price:22,species:['Dog'],kind:'puzzle',benefit:'Play; slows hunger'},
 {id:'scratching-post',name:'Scratching Post',icon:'╫',price:18,species:['Cat'],kind:'scratch',benefit:'Scratching and happiness'},
 {id:'cat-tower',name:'Cat Tower',icon:'▥',price:25,species:['Cat'],kind:'scratch',benefit:'Climbing and play'},
 {id:'cat-toy',name:'Feather Toy',icon:'✦',price:9,species:['Cat'],kind:'play',benefit:'Play and happiness'},
 {id:'cat-bed',name:'Cat Bed',icon:'▰',price:20,species:['Cat'],kind:'bed',benefit:'Comfort and rest'},
 {id:'cat-puzzle',name:'Cat Puzzle Feeder',icon:'⊞',price:22,species:['Cat'],kind:'puzzle',benefit:'Play; slows hunger'},
 {id:'rabbit-tunnel',name:'Rabbit Tunnel',icon:'◉',price:16,species:['Rabbit'],kind:'tunnel',benefit:'Tunneling and happiness'},
 {id:'rabbit-chew',name:'Willow Chew',icon:'≋',price:8,species:['Rabbit'],kind:'chew',benefit:'Chewing and happiness'},
 {id:'rabbit-hideout',name:'Rabbit Hideout',icon:'⌂',price:18,species:['Rabbit'],kind:'tunnel',benefit:'Security and rest'},
 {id:'rabbit-mat',name:'Rabbit Bed Mat',icon:'▰',price:14,species:['Rabbit'],kind:'bed',benefit:'Comfort and rest'},
 {id:'rabbit-puzzle',name:'Rabbit Puzzle Feeder',icon:'⊞',price:22,species:['Rabbit'],kind:'puzzle',benefit:'Play; slows hunger'}
];
export class EnrichmentSystem{
 constructor(economy,penSystem){this.economy=economy;this.pens=penSystem;this.inventory=[];}
 purchase(itemId){const item=ENRICHMENT_ITEMS.find(i=>i.id===itemId);if(!item||!this.economy.spend(item.price))return null;this.inventory.push(itemId);return item}
 install(itemId,species){const item=ENRICHMENT_ITEMS.find(i=>i.id===itemId);const index=this.inventory.indexOf(itemId);if(!item||index<0||!item.species.includes(species))return null;const placed=this.pens.install(item);if(!placed)return null;this.inventory.splice(index,1);return placed}
}

