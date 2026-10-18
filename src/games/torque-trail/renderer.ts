import { localPoint, terrainAt, type Ride } from './model';

const palette={sky:'#182039',far:'#34355b',near:'#555071',sun:'#ffce8b',grass:'#c0a16e',edge:'#f6d6a5',dirt:'#946347',deep:'#513d42',ink:'#101b29',bike:'#79d8ce',red:'#f19169',white:'#f2efda'};
/** Original pixel artwork; a deliberately small palette and integer-aligned drawing. */
export function drawRide(c:CanvasRenderingContext2D,run:Ride,reduced:boolean):void {
  const camera=run.x-5,scale=20,groundY=350+Math.min(55,Math.max(0,run.y-1.3)*10);
  const X=(x:number)=>Math.round((x-camera)*scale),Y=(y:number)=>Math.round(groundY-y*scale);
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
  const line=(ax:number,ay:number,bx:number,by:number,color:string,width=2)=>{
    const steps=Math.ceil(Math.max(Math.abs(bx-ax),Math.abs(by-ay))/2);
    for(let i=0;i<=steps;i++)rect(ax+(bx-ax)*i/(steps||1),ay+(by-ay)*i/(steps||1),width,width,color);
  };
  rect(0,0,360,480,palette.sky);
  rect(0,160,360,90,'#2c3050');rect(0,250,360,130,'#664c61');
  for(let y=-31;y<=31;y+=3){const half=Math.floor(Math.sqrt(31*31-y*y));rect(270-half,88+y,half*2,3,palette.sun);}
  for(let layer=0;layer<2;layer++) {
    const drift=camera*(layer===0?1.1:2.6);
    for(let x=-8;x<368;x+=4) {
      const hill=(Math.sin((x+drift)*.018)+Math.sin((x+drift)*.037)*.45)*27;
      const top=Math.round(230+layer*50-hill);
      rect(x,top,4,380-top,layer===0?palette.far:palette.near);
    }
  }
  // Fence and signal posts are tied to world coordinates, not animation frames.
  for(let wx=Math.floor(camera/8)*8;wx<camera+20;wx+=8) {
    const x=X(wx),h=Y(terrainAt(run.track,wx).height);
    rect(x,h-34,3,32,'#a58478');rect(x,h-30,18,3,'#a58478');
  }
  for(let x=0;x<360;x+=3) {
    const surface=terrainAt(run.track,camera+x/scale),top=Y(surface.height);
    if(!surface.solid){rect(x,groundY+36,3,444-groundY,palette.ink);continue;}
    rect(x,top,3,480-top,palette.deep);rect(x,top,3,6,palette.edge);rect(x,top+6,3,14,palette.grass);
    rect(x,top+20,3,27,palette.dirt);
    const speck=Math.abs(Math.floor((camera+x/scale)*17))%31;
    rect(x,top+24+speck,2,2,'#ad7951');
  }
  for(const f of run.track.features) {
    const sx=X(f.start-2);
    if(sx<-60||sx>390)continue;
    const y=Y(terrainAt(run.track,f.start-2).height);
    rect(sx,y-41,3,41,palette.ink);rect(sx-14,y-46,33,16,f.kind==='gap'?palette.red:palette.sun);
    c.fillStyle=palette.ink;c.font='bold 7px monospace';c.fillText(f.kind==='gap'?'GAP':'RAMP',sx-11,y-35);
  }
  for(const checkpoint of run.track.checkpoints.slice(1)) {
    const x=X(checkpoint),y=Y(0);
    if(x<0||x>360)continue;
    rect(x,y-43,3,43,palette.white);rect(x+3,y-43,18,12,checkpoint<=run.checkpoint?palette.bike:'#a4aaad');
  }
  const finish=X(run.track.length);
  if(finish>-20&&finish<380){rect(finish,Y(0)-90,4,90,palette.white);for(let i=0;i<6;i++)rect(finish+4+i*6,Y(0)-90,6,8,i%2?palette.ink:palette.white);}
  if(!reduced&&run.grounded&&run.vx>3&&run.phase==='riding') {
    for(let i=0;i<9;i++){
      const age=(run.elapsed*2+i*.17)%1;
      rect(X(run.x-.9-age*2),Y(run.y-.7+age*.5),2,2,'#d2ae82');
    }
  }
  const point=(x:number,y:number)=>{const p=localPoint(run,x,y);return {x:X(p.x),y:Y(p.y)};};
  const link=(a:{x:number;y:number},b:{x:number;y:number},color:string,w=2)=>line(a.x,a.y,b.x,b.y,color,w);
  for(const wheel of run.wheels) {
    const x=X(wheel.x),y=Y(wheel.y),r=7;
    for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++)if(xx*xx+yy*yy<=r*r)rect(x+xx,y+yy,1,1,xx*xx+yy*yy>(r-2)**2?palette.ink:'#abb9b6');
    rect(x-2,y-2,4,4,palette.ink);
    line(x,y,x+Math.cos(wheel.spin)*5,y+Math.sin(wheel.spin)*5,palette.white,1);
  }
  const rear={x:X(run.wheels[0].x),y:Y(run.wheels[0].y)},front={x:X(run.wheels[1].x),y:Y(run.wheels[1].y)};
  const tail=point(-.68,.27),tank=point(.12,.30),engine=point(-.15,-.12),handle=point(.69,.48);
  link(rear,tail,palette.red,3);link(rear,engine,palette.bike,3);link(tail,tank,palette.bike,4);
  link(tank,engine,palette.red,3);link(engine,front,palette.bike,2);link(front,handle,palette.white,3);link(tank,handle,palette.bike,3);
  rect(engine.x-4,engine.y-3,9,7,palette.ink);link(point(-.73,.35),point(-.1,.35),palette.ink,4);
  const hip=point(-.20-run.lean*.1,.5),shoulder=point(.04+run.lean*.18,.86),head=point(.12+run.lean*.24,1.12);
  link(hip,point(.15,.18),palette.sky,4);link(point(.15,.18),engine,palette.white,3);
  link(hip,shoulder,palette.red,6);link(shoulder,handle,palette.white,3);
  rect(head.x-6,head.y-6,11,10,palette.white);rect(head.x,head.y-3,7,4,palette.ink);rect(head.x-5,head.y-6,9,3,palette.bike);
  c.font='bold 9px monospace';c.fillStyle=palette.white;c.fillText(`TRAIL ${String(run.level).padStart(2,'0')} / DUST COUNTRY`,14,24);
  // A short route preview exposes gaps early even inside the portrait window.
  rect(14,42,332,3,'#59627b');
  for(const f of run.track.features)rect(14+f.start/run.track.length*332,39,Math.max(3,f.length/run.track.length*332),f.kind==='gap'?9:5,f.kind==='gap'?palette.red:palette.sun);
  for(const cp of run.track.checkpoints)rect(14+cp/run.track.length*332,47,2,3,palette.bike);
  rect(13+Math.min(1,run.x/run.track.length)*332,35,3,16,palette.white);
  if(run.phase==='crashed'||run.phase==='over') {
    rect(43,174,274,52,palette.ink);c.fillStyle=palette.red;c.font='bold 20px monospace';c.fillText('RIDER DOWN',105,199);
    c.fillStyle=palette.white;c.font='9px monospace';c.fillText(run.lives>0?'RECOVER AT THE LAST FLAG':'THREE ATTEMPTS. ANOTHER TRAIL.',run.lives>0?94:47,216);
  }
}
