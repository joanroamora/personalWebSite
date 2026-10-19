import { mountArcade, type ArcadeGame, type Beep } from '../shared/arcade';
import { COLORS, WORLD, VIEW, carriedCargo, craneAction, createCrane, currentOrder, gripTarget, stepCrane, targetSlot } from './model';
import { renderCrane } from './renderer';

function createGame(beep:Beep):ArcadeGame {
  let run=createCrane();
  return {
    reset(){run=createCrane();},
    next(){const score=run.score;run=createCrane(run.operation+1);run.score=score;},
    update(dt,input){stepCrane(run,dt,input);for(const event of run.events.splice(0)){if(event==='success')beep(740,.18,'triangle');else if(event==='error')beep(100,.18,'sawtooth');else if(event==='dispatch')beep(310,.4,'triangle');else beep(event==='grab'?350:260,.08,'triangle');}},
    action(action){if(action==='grip'||action==='view-left'||action==='view-right')craneAction(run,action);},
    camera(value){run.manualCamera=true;run.cameraTarget=Math.max(0,Math.min(WORLD-VIEW,value/100*(WORLD-VIEW)));},
    draw(context,reduced){renderCrane(context,run,reduced);},
    hud(root){
      const text=(selector:string,value:string)=>{const element=root.querySelector(selector)!;if(element.textContent!==value)element.textContent=value;};
      const order=currentOrder(run),cargo=run.cargo.find(cargo=>cargo.id===order?.cargo),minutes=Math.floor(run.timer/60),seconds=Math.floor(run.timer%60);
      text('[data-crane-score]',String(run.score).padStart(5,'0'));text('[data-crane-time]',`${minutes}:${String(seconds).padStart(2,'0')}`);text('[data-crane-count]',`${run.completed}/${run.quota}`);
      const orderText=cargo&&order?`Load ${COLORS[cargo.color].name} container ${cargo.id} ${COLORS[cargo.color].symbol} into slot ${String(order.slot+1).padStart(2,'0')}.`:'Operation complete. Train departing.';
      text('[data-crane-order]',orderText);
      text('[data-crane-held]',run.held?`HOOKED / ${run.held}`:'HOOK / EMPTY');
      const button=root.querySelector<HTMLButtonElement>('[data-action="grip"]')!;
      button.textContent=run.held?'Release / Space':'Pick Up / Space';button.disabled=run.phase!=='working'||!!run.settling;
      button.dataset.aligned=String(!!gripTarget(run)||targetSlot(run)>=0);
      const notice=run.noticeTime>0||run.phase==='departing'?run.notice:run.held?(targetSlot(run)>=0?'3 / Aligned with wagon. Stop and Release to place the load.':'Raise, move, align and lower into the requested slot.'):gripTarget(run)?'Hook aligned. Select Pick Up to secure this container.':'Use the yard overview to find your cargo and destination.';
      text('[data-crane-warning]',notice);
      root.querySelector<HTMLElement>('[data-crane-time]')!.style.color=run.timer<30?'#ffaaa0':'';
      const camera=root.querySelector<HTMLInputElement>('[data-camera]')!;
      if(document.activeElement!==camera)camera.value=String(run.camera/(WORLD-VIEW)*100);
      const section=Math.min(6,1+Math.floor((run.camera+1)/((WORLD-VIEW)/5)));
      text('[data-crane-bay]',`VIEW ${String(section).padStart(2,'0')} / 06`);
      text('[data-crane-streak]',`OP ${String(run.operation).padStart(2,'0')} · STREAK ×${run.streak}`);
      const carried=carriedCargo(run);root.querySelector<HTMLElement>('[data-crane-order]')!.dataset.carrying=String(carried?.id===order?.cargo);
      return notice;
    },
    result(){return run.phase==='over'?{score:run.score,title:run.success?'Right on time':'Shift ended',message:`${run.completed} of ${run.quota} deliveries. ${run.mistakes} errors. Best streak ×${run.bestStreak}. ${run.success?'Remaining time earned a dispatch bonus. The next operation brings more cargo and longer routes.':'The departure deadline has passed. Try again: raise before travelling, then lower and align with the numbered slot.'}`,next:run.success?'Next Operation':undefined}:null;},
  };
}
const mount=()=>mountArcade('rail-crane',createGame);mount();
window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
