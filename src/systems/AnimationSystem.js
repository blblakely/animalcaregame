// Each species has a different sprite-sheet layout. Dog column 7 is a sit
// pose, so it must never be used as the second side-walk frame.
export function animalWalkColumn(species,dx,dy,toggle=0){
 if(Math.abs(dx)>Math.abs(dy)){
  if(species==='Dog')return 6;
  return (species==='Rabbit'?7:6)+(toggle?1:0);
 }
 return dy<0?4+(toggle?1:0):1+(toggle?1:0);
}

