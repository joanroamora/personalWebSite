import { mountArcade, type ArcadeGame, type Beep } from '../shared/arcade';
import { createRide, recoverRide, stepRide, upcomingFeature } from './model';
import { drawRide } from './renderer';

function createGame(beep:Beep):ArcadeGame {
  let run=createRide(),lastEngine=0;
  return {
    reset(){run=createRide();lastEngine=0;},
    update(dt,input){
      stepRide(run,dt,input);
      if(input.y<0&&run.phase==='riding'&&run.elapsed-lastEngine>.2){beep(55+Math.abs(run.vx)*7,.06,'triangle');lastEngine=run.elapsed;}
      for(const event of run.events.splice(0))beep(event==='crash'?80:event==='land'?400:event==='finish'?800:620,.12,event==='crash'?'sawtooth':'triangle');
    },
    action(action){if(action==='context')recoverRide(run);},
    draw(context,reduced){drawRide(context,run,reduced);},
    hud(root){
      const text=(selector:string,value:string)=>{const node=root.querySelector(selector)!;if(node.textContent!==value)node.textContent=value;};
      text('[data-ride-score]',String(run.score).padStart(5,'0'));text('[data-ride-speed]',`${Math.round(Math.abs(run.vx)*3.6)}`);
      text('[data-ride-lives]',String(run.lives));text('[data-ride-distance]',`${Math.max(0,Math.ceil(run.track.length-run.x))} m to finish`);
      text('[data-ride-landings]',`${run.landings} clean landings`);
      const button=root.querySelector<HTMLButtonElement>('[data-action="context"]')!;
      button.disabled=run.phase!=='crashed';button.textContent=run.phase==='crashed'?'Recover / E':'Checkpoint saved';
      const feature=upcomingFeature(run),ahead=feature?Math.ceil(feature.start-run.x):0;
      let message=run.elapsed<7?'Hold Gas to ride. Lean gently to follow the ground.':'Keep both wheels aligned with the landing.';
      if(feature&&ahead<38&&ahead>0)message=feature.kind==='gap'?`GAP IN ${ahead} m — build speed, then level out.`:`${feature.kind==='whoops'?'BUMPS':'RAMP'} IN ${ahead} m — balance your landing.`;
      if(run.phase==='crashed')message=`${run.reason} Select Recover for your last checkpoint.`;
      text('[data-ride-warning]',message);
      return run.phase==='crashed'?`${run.reason} ${run.lives} attempts left. Select Recover.`:run.elapsed<7?'Hold Gas to ride. Left and right control rider balance.':'';
    },
    result(){return run.phase==='finished'?{score:run.score,title:'Trail complete',message:`${run.landings} clean landings · ${run.lives} attempts left · ${run.elapsed.toFixed(1)} seconds. Ready for a longer, rougher trail?`,next:'Next Trail'}:run.phase==='over'?{score:run.score,title:'Dust settles',message:`${Math.floor(run.furthest-6)} metres · ${run.landings} clean landings. ${run.reason}`} :null;},
    next(){run=createRide(run.level+1);lastEngine=0;},
  };
}
const mount=()=>mountArcade('torque-trail',createGame);mount();
window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
