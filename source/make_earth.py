from PIL import Image,ImageDraw,ImageFilter
from mpl_toolkits.basemap import Basemap
import numpy as np
from scipy.ndimage import gaussian_filter
from pathlib import Path
W,H=2048,1024
rng=np.random.default_rng(134)
base=np.zeros((H,W,3),dtype=np.float32)
y,x=np.mgrid[0:H,0:W].astype(np.float32)
lat=(.5-y/H)*180
lon=(x/W-.5)*360
noise=(gaussian_filter(rng.normal(size=(H,W)),15)*24+gaussian_filter(rng.normal(size=(H,W)),3)*3)
noise=noise/(np.std(noise)+1e-8)
# Deliberately stylized globe, not a satellite or topographical survey.
ocean=np.stack([13+1.1*noise,49+3.4*noise,64+5.1*noise],axis=2)
base[:]=ocean
mask=Image.new('L',(W,H),0); d=ImageDraw.Draw(mask)
b=Basemap(projection='cyl',llcrnrlon=-180,llcrnrlat=-89.9,urcrnrlon=180,urcrnrlat=89.9,resolution='c')
for p in b.landpolygons:
    coords=p.get_coords()
    pts=[((float(a)+180)/360*W,(90-float(c))/180*H) for a,c in coords]
    if len(pts)>2: d.polygon(pts,fill=255)
land=np.asarray(mask)>0
# deserts in subtropical northern Africa and Arabia, central Asia and Australia
sahara=(lat>12)&(lat<35)&(lon>-18)&(lon<61)
arabian=(lat>12)&(lat<31)&(lon>32)&(lon<62)
australia=(lat<-15)&(lat>-35)&(lon>113)&(lon<151)
central=(lat>33)&(lat<48)&(lon>45)&(lon<108)
desert=sahara|arabian|australia|central
forest=((lat>-8)&(lat<8)) | ((lat>30)&(lat<58)&(lon<-55)) | ((lat>40)&(lat<65)&(lon>40)&(lon<145))
baseLand=np.zeros_like(base)
for k,v in enumerate([69,94,74]):baseLand[:,:,k]=v
baseLand[desert]=np.array([149,125,89]); baseLand[forest]=np.array([40,92,78])
# soften biome edges slightly and retain subtle land relief
biome=Image.fromarray(baseLand.astype('uint8'),'RGB').filter(ImageFilter.GaussianBlur(7))
baseLand=np.asarray(biome).astype(np.float32)
relief=gaussian_filter(rng.normal(size=(H,W)),2)
relief=relief/(np.std(relief)+1e-8)
baseLand=baseLand + relief[:,:,None]*5 + noise[:,:,None]*5
# pale polar ice cap
ice=np.abs(lat)>76
baseLand[ice]=[175,188,171]
base[land]=baseLand[land]
# shallow-water color near land
coast=mask.filter(ImageFilter.GaussianBlur(6))
near=np.asarray(coast).astype(float)/255.0
shallow=(near>0.01)&(~land)
base[shallow]+=np.array([5,12,12])*(near[shallow,None])
im=Image.fromarray(np.uint8(np.clip(base,0,255)),'RGB')
p=Path('/mnt/data/wondertime_build/assets/earth.webp'); im.save(p,'WEBP',quality=81,method=5)
print('texture',p,p.stat().st_size)
