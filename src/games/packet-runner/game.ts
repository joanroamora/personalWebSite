import {mountArcade,type ArcadeGame,type Beep} from '../shared/arcade';
import {text} from '../shared/presentation';
import {createPacket,stepPacket,packetAction,destinationName} from './model';
import {drawPacket} from './renderer';
function createGame(beep:Beep):ArcadeGame {
 let run=createPacket();
 return {
  reset(){run=createPacket();},next(){const score=run.score;run=createPacket(run.level+1,run.seed+37);run.score=score;},
  update(dt,input){stepPacket(run,dt,input);for(const event of run.events.splice(0))beep(event==='hit'||event==='fail'?110:event==='portal'?880:620,.1,'triangle');},
  action(action){packetAction(run,action);},draw(context,reduced){drawPacket(context,run,reduced);},
  hud(root){
   text(root,'[data-packet-destination]',destinationName(run));text(root,'[data-packet-ttl]',`${run.ttl.toFixed(1)}s`);text(root,'[data-packet-score]',String(run.score));text(root,'[data-packet-hull]',`${run.integrity}%`);root.querySelector<HTMLMeterElement>('[data-packet-integrity]')!.value=run.integrity;
   text(root,'[data-packet-deliveries]',`${run.completed} / ${run.quota} deliveries`);text(root,'[data-packet-id]',`P-${String(run.id).padStart(3,'0')} / ${run.priority?'PRIORITY':'Standard'}`);text(root,'[data-packet-failures]',`${run.failures} / 3 failed`);
   root.querySelector('[data-action="priority"]')!.setAttribute('aria-pressed',String(run.nextPriority));text(root,'[data-action="priority"]',run.nextPriority?'Next: Priority ✓':'Priority Packet');
   let notice=run.noticeTime>0?run.notice:`Match ${destinationName(run)}. Connected paths only. ${run.network.portals?'I ↔ II portals are paired.':'Hold a direction; release to stop.'}`;
   if(run.closure&&run.closure.warning>0)notice=`! Node ${run.closure.node} closes in ${Math.ceil(run.closure.warning)}s. An alternate route is protected.`;
   text(root,'[data-packet-notice]',notice);return run.noticeTime>0?run.notice:'';
  },
  result(){return run.phase==='clear'?{score:run.score,title:'Packets delivered',message:`${run.completed} deliveries · ${run.failures} failures · Best current streak ${run.streak}. Next network adds new routes, portals and threats.`,next:'Next Network'}:run.phase==='over'?{score:run.score,title:'Connection closed',message:`${run.completed} deliveries · ${run.failures} failed packets. ${run.notice}`} :null;},
 };
}
const mount=()=>mountArcade('packet-runner',createGame);mount();window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
