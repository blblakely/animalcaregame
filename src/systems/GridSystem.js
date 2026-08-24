import {TILE_SIZE,COLS,ROWS,key,tileType,isPlayerWalkable,isPublicWalkable,isAnimalWalkable,worldCenter} from '../data/shelterGrid.js';
export class GridSystem{
 constructor(){this.dynamic=new Map()}
 cell(x,y){return{c:Math.floor(x/TILE_SIZE),r:Math.floor(y/TILE_SIZE)}}
 center(c,r){return worldCenter(c,r)}
 type(c,r){return this.dynamic.get(key(c,r))||tileType(c,r)}
 playerWalkable(c,r){return isPlayerWalkable(c,r)&&!this.dynamic.has(key(c,r))}
 publicWalkable(c,r){return isPublicWalkable(c,r)&&!this.dynamic.has(key(c,r))}
 animalWalkable(species,c,r){return isAnimalWalkable(species,c,r)&&!this.dynamic.has(key(c,r))}
 occupy(cells,type='occupied'){if(cells.some(t=>this.dynamic.has(key(t.c,t.r))))return false;cells.forEach(t=>this.dynamic.set(key(t.c,t.r),type));return true}
 release(cells){cells.forEach(t=>this.dynamic.delete(key(t.c,t.r)))}
 neighbors(c,r,walkable){return[[1,0],[-1,0],[0,1],[0,-1]].map(([dc,dr])=>({c:c+dc,r:r+dr})).filter(n=>walkable(n.c,n.r))}
 path(start,goal,walkable=(c,r)=>this.publicWalkable(c,r)){
  if(!walkable(goal.c,goal.r))return[];const open=[start],came=new Map(),g=new Map([[key(start.c,start.r),0]]),f=new Map([[key(start.c,start.r),this.h(start,goal)]]),closed=new Set();
  while(open.length){open.sort((a,b)=>(f.get(key(a.c,a.r))??Infinity)-(f.get(key(b.c,b.r))??Infinity));const cur=open.shift(),ck=key(cur.c,cur.r);if(cur.c===goal.c&&cur.r===goal.r){const out=[cur];let k=ck;while(came.has(k)){const prev=came.get(k);out.push(prev);k=key(prev.c,prev.r)}return out.reverse()}
   closed.add(ck);for(const n of this.neighbors(cur.c,cur.r,walkable)){const nk=key(n.c,n.r);if(closed.has(nk))continue;const ng=(g.get(ck)??Infinity)+1;if(ng<(g.get(nk)??Infinity)){came.set(nk,cur);g.set(nk,ng);f.set(nk,ng+this.h(n,goal));if(!open.some(o=>o.c===n.c&&o.r===n.r))open.push(n)}}
  }return[]
 }
 h(a,b){return Math.abs(a.c-b.c)+Math.abs(a.r-b.r)}
 blockedCells(){const out=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(this.type(c,r)!=='floor')out.push({c,r,type:this.type(c,r)});return out}
}

