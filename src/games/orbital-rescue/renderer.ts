import {WORLD,passengers,type Rescue} from './model';
export function drawRescue(c:CanvasRenderingContext2D,run:Rescue,reduced:boolean,thrust=false):void {
 const X=(x:number)=>x-run.camera.x+180,Y=(y:number)=>y-run.camera.y+240;
 c.fillStyle='#081422';c.fillRect(0,0,360,480);
 for(let i=0;i<65;i++){const x=((i*137.7-run.camera.x*.13)%360+360)%360,y=((i*i*13.1-run.camera.y*.13)%480+480)%480;c.fillStyle=i%4?'#587287':'#cfdee0';c.fillRect(x,y,i%7===0?2:1,1);}
 c.strokeStyle='#658995';c.setLineDash([5,7]);c.strokeRect(X(0),Y(0),WORLD,WORLD);c.setLineDash([]);
 const px=X(run.planet.x),py=Y(run.planet.y),radius=run.planet.radius;
 c.strokeStyle='#3b5670';c.lineWidth=1;c.setLineDash([3,7]);c.beginPath();c.arc(px,py,radius+70,0,Math.PI*2);c.stroke();c.setLineDash([]);
 c.fillStyle='#34485f';c.beginPath();c.arc(px,py,radius,0,Math.PI*2);c.fill();c.strokeStyle='#91aeb8';c.lineWidth=2;c.stroke();c.fillStyle='#24394f';for(let i=0;i<6;i++){const angle=i*2.4;c.beginPath();c.arc(px+Math.cos(angle)*radius*.6,py+Math.sin(angle)*radius*.6,7+i%3*4,0,Math.PI*2);c.fill();}
 for(const d of run.debris){const x=X(d.x),y=Y(d.y);c.save();c.translate(x,y);c.rotate(d.angle);c.fillStyle='#8f9caa';c.strokeStyle='#d7d7c2';c.lineWidth=1;c.beginPath();c.moveTo(-d.size,0);c.lineTo(-3,-d.size);c.lineTo(d.size,-2);c.lineTo(d.size*.6,d.size*.8);c.lineTo(-4,d.size);c.closePath();c.fill();c.stroke();c.restore();}
 const sx=X(run.station.x),sy=Y(run.station.y);
 c.strokeStyle='#b8ecd2';c.lineWidth=2;c.setLineDash([4,4]);c.strokeRect(sx-32,sy-34,64,68);c.setLineDash([]);
 c.fillStyle='#316276';c.fillRect(sx-49,sy-12,27,24);c.fillRect(sx+22,sy-12,27,24);c.strokeStyle='#87bdc8';c.strokeRect(sx-49,sy-12,27,24);c.strokeRect(sx+22,sy-12,27,24);c.fillStyle='#e0e6d3';c.fillRect(sx-19,sy-17,38,34);c.fillStyle='#2b5a63';c.fillRect(sx-10,sy-9,20,18);
 c.fillStyle='#ddf5db';c.font='10px monospace';c.textAlign='center';c.fillText('STATION ↑',sx,sy+49);
 const indicator=(x:number,y:number,name:string,color:string)=>{
  const screenX=X(x),screenY=Y(y);if(screenX>=16&&screenX<=344&&screenY>=30&&screenY<=450)return;
  const dx=screenX-180,dy=screenY-240,factor=Math.min(158/Math.max(1,Math.abs(dx)),205/Math.max(1,Math.abs(dy))),ix=180+dx*factor,iy=240+dy*factor,angle=Math.atan2(dy,dx);
  c.save();c.translate(ix,iy);c.rotate(angle);c.fillStyle=color;c.beginPath();c.moveTo(9,0);c.lineTo(-5,-5);c.lineTo(-5,5);c.closePath();c.fill();c.restore();c.fillStyle=color;c.font='9px monospace';c.textAlign='center';c.fillText(`${name} ${Math.round(Math.hypot(x-run.ship.x,y-run.ship.y))}m`,Math.max(42,Math.min(316,ix)),iy+(iy<240?18:-10));
 };
 indicator(run.station.x,run.station.y,'S','#adedd3');
 for(const a of run.astronauts){if(a.state==='rescued'||a.state==='aboard')continue;const x=X(a.x),y=Y(a.y);if(a.state==='lost'){c.fillStyle='#d9a6a3';c.font='10px monospace';c.fillText('× '+a.id,x,y);continue;}
  indicator(a.x,a.y,a.id,'#f4d8a4');c.strokeStyle='#dbbd86';c.lineWidth=1;c.beginPath();c.arc(x,y,23,0,Math.PI*2);c.stroke();c.fillStyle='#eaeed9';c.beginPath();c.arc(x,y-5,5,0,Math.PI*2);c.fill();c.fillStyle='#67a6b8';c.fillRect(x-3,y-7,6,3);c.strokeStyle='#eaeed9';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+9);c.moveTo(x-7,y+2);c.lineTo(x+7,y+2);c.moveTo(x,y+8);c.lineTo(x-5,y+15);c.moveTo(x,y+8);c.lineTo(x+5,y+15);c.stroke();
  c.fillStyle='#ffe2a7';c.font='10px monospace';c.textAlign='center';c.fillText(`${a.id} / ${Number.isFinite(a.oxygen)?Math.ceil(a.oxygen)+'s O₂':'TRAINING'}`,x,y-32);
  if(a.progress>0){c.strokeStyle='#a7e8b9';c.lineWidth=4;c.beginPath();c.arc(x,y,27,-Math.PI/2,-Math.PI/2+Math.PI*2*a.progress/1.4);c.stroke();}
 }
 const ship=run.ship,x=X(ship.x),y=Y(ship.y);c.save();c.translate(x,y);c.rotate(ship.angle+Math.PI/2);
 c.globalAlpha=!reduced&&ship.invulnerable>0&&Math.floor(run.elapsed*8)%2?.55:1;
 if(thrust&&run.phase==='flying'){c.fillStyle=ship.fuel>0?'#f6cd88':'#9bd5f4';c.beginPath();c.moveTo(-4,9);c.lineTo(0,15+(reduced?4:Math.sin(run.elapsed*40)*4+4));c.lineTo(4,9);c.fill();}
 c.fillStyle='#dfeee4';c.strokeStyle='#78c9c5';c.lineWidth=2;c.beginPath();c.moveTo(0,-14);c.lineTo(10,10);c.lineTo(0,5);c.lineTo(-10,10);c.closePath();c.fill();c.stroke();c.fillStyle='#39627c';c.fillRect(-3,-5,6,8);c.restore();
 c.strokeStyle='#90e6d4';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+ship.vx*.5,y+ship.vy*.5);c.stroke();
 if(run.dockProgress>0||run.phase==='docking'){c.strokeStyle='#a5eab8';c.lineWidth=3;c.beginPath();c.arc(sx,sy,38,-Math.PI/2,-Math.PI/2+Math.PI*2*(run.phase==='docking'?run.phaseTime/2:run.dockProgress/1.2));c.stroke();}
 // Bounded whole-world view; lost beacons stay visible as crosses.
 c.fillStyle='#0c2333ed';c.fillRect(260,375,88,88);c.strokeStyle='#6a8d9e';c.strokeRect(260,375,88,88);
 const mx=(wx:number)=>264+wx/WORLD*80,my=(wy:number)=>379+wy/WORLD*80;
 c.fillStyle='#50637a';c.beginPath();c.arc(mx(run.planet.x),my(run.planet.y),run.planet.radius/WORLD*80,0,Math.PI*2);c.fill();
 c.fillStyle='#b6f2cc';c.fillRect(mx(run.station.x)-2,my(run.station.y)-2,4,4);
 for(const a of run.astronauts)if(a.state==='waiting'||a.state==='lost'){c.fillStyle=a.state==='lost'?'#ff9a9d':'#ffdc99';c.fillRect(mx(a.x)-1,my(a.y)-1,3,3);}
 c.fillStyle='#eff5ed';c.fillRect(mx(ship.x)-2,my(ship.y)-2,4,4);c.textAlign='left';c.font='9px monospace';c.fillStyle='#b5d6de';c.fillText('MISSION MAP',263,371);c.fillText(`CABIN ${passengers(run)} / ${run.capacity}`,12,463);
}
