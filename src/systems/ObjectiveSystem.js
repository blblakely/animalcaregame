export class ObjectiveSystem {
  constructor(){ this.items=[['feed','Feed an animal'],['play','Play with an animal'],['clean','Clean an enclosure'],['profile','View an animal profile'],['adopt','Complete an adoption']].map(([id,label])=>({id,label,done:false})); }
  complete(id){ const item=this.items.find(i=>i.id===id); if(item&&!item.done){item.done=true;return true} return false; }
}

