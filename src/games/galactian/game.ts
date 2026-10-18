import { mountArcade, type ArcadeGame, type Beep } from '../shared/arcade';
import { baseY, canLand, createFlight, flightAction, landingBase, nearestBase, stepFlight } from './model';
import { createGalactianRenderer } from './renderer';

function createGame(beep:Beep):ArcadeGame {
  let run=createFlight(),lastTone=0;
  const render=createGalactianRenderer();
  return {
    reset(){run=createFlight();},
    update(dt,input){
      stepFlight(run,dt,input);
      for(const event of run.events.splice(0)){
        if(event==='shot'){if(run.elapsed-lastTone>.12){beep(790,.035);lastTone=run.elapsed;}}
        else if(event==='bomb')beep(135,.22,'sawtooth');else if(event==='kill')beep(180,.07,'triangle');
        else if(event==='hit')beep(75,.12,'sawtooth');else beep(550,.16,'triangle');
      }
    },
    action(action){if(action==='bomb'||action==='context')flightAction(run,action);},
    draw(context,reduced){render(context,run,reduced);},
    hud(root){
      const text=(selector:string,value:string)=>{const element=root.querySelector(selector)!;if(element.textContent!==value)element.textContent=value;};
      text('[data-flight-score]',String(run.score).padStart(6,'0'));text('[data-flight-bombs]',String(run.bombs));
      (root.querySelector('[data-flight-fuel]') as HTMLMeterElement).value=run.fuel;
      (root.querySelector('[data-flight-hull]') as HTMLMeterElement).value=run.integrity;
      text('[data-fuel-value]',`${Math.ceil(run.fuel)}%`);text('[data-hull-value]',`${Math.ceil(run.integrity)}%`);
      const base=nearestBase(run),metres=Math.round(Math.abs(baseY(run,base)-run.player.y)*2);
      const above=baseY(run,base)<run.player.y,dx=base.x-run.player.x;
      const direction=Math.abs(dx)<30?(above?'↑':'↓'):above?(dx<0?'↖':'↗'):(dx<0?'↙':'↘');
      text('[data-flight-base]',`BASE ${direction} ${metres} m`);
      const button=root.querySelector<HTMLButtonElement>('[data-action="context"]')!;
      button.disabled=!canLand(run)&&run.phase!=='docked';
      button.textContent=run.phase==='docked'?'Take Off':run.phase==='landing'?'Landing…':run.phase==='service'?'Refuelling…':'Land';
      root.querySelector<HTMLButtonElement>('[data-action="bomb"]')!.disabled=run.bombs===0||run.phase!=='flight';
      const progress=root.querySelector<HTMLProgressElement>('[data-flight-progress]')!;
      progress.hidden=!['landing','service'].includes(run.phase);progress.value=run.phase==='landing'?run.phaseTime/1.4:run.phaseTime/2.7;
      let notice='';
      if(run.phase==='takeoff')notice='Launching from allied base. Clear skies ahead.';
      else if(run.phase==='landing')notice='Landing sequence — hold position.';
      else if(run.phase==='service')notice='Resupplying fuel, armour and bombs.';
      else if(run.phase==='docked')notice='Fully supplied. Select Take Off when ready.';
      else if(run.fuel===0)notice=`EMERGENCY GLIDE / ${Math.ceil(run.emergency)}s — reach a base!`;
      else if(run.integrity<=25)notice='CRITICAL INTEGRITY — repair at an allied base.';
      else if(run.fuel<25)notice='LOW FUEL — slow down and find an allied base.';
      else if(landingBase(run))notice=canLand(run)?'Landing zone aligned. Select Land.':'Hold Slow to enable landing.';
      else if(run.elapsed<12)notice='Guns hit aircraft. Bombs hit ground targets.';
      const warning=root.querySelector<HTMLElement>('[data-flight-warning]')!;warning.textContent=notice;warning.dataset.critical=String(run.fuel===0||run.integrity<=25);
      // Emergency countdown remains visible; assistive announcements avoid reading every tick.
      return run.fuel===0?'Emergency fuel. Reach an allied base now.':notice;
    },
    result(){return run.phase==='over'?{score:run.score,title:'Mission ended',message:run.reason}:null;},
  };
}
const mount=()=>mountArcade('galactian',createGame);mount();
window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
