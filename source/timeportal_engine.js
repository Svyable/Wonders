// WonderTime / Timeportals — dependency-free, orbitable software 3D dioramas.
// All meshes are illustrative and intentionally unscaled, not archaeological scans.
const PORTAL_MAP = new Map(PORTALS.map(p => [p.id,p]));
const CIV_MAP = new Map(CIVILIZATIONS.map(p => [p.id,p]));
const TP_COLORS = {
  ochre:{sky:'#1a3037',mist:'#c69268',ground:'#6c5945',stone:'#d9b68c',light:'#edcfaa',dark:'#66523f',accent:'#dbad6b',green:'#69755a'},
  mist:{sky:'#142630',mist:'#aab4a1',ground:'#62765e',stone:'#c3baa6',light:'#e7dbc0',dark:'#66685f',accent:'#e2c487',green:'#6b8367'},
  rose:{sky:'#21303e',mist:'#d99575',ground:'#9b674c',stone:'#ca8665',light:'#efb28a',dark:'#6b3d3e',accent:'#ffd0a0',green:'#5a795d'},
  emerald:{sky:'#122f33',mist:'#95bba4',ground:'#4d725a',stone:'#9aaba0',light:'#d7d7bc',dark:'#466559',accent:'#d7bc8b',green:'#376d57'},
  jungle:{sky:'#122f35',mist:'#83b6aa',ground:'#3a6758',stone:'#aeb8a4',light:'#d8ccb1',dark:'#415a51',accent:'#dbc38d',green:'#366e58'},
  limestone:{sky:'#23353b',mist:'#c5b690',ground:'#8b8361',stone:'#d4c4a1',light:'#e5d6b4',dark:'#74735e',accent:'#dbc28b',green:'#59775e'},
  terracotta:{sky:'#20313b',mist:'#bc8b72',ground:'#9b785a',stone:'#bc9b79',light:'#e3c3a2',dark:'#756455',accent:'#d5ac79',green:'#527a6a'},
  basalt:{sky:'#1c303b',mist:'#9ca39b',ground:'#5a6662',stone:'#84918b',light:'#b6b9ab',dark:'#394b4f',accent:'#d7b892',green:'#547a64'},
  volcanic:{sky:'#1d2d37',mist:'#a69483',ground:'#65645c',stone:'#958a7b',light:'#c7b6a0',dark:'#4a4c4e',accent:'#dea97f',green:'#687661'},
  lagoon:{sky:'#0a333d',mist:'#6db9b9',ground:'#23676d',stone:'#7e9990',light:'#b9c3a9',dark:'#385f67',accent:'#d6c68d',green:'#326c64'},
  rainforest:{sky:'#12333a',mist:'#76aba5',ground:'#37634d',stone:'#a9ab8c',light:'#d0c7a2',dark:'#455846',accent:'#c5b17f',green:'#316947'},
  granite:{sky:'#28333a',mist:'#c7b495',ground:'#777a5d',stone:'#afa992',light:'#d4c6ab',dark:'#5e645a',accent:'#dfbc89',green:'#577557'},
  travertine:{sky:'#192c39',mist:'#d1ae89',ground:'#847966',stone:'#c5ae91',light:'#eed9b9',dark:'#7b6454',accent:'#e1b887',green:'#658364'},
  mountain:{sky:'#20323c',mist:'#8fb2ad',ground:'#546b62',stone:'#a6a79a',light:'#d1c6b5',dark:'#5b6b67',accent:'#d4ba8d',green:'#557661'},
  marble:{sky:'#1b3242',mist:'#bdcbd2',ground:'#53736c',stone:'#dfdfdb',light:'#f9ede2',dark:'#8eaaa6',accent:'#e6c88e',green:'#47725c'},
  sandstone:{sky:'#283541',mist:'#d3a981',ground:'#a57a57',stone:'#cba17a',light:'#e8c6a0',dark:'#785743',accent:'#efca95',green:'#5e7859'},
  tropical:{sky:'#19343a',mist:'#a3b99c',ground:'#517b63',stone:'#9b997b',light:'#cec2a3',dark:'#466c59',accent:'#d9b78b',green:'#39765e'},
  indus:{sky:'#253744',mist:'#c6b99a',ground:'#94806d',stone:'#b98e70',light:'#ddb99a',dark:'#7c6356',accent:'#d6bc89',green:'#65846a'},
  redrock:{sky:'#233340',mist:'#bb9179',ground:'#8e6753',stone:'#b98064',light:'#dea487',dark:'#754b45',accent:'#e2b98d',green:'#6e8166'},
  andes:{sky:'#183541',mist:'#a8bcc0',ground:'#54776c',stone:'#a3aa9d',light:'#d1c5ac',dark:'#56736c',accent:'#d8bb8c',green:'#4d725c'}
};
let tp = {id:null,p:1,playing:false,last:0,yaw:-.58,pitch:.49,zoom:1,drag:false,x:0,y:0,pointers:new Map(),raf:null};
const tpNode = document.getElementById('timeportal');
const tpCanvas = document.getElementById('tpCanvas');
const tpCtx = tpCanvas.getContext('2d',{alpha:false});
const tpClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function tpYear(y){return y<0?`c. ${Math.abs(Math.round(y)).toLocaleString()} BCE`:`${Math.round(y)} CE`}
function tpLerp(a,b,t){return a+(b-a)*t}
function tpCurrentYear(){if(!tp.id)return 2026;const stages=PORTAL_MAP.get(tp.id).stages;const i=tp.p<1?0:1;return tpLerp(stages[i].year,stages[i+1].year,tpClamp(tp.p-i,0,1));}
function tpStageIndex(){return tp.p<.49?0:tp.p<1.52?1:2}
function tpUpdateUI(){if(!tp.id)return;const s=siteMap.get(tp.id),p=PORTAL_MAP.get(tp.id),stage=tpStageIndex();
 const civ=CIV_MAP.get(tp.id),moment=civ?.stages[stage]||{},pop=moment.population;
 const civVal=(key)=>moment[key]||civ?.[key]||'Not established';
 document.getElementById('tpHudPopulation').textContent=pop?.value||'Not known';
 document.getElementById('tpHudLanguage').textContent=civVal('languages');
 document.getElementById('tpHudPolity').textContent=civVal('polity');
 document.getElementById('tpHudScope').textContent=pop?pop.scope+' · '+pop.confidence:'Population: '+(moment.population_note||civ?.population_note||'not quantified');
 document.getElementById('tpDataWriting').textContent=civVal('writing');
 document.getElementById('tpDataEngineering').textContent=civVal('engineering');
 document.getElementById('tpDataEcology').textContent=civVal('ecology');
 document.getElementById('tpDataNote').textContent=pop?pop.method+'; snapshot anchor '+tpYear(p.stages[stage].year)+'; not interpolated.':'Historical context tied to '+tpYear(p.stages[stage].year)+'. Missing figures are deliberately not guessed.';
 document.getElementById('tpDataSource').href=pop?.url||civ?.source||p.source;
 document.getElementById('tpDate').textContent=tp.p<.04||Math.abs(tp.p-1)<.04||tp.p>1.96?tpYear(p.stages[Math.round(tp.p)].year):tpYear(tpCurrentYear());
 document.getElementById('tpEra').textContent=p.stages[stage].name;
 document.getElementById('tpFinalTick').textContent=p.stages[2].year>=2025?'PRESENT / LEGACY':'TURNING POINT';
 document.getElementById('tpStory').textContent=p.stages[stage].story;
 document.getElementById('tpRange').value=Math.round(tp.p*500);
 document.getElementById('tpStatus').textContent=tp.playing?'PAUSE':'PLAY HISTORY';
 document.getElementById('tpChapter').textContent=`0${stage+1} / 03`;
 tpNode.querySelectorAll('[data-tp-stage]').forEach((b,i)=>b.classList.toggle('active',i===stage));
 if(s){document.getElementById('tpGlobeLabel').textContent=`${Math.abs(s.lat).toFixed(2)}° ${s.lat>=0?'N':'S'} / ${Math.abs(s.lon).toFixed(2)}° ${s.lon>=0?'E':'W'}`;}
}
function openPortal(id){const p=PORTAL_MAP.get(id),s=siteMap.get(id);if(!p||!s)return;
 closeOverlay();document.getElementById('conversation').classList.remove('open');
 tp.id=id;tp.p=1;tp.playing=false;tp.yaw=id==='petra'?.03:-.59;tp.pitch=.5;tp.zoom=1;tp.last=0;tp.pointers.clear();
 tpNode.classList.add('open');tpNode.setAttribute('aria-hidden','false');tpNode.querySelector('.tp-grid').scrollTop=0;
 document.getElementById('tpTitle').textContent=s.name;document.getElementById('tpLocation').textContent=`${s.place} · ${s.era}`;
 document.getElementById('tpFocus').textContent=s.focus;
 document.getElementById('tpCaveat').textContent=p.caveat;
 document.getElementById('tpSource').href=p.source;document.getElementById('tpSource').textContent='Primary site reference ↗';
 document.getElementById('tpStages').innerHTML=p.stages.map((e,i)=>`<button type="button" data-tp-stage="${i}" aria-label="Jump to ${escapeHtml(e.name)}"><span>${tpYear(e.year)}</span><strong>${escapeHtml(e.name)}</strong></button>`).join('');
 document.getElementById('tpStageFacts').textContent=`${s.fact}`;
 focusSite(id,true);tpUpdateUI();tpResize();tpDraw();if(!tp.raf)tp.raf=requestAnimationFrame(tpLoop);document.getElementById('tpClose').focus({preventScroll:true});tpNode.querySelector('.tp-grid').scrollTop=0;
}
function closePortal(){tp.playing=false;tpNode.classList.remove('open');tpNode.setAttribute('aria-hidden','true');if(tp.id){setYear(tpClamp(Math.round(tpCurrentYear()),-10000,2026))}tp.id=null;tp.pointers.clear()}
document.getElementById('tpClose').onclick=closePortal;
document.getElementById('tpRange').oninput=e=>{tp.playing=false;tp.p=Number(e.target.value)/500;tpUpdateUI();tpDraw()};
document.getElementById('tpStages').onclick=e=>{let b=e.target.closest('[data-tp-stage]');if(!b)return;tp.playing=false;tp.p=Number(b.dataset.tpStage);tpUpdateUI();tpDraw()};
document.getElementById('tpPlay').onclick=()=>{if(tp.p>=1.99&&!tp.playing)tp.p=0;tp.playing=!tp.playing;tpUpdateUI()};
document.getElementById('tpReset').onclick=()=>{tp.yaw=tp.id==='petra'?.03:-.59;tp.pitch=.5;tp.zoom=1;tpDraw()};
document.getElementById('tpZoomIn').onclick=()=>{tp.zoom=tpClamp(tp.zoom*1.18,.67,1.7);tpDraw()};
document.getElementById('tpZoomOut').onclick=()=>{tp.zoom=tpClamp(tp.zoom/1.18,.67,1.7);tpDraw()};
document.getElementById('tpShot').onclick=()=>{if(!tp.id)return;tpDraw();const a=document.createElement('a');a.href=tpCanvas.toDataURL('image/png');a.download=`WonderTime_${tp.id}_${tpStageIndex()+1}.png`;a.click()};
document.getElementById('tpNext').onclick=()=>{const ids=PORTALS.map(x=>x.id);let i=ids.indexOf(tp.id);openPortal(ids[(i+1)%ids.length])};
tpCanvas.addEventListener('pointerdown',e=>{tpCanvas.setPointerCapture(e.pointerId);tp.pointers.set(e.pointerId,[e.clientX,e.clientY]);tp.drag=true;tp.x=e.clientX;tp.y=e.clientY});
tpCanvas.addEventListener('pointermove',e=>{if(!tp.pointers.has(e.pointerId))return;const old=tp.pointers.get(e.pointerId);tp.pointers.set(e.pointerId,[e.clientX,e.clientY]);if(tp.pointers.size===2){const pts=[...tp.pointers.values()];const d=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);if(tp.pinchDistance)tp.zoom=tpClamp(tp.zoom*d/tp.pinchDistance,.65,1.8);tp.pinchDistance=d;tpDraw();return}tp.pinchDistance=null;tp.yaw+=(e.clientX-old[0])*.009;tp.pitch=tpClamp(tp.pitch+(e.clientY-old[1])*.005,.15,1.12);tpDraw()});
for(let ev of ['pointerup','pointercancel','lostpointercapture'])tpCanvas.addEventListener(ev,e=>{tp.pointers.delete(e.pointerId);tp.drag=tp.pointers.size>0;tp.pinchDistance=null});
tpCanvas.addEventListener('wheel',e=>{if(!tp.id)return;e.preventDefault();tp.zoom=tpClamp(tp.zoom*(e.deltaY>0?.91:1.10),.65,1.8);tpDraw()},{passive:false});
tpNode.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closePortal()}else if(e.key==='ArrowRight'&&!['INPUT'].includes(document.activeElement.tagName)){e.preventDefault();tp.p=tpClamp(tp.p+.1,0,2);tpUpdateUI();tpDraw()}else if(e.key==='ArrowLeft'&&!['INPUT'].includes(document.activeElement.tagName)){e.preventDefault();tp.p=tpClamp(tp.p-.1,0,2);tpUpdateUI();tpDraw()}});
function tpLoop(now){tp.raf=requestAnimationFrame(tpLoop);if(!tp.id)return;const dt=tp.last?Math.min(.07,(now-tp.last)/1000):0;tp.last=now;if(tp.playing){tp.p=tpClamp(tp.p+dt*.21,0,2);if(tp.p>=2)tp.playing=false;tpUpdateUI();tpDraw()}}
function tpResize(){if(!tp.id)return;const rect=tpCanvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const ratio=Math.min(devicePixelRatio||1,2);const w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);if(tpCanvas.width!==w||tpCanvas.height!==h){tpCanvas.width=w;tpCanvas.height=h}tpCtx.setTransform(ratio,0,0,ratio,0,0)}
window.addEventListener('resize',()=>{if(tp.id){tpResize();tpDraw()}});
// Geometry engine. Scene units are narrative units, NOT metres. Rendering uses painter-sorted
// polygons in an orbitable perspective camera, making the experience fully offline.
function tpScene(id,time){const P=PORTAL_MAP.get(id),C=TP_COLORS[P.palette]||TP_COLORS.limestone;const faces=[];const build=tpClamp(.16+time*.84,.16,1),aged=tpClamp(time-1,0,1);
 const toPoint=(x,y,z)=>[x,y,z];
 function polygon(points,color,alpha=1,line=null){faces.push({points,color,alpha,line})}
 function obox(x,y,z,w,h,d,color,rot=0,alpha=1){if(w<=0||h<=0||d<=0)return;const c=Math.cos(rot),s=Math.sin(rot),coord=(dx,dy,dz)=>toPoint(x+dx*c-dz*s,y+dy,z+dx*s+dz*c),X=w/2,Z=d/2;
  const a=coord(-X,0,-Z),b=coord(X,0,-Z),c1=coord(X,0,Z),d1=coord(-X,0,Z),A=coord(-X,h,-Z),B=coord(X,h,-Z),C1=coord(X,h,Z),D=coord(-X,h,Z);
  polygon([a,b,B,A],color,alpha);polygon([b,c1,C1,B],color,alpha);polygon([c1,d1,D,C1],color,alpha);polygon([d1,a,A,D],color,alpha);polygon([A,B,C1,D],tpMix(color,C.light,.22),alpha);
 }
 function linePath(pts,height,width,color){for(let i=0;i<pts.length-1;i++){let [a,b]=[pts[i],pts[i+1]],dx=b[0]-a[0],dz=b[1]-a[1],ang=Math.atan2(dz,dx);obox((a[0]+b[0])/2,0,(a[1]+b[1])/2,Math.hypot(dx,dz),height,width,color,ang)}}
 function cyl(x,y,z,r,h,color,n=12){if(h<=0)return;for(let i=0;i<n;i++){let a=2*Math.PI*i/n,b=2*Math.PI*(i+1)/n;polygon([[x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+r*Math.cos(b),y,z+r*Math.sin(b)],[x+r*Math.cos(b),y+h,z+r*Math.sin(b)],[x+r*Math.cos(a),y+h,z+r*Math.sin(a)]],i%2?color:tpMix(color,C.light,.08))}let top=[];for(let i=0;i<n;i++){const a=2*Math.PI*i/n;top.push([x+r*Math.cos(a),y+h,z+r*Math.sin(a)])}polygon(top,tpMix(color,C.light,.18))}
 function cone(x,y,z,r1,r2,h,color,n=14){if(h<=0)return;for(let i=0;i<n;i++){let a=2*Math.PI*i/n,b=2*Math.PI*(i+1)/n;polygon([[x+r1*Math.cos(a),y,z+r1*Math.sin(a)],[x+r1*Math.cos(b),y,z+r1*Math.sin(b)],[x+r2*Math.cos(b),y+h,z+r2*Math.sin(b)],[x+r2*Math.cos(a),y+h,z+r2*Math.sin(a)]],i%2?color:tpMix(color,C.light,.06))}}
 function pyramid(x,z,w,h,levels,color){for(let i=0;i<levels;i++){let f=(levels-i)/levels;obox(x,i*h/levels,z,w*f,h/levels,w*f, i%2?color:tpMix(color,C.light,.10))}obox(x,h,z,w*.14,.12,w*.14,C.accent)}
 function ring(x,z,r,n,h,thick,color,arc=Math.PI*2){for(let i=0;i<n;i++){let a=arc*i/n,b=arc*(i+1)/n,theta=(a+b)/2;obox(x+Math.cos(theta)*r,0,z+Math.sin(theta)*r,2*r*Math.sin((b-a)/2),h,thick,color,theta+Math.PI/2)}}
 function tree(x,z,k=1){cyl(x,0,z,.10*k,.9*k,C.dark,5);cone(x,.65*k,z,.7*k,.05*k,1.4*k,C.green,7)}
 function pool(x,z,w,d){obox(x,-.04,z,w,.08,d,'#285c65');polygon([[x-w/2,.05,z-d/2],[x+w/2,.05,z-d/2],[x+w/2,.05,z+d/2],[x-w/2,.05,z+d/2]],'#448f95',.83)}
 function blocksGrid(nx,nz,spacing,shiftx=0,shiftz=0){for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){let x=(a-(nx-1)/2)*spacing+shiftx,z=(b-(nz-1)/2)*spacing+shiftz,seed=(a*17+b*29)%7;obox(x,0,z,spacing*.64,.4+seed*.16,spacing*.65,C.stone)}}
 function columns(x0,z0,nx,nz,spacing,h,r=.22){for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){let x=x0+(a-(nx-1)/2)*spacing,z=z0+(b-(nz-1)/2)*spacing;cyl(x,0,z,r,h,C.light,8);obox(x,h,z,r*2.8,.24,r*2.8,C.accent)}}
 function mesa(x,z,baseR,h){for(let i=0;i<8;i++){let t=i/8,r=baseR*(.93-.22*t),y=h*i/8;cone(x,y,z,r,r*.94,h/8,i%2?C.dark:C.stone,13)}}
 function stairs(x,z,w,h,steps){for(let i=0;i<steps;i++)obox(x,i*h/steps,z+i*(h/steps)*.18,w*(1-i*.04),h/steps,Math.max(.6,4.2-i*.27),C.stone)}
 function ellipticalWall(x,z,rx,rz,h,color,n=38,start=0,end=Math.PI*2,gaps=[]){
  for(let i=0;i<n;i++){let mid=start+(end-start)*(i+.5)/n;if(gaps.some(g=>Math.abs(Math.atan2(Math.sin(mid-g),Math.cos(mid-g)))<.12))continue;
   let a=start+(end-start)*i/n,b=start+(end-start)*(i+1)/n,px=x+rx*Math.cos(mid),pz=z+rz*Math.sin(mid),dx=rx*(Math.cos(b)-Math.cos(a)),dz=rz*(Math.sin(b)-Math.sin(a));
   obox(px,0,pz,Math.hypot(dx,dz)*1.055,h,.65,color,Math.atan2(dz,dx));
  }
 }
 function lowWalls(x,z,w,d,h,color,gate=0){
  // Enclosing court walls with visible interior rather than solid windowless blocks.
  obox(x,0,z-d/2,w,h,.26,color);obox(x,0,z+d/2,w,h,.26,color);
  obox(x-w/2,0,z,.26,h,d,color);obox(x+w/2,0,z,.26,h,d,color);
  if(gate)obox(x,0,z+d/2,.85,.30,.30,C.dark);
 }
 function pitchedRoof(x,z,w,d,y,color){
  // Shallow four-sided ceramic roof, split to make a courtyard aperture legible.
  const ridge=.56;
  polygon([[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y+ridge,z],[x-w/2,y+ridge,z]],color);
  polygon([[x-w/2,y+ridge,z],[x+w/2,y+ridge,z],[x+w/2,y,z+d/2],[x-w/2,y,z+d/2]],tpMix(color,C.light,.12));
 }
 function globeMarkers(){/* reserved for future geo overlay */}
 const attrition={gobekli:.26,stonehenge:.08,petra:.05,machu:.18,angkor:.10,chichen:.12,teotihuacan:.25,borobudur:.05,rapanui:.10,nanmadol:.18,tikal:.15,greatzimbabwe:.07,pompeii:.08,rome:.16,greatwall:.10,taj:.03,abusimbel:.035,sigiriya:.25,mohenjo:.45,lalibela:.04,persepolis:.44,cusco:.15};
 const tall=build*(1-aged*(attrition[id]??.20)),safe=Math.max(.12,tall);
 // Horizontal architectural model base. This scene has no geodetic measurements.
 obox(0,-.47,0,30,.52,24,tpMix(C.ground,C.dark,.15));
 obox(0,-.02,0,29.9,.05,23.85,C.ground);
 // Symmetric procedural marks make the area feel like a geospatial field diorama.
 for(let z=-9;z<=9;z+=3)for(let x=-12;x<=12;x+=3){if(Math.abs(x)>12||Math.abs(z)>9)continue;obox(x,-.001,z,.03,.009,.03,tpMix(C.ground,C.light,.24))}
 const baseFaceCount=faces.length;
 switch(id){
 case 'gobekli':{
  for(const [cx,cz,rr] of [[-3.7,0,5],[5,1.5,3.6]]){ring(cx,cz,rr,22,.75*safe,.72,C.dark);for(let i=0;i<12;i++){const a=i*Math.PI/6,x=cx+rr*Math.cos(a),z=cz+rr*Math.sin(a);obox(x,0,z,.58,(2.4+(i%3)*.15)*safe,.53,C.stone);obox(x,2.16*safe,z,1.16,.43*safe,.54,C.light)}for(let dx of [-1.4,1.4]){obox(cx+dx,0,cz,.79,4.3*safe,.72,C.light);obox(cx+dx,4.0*safe,cz,1.68,.50*safe,.76,C.stone)}}break}
 case 'stonehenge':{
  ring(0,0,8,48,.16,.34,C.dark);for(let i=0;i<25;i++){if(aged>.3&&(i%5===1||i%7===2))continue;let a=i*Math.PI*2/25,x=6.6*Math.cos(a),z=6.6*Math.sin(a),h=3.7*safe*(1-aged*.12);obox(x,0,z,.75,h,1.15,C.stone,a+.22);if(aged<.7||i%4===0)obox(x,h,z,1.6,.49*safe,1.2,C.light,a+.22)}for(let i=0;i<5;i++){let a=(i/5)*Math.PI*1.8;let x=3.0*Math.cos(a),z=3*Math.sin(a);obox(x-1.1,0,z,.8,4.4*safe,1,C.stone);obox(x+1.1,0,z,.8,4.4*safe,1,C.stone);obox(x,4.4*safe,z,3.1,.53*safe,1.1,C.light)}break}
 case 'petra':{
  // Canyon wall and generic rock-cut facade silhouette. Deliberately not a measured Treasury.
  for(let i=0;i<10;i++){let x=(i-4.5)*2.6;obox(x,0,-5.6,2.72, (6.0+Math.sin(i*2.4)*1.8)*safe,3.1,i%3===0?C.dark:C.stone)}
  obox(0,0,-3.84,12,6.1*safe,.50,C.light);columns(0,-3.15,6,1,1.8,3.7*safe,.26);
  obox(0,4.2*safe,-3.18,11,.44*safe,.9,C.accent);obox(0,4.67*safe,-3.2,7,.24*safe,1,C.light);
  cone(0,5*safe,-3.1,1.5,0,1.6*safe,C.light,12);cyl(0,5*safe,-3.1,.68,1.1*safe,C.stone,12);
  for(let i=0;i<7;i++){let x=i*1.2-3.6;obox(x,0,-4,.5,.22,.7,C.dark)}break}
 case 'machu':{
  for(let row=0;row<7;row++){let z=-8+row*2.15,w=19-row*.58;obox(-1,0,z,w,(.33+row*.30)*safe,1.9,row%2?C.stone:C.dark)}
  for(let i=0;i<18;i++){let x=(i%6)*2-5,z=Math.floor(i/6)*2.3-1;obox(x,(i%3)*.05,z,1.65,1.8*safe,1.33,C.stone);cone(x,1.8*safe,z,1.35,.12,.98*safe,C.dark,4)}
  for(let i=0;i<7;i++)tree(9-i*.8,4+i%2*2,1);break}
 case 'angkor':{
  pool(0,0,25,19);obox(0,.06,0,18,.22,13,C.stone);obox(0,.33,0,12,1.2*safe,9,C.dark);obox(0,1.48*safe,0,7,1.15*safe,5.5,C.stone);
  for(let [x,z,h] of [[0,0,6],[5,3,4],[-5,3,4],[5,-3,4],[-5,-3,4]]){obox(x,1.3*safe,z,2.2,1*safe,2.2,C.stone);cone(x,2.3*safe,z,1.1,.15,(h-1.6)*safe,C.light,9)}
  obox(0,.1,-9,2.1,.25,13,C.accent);break}
 case 'chichen':{
  pyramid(0,0,14,8*safe,9,C.stone);stairs(0,-7.5,1.55,7.7*safe,9);obox(0,8*safe,0,2.6,1.35*safe,2.6,C.light);
  for(let i=0;i<8;i++){let x=i<4?-10:10,z=(i%4)*4-6;cyl(x,0,z,.36,1.3*safe,C.light)}break}
 case 'teotihuacan':{
  obox(0,.02,0,4,.09,23,C.accent);pyramid(-4,-3,11,6.6*safe,7,C.stone);pyramid(3,6,8,4.5*safe,6,C.light);
  for(let k=0;k<10;k++){let z=-10+k*2.1;obox(-10,.01,z,3.3,.7*safe,2,C.dark);obox(9,.01,z,3.3,.6*safe,2,C.dark)}break}
 case 'borobudur':{
  for(let i=0;i<6;i++){let w=18-i*2.4;obox(0,i*.7*safe,0,w,.75*safe,w,C.stone)}
  for(let k=0;k<3;k++){let r=5.2-k*1.8,y=(4.2+k*.66)*safe;for(let i=0;i<8+k*3;i++){let a=i*2*Math.PI/(8+k*3),x=r*Math.cos(a),z=r*Math.sin(a);cyl(x,y,z,.48,.55*safe,C.light,8);cone(x,y+.53*safe,z,.52,.10,.77*safe,C.light,8)}}cyl(0,6.2*safe,0,1.2,1.15*safe,C.light);cone(0,7.2*safe,0,1.2,.07,1.15*safe,C.stone);break}
 case 'rapanui':{
  obox(0,0,2,21,1.05*safe,4,C.dark);for(let i=0;i<7;i++){let x=(i-3)*2.8;obox(x,1*safe,2,.98,3.25*safe,.78,C.stone);obox(x,4.14*safe,1.85,1.35,1.28*safe,1,C.light);obox(x,4.8*safe,1.3,.30,.68*safe,.45,C.stone);obox(x,3*safe,1.4,.85,.22,.25,C.dark)}for(let i=0;i<4;i++)tree(-11+i*5,-7,.7);break}
 case 'nanmadol':{
  pool(0,0,29,23);for(let a=0;a<5;a++)for(let b=0;b<3;b++){let x=(a-2)*5.1,z=(b-1)*6.5;obox(x,.06,z,3.4,.42*safe,4.5,C.ground);for(let k=0;k<4;k++){obox(x-1.5,.4*safe+k*.27*safe,z, .54,.28*safe,4.2,C.stone);obox(x+1.5,.4*safe+k*.27*safe,z,.54,.28*safe,4.2,C.stone)}if((a+b)%2===0){obox(x,0.45*safe,z-1.9,3,.7*safe,.5,C.light);obox(x,0.45*safe,z+1.9,3,.7*safe,.5,C.light)}}break}
 case 'tikal':{
  for(let [x,z,w,h] of [[-4,3,8.8,8.6],[5,-3,6.2,6.2],[-9,-5,3.4,3.1]]){pyramid(x,z,w,h*safe,7,C.stone);obox(x,h*safe,z,2.7,1.35*safe,2.5,C.light);obox(x,(h+1.35)*safe,z,1.3,.82*safe,2,C.dark)}for(let i=0;i<28;i++){let x=((i*23)%31-15)*.84,z=((i*37)%29-14)*.80;if(Math.abs(x)<6&&Math.abs(z)<6)continue;tree(x,z,.75+(i%3)*.35)}break}
 case 'greatzimbabwe':{
  // Great Enclosure is elliptical dry-stone masonry, not a circular castle.
  // A partial eastern entrance and conical tower are rendered schematically.
  obox(0,.02,0,23,.13,18,tpMix(C.ground,C.dark,.23));
  ellipticalWall(0,1,10.0,6.6,4.3*safe,C.stone,55,0,Math.PI*2,[.16]);
  ellipticalWall(-1.0,1.1,5.8,3.5,2.65*safe,C.dark,37,.10,Math.PI*1.72,[1.5]);
  // Chevron-like masonry registers on outer northern arc, interpretive only.
  for(let k=0;k<11;k++){let a=2.6+k*.10,x=10*Math.cos(a),z=1+6.6*Math.sin(a);obox(x,3.8*safe,z,.4,.22*safe,.18,C.light)}
  cone(3.0,0,2.2,1.15,.24,4.7*safe,C.light,16);
  // Round domestic structures beyond the stone enclosure.
  for(const [x,z,r] of [[-9,-7,1.4],[-5,-7.5,.95],[7,-6.8,1.1]]){
    cyl(x,0,z,r,.76*safe,C.dark,10);if(aged<.8)cone(x,.76*safe,z,r*1.18,0,1.1*safe,C.accent,9);
  }
  // Granite hill enclosure in the distance, separate from the Great Enclosure.
  for(const [x,z,r,h] of [[-8,8,3.2,2.9],[-11,8,2.7,2.1],[-6,10,2.0,2.6]])cone(x,0,z,r,r*.47,h*safe,C.dark,10);
  for(let k=0;k<11;k++){let x=-12+k*.55,z=7.2+Math.sin(k*.6)*.7;obox(x,.55*safe,z,.9,1.2*safe,.45,C.stone)}
  break}

 case 'pompeii':{
  // Roman city typology, deliberately NOT a street-by-street archaeological survey.
  // A forum, basalt streets, atrium houses, water, shops and oval amphitheatre give
  // a legible urban section. 79 CE is pumice/ash, not lava.
  const catastrophe=tpClamp((time-1.09)/.91,0,1),occupied=tpClamp(.34+time*.66,.34,1);
  const basalt='#454b51',kerb='#b3aa96',red='#a85845',ash='#b4aba1';
  // Inlaid basalt street ribbons and raised Roman sidewalks.
  for(const z of [-4.4,4.0]){
   obox(0,.08,z,28.4,.12,2.3,basalt);obox(0,.15,z-1.2,28.4,.14,.22,kerb);obox(0,.15,z+1.2,28.4,.14,.22,kerb);
   for(let x=-13;x<=13;x+=1.9)obox(x,.205,z,.04,.01,2.1,'#6b6e69');
  }
  for(const x of [-3.2,5.4]){
   obox(x,.09,0,2.1,.12,22.2,basalt);
   obox(x-1.13,.16,0,.19,.14,22.2,kerb);obox(x+1.13,.16,0,.19,.14,22.2,kerb);
   for(let z=-10;z<=10;z+=2)obox(x,.207,z,1.8,.012,.035,'#6c6c66');
  }
  // Stepping-stone pedestrian crossings: not exact surveyed placement.
  for(const [x,z] of [[-3.2,4],[-3.2,-4.4],[5.4,4],[5.4,-4.4]]){
   for(const o of [-.58,0,.58])obox(x+o,.24,z,.46,.15,.51,C.light);
  }
  // Enclosing urban circuit and small gates in the representative slice.
  for(const z of [-11.1,11.1])obox(0,0,z,28.5,(1.0-catastrophe*.4)*safe,.35,C.dark);
  for(const x of [-14,14])obox(x,0,0,.37,(1.0-catastrophe*.4)*safe,21.7,C.dark);
  for(const [x,z] of [[-13,-10],[-13,10],[13,-10],[13,10]])obox(x,0,z,.9,(1.9-catastrophe*.5)*safe,.9,C.stone);
  // Forum in western sector, an open plaza ringed by porticoes.
  obox(-9.5,.10,.2,6.4,.11,6.25,tpMix(C.stone,C.light,.26));
  for(let i=0;i<6;i++)for(const z of [-2.47,2.75])cyl(-12.1+i*1.03,.18,z,.15,1.42*occupied*(1-catastrophe*.35),C.light,7);
  for(let i=0;i<5;i++)for(const x of [-12.1,-6.9])cyl(x,.18,-1.9+i*1.13,.13,1.3*occupied*(1-catastrophe*.35),C.light,7);
  obox(-9.5,.22,-2.7,3.5,.6*safe,1.3,C.stone);columns(-9.5,-2.7,4,1,.73,1.5*occupied*(1-catastrophe*.45),.19);
  // Insulae: representative domus with open courtyards, perimeter rooms, roof tiles,
  // shop openings facing the streets. Affected roofs diminish during the eruption.
  const plots=[[-9,-8.3],[.9,-8.2],[10,-8.0],[.9,.0],[10,.0],[-9,8.1],[.9,8.0]];
  for(let i=0;i<plots.length;i++){
   if(time<.45&&i%3===1)continue;
   const [x,z]=plots[i],w=(i%2?4.4:4.9),d=3.5,h=(1.4+(i%3)*.15)*occupied*(1-catastrophe*.32);
   obox(x,.20,z,w,.09,d,'#c6b198');
   // Atrium court; walls around an open central basin.
   for(const sx of [-1,1])obox(x+sx*(w/2-.35),.22,z,.5,h,d,C.stone);
   for(const sz of [-1,1])obox(x,.22,z+sz*(d/2-.31),w-.5,h,.50,i%2?C.light:C.stone);
   obox(x,.30,z,1.07,.08,.84,'#63858c');
   // Parallel ridges for tiled roof edges; the courtyard stays open to the sky.
   if(catastrophe<.92){
    const fade=1-catastrophe*(i%2?.65:.91);
    if(fade>.19){for(const sx of [-1,1])obox(x+sx*(w/2-.64),.22+h,z,.95,.17*fade,d+.3,red);
     for(const sz of [-1,1])obox(x,.22+h,z+sz*(d/2-.49),w-1.45,.17*fade,.94,red)}
   }
   // Street-side taberna front, narrow shop openings and painted lintels.
   if(i%2===0){for(const dx of [-1.25,.12,1.35]){
    obox(x+dx,.23+h*.42,z-d/2-.19,.90,.13,.16,red);
    obox(x+dx,.22,z-d/2-.26,.55,.44*occupied,.18,C.dark);
   }}
   if(catastrophe>.3){for(let k=0;k<3;k++)obox(x-1.4+k*1.4,.11,z+(k%2)*.85,1.1,.11*catastrophe,.65,ash)}
  }
  // Amphitheatre east edge: concentric oval seating around an open arena.
  if(time>.31){
   const aX=9.2,aZ=7.1,ramp=(1-catastrophe*.47)*safe;
   for(let tier=0;tier<3;tier++){
    let rx=4.3-tier*.65,rz=3.0-tier*.48,h=(.75+tier*.55)*ramp;
    for(let k=0;k<42;k++){
     const th=2*Math.PI*(k+.5)/42,a=2*Math.PI*k/42,b=2*Math.PI*(k+1)/42;
     if(catastrophe>.65&&(k%9===1||k%13===0))continue;
     const px=aX+rx*Math.cos(th),pz=aZ+rz*Math.sin(th),dx=rx*(Math.cos(b)-Math.cos(a)),dz=rz*(Math.sin(b)-Math.sin(a));
     obox(px,.14,pz,Math.hypot(dx,dz)*1.08,h,.38,tier===0?C.dark:tier===1?C.stone:C.light,Math.atan2(dz,dx));
    }
   }
   cyl(aX,.18,aZ,1.25,.10,'#b69c80',20);
  }
  // The event depiction uses drifting pale pumice deposits, not molten lava.
  if(catastrophe>.05){for(let k=0;k<28;k++){
   const x=((k*53)%281)/10-14,z=((k*71)%201)/10-10,h=(.04+catastrophe*.13)*((k%4)+1);
   obox(x,.29,z,.22+(k%3)*.26,h,.26+(k%4)*.23,ash,0,.25+catastrophe*.55);
  }}
  break}

 case 'rome':{
  const n=40;for(let i=0;i<n;i++){let a=i*2*Math.PI/n,x=7.7*Math.cos(a),z=5.5*Math.sin(a);if(aged>.1&&(i%6===1||i%9===2))continue;let ang=a+Math.PI/2;for(let floor=0;floor<3;floor++){obox(x,(floor*1.6)*safe,z,1.25,.52*safe,.85,C.stone,ang);obox(x,(floor*1.6+1.10)*safe,z,1.25,.46*safe,.84,C.light,ang);obox(x,(floor*1.6+.47)*safe,z,.39,.63*safe,.85,C.dark,ang)} }obox(0,.09,0,9,.10,6.4,C.dark);break}
 case 'greatwall':{
  const path=[[-14,7],[-10,3],[-7,5],[-3,-1],[1,2],[5,-3],[9,0],[13,-7]];linePath(path,1.9*safe,1.8,C.stone);for(let i=1;i<path.length-1;i+=2){let [x,z]=path[i];obox(x,0,z,2.7,3.4*safe,2.7,C.dark);obox(x,3.1*safe,z,3.1,.45*safe,3.1,C.light)}for(let i=0;i<12;i++){let x=-14+i*2.5,z=9-((i*5)%8);tree(x,z,.6)}break}
 case 'taj':{
  pool(0,-7,2.5,8);obox(0,.07,2,18,.55,10,C.light);obox(0,.6,2,9,3.5*safe,6.9,C.stone);
  cyl(0,4.05*safe,2,2.8,.60*safe,C.light,16);cone(0,4.6*safe,2,3.05,.1,3.5*safe,C.light,20);cyl(0,8.1*safe,2,.15,.7*safe,C.accent);
  for(let [x,z] of [[-8,-2],[-8,6],[8,-2],[8,6]]){cyl(x,.5,z,.52,6.8*safe,C.light,10);cyl(x,7.2*safe,z,.65,.40*safe,C.stone);cone(x,7.6*safe,z,.8,0,1.3*safe,C.light,10)}
  for(let x of [-4,4])obox(x,1.1*safe,-1.55,1.5,2.4*safe,.28,C.dark);break}
 case 'abusimbel':{
  for(let i=0;i<14;i++){let x=-13+i*2;obox(x,0,4,2.2,(4.5+Math.sin(i*2)*1.3)*safe,5,i%2?C.stone:C.dark)}
  obox(0,0,1.25,16,5*safe,.8,C.stone);for(let k=0;k<4;k++){let x=(k-1.5)*3.8;obox(x,0,.65,2.3,3.35*safe,1.5,C.light);obox(x,3.2*safe,.60,2.65,1.45*safe,1.8,C.stone);obox(x,1.1*safe,-.15,1.2,.28*safe,.45,C.dark)}obox(0,0,-1,1.7,2.3*safe,1.4,C.dark);break}
 case 'sigiriya':{
  mesa(0,0,5,9.5*safe);obox(0,9.4*safe,0,7,.35*safe,5,C.stone);if(aged<.8){obox(0,9.7*safe,0,4.3,2.1*safe,3.8,C.light)}
  for(let i=0;i<9;i++){let z=-10+i*2;obox(6+(i%3)*1.2,0,z,4,.45*safe,1.35,C.stone)}for(let i=0;i<12;i++)tree(-13+(i%4)*3.1,-9+Math.floor(i/4)*7,.8);break}
 case 'mohenjo':{
  // Indus settlement: ordered streets, baked-brick compounds and a sunken bath.
  const brick='#b17d64',street='#8b796b';
  for(let x=-10;x<=10;x+=5.4)obox(x,.09,0,1.25,.10,22,street);
  for(let z=-8;z<=8;z+=5.3)obox(0,.09,z,27,.1,1.4,street);
  for(let a=0;a<4;a++)for(let b=0;b<3;b++){
   let x=-7.5+a*5.0,z=-5.4+b*5.2,w=3.4,d=3.3,h=(.95+((a+b)%3)*.22)*safe;
   obox(x,.16,z,w,.12,d,brick);lowWalls(x,z,w,d,h,brick);
   obox(x-.92,.22,z-.76,.75,.34*safe,.7,C.dark);
   // Flat roofs were typical; leave many courts uncovered to reveal drainage.
   if((a+b)%4===0 && aged<.4)obox(x,.16+h,z,w,.15,d,brick);
   for(let k=0;k<3;k++)obox(x-w/2+k*.50,.3,z+d/2,.35,.11,.18,C.light);
  }
  // Great Bath archetype: sunken rectangular basin and galleries.
  obox(-5.7,.2,-.1,8.2,.55*safe,5.5,C.stone);
  obox(-5.7,.78*safe,-.1,6.7,.10,3.8,C.dark);
  pool(-5.7,-.1,5.7,2.7);
  for(let k=0;k<4;k++)obox(-8+k*.46,.14,-.1,1.2,.15*safe,2.2,C.light);
  for(const z of [-2.45,2.2])for(let i=0;i<7;i++)cyl(-9.2+i*1.15,.3,z,.13,.75*safe,C.light,6);
  // Public well rings and brick drains.
  for(const [x,z] of [[10,-2],[4,7]]){cyl(x,.17,z,.55,.62*safe,C.light,14);cyl(x,.78*safe,z,.43,.11,C.dark,14)}
  break}

 case 'lalibela':{
  // Bet Giyorgis-inspired cruciform roof in a deep excavated courtyard.
  // A cutaway schematic: rock surfaces and trench are NOT a measured plan.
  obox(0,.07,0,23,.18,18,C.stone); // plateau surface
  obox(0,.27,0,15,.07,14,C.dark); // excavation trench
  obox(0,.32,0,11,.14,11,tpMix(C.dark,C.stone,.18));
  // Small central cross church set within cut rock, carved as one volume.
  obox(0,.43,0,3.7,1.85*safe,9.2,C.light);
  obox(0,.43,0,9.1,1.85*safe,3.7,C.light);
  // Cross roof relief matching lower cross below, not a freestanding tower.
  obox(0,2.27*safe,0,1.2,.27,6.8,C.stone);
  obox(0,2.27*safe,0,6.8,.27,1.2,C.stone);
  for(const [x,z] of [[-4.5,-4.8],[4.5,-4.8],[-4.5,4.8],[4.5,4.8]]){
   obox(x,.37,z,1.4,.45*safe,1.25,C.dark);
  }
  // Topographic stepped cut into volcanic tuff.
  for(let k=0;k<3;k++){
   let w=16+k*1.2,d=15+k*.9;
   obox(-w/2,.22,0,.32,.45*safe,d,C.stone);obox(w/2,.22,0,.32,.45*safe,d,C.stone);
   obox(0,.22,-d/2,w,.45*safe,.32,C.stone);obox(0,.22,d/2,w,.45*safe,.32,C.stone);
  }
  for(let i=0;i<7;i++){let x=-11+i*3.7;obox(x,.38,-8.5,.8,.52*safe,1,C.dark)}
  break}

 case 'persepolis':{
  obox(0,.07,0,21,1.05*safe,15,C.stone);columns(0,1,6,4,2.7,5.7*safe,.28);
  obox(0,6.05*safe,1,18,.38*safe,12,C.dark,0,1-aged*.79);for(let i=0;i<8;i++)obox((i-3.5)*1.5,.16*safe,-8-i*.08,.98,.2*safe,1.3,C.light);break}
 case 'cusco':{
  for(let j=0;j<3;j++){const path=[];for(let i=0;i<10;i++)path.push([-13+i*2.9,(j-1)*5.5+(i%2)*1.6]);linePath(path,(1.1+j*.55)*safe,1.2,j%2?C.stone:C.light)}
  for(let k=0;k<7;k++){let x=-11+k*3.5;obox(x,0,9,2.5,1.4*safe,2.5,C.dark)}for(let i=0;i<8;i++)tree(-12+i*3,-9,.7);break}
 }
 return {faces,C,build,aged,baseFaceCount};
}
function tpHex(h){const m=String(h).replace('#','');return [0,2,4].map(i=>parseInt(m.slice(i,i+2),16)||0)}
function tpMix(a,b,f){let x=tpHex(a),y=tpHex(b),v=x.map((n,i)=>Math.round(n+(y[i]-n)*f));return '#'+v.map(n=>tpClamp(n,0,255).toString(16).padStart(2,'0')).join('')}
function tpDraw(){if(!tp.id)return;tpResize();const c=tpCtx,rect=tpCanvas.getBoundingClientRect(),W=rect.width,H=rect.height;if(!W||!H)return;const P=PORTAL_MAP.get(tp.id),{faces,C,aged,baseFaceCount}=tpScene(tp.id,tp.p);c.clearRect(0,0,W,H);
 const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,tpMix(C.sky,'#020e17',.3));sky.addColorStop(.55,C.sky);sky.addColorStop(1,tpMix(C.mist,C.sky,.62));c.fillStyle=sky;c.fillRect(0,0,W,H);
 let glow=c.createRadialGradient(W*.58,H*.31,20,W*.55,H*.35,W*.67);glow.addColorStop(0,tpRgba(C.accent,.15));glow.addColorStop(1,tpRgba(C.accent,0));c.fillStyle=glow;c.fillRect(0,0,W,H);
 // Pompeii's 79 CE event: atmospheric ash plume over Vesuvius, never lava.
 if(tp.id==='pompeii'&&tp.p>1.12){
  const k=tpClamp((tp.p-1.12)/.88,0,1),mx=W*.75,my=H*.44;
  c.fillStyle=tpRgba(C.dark,.18+.2*k);c.beginPath();c.moveTo(W*.60,H*.59);c.lineTo(mx,H*.43);c.lineTo(W*.91,H*.60);c.closePath();c.fill();
  const ash=c.createLinearGradient(mx,my-200*k,mx,H*.60);ash.addColorStop(0,'rgba(148,149,145,.02)');ash.addColorStop(.55,'rgba(161,159,155,.30)');ash.addColorStop(1,'rgba(78,82,85,.22)');
  c.fillStyle=ash;c.beginPath();c.moveTo(mx-15,my);c.bezierCurveTo(mx-65,my-75*k,mx+70,my-125*k,mx-30,my-205*k);c.bezierCurveTo(mx+145,my-225*k,mx+136,my-96*k,mx+26,my-55*k);c.lineTo(mx+24,my);c.closePath();c.fill();
  for(let j=0;j<6;j++){let x=mx+Math.sin(j*1.8)*40*k,y=my-(80+j*16)*k,r=18+j*3;c.fillStyle=`rgba(176,173,168,${(.04+.035*j)*k})`;c.beginPath();c.ellipse(x,y,r*2,r,0,0,Math.PI*2);c.fill()}
 }
 // Haze and landscape are decorative silhouettes, not surveyed terrain.
 for(let r=0;r<3;r++){c.beginPath();c.moveTo(0,H*(.55+r*.064));for(let i=0;i<=24;i++){const x=i/24*W,cx=i*.6+r;const ry=H*(.54+r*.065)+Math.sin(cx*1.2)*H*.019+Math.cos(cx*.51)*H*.018;c.lineTo(x,ry)}c.lineTo(W,H);c.lineTo(0,H);c.fillStyle=tpRgba(C.ground,.16+r*.10);c.fill()}
 const u=Math.min(W/37,H/26)*tp.zoom,cy=H*.61,cx=W*.5,sy=Math.sin(tp.yaw),co=Math.cos(tp.yaw),sp=Math.sin(tp.pitch),cp=Math.cos(tp.pitch);
 function project(p){let [x,y,z]=p,xr=x*co+z*sy,zr=z*co-x*sy,yr=y*cp-zr*sp,depth=y*sp+zr*cp,scale=1/(1-depth/85);return {x:cx+xr*u*scale,y:cy-yr*u*scale,depth}}
 const drawlist=faces.map((f,i)=>{const points=f.points.map(project),depth=points.reduce((sum,p)=>sum+p.depth,0)/points.length;return {points,depth,layer:i<baseFaceCount?0:1,color:f.color,alpha:f.alpha,line:f.line}}).sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
 for(let f of drawlist){c.beginPath();f.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.globalAlpha=f.alpha;c.fillStyle=f.color;c.fill();c.strokeStyle=tpRgba(C.dark,.22);c.lineWidth=.55;c.stroke()}c.globalAlpha=1;
 if(tp.id==='pompeii'&&tp.p>1.10){
  // Falling pumice is an illustrative ash effect. Do not use as a dated quantitative depth.
  const k=tpClamp((tp.p-1.10)/.90,0,1);c.fillStyle=tpRgba('#d8d0c4',k*.42);
  for(let j=0;j<110;j++){let xx=((j*193+29)%1009)/1009*W,yy=((j*127+7)%997)/997*H;
   c.fillRect(xx,yy,(j%3)+.6,(j%4)+1)}
 }
 // Frame vignette, anchored annotations and subtle spatial scale marks.
 const vig=c.createRadialGradient(W*.5,H*.48,H*.1,W*.5,H*.5,Math.max(W,H)*.64);vig.addColorStop(0,'rgba(2,13,20,0)');vig.addColorStop(1,'rgba(2,13,20,.49)');c.fillStyle=vig;c.fillRect(0,0,W,H);
 c.strokeStyle=tpRgba(C.accent,.24);c.lineWidth=1;c.beginPath();c.moveTo(22,H-38);c.lineTo(90,H-38);c.moveTo(22,H-43);c.lineTo(22,H-33);c.moveTo(90,H-43);c.lineTo(90,H-33);c.stroke();c.font='10px ui-monospace,monospace';c.fillStyle=tpRgba(C.light,.66);c.fillText('ILLUSTRATIVE SCALE',22,H-49);
}
function tpRgba(hex,a){let [r,g,b]=tpHex(hex);return `rgba(${r},${g},${b},${a})`}
