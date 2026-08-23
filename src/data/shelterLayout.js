// Paw Haven's fixed prototype map lives in data, not in the artwork.
// A future build mode can replace these arrays without changing scene logic.
export const MAP = { width: 1200, height: 720 };

export const PEN_LAYOUT = {
  Dog: { bounds:{x:42,y:82,width:338,height:162}, gate:{x:200,y:270}, capacity:4,
    bowls:[{id:'dog-water',kind:'water',x:82,y:125},{id:'dog-food',kind:'food',x:340,y:125}],
    enrichment:[[105,175],[175,145],[250,180],[325,158]] },
  Rabbit: { bounds:{x:825,y:82,width:330,height:162}, gate:{x:1000,y:270}, capacity:4,
    bowls:[{id:'rabbit-water',kind:'water',x:858,y:125},{id:'rabbit-food',kind:'food',x:1120,y:125}],
    enrichment:[[870,175],[930,148],[1000,180],[1070,150]] },
  Cat: { bounds:{x:430,y:82,width:340,height:162}, gate:{x:600,y:270}, capacity:5,
    bowls:[{id:'cat-water',kind:'water',x:462,y:125},{id:'cat-food',kind:'food',x:738,y:125}],
    enrichment:[[475,175],[535,148],[605,180],[670,148],[730,180]] }
};

// Collision rectangles use centers because Phaser zones use center coordinates.
// Door openings are real gaps: no invisible collider spans them.
export const COLLIDERS = [
  {x:600,y:12,w:1200,h:24,type:'wall'}, {x:12,y:360,w:24,h:720,type:'wall'},
  {x:1188,y:360,w:24,h:720,type:'wall'},
  {x:260,y:708,w:520,h:24,type:'wall'}, {x:935,y:708,w:530,h:24,type:'wall'},
  // Closed pen fronts (including visually distinct gate doors).
  {x:200,y:266,w:400,h:22,type:'fence'}, {x:600,y:266,w:380,h:22,type:'fence'},
  {x:1000,y:266,w:400,h:22,type:'fence'},
  {x:405,y:150,w:22,h:275,type:'fence'}, {x:800,y:150,w:22,h:275,type:'fence'},
  // Bottom-room top walls with wide door gaps.
  {x:52,y:466,w:105,h:20,type:'wall'}, {x:218,y:466,w:55,h:20,type:'wall'},
  {x:282,y:466,w:65,h:20,type:'wall'}, {x:432,y:466,w:75,h:20,type:'wall'},
  {x:535,y:466,w:130,h:20,type:'wall'}, {x:750,y:466,w:140,h:20,type:'wall'},
  {x:867,y:466,w:95,h:20,type:'wall'}, {x:1132,y:466,w:135,h:20,type:'wall'},
  {x:250,y:590,w:20,h:250,type:'wall'}, {x:480,y:590,w:20,h:250,type:'wall'},
  {x:820,y:590,w:20,h:250,type:'wall'},
  // Physical furniture footprints only—not their full visible height.
  {x:93,y:625,w:155,h:72,type:'furniture'}, {x:365,y:630,w:135,h:70,type:'furniture'},
  {x:735,y:610,w:115,h:72,type:'furniture'}, {x:1070,y:625,w:190,h:75,type:'furniture'},
  {x:895,y:590,w:55,h:95,type:'furniture'}
];

export const INTERACTIONS = [
  {x:105,y:540,w:155,h:85,type:'food',label:'Food pantry'},
  {x:360,y:540,w:160,h:85,type:'cleaning',label:'Wash station'},
  {x:705,y:535,w:150,h:75,type:'desk',label:'Adoption desk'},
  {x:1040,y:535,w:170,h:80,type:'computer',label:'Intake computer'}
];

export const VIEWING_SPOTS = {
  Dog:[[120,335],[200,350],[290,335]], Cat:[[500,335],[600,350],[700,335]],
  Rabbit:[[900,335],[1000,350],[1090,335]]
};

// Connected public navigation graph. Edges only traverse open floor/doorways.
export const NAV_NODES = {
  entrance:[600,695], lobby:[600,590], reception:[650,520], hallCenter:[600,410],
  hallLeft:[250,410], hallRight:[950,410], pantry:[160,520], cleaning:[355,520],
  office:[1035,520], dogView:[200,350], catView:[600,350], rabbitView:[1000,350]
};
export const NAV_EDGES = {
  entrance:['lobby'], lobby:['entrance','reception','hallCenter'], reception:['lobby'],
  hallCenter:['lobby','hallLeft','hallRight','catView'], hallLeft:['hallCenter','dogView','pantry','cleaning'],
  hallRight:['hallCenter','rabbitView','office'], pantry:['hallLeft'], cleaning:['hallLeft'],
  office:['hallRight'], dogView:['hallLeft'], catView:['hallCenter'], rabbitView:['hallRight']
};

