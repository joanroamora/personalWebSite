const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export const GRID_STEP=.25, GRID_SECONDS_PER_SECOND=60, BATTERY_EFFICIENCY=.92;
export type BatteryMode='Charge'|'Hold'|'Discharge';
export interface District {name:string;icon:string;base:number;demand:number;allocation:number;received:number;capacity:number;satisfaction:number;stress:number;tripped:boolean;fault:boolean}
export interface GridEvent {kind:'Heat Wave'|'Wind Drop'|'Generator Fault'|'Line Overload'|'Evening Peak';at:number;duration:number;started:boolean;resolved:boolean}
export interface Grid {
  level:number;elapsed:number;duration:number;accumulator:number;phase:'playing'|'won'|'lost';selected:number;
  gas:{running:boolean;startup:number;target:number;output:number;maximum:number;fault:boolean};
  solar:number;wind:number;generation:number;demand:number;supplied:number;curtailed:number;
  battery:{mode:BatteryMode;energy:number;capacity:number;power:number;charge:number;discharge:number};
  districts:District[];events:GridEvent[];crew:{target:number|null;remaining:number;cooldown:number};
  stability:number;emergency:number;score:number;servedMWh:number;unservedMWh:number;hospitalSeconds:number;resolved:number;notice:string;
}
export function solarForecast(time:number,duration=180,level=1):number {
  return 72*(1+.1*(level-1))*Math.max(0,Math.sin(Math.PI*(.15+.85*Math.min(1,time/duration))));
}
export function createGrid(level=1):Grid {
  level=clamp(Math.floor(level),1,8);const factor=1+.1*(level-1);
  const districts=[['Residential','⌂',52,90],['Downtown','▥',64,95],['Industrial','⚙',66,100],['Hospital','+',34,65]].map(([name,icon,base,capacity])=>({name:String(name),icon:String(icon),base:Number(base)*factor,demand:Number(base)*factor,allocation:Number(base)*factor,received:0,capacity:Number(capacity)*factor,satisfaction:100,stress:0,tripped:false,fault:false}));
  return {level,elapsed:0,duration:180,accumulator:0,phase:'playing',selected:-1,
    gas:{running:false,startup:0,target:190*factor,output:0,maximum:260*factor,fault:false},solar:0,wind:0,generation:0,demand:216*factor,supplied:0,curtailed:0,
    battery:{mode:'Hold',energy:60*factor,capacity:100*factor,power:50*factor,charge:0,discharge:0},districts,
    events:[['Heat Wave',35,20],['Wind Drop',level>1?46:68,15],['Generator Fault',95,20],['Line Overload',level>2?105:125,22],['Evening Peak',150,30]].map(([kind,at,duration])=>({kind:kind as GridEvent['kind'],at:Number(at),duration:Number(duration),started:false,resolved:false})),
    crew:{target:null,remaining:0,cooldown:0},stability:100,emergency:0,score:0,servedMWh:0,unservedMWh:0,hospitalSeconds:0,resolved:0,notice:'1 / Select Start Gas. The generator needs 8 seconds to warm up.'};
}
export const lineCapacity=(district:District)=>district.tripped?0:district.capacity*(district.fault?.55:1);
export const gasCapacity=(grid:Grid)=>grid.gas.maximum*(grid.gas.fault?.6:1);
const active=(grid:Grid,kind:GridEvent['kind'])=>grid.events.some(event=>event.kind===kind&&grid.elapsed>=event.at&&grid.elapsed<event.at+event.duration&&!event.resolved);

/** Charge/discharge powers are mutually exclusive; dt is real seconds, with a declared 60x grid clock. */
export function batteryFlow(battery:Grid['battery'],generation:number,requested:number,dt:number):number {
  battery.charge=0;battery.discharge=0;
  const hours=dt*GRID_SECONDS_PER_SECOND/3600;
  if(hours<=0)return generation;
  if(battery.mode==='Charge') {
    battery.charge=Math.min(battery.power,Math.max(0,generation-requested),(battery.capacity-battery.energy)/(hours*BATTERY_EFFICIENCY));
    battery.energy+=battery.charge*hours*BATTERY_EFFICIENCY;
  } else if(battery.mode==='Discharge') {
    battery.discharge=Math.min(battery.power,Math.max(0,requested-generation),battery.energy*BATTERY_EFFICIENCY/hours);
    battery.energy-=battery.discharge*hours/BATTERY_EFFICIENCY;
  }
  battery.energy=clamp(battery.energy,0,battery.capacity);
  if(battery.energy<1e-9)battery.energy=0;
  return Math.max(0,generation-battery.charge+battery.discharge);
}

