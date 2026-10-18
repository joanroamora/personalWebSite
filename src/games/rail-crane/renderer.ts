import { COLORS, currentOrder, gripTarget, slotX, targetSlot, type Cargo, type CraneRun } from './model';

function container(c:CanvasRenderingContext2D,cargo:Cargo,x:number,y:number,highlight:boolean):void {
  const color=COLORS[cargo.color];
  c.fillStyle='#08151c66';c.fillRect(x-24,y+13,55,5);
  c.fillStyle=color.paint;c.fillRect(x-26,y-14,52,28);c.fillStyle='#ffffff28';c.fillRect(x-26,y-14,52,4);c.fillStyle='#122a3a55';c.fillRect(x-26,y+10,52,4);
  c.strokeStyle='#162f3b77';c.lineWidth=1;for(let n=0;n<7;n++){c.beginPath();c.moveTo(x-22+n*7,y-9);c.lineTo(x-22+n*7,y+8);c.stroke();}
  c.fillStyle='#152d3d';c.fillRect(x-21,y-6,42,13);c.fillStyle='#f2eee2';c.font='bold 9px monospace';c.textAlign='center';c.fillText(`${color.symbol} ${cargo.id}`,x,y+4);
  if(highlight){c.strokeStyle='#fff0b5';c.lineWidth=2;c.strokeRect(x-29,y-17,58,34);}
}
export function renderCrane(c:CanvasRenderingContext2D,run:CraneRun,reduced:boolean):void {
  const camera=Math.round(run.camera),order=currentOrder(run),departure=run.phase==='departing'||(run.phase==='over'&&run.success)?run.departure*run.departure*90:0;
  c.fillStyle='#7993a2';c.fillRect(0,0,360,480);
  c.fillStyle='#9eafb4';c.fillRect(0,42,360,85);
  for(let i=-1;i<9;i++){const x=i*72-(camera*.16)%72;c.fillStyle=i%2?'#496777':'#557581';c.fillRect(x,65+(i%3)*15,52,75);c.fillStyle='#b8c5bb';for(let k=0;k<3;k++)c.fillRect(x+8+k*12,85,5,4);}
  c.fillStyle='#b8b6a2';c.fillRect(0,145,360,335);c.fillStyle='#a6a68e';c.fillRect(0,146,360,83);
  for(let i=-1;i<10;i++){const x=i*72-camera%72;c.fillStyle='#c9c4a7';c.fillRect(x,149,2,74);c.fillRect(x,255,36,3);}
  c.fillStyle='#8c947f';c.fillRect(0,230,360,16);c.fillStyle='#525e60';c.fillRect(0,422,360,58);
  // Tracks, sleepers and loading platform retain contrast at the native 360px width.
  for(let i=-1;i<15;i++){const x=i*30-camera%30;c.fillStyle='#405157';c.fillRect(x,399,21,33);}
  c.fillStyle='#c2c3b0';c.fillRect(0,402,360,4);c.fillRect(0,426,360,4);c.fillStyle='#293b43';c.fillRect(0,406,360,3);c.fillRect(0,430,360,3);
  c.font='9px monospace';c.textAlign='center';
  for(let i=0;i<16;i++){
    const x=slotX(i)-camera-departure;if(x< -80||x>440)continue;
    c.fillStyle='#344b5b';c.fillRect(x-40,381,80,15);c.fillStyle='#162d3a';c.fillRect(x-44,393,88,4);c.fillRect(x-30,396,15,17);c.fillRect(x+15,396,15,17);
    c.fillStyle='#8aa0a8';c.fillRect(x-28,400,11,4);c.fillRect(x+17,400,11,4);
    c.strokeStyle=order?.slot===i?'#fff0b5':'#687d7c';c.lineWidth=order?.slot===i?3:1;c.setLineDash([6,3]);c.strokeRect(x-29,346,58,31);c.setLineDash([]);
    c.fillStyle=order?.slot===i?'#fff0b5':'#e2e7da';c.font='bold 11px monospace';c.fillText(`SLOT ${String(i+1).padStart(2,'0')}`,x,455);
    if(order?.slot===i){c.fillStyle='#fff0b5';c.beginPath();c.moveTo(x-5,333);c.lineTo(x+5,333);c.lineTo(x,341);c.fill();}
  }
  // A locomotive at the head of the long consist, visible when exploring the left end.
  const locoX=8-camera-departure;
  if(locoX>-75){c.fillStyle='#d69565';c.fillRect(locoX-45,353,60,39);c.fillStyle='#314a5a';c.fillRect(locoX-14,339,29,18);c.fillStyle='#a9dae0';c.fillRect(locoX-9,343,18,10);c.fillStyle='#263c49';c.fillRect(locoX-37,388,12,20);c.fillRect(locoX-3,388,12,20);c.fillStyle='#ffdf93';c.fillRect(locoX-49,365,5,10);}
  for(const cargo of run.cargo){if(cargo.id===run.held)continue;const x=cargo.x-camera-(cargo.slot!==null?departure:0);if(x< -40||x>400)continue;container(c,cargo,x,cargo.y,order?.cargo===cargo.id);}
  // Gantry rail spans the yard; the trolley and suspended spreader are functional.
  c.fillStyle='#2f4b60';c.fillRect(0,29,360,20);c.fillStyle='#eac188';c.fillRect(0,31,360,4);c.fillStyle='#f7d9a4';
  for(let x=-30-camera%40;x<380;x+=40){c.beginPath();c.moveTo(x,35);c.lineTo(x+18,49);c.lineTo(x+32,35);c.lineWidth=2;c.strokeStyle='#e4b779';c.stroke();}
  const x=run.x-camera,y=run.y;
  if(x>=-30&&x<=390){
    c.fillStyle='#d3a76b';c.fillRect(x-21,37,42,23);c.fillStyle='#f4d59b';c.fillRect(x-16,40,32,6);c.fillStyle='#213d50';c.fillRect(x-16,50,12,6);c.fillRect(x+4,50,12,6);
    const sway=Math.sin(run.swing)*20,hookX=x+(run.held?sway:0);c.strokeStyle='#273f50';c.lineWidth=2;c.beginPath();c.moveTo(x-9,60);c.lineTo(hookX-9,y);c.moveTo(x+9,60);c.lineTo(hookX+9,y);c.stroke();
    c.fillStyle=gripTarget(run)?'#e2f6aa':'#eac287';c.fillRect(hookX-16,y-4,32,7);c.fillStyle='#263c4c';for(let n=0;n<4;n++)c.fillRect(hookX-13+n*8,y-4,4,7);c.fillStyle='#243d4f';c.fillRect(hookX-15,y+3,3,5);c.fillRect(hookX+12,y+3,3,5);
    if(gripTarget(run)&&!run.held){c.strokeStyle='#f0f8c8';c.strokeRect(hookX-20,y-8,40,20);c.font='8px monospace';c.textAlign='center';c.fillStyle='#14313d';c.fillText('PICK UP',hookX,y-14);}
    const cargo=run.cargo.find(cargo=>cargo.id===run.held);if(cargo)container(c,cargo,cargo.x-camera,cargo.y,false);
    if(targetSlot(run)>=0){c.strokeStyle='#fff0b5';c.lineWidth=2;c.strokeRect(slotX(targetSlot(run))-camera-31,344,62,35);}
  }
  // Yard overview: requested cargo, requested slot, trolley and visible section.
  c.fillStyle='#122a3a';c.fillRect(0,0,360,24);c.fillStyle='#7d9a9b';c.fillRect(14,11,332,3);
  const project=(value:number)=>14+value/1580*332;
  for(let i=0;i<16;i++){c.fillStyle=run.slots[i]?'#c0ddae':'#63828c';c.fillRect(project(slotX(i))-2,9,4,7);}
  if(order){const cargo=run.cargo.find(cargo=>cargo.id===order.cargo)!;c.fillStyle='#edf1d9';c.fillRect(project(cargo.x)-2,4,4,4);c.fillStyle='#ffc785';c.fillRect(project(slotX(order.slot))-3,17,6,3);}
  c.strokeStyle='#e3d7ae';c.lineWidth=1;c.strokeRect(project(camera),6,360/1580*332,14);c.fillStyle='#f4ece1';c.fillRect(project(run.x)-2,8,4,8);
  c.textAlign='left';c.font='8px monospace';c.fillStyle='#edf0df';c.fillText('STAGING / ID + SYMBOL',10,128);c.fillStyle='#384d53';c.fillText('RAIL TERMINAL / EAST YARD',10,477);
  if(run.phase==='departing'){c.fillStyle='#0a243cd9';c.fillRect(24,260,312,53);c.fillStyle='#fff0c7';c.font='bold 15px monospace';c.textAlign='center';c.fillText(run.success?'TRAIN CLEARED FOR DEPARTURE':'DEADLINE / TRAIN DEPARTING',180,291);}
  if(!reduced&&run.phase==='working'&&run.held){c.fillStyle='#fbdfa2';c.fillRect(x-4,64,8,3);}
}
