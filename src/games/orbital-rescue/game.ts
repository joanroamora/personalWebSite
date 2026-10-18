import {mountArcade,type ArcadeGame,type Beep} from '../shared/arcade';
import {text,button,clock} from '../shared/presentation';
import {createRescue,stepRescue,rescueAction,selectedAstronaut,passengers,speed,angleDifference} from './model';
import {drawRescue} from './renderer';
function createGame(beep:Beep):ArcadeGame {
 let run=createRescue(),thrust=false;
 return {
  reset(){run=createRescue();thrust=false;},next(){run=createRescue(run.level+1);thrust=false;},
  update(dt,input){stepRescue(run,dt,input);thrust=input.y<0&&run.ship.fuel+run.ship.reserve>0;for(const event of run.events.splice(0))beep(event==='hit'||event==='lost'?100:event==='rescue'?720:480,.12,'triangle');},
  action(action){rescueAction(run,action==='bomb'?'next-beacon':action);},draw(context,reduced){drawRescue(context,run,reduced,thrust);},
  hud(root){
   const ship=run.ship,aboard=passengers(run),waiting=run.astronauts.filter(a=>a.state==='waiting');
   text(root,'[data-rescue-fuel]',ship.fuel>0?`${Math.ceil(ship.fuel)}%`:`RCS ${ship.reserve.toFixed(0)}`);text(root,'[data-rescue-hull]',`${Math.ceil(ship.hull)}%`);text(root,'[data-rescue-passengers]',`${aboard} / ${run.capacity}`);text(root,'[data-rescue-count]',`${run.rescued} / ${run.goal}`);text(root,'[data-rescue-speed]',`${speed(run).toFixed(1)} m/s`);text(root,'[data-rescue-score]',String(run.score));
   const selected=selectedAstronaut(run),a=selected?.state==='waiting'?selected:waiting[0],stationDistance=Math.hypot(ship.x-run.station.x,ship.y-run.station.y);
   const home=aboard===run.capacity||!a||ship.fuel<18||aboard>0&&stationDistance<80;
   const target=home?run.station:a!,distance=Math.hypot(ship.x-target.x,ship.y-target.y),bearing=Math.atan2(target.y-ship.y,target.x-ship.x),turn=angleDifference(bearing,ship.angle);
   text(root,'[data-rescue-target]',`OBJECTIVE ${run.rescued}/${run.goal} · ${home?'STATION':a!.id} ${Math.round(distance)}m · ${turn<0?'↶':'↷'} ${Math.round(Math.abs(turn)*180/Math.PI)}°${!home?' · O₂ '+(Number.isFinite(a!.oxygen)?Math.ceil(a!.oxygen)+'s':'training'):''}`);
   let notice=run.noticeTime>0?run.notice:'Coast between burns. Brake before the rescue or docking ring.';
   let progress=0;
   if(run.phase==='docked')notice=ship.fuel>=99.9&&ship.hull>=99.9?'Docked and ready. Thrust or Launch begins your flight.':'Refuelling and repairing. Launch becomes available when ready.';
   else if(run.phase==='docking'){notice='Docking assist / delivering passengers. Please hold.';progress=run.phaseTime/2;}
   else if(home&&distance<80){notice=speed(run)>11?'STATION / Too Fast. Brake below 11 m/s.':Math.abs(angleDifference(ship.angle,run.station.angle))>=.8?'STATION / Point nose upward to align.':distance>34?'STATION / Move Closer to the docking box.':'DOCKING / Hold position. Assist engages automatically.';progress=run.dockProgress/1.2;}
   else if(a&&distance<65&&!home){notice=Math.hypot(ship.vx-a.vx,ship.vy-a.vy)>9?'RESCUE / Too Fast. Brake below 9 m/s.':distance>23?'RESCUE / Move Closer to the beacon ring.':'RESCUE / Holding position…';progress=a.progress/1.4;}
   if(ship.fuel<=0)notice=`EMERGENCY RCS / ${ship.reserve.toFixed(0)} reserve left. Return to Station.`;
   if(run.level>1)notice+=` · ${clock(run.duration-run.elapsed)} left`;
   text(root,'[data-rescue-notice]',notice);root.querySelector<HTMLProgressElement>('[data-rescue-progress]')!.value=progress;
   button(root,'[data-action="context"]',run.phase!=='docked'||ship.fuel<99.9||ship.hull<99.9,run.phase==='docked'?'Launch':run.phase==='docking'?'Docking…':'Dock automatically');button(root,'[data-action="next-beacon"]',waiting.length===0);
   return ship.fuel<=0?'Emergency reserve active. Return to Station.':run.noticeTime>0?run.notice:'';
  },
  result(){return ['won','lost'].includes(run.phase)?{score:run.score,title:run.phase==='won'?'Everyone aboard':'Rescue ended',message:`${run.rescued} / ${run.goal} astronauts delivered · Hull ${Math.ceil(run.ship.hull)}% · Fuel ${Math.ceil(run.ship.fuel)}% · ${Math.floor(run.elapsed)} seconds. ${run.phase==='won'?'Your next mission reaches farther, with oxygen limits and debris.':run.notice}`,next:run.phase==='won'?'Next Mission':undefined}:null;},
 };
}
const mount=()=>mountArcade('orbital-rescue',createGame);mount();window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