/** Hospital first; remaining districts share constrained supply proportionally. */
export function distribute(grid:Grid,supply:number):void {
  const requested=grid.districts.map(d=>Math.max(0,Math.min(d.allocation,lineCapacity(d),d.demand)));
  const hospital=Math.min(requested[3],supply);grid.districts[3].received=hospital;
  const others=requested.slice(0,3).reduce((sum,n)=>sum+n,0),ratio=Math.min(1,Math.max(0,supply-hospital)/(others||1));
  for(let i=0;i<3;i++)grid.districts[i].received=requested[i]*ratio;
  grid.supplied=grid.districts.reduce((sum,d)=>sum+d.received,0);grid.curtailed=Math.max(0,supply-grid.supplied);
}
export function autoBalance(grid:Grid):void {
  for(const district of grid.districts)district.allocation=Math.min(district.demand,lineCapacity(district));
  grid.notice='Assignments updated. Hospital has first priority. Generation and repairs still need you.';
}
export function repairAvailable(grid:Grid):boolean {
  return Boolean(grid.crew.target===null&&grid.crew.cooldown<=0&&(grid.selected===-1?grid.gas.fault:grid.districts[grid.selected]?.fault||grid.districts[grid.selected]?.tripped));
}
export function gridAction(grid:Grid,action:string,value?:number):boolean {
  if(grid.phase!=='playing')return false;
  if(action.startsWith('select-')){const index=Number(action.slice(7));if(Number.isInteger(index)&&index>=-3&&index<4){grid.selected=index;return true;}return false;}
  if(action==='start-gas'&&!grid.gas.running&&grid.gas.startup===0){grid.gas.startup=8;grid.notice='Gas plant starting. Output ramps gradually after warm-up.';return true;}
  if(['Charge','Hold','Discharge'].includes(action)){grid.battery.mode=action as BatteryMode;return true;}
  if(action==='auto'){autoBalance(grid);return true;}
  if(action==='increase'||action==='decrease'||action==='set') {
    if(grid.selected<-1)return false;
    const change=action==='increase'?10:action==='decrease'?-10:0;
    if(grid.selected===-1)grid.gas.target=clamp(value??grid.gas.target+change,0,grid.gas.maximum);
    else {const d=grid.districts[grid.selected];d.allocation=clamp(value??d.allocation+change,0,d.capacity*1.2);}
    return true;
  }
  if(action==='repair'&&repairAvailable(grid)){grid.crew.target=grid.selected;grid.crew.remaining=7;grid.notice='Crew dispatched. Keep the line below its limit while repairs are underway.';return true;}
  return false;
}
function tick(grid:Grid):void {
  const dt=GRID_STEP;grid.elapsed=Math.min(grid.duration,grid.elapsed+dt);
  for(const event of grid.events) {
    if(!event.started&&grid.elapsed>=event.at){event.started=true;grid.notice=`${event.kind} active. Check generation and allocations.`;if(event.kind==='Generator Fault')grid.gas.fault=true;if(event.kind==='Line Overload')grid.districts[2].fault=true;}
    if(event.started&&grid.elapsed>=event.at+event.duration&&!event.resolved){event.resolved=true;if(event.kind==='Generator Fault')grid.gas.fault=false;if(event.kind==='Line Overload')grid.districts[2].fault=false;}
  }
  grid.crew.cooldown=Math.max(0,grid.crew.cooldown-dt);
  if(grid.crew.target!==null) {
    grid.crew.remaining-=dt;
    if(grid.crew.remaining<=0){const target=grid.crew.target;if(target===-1)grid.gas.fault=false;else{const d=grid.districts[target];d.tripped=false;d.fault=false;d.stress=0;}
      const kind=target===-1?'Generator Fault':'Line Overload';grid.events.filter(e=>e.kind===kind&&e.started).forEach(e=>e.resolved=true);
      grid.resolved++;grid.crew.target=null;grid.crew.cooldown=12;grid.notice='Repair complete. Crew resting for 12 seconds.';
    }
  }
  if(grid.gas.startup>0){grid.gas.startup=Math.max(0,grid.gas.startup-dt);if(grid.gas.startup===0)grid.gas.running=true;}
  const target=grid.gas.running?Math.min(grid.gas.target,gasCapacity(grid)):0;
  grid.gas.output+=clamp(target-grid.gas.output,-5*dt,5*dt);
  grid.gas.output=Math.min(grid.gas.output,gasCapacity(grid));
  grid.solar=solarForecast(grid.elapsed,grid.duration,grid.level);
  grid.wind=(62+8*Math.sin(grid.elapsed*.07))*(1+.1*(grid.level-1))*(active(grid,'Wind Drop')?.52:1);
  grid.generation=grid.gas.output+grid.solar+grid.wind;
  grid.demand=0;
  for(const [i,d] of grid.districts.entries()) {
    d.demand=d.base*(1+.045*Math.sin(grid.elapsed*.035+i))*(active(grid,'Heat Wave')?1.18:1)*(active(grid,'Evening Peak')?1.14:1);
    grid.demand+=d.demand;
    const cap=lineCapacity(d);
    if(!d.tripped&&d.allocation>cap+.5)d.stress+=dt;else d.stress=Math.max(0,d.stress-dt*2);
    if(d.stress>=8&&!d.tripped){d.tripped=true;grid.notice=`${d.name} line tripped. Select the district and dispatch the crew.`;}
  }
  const requested=grid.districts.reduce((sum,d)=>sum+Math.min(d.allocation,d.demand,lineCapacity(d)),0);
  const supply=batteryFlow(grid.battery,grid.generation,requested,dt);distribute(grid,supply);
  let shortage=0;
  for(const [i,d] of grid.districts.entries()) {
    const missing=clamp(1-d.received/d.demand,0,1);
    d.satisfaction=clamp(d.satisfaction+dt*(missing>.03?-missing*(i===3?3.5:1.7):.5),0,100);
    shortage+=missing*(i===3?3:1)/6;
  }
  if(grid.elapsed>12)grid.stability=clamp(grid.stability+dt*(shortage<.04?.55:-shortage*1.8),0,100);
  grid.emergency=grid.stability===0?grid.emergency+dt:0;
  const hours=dt*GRID_SECONDS_PER_SECOND/3600;
  grid.servedMWh+=grid.supplied*hours;grid.unservedMWh+=(grid.demand-grid.supplied)*hours;
  if(grid.districts[3].received>=grid.districts[3].demand*.95)grid.hospitalSeconds+=dt;
  const efficiency=grid.generation>0?Math.min(1,grid.supplied/grid.generation):0;
  grid.score=Math.floor(grid.servedMWh*8+grid.hospitalSeconds*3+grid.stability*2+grid.resolved*100+efficiency*50);
  if(grid.emergency>=7){grid.phase='lost';grid.notice='Grid stability stayed at zero beyond the emergency window.';}
  else if(grid.elapsed>=grid.duration){grid.phase=grid.stability>=15?'won':'lost';grid.notice=grid.phase==='won'?'Peak hour survived. Texas can exhale.':'The shift ended with insufficient stability.';}
  else {
    const warning=grid.events.find(e=>!e.started&&e.at-grid.elapsed<=8);
    if(warning)grid.notice=`IN ${Math.ceil(warning.at-grid.elapsed)}s / ${warning.kind}. ${warning.kind==='Line Overload'?'Industrial line capacity will drop. Lower its assignment.':'Prepare gas output and battery reserves.'}`;
    else if(grid.stability<20)grid.notice=`GRID CRITICAL / ${grid.stability===0?Math.ceil(7-grid.emergency)+'s emergency window':'Restore priority loads now.'}`;
    else if(grid.elapsed>12&&grid.elapsed<23)grid.notice='2 / Auto Balance assigns demand. Charge the battery from surplus; Discharge covers a shortfall.';
  }
}
export function stepGrid(grid:Grid,dt:number):void {
  if(grid.phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
  grid.accumulator+=Math.min(dt,.5);
  while(grid.accumulator>=GRID_STEP&&grid.phase==='playing'){grid.accumulator-=GRID_STEP;tick(grid);}
}
