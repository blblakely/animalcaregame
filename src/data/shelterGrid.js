// Authoritative 32px physical map. Artwork is rendered in separate layers, while
// every physical system reads these same cells.
export const TILE_SIZE=32, COLS=38, ROWS=23;
export const WORLD={width:COLS*TILE_SIZE,height:ROWS*TILE_SIZE};
export const key=(c,r)=>`${c},${r}`;
export const rectCells=(c,r,w,h)=>Array.from({length:w*h},(_,i)=>({c:c+i%w,r:r+Math.floor(i/w)}));

const blocked=new Map();
const mark=(cells,type)=>cells.forEach(({c,r})=>blocked.set(key(c,r),type));
mark(rectCells(0,0,COLS,1),'wall');mark(rectCells(0,0,1,ROWS),'wall');mark(rectCells(COLS-1,0,1,ROWS),'wall');
mark(rectCells(0,ROWS-1,17,1),'wall');mark(rectCells(21,ROWS-1,17,1),'wall');

export const PENS={
 Dog:{species:'Dog',capacity:4,areaPerAnimal:14,interior:rectCells(1,2,11,6),fence:[...rectCells(1,8,11,1),...rectCells(12,1,1,8)],gate:[{c:5,r:8},{c:6,r:8}],bowls:[{id:'dog-water',kind:'water',c:2,r:3},{id:'dog-food',kind:'food',c:10,r:3}],enrichment:[{c:3,r:5},{c:5,r:4},{c:8,r:5},{c:10,r:4}]},
 Rabbit:{species:'Rabbit',capacity:4,areaPerAnimal:7,interior:rectCells(26,2,11,6),fence:[...rectCells(26,8,11,1),...rectCells(25,1,1,8)],gate:[{c:31,r:8},{c:32,r:8}],bowls:[{id:'rabbit-water',kind:'water',c:27,r:3},{id:'rabbit-food',kind:'food',c:35,r:3}],enrichment:[{c:27,r:5},{c:29,r:4},{c:32,r:5},{c:34,r:4}]},
 Cat:{species:'Cat',capacity:5,areaPerAnimal:10,interior:rectCells(14,2,10,6),fence:[...rectCells(14,8,10,1),...rectCells(13,1,1,8),...rectCells(24,1,1,8)],gate:[{c:18,r:8},{c:19,r:8}],bowls:[{id:'cat-water',kind:'water',c:14,r:3},{id:'cat-food',kind:'food',c:23,r:3}],enrichment:[{c:15,r:5},{c:17,r:4},{c:19,r:5},{c:21,r:4},{c:22,r:6}]}
};
for(const p of Object.values(PENS)){mark(p.fence,'fence');mark(p.gate,'gate')}

// Room divider walls. Each omitted run is an actual 2–3 tile doorway.
for(const [start,end] of [[0,2],[6,7],[8,9],[13,15],[16,17],[21,26],[27,30],[34,38]])mark(rectCells(start,14,end-start,1),'wall');
mark(rectCells(7,14,1,9),'wall');mark(rectCells(15,14,1,9),'wall');mark(rectCells(26,14,1,9),'wall');

export const OBJECTS=[
 {id:'pantry-shelves',room:'pantry',c:1,r:18,w:5,h:3,type:'food',label:'Food pantry'},
 {id:'wash-station',room:'cleaning',c:9,r:18,w:4,h:3,type:'cleaning',label:'Wash station'},
 {id:'waiting-bench',room:'lobby',c:16,r:17,w:2,h:2,type:'decor'},
 {id:'adoption-desk',room:'lobby',c:22,r:18,w:3,h:2,type:'desk',label:'Adoption desk'},
 {id:'office-cabinet',room:'office',c:28,r:17,w:2,h:3,type:'decor'},
 {id:'intake-desk',room:'office',c:32,r:18,w:4,h:2,type:'computer',label:'Intake computer'}
];
for(const o of OBJECTS)mark(rectCells(o.c,o.r,o.w,o.h),'furniture');

export const VIEWING={Dog:[{c:3,r:10},{c:6,r:11},{c:9,r:10}],Cat:[{c:15,r:10},{c:18,r:11},{c:21,r:10}],Rabbit:[{c:28,r:10},{c:31,r:11},{c:34,r:10}]};
export const SAFE_WAIT=[{c:4,r:13},{c:11,r:13},{c:18,r:13},{c:25,r:13},{c:33,r:13}];
export const DESTINATIONS={entrance:{c:19,r:21},lobby:{c:19,r:18},reception:{c:21,r:17},pantry:{c:4,r:16},cleaning:{c:11,r:16},office:{c:32,r:16},exit:{c:19,r:22}};
export const tileType=(c,r)=>blocked.get(key(c,r))||'floor';
export const isPlayerWalkable=(c,r)=>['floor','gate'].includes(tileType(c,r));
export const isPublicWalkable=(c,r)=>c>=0&&r>=0&&c<COLS&&r<ROWS&&tileType(c,r)==='floor'&&!Object.values(PENS).some(p=>p.interior.some(t=>t.c===c&&t.r===r));
export const isAnimalWalkable=(species,c,r)=>PENS[species].interior.some(t=>t.c===c&&t.r===r);
export const worldCenter=(c,r)=>({x:c*TILE_SIZE+TILE_SIZE/2,y:r*TILE_SIZE+TILE_SIZE/2});

