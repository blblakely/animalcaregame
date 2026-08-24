import {COLS,ROWS,OBJECTS,PENS,NPC_LANE_CELLS,REQUIRED_DESTINATIONS,DESTINATIONS,key,rectCells,tileType,isPublicWalkable} from '../data/shelterGrid.js';

export const FURNITURE_CATALOG=[
 {id:'wooden-chair',name:'Wooden Chair',category:'Seating',price:30,texture:'catalog-chair',w:1,h:1,display:{w:34,h:54},rotatable:true,blocking:true},
 {id:'lobby-bench',name:'Lobby Bench',category:'Seating',price:65,texture:'catalog-bench',w:2,h:1,display:{w:58,h:78},rotatable:true,blocking:true},
 {id:'cozy-sofa',name:'Cozy Sofa',category:'Seating',price:120,texture:'catalog-bench',w:3,h:1,display:{w:88,h:72},rotatable:true,blocking:true},
 {id:'small-table',name:'Small Table',category:'Tables',price:50,texture:'catalog-table',w:2,h:1,display:{w:62,h:50},rotatable:true,blocking:true},
 {id:'side-table',name:'Side Table',category:'Tables',price:35,texture:'catalog-table',w:1,h:1,display:{w:34,h:42},rotatable:false,blocking:true},
 {id:'filing-cabinet',name:'Filing Cabinet',category:'Storage',price:80,texture:'catalog-filing',w:1,h:2,display:{w:42,h:86},rotatable:true,blocking:true},
 {id:'bookshelf',name:'Bookshelf',category:'Storage',price:90,texture:'catalog-bookshelf',w:1,h:2,display:{w:50,h:92},rotatable:true,blocking:true},
 {id:'storage-cabinet',name:'Storage Cabinet',category:'Storage',price:75,texture:'catalog-storage',w:1,h:2,display:{w:48,h:90},rotatable:true,blocking:true},
 {id:'potted-plant',name:'Potted Plant',category:'Decor',price:25,texture:'catalog-plant',w:1,h:1,display:{w:34,h:55},rotatable:false,blocking:true},
 {id:'floor-lamp',name:'Floor Lamp',category:'Decor',price:40,texture:'catalog-lamp',w:1,h:1,display:{w:32,h:58},rotatable:false,blocking:true},
 {id:'office-desk',name:'Office Desk',category:'Office',price:110,texture:'catalog-desk',w:3,h:2,display:{w:105,h:86},rotatable:true,blocking:true},
 {id:'small-rug',name:'Small Rug',category:'Rugs',price:30,texture:'catalog-rug',w:2,h:2,display:{w:64,h:48},rotatable:true,blocking:false}
];
const byId=id=>FURNITURE_CATALOG.find(i=>i.id===id);

export class FurnitureSystem{
 constructor(grid,economy){this.grid=grid;this.economy=economy;this.inventory={};this.placed=[];this.load()}
 starter(){return OBJECTS.map((o,n)=>({instanceId:`starter-${n}`,catalogId:o.catalogId||o.id,texture:o.id,c:o.c,r:o.r,w:o.w,h:o.h,rotation:0,display:o.display,movable:o.movable,rotatable:o.rotatable,fixed:o.fixed,blocking:true,type:o.type,label:o.label}))}
 load(){let saved=null;try{if(typeof localStorage!=='undefined')saved=JSON.parse(localStorage.getItem('paw-haven-furniture-v1'))}catch{}this.inventory=saved?.inventory||{};this.placed=saved?.placed||this.starter();if(Number.isFinite(saved?.money))this.economy.money=saved.money;for(const p of this.placed){const item=!p.fixed&&byId(p.catalogId);if(item){p.texture=item.texture;p.display=item.display;p.rotatable=item.rotatable;p.blocking=item.blocking}if(!p.fixed&&p.blocking!==false)this.grid.occupy(this.cells(p),`furniture:${p.instanceId}`)}}
 save(){if(typeof localStorage!=='undefined')localStorage.setItem('paw-haven-furniture-v1',JSON.stringify({inventory:this.inventory,placed:this.placed,money:this.economy.money}))}
 item(id){return byId(id)}
 count(id){return this.inventory[id]||0}
 buy(id){const item=byId(id);if(!item||!this.economy.spend(item.price))return null;this.inventory[id]=this.count(id)+1;this.save();return item}
 dimensions(item,rotation=0){return rotation%180?{w:item.h,h:item.w}:{w:item.w,h:item.h}}
 cells(p){return rectCells(p.c,p.r,p.w,p.h)}
 createPlacement(id,c,r,rotation=0){const item=byId(id),d=this.dimensions(item,rotation);return{instanceId:`furniture-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,catalogId:id,texture:item.texture,c,r,w:d.w,h:d.h,rotation,display:item.display,movable:true,rotatable:item.rotatable,fixed:false,blocking:item.blocking,category:item.category}}
 protected(c,r){return [DESTINATIONS.entrance,...REQUIRED_DESTINATIONS].some(t=>t.c===c&&t.r===r)||Object.values(PENS).some(p=>[...p.interior,...p.fence,...p.gate].some(t=>t.c===c&&t.r===r))}
 canPlace(p){const cells=this.cells(p);if(cells.some(t=>t.c<1||t.r<1||t.c>=COLS-1||t.r>=ROWS-1||tileType(t.c,t.r)!=='floor'||(p.blocking!==false&&this.grid.dynamic.has(key(t.c,t.r)))||this.protected(t.c,t.r)))return false;if(p.blocking===false)return true;const proposed=new Set(cells.map(t=>key(t.c,t.r))),walk=(c,r)=>isPublicWalkable(c,r)&&!this.grid.dynamic.has(key(c,r))&&!proposed.has(key(c,r));return REQUIRED_DESTINATIONS.every(goal=>this.grid.path(DESTINATIONS.entrance,goal,walk).length>0)}
 place(p,fromInventory=true){if(!this.canPlace(p)||fromInventory&&this.count(p.catalogId)<1)return false;this.placed.push(p);if(p.blocking!==false)this.grid.occupy(this.cells(p),`furniture:${p.instanceId}`);if(fromInventory)this.inventory[p.catalogId]--;this.save();return true}
 pickUp(instanceId){const p=this.placed.find(x=>x.instanceId===instanceId);if(!p?.movable)return null;if(p.blocking!==false)this.grid.release(this.cells(p));this.placed=this.placed.filter(x=>x!==p);return p}
 restore(p){this.placed.push(p);if(p.blocking!==false)this.grid.occupy(this.cells(p),`furniture:${p.instanceId}`);this.save()}
 store(p){this.inventory[p.catalogId]=this.count(p.catalogId)+1;this.save()}
 reset(){if(typeof localStorage!=='undefined')localStorage.removeItem('paw-haven-furniture-v1')}
}

