import {mountArcade,type ArcadeGame,type Beep} from '../shared/arcade';
import {text,button,clock} from '../shared/presentation';
import {createGrid,stepGrid,gridAction,lineCapacity,gasCapacity,repairAvailable} from './model';
function createGame(beep:Beep):ArcadeGame {
 let run=createGrid(),lastResolved=0,lastPhase=run.phase,lastAlert='';
 return {
  reset(){run=createGrid();lastResolved=0;lastPhase=run.phase;lastAlert='';},next(){run=createGrid(run.level+1);lastResolved=0;lastPhase=run.phase;lastAlert='';},
  update(dt){stepGrid(run,dt);const warning=run.events.find(event=>!event.started&&event.at-run.elapsed<=8),alert=warning?.kind??(run.stability<20?'Grid critical':'');if(alert&&alert!==lastAlert)beep(190,.12,'triangle');lastAlert=alert;if(run.resolved>lastResolved){beep(680,.15,'triangle');lastResolved=run.resolved;}if(run.phase!==lastPhase){beep(run.phase==='won'?820:120,.3,'triangle');lastPhase=run.phase;}},
  action(action){if(gridAction(run,action))beep(350,.035,'triangle');},control(name,value){if(name==='assignment')gridAction(run,'set',value);},draw(){},
  hud(root){
   text(root,'[data-grid-time]',clock(run.duration-run.elapsed));text(root,'[data-grid-generation]',`${Math.round(run.generation)} MW`);text(root,'[data-grid-demand]',`${Math.round(run.demand)} MW`);text(root,'[data-grid-battery]',`${run.battery.energy.toFixed(1)} MWh`);text(root,'[data-grid-stability]',`${Math.round(run.stability)}%`);text(root,'[data-grid-score]',String(run.score));text(root,'[data-grid-day]',`DAY ${String(run.level).padStart(2,'0')}`);text(root,'[data-grid-notice]',run.notice);
   text(root,'[data-grid-gas]',run.gas.startup>0?`Starting ${Math.ceil(run.gas.startup)}s`:run.gas.running?`${Math.round(run.gas.output)} / ${Math.round(gasCapacity(run))} MW`:'Offline / Start below');text(root,'[data-grid-solar]',`${Math.round(run.solar)} MW`);text(root,'[data-grid-wind]',`${Math.round(run.wind)} MW`);
   text(root,'[data-grid-storage]',`${run.battery.energy.toFixed(1)} / ${Math.round(run.battery.capacity)} MWh`);const meter=root.querySelector<HTMLMeterElement>('[data-grid-energy]')!;meter.max=run.battery.capacity;meter.value=run.battery.energy;
   text(root,'[data-grid-flow]',`${run.battery.mode} / ${Math.round(run.battery.charge||run.battery.discharge)} MW · Max ${Math.round(run.battery.power)} MW`);
   for(const mode of ['Charge','Hold','Discharge'])root.querySelector(`[data-action="${mode}"]`)!.setAttribute('aria-pressed',String(run.battery.mode===mode));
   for(let index=-3;index<4;index++)root.querySelector(`[data-action="select-${index}"]`)!.setAttribute('aria-pressed',String(run.selected===index));
   run.districts.forEach((d,i)=>{text(root,`[data-grid-district="${i}"]`,`Demand ${Math.round(d.demand)} / Received ${Math.round(d.received)} MW`);text(root,`[data-grid-satisfaction="${i}"]`,`Service ${Math.round(d.satisfaction)}%`);const line=root.querySelector<HTMLElement>(`[data-grid-line="${i}"]`)!;line.dataset.overload=String(d.stress>0);line.dataset.off=String(d.tripped);text(root,`[data-grid-line="${i}"]`,`${d.tripped?'× DISCONNECTED':d.stress>0?'! OVERLOAD '+Math.ceil(8-d.stress)+'s':'✓ FLOW'} / ${Math.round(d.received)} of ${Math.round(lineCapacity(d))} MW`);});
   const selected=run.selected>=0?run.districts[run.selected]:null,value=selected?.allocation??run.gas.target;
   run.districts.forEach((d,i)=>{text(root,`[data-grid-map-value="${i}"]`,`${d.tripped?'×':d.stress>0?'!':'✓'} ${Math.round(d.received)}/${Math.round(d.demand)} MW`);const line=root.querySelector<SVGPathElement>(`[data-grid-map-line="${i}"]`)!;line.setAttribute('stroke',d.tripped?'#ffaba3':d.stress>0?'#ffcf93':'#bde4a1');line.setAttribute('stroke-dasharray',d.tripped?'2 4':d.stress>0?'5 3':'none');});
   text(root,'[data-grid-selection]',run.selected===-2?'SOLAR / Forecast follows the visible curve':run.selected===-3?'WIND / Output varies gradually':`${selected?.name.toUpperCase()??'GAS'} / ${run.selected===-1?'Target':'Assigned'} ${Math.round(value)} MW`);
   const range=root.querySelector<HTMLInputElement>('[data-control="assignment"]')!;range.disabled=run.selected<-1;range.max=String(selected?selected.capacity*1.2:run.gas.maximum);if(document.activeElement!==range)range.value=String(value);
   button(root,'[data-action="increase"]',run.selected<-1);button(root,'[data-action="decrease"]',run.selected<-1);button(root,'[data-action="repair"]',!repairAvailable(run),run.crew.target!==null?`Repairing ${Math.ceil(run.crew.remaining)}s`:run.crew.cooldown>0?`Crew rest ${Math.ceil(run.crew.cooldown)}s`:'Dispatch Crew');button(root,'[data-action="start-gas"]',run.gas.running||run.gas.startup>0,run.gas.running?'Gas online':run.gas.startup>0?`Starting / ${Math.ceil(run.gas.startup)}s`:'Start Gas / 8s warm-up');
   text(root,'[data-grid-crew]',run.crew.target!==null?`Crew working / ${Math.ceil(run.crew.remaining)}s left`:run.crew.cooldown>0?`Crew cooldown / ${Math.ceil(run.crew.cooldown)}s`:'Crew available / Repair takes 7 seconds');text(root,'[data-grid-curtailment]',`Surplus ${Math.round(run.curtailed)} MW / safely curtailed`);
   const sun=root.querySelector<SVGCircleElement>('[data-grid-sun]')!;sun.setAttribute('cx',String(10+run.elapsed/run.duration*270));sun.setAttribute('cy',String(53-run.solar/(72*(1+.1*(run.level-1)))*43));
   return run.notice.replace(/IN \d+s/,'Incoming event');
  },
  result(){return run.phase==='playing'?null:{score:run.score,title:run.phase==='won'?'Lights still on':'Grid blackout',message:`${run.servedMWh.toFixed(1)} MWh served · ${run.unservedMWh.toFixed(1)} MWh unmet · Hospital protected ${Math.round(run.hospitalSeconds/run.duration*100)}% · ${run.resolved} repairs. ${run.notice}`,next:run.phase==='won'?'Next Day':undefined};},
 };
}
const mount=()=>mountArcade('blackout-texas',createGame);mount();window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
