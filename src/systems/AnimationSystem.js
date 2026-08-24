// Each species has a different sprite-sheet layout. Side cycles now use two
// dedicated walk cells; activity poses are never allowed into movement loops.
export function animalWalkColumn(species,dx,dy,toggle=0){
 if(Math.abs(dx)>Math.abs(dy)){
  return (species==='Rabbit'?7:6)+(toggle?1:0);
 }
 return dy<0?4+(toggle?1:0):1+(toggle?1:0);
}

