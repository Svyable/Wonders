// Modern Earth geography. NASA Blue Marble (local + public NASA GIBS tiles),
// with optional EOX Sentinel-2 Cloudless 2016 CC BY 4.0 detail. No ancient date claim.
const surface={active:false,lat:app.lat,lon:app.lon,z:7,tiles:new Map(),pointers:new Map(),drag:null,lastPinUpdate:0};
const sfEl=$('#surfaceMode'),sfTiles=$('#surfaceTiles'),sfCanvas=$('#surfaceFallback'),sfPins=$('#surfacePins');
const mercLat=lat=>Math.log(Math.tan(Math.PI/4+clamp(lat,-85,85)*rad/2));
const worldCoord=(lat,lon,z)=>({x:(lon+180)/360*256*2**z,y:(1-mercLat(lat)/Math.PI)/2*256*2**z});
const latFromY=(y,z)=>Math.atan(Math.sinh(Math.PI*(1-2*y/(256*2**z))))/rad;
const lonFromX=(x,z)=>x/(256*2**z)*360-180;
const wrappedLon=lon=>((lon+180)%360+360)%360-180;
function isSurfaceOpen(){return surface.active}
function setGlobeZoom(value){app.zoom=clamp(value,.69,3.05);if(app.zoom>=2.83){enterSurface();return}render()}
function enterSurface(){if(surface.active)return;surface.active=true;surface.lat=app.lat;surface.lon=wrappedLon(app.lon);surface.z=5;app.zoom=1.04;sfEl.parentElement.classList.add('surface-active');sfEl.classList.add('active');$('#globeCaption').textContent='GEOGRAPHIC APPROACH · MODERN IMAGERY';renderSurface();}
function leaveSurface(){if(!surface.active)return;surface.active=false;sfEl.classList.remove('active');sfEl.parentElement.classList.remove('surface-active');app.goalLat=app.lat=surface.lat;app.goalLon=app.lon=surface.lon;app.zoom=1.1;for(const i of surface.tiles.values())i.remove();surface.tiles.clear();render()}
function centerSurface(lat,lon){surface.lat=clamp(lat,-84,84);surface.lon=wrappedLon(lon);app.lat=app.goalLat=surface.lat;app.lon=app.goalLon=surface.lon;if(surface.active)renderSurface()}
function zoomSurface(delta){if(!surface.active){enterSurface();return}const old=surface.z;surface.z=clamp(old+delta,3,14);if(old!==surface.z)renderSurface()}
function renderSurfaceFallback(){const w=Math.max(1,Math.round(sfEl.clientWidth)),h=Math.max(1,Math.round(sfEl.clientHeight));if(sfCanvas.width!==w||sfCanvas.height!==h){sfCanvas.width=w;sfCanvas.height=h}const g=sfCanvas.getContext('2d');g.fillStyle='#11343d';g.fillRect(0,0,w,h);if(!textureImg.complete||!textureImg.naturalWidth)return;
 const sz=textureImg.naturalWidth,sh=textureImg.naturalHeight,scale=256*2**surface.z,c=worldCoord(surface.lat,surface.lon,surface.z),step=2;
 for(let yy=0;yy<h;yy+=step){const lat=latFromY(c.y+yy-h/2,surface.z),sy=clamp((90-lat)/180*sh,0,sh-1);const pxspan=w/scale*sz,sx=(c.x-w/2)/scale*sz;const sw=clamp(pxspan,.01,sz);const sourceY=Math.floor(sy);for(const offset of [-1,0,1]){const start=sx+offset*sz;if(start>=sz||start+pxspan<=0)continue;const tileLeft=Math.max(0,start),tileRight=Math.min(sz,start+pxspan);if(tileRight<=tileLeft)continue;const dl=(tileLeft-start)/pxspan*w, dw=(tileRight-tileLeft)/pxspan*w;g.drawImage(textureImg,tileLeft,sourceY,tileRight-tileLeft,1,dl,yy,dw,step)}}
}
function renderSurface(){if(!surface.active)return;renderSurfaceFallback();const w=sfEl.clientWidth,h=sfEl.clientHeight,c=worldCoord(surface.lat,surface.lon,surface.z),count=2**surface.z;
 const xMin=Math.floor((c.x-w/2)/256),xMax=Math.floor((c.x+w/2)/256),yMin=Math.max(0,Math.floor((c.y-h/2)/256)),yMax=Math.min(count-1,Math.floor((c.y+h/2)/256));
 const detail=surface.z>=9;const layer=detail?'eox':'nasa';$('#surfaceStatus').textContent=`${surface.z>=9?'SENTINEL-2 · 2016–17':'NASA BLUE MARBLE'} / Z${surface.z} / ${surface.lat.toFixed(2)}°, ${surface.lon.toFixed(2)}°`;
 $('#surfaceAttribution').innerHTML=detail?'<a href="https://cloudless.eox.at/documentation/license" target="_blank" rel="noopener">EOxCloudless 2016</a> · EOX IT Services (modified Copernicus Sentinel data 2016–17), CC BY 4.0 · modern reference':'<a href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/" target="_blank" rel="noopener">NASA Blue Marble</a> · modern reference, not historic terrain';
 const needed=new Set();for(let x=xMin;x<=xMax;x++)for(let y=yMin;y<=yMax;y++){if(y<0||y>=count)continue;const tileX=((x%count)+count)%count,key=`${layer}/${surface.z}/${tileX}/${y}`;needed.add(key);const left=x*256-c.x+w/2,top=y*256-c.y+h/2;let im=surface.tiles.get(key);if(!im){im=new Image();im.alt='';im.decoding='async';im.loading='eager';im.onload=()=>im.classList.add('loaded');im.onerror=()=>{im.remove();surface.tiles.delete(key)};sfTiles.append(im);surface.tiles.set(key,im);im.src=detail?`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/${surface.z}/${y}/${tileX}.jpg`:`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/${surface.z}/${y}/${tileX}.jpeg`;}im.style.left=left+'px';im.style.top=top+'px'}
 for(const [key,im] of surface.tiles){if(!needed.has(key)){im.remove();surface.tiles.delete(key)}}
 sfPins.replaceChildren();for(const s of SITES){const p=worldCoord(s.lat,s.lon,surface.z),dx=(((p.x-c.x+count*128)%(count*256)+count*256)%(count*256))-count*128,dy=p.y-c.y,x=w/2+dx,y=h/2+dy;if(x<12||x>w-12||y<12||y>h-12)continue;const b=document.createElement('button');b.type='button';b.className='surface-pin';b.textContent=(surface.z>9?s.name:'◆');b.title=s.name;b.setAttribute('aria-label','Explore '+s.name);b.style.left=x+'px';b.style.top=y+'px';b.onclick=()=>{focusSite(s.id);(PORTAL_MAP.has(s.id)?openPortal(s.id):openSite(s.id))};sfPins.append(b)}
 app.lon=app.goalLon=surface.lon;app.lat=app.goalLat=surface.lat;
}
sfEl.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;touch();surface.pointers.set(e.pointerId,[e.clientX,e.clientY]);if(surface.pointers.size===1){surface.drag={lat:surface.lat,lon:surface.lon,x:e.clientX,y:e.clientY}}sfEl.setPointerCapture(e.pointerId);sfEl.classList.add('panning')});
sfEl.addEventListener('pointermove',e=>{if(!surface.pointers.has(e.pointerId))return;surface.pointers.set(e.pointerId,[e.clientX,e.clientY]);if(surface.pointers.size!==1||!surface.drag)return;const start=worldCoord(surface.drag.lat,surface.drag.lon,surface.z),nx=start.x-(e.clientX-surface.drag.x),ny=start.y-(e.clientY-surface.drag.y);surface.lon=wrappedLon(lonFromX(nx,surface.z));surface.lat=clamp(latFromY(ny,surface.z),-84,84);renderSurface()});
function surfaceRelease(e){surface.pointers.delete(e.pointerId);if(!surface.pointers.size){surface.drag=null;sfEl.classList.remove('panning')}}
sfEl.addEventListener('pointerup',surfaceRelease);sfEl.addEventListener('pointercancel',surfaceRelease);
sfEl.addEventListener('wheel',e=>{e.preventDefault();touch();zoomSurface(e.deltaY<0?1:-1)},{passive:false});
$('#surfaceExit').onclick=()=>leaveSurface();
// Hover/focus, not background tile prefetch. Network is optional and may be unavailable.
