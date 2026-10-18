import { baseY, type FlightRun } from './model';

// All sprites and terrain are original code-drawn artwork; no downloaded assets.
function ship(c:CanvasRenderingContext2D,x:number,y:number,enemy=false,frame=0):void {
  c.save();c.translate(Math.round(x),Math.round(y));
  c.fillStyle='#07121d88';c.fillRect(-14,8,30,7);
  c.fillStyle=enemy?'#d5a16d':'#80b6c9';c.beginPath();c.moveTo(0,-18);c.lineTo(7,-3);c.lineTo(17,9);c.lineTo(17,14);c.lineTo(4,9);c.lineTo(0,14);c.lineTo(-4,9);c.lineTo(-17,14);c.lineTo(-17,9);c.lineTo(-7,-3);c.closePath();c.fill();
  c.fillStyle=enemy?'#73514c':'#edf2d1';c.fillRect(-3,-13,6,23);c.fillStyle=enemy?'#ef7461':'#4be5db';c.fillRect(-2,-7,4,8);
  c.fillStyle='#283e52';c.fillRect(-13,6,5,5);c.fillRect(8,6,5,5);
  if(!enemy){c.fillStyle=frame%2?'#ffe3a0':'#fa9e66';c.fillRect(-3,15,6,frame%2?8:5);}
  c.restore();
}
export function createGalactianRenderer(): (c:CanvasRenderingContext2D,run:FlightRun,reduced:boolean)=>void {
  const terrain=document.createElement('canvas');terrain.width=360;terrain.height=960;
  const t=terrain.getContext('2d')!;
  t.fillStyle='#354b46';t.fillRect(0,0,360,960);
  let seed=9471;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<320;i++){const x=Math.floor(random()*90)*4,y=Math.floor(random()*240)*4;t.fillStyle=['#3d554b','#40594e','#2d453f','#49604f'][i%4];t.fillRect(x,y,4+random()*12,4);}
  t.fillStyle='#56624f';t.fillRect(151,0,58,960);t.fillStyle='#65705a';t.fillRect(155,0,50,960);
  for(let y=0;y<960;y+=32){t.fillStyle='#909170';t.fillRect(179,y,3,12);t.fillStyle='#213c34';t.fillRect(147,y,3,24);t.fillRect(210,y+8,3,24);}
  for(let i=0;i<14;i++){const x=i%2?35+random()*65:244+random()*65,y=random()*960,r=10+random()*16;t.fillStyle='#253e39';t.beginPath();t.ellipse(x,y,r,r*.65,0,0,Math.PI*2);t.fill();t.strokeStyle='#61725a';t.lineWidth=3;t.stroke();t.fillStyle='#1e3331';t.fillRect(x-r/2,y-3,r,5);}
  for(let i=0;i<5;i++){const x=i%2?24:275,y=i*190+40;t.fillStyle='#263c38';t.fillRect(x+4,y+5,48,40);t.fillStyle='#6a7858';t.fillRect(x,y,48,33);t.fillStyle='#84916a';t.fillRect(x+4,y+3,40,4);t.fillStyle='#243b34';t.fillRect(x+10,y+14,28,17);t.fillStyle='#b97c55';t.fillRect(x+17,y+17,4,8);t.fillRect(x+29,y+17,4,8);}
  return (c,run,reduced)=>{
    c.fillStyle='#354b46';c.fillRect(0,0,360,480);
    const offset=Math.floor(run.distance%960);c.drawImage(terrain,0,offset-960);c.drawImage(terrain,0,offset);
    for(const base of run.bases){
      const y=baseY(run,base);if(y< -90||y>570)continue;
      c.fillStyle='#193b49';c.fillRect(base.x-54,y-65,108,130);c.strokeStyle=base.used?'#789e9b':'#a5efc6';c.lineWidth=2;c.strokeRect(base.x-48,y-59,96,118);
      c.fillStyle='#3d6266';c.fillRect(base.x-43,y-53,86,106);
      c.strokeStyle='#a7e3cb';c.setLineDash([5,5]);c.strokeRect(base.x-36,y-36,72,72);c.setLineDash([]);
      c.strokeStyle='#b9edd7';c.beginPath();c.arc(base.x,y,23,0,Math.PI*2);c.stroke();c.fillStyle='#d2eee3';c.font='bold 18px monospace';c.textAlign='center';c.fillText('H',base.x,y+6);
      c.fillStyle='#a5efc6';c.font='8px monospace';c.fillText(base.used?'ALLIED OUTPOST':'ALLIED / LANDING ZONE',base.x,y-45);
      for(const dx of [-49,49])for(const dy of [-53,53]){c.fillStyle='#d1ee9c';c.fillRect(base.x+dx-2,y+dy-2,4,4);}
    }
    for(const enemy of run.enemies){
      const x=Math.round(enemy.x),y=Math.round(enemy.y);
      if(enemy.kind==='fighter'||enemy.kind==='scout'){ship(c,x,y,true);if(enemy.kind==='scout'){c.fillStyle='#a4ce7d';c.fillRect(x-19,y+2,6,6);c.fillRect(x+13,y+2,6,6);}}
      else if(enemy.kind==='orc'){
        for(let i=0;i<3;i++){const dx=(i-1)*10,dy=i%2*8;c.fillStyle='#1b302a';c.fillRect(x+dx-3,y+dy+6,7,4);c.fillStyle='#93b965';c.fillRect(x+dx-4,y+dy-5,8,6);c.fillStyle='#658349';c.fillRect(x+dx-3,y+dy+1,6,7);c.fillStyle='#f0d09b';c.fillRect(x+dx-2,y+dy-3,2,1);c.fillStyle='#bb8e67';c.fillRect(x+dx+3,y+dy,3,6);}
      }else{
        c.fillStyle='#1a2e29';c.fillRect(x-19,y-14,38,29);c.fillStyle='#6d8055';c.fillRect(x-15,y-13,30,24);c.fillStyle='#91a469';c.fillRect(x-12,y-10,24,5);c.fillStyle='#41543c';c.fillRect(x-8,y-5,16,16);c.fillStyle='#d6a16b';c.fillRect(x-2,y+1,4,20);
        if(enemy.kind==='crawler'){c.fillStyle='#263c33';for(const dx of [-20,15]){c.fillRect(x+dx,y-17,5,36);c.fillStyle='#9b9c70';for(let n=0;n<4;n++)c.fillRect(x+dx,y-14+n*8,5,3);c.fillStyle='#263c33';}}
        c.fillStyle='#ffcb89';c.font='7px monospace';c.textAlign='center';c.fillText('GROUND',x,y-21);
      }
    }
    for(const shot of run.shots){c.fillStyle=shot.friendly?'#ddf5a3':'#ffb591';c.fillRect(Math.round(shot.x)-2,Math.round(shot.y)-3,4,shot.friendly?10:6);if(!shot.friendly){c.fillStyle='#632f40';c.fillRect(shot.x-1,shot.y-1,2,2);}}
    for(const blast of run.blasts){
      c.strokeStyle=blast.hit?'#ffd99b':'#ffe4ab';c.lineWidth=2;const r=blast.hit?58*(1-(blast.time-.5)/.55):45;
      c.beginPath();c.arc(blast.x,blast.y,Math.max(1,r),0,Math.PI*2);c.stroke();
      if(blast.hit){c.fillStyle='#f7bb6544';c.fill();}else{c.fillStyle='#ffe5aa';c.fillRect(blast.x-7,blast.y-1,14,2);c.fillRect(blast.x-1,blast.y-7,2,14);c.font='8px monospace';c.textAlign='center';c.fillText('BOMB',blast.x,blast.y-52);}
    }
    for(const spark of run.sparks){const r=spark.size*(1+spark.time);c.globalAlpha=1-spark.time/.55;c.fillStyle='#f0bb75';c.fillRect(spark.x-r/2,spark.y-r/2,r,r);c.fillStyle='#fff0ba';c.fillRect(spark.x-r/4,spark.y-r/4,r/2,r/2);c.globalAlpha=1;}
    const blink=run.invulnerable>0&&!reduced&&Math.floor(run.elapsed*12)%2===0;
    if(!blink){
      c.save();if(['landing','service','docked','takeoff'].includes(run.phase)){c.translate(run.player.x,run.player.y);const scale=run.phase==='landing'?1-run.phaseTime*.12:run.phase==='takeoff'?.83+.17*Math.min(1,run.phaseTime/1.15):.83;c.scale(scale,scale);ship(c,0,0,false,run.phase==='takeoff'&&!reduced?Math.floor(run.elapsed*16):0);}else ship(c,run.player.x,run.player.y,false,reduced?0:Math.floor(run.elapsed*16));c.restore();
    }
    if(run.phase==='flight'){
      c.strokeStyle='#d4eabd77';c.setLineDash([3,5]);c.beginPath();c.arc(run.player.x,run.player.y-105,48,0,Math.PI*2);c.stroke();c.setLineDash([]);
    }
    c.fillStyle='#06151caa';c.fillRect(0,0,360,22);c.fillStyle='#b5d6c8';c.font='8px monospace';c.textAlign='left';c.fillText('ORK OCCUPATION / SECTOR '+String(1+Math.floor(run.distance/1300)).padStart(2,'0'),10,14);c.textAlign='right';c.fillStyle='#f3d2a6';c.fillText('AIR: GUNS · GROUND: BOMBS',350,14);
  };
}
