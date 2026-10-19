export type Direction='up'|'down'|'left'|'right';
export interface Network {cols:number;rows:number;edges:number[][];origin:number;destinations:number[];portals:[number,number]|null;congestion:string[]}
export interface Patrol {route:number[];index:number;progress:number;forward:boolean}
export interface Packet {
  level:number;seed:number;network:Network;phase:'delivery'|'transition'|'clear'|'over';elapsed:number;transition:number;
  node:number;from:number;to:number;progress:number;travel:number;queued:Direction|null;manual:boolean;holding:Direction|null;
  destination:number;id:number;ttl:number;initialTTL:number;integrity:number;invulnerable:number;portalCooldown:number;
  completed:number;quota:number;failures:number;streak:number;score:number;priority:boolean;nextPriority:boolean;
  blocked:number[];closure:{node:number;warning:number;remaining:number}|null;nextClosure:number;
  patrols:Patrol[];checksums:number[];boosts:number[];notice:string;noticeTime:number;events:('deliver'|'hit'|'portal'|'pickup'|'fail')[];
}
const edgeKey=(a:number,b:number)=>`${Math.min(a,b)}:${Math.max(a,b)}`;
export function createNetwork(level=1,seed=301):Network {
  const cols=level>=3?9:7,rows=level===1?7:level===2?9:11,total=cols*rows;
  let rng=seed>>>0;const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
  const edges:number[][]=Array.from({length:total},()=>[]),seen=new Set<number>([0]),stack=[0];
  const neighbours=(node:number)=>[node%cols>0?node-1:-1,node%cols<cols-1?node+1:-1,node>=cols?node-cols:-1,node<total-cols?node+cols:-1].filter(n=>n>=0);
  const connect=(a:number,b:number)=>{if(!edges[a].includes(b)){edges[a].push(b);edges[b].push(a);}};
  while(stack.length){const current=stack[stack.length-1],next=neighbours(current).filter(n=>!seen.has(n));if(!next.length){stack.pop();continue;}const chosen=next[Math.floor(random()*next.length)];connect(current,chosen);seen.add(chosen);stack.push(chosen);}
  for(let node=0;node<total;node++)for(const next of neighbours(node))if(random()<.19)connect(node,next);
  const origin=(rows-1)*cols,destinations=[cols-1,total-1,0];
  const portals:Network['portals']=level>=2?[cols+1,total-cols-2]:null;
  const congestion:string[]=[];for(let node=0;node<total;node++)for(const next of edges[node])if(next>node&&random()<.13)congestion.push(edgeKey(node,next));
  return {cols,rows,edges,origin,destinations,portals,congestion};
}
/** BFS checks only physical links by default, so TTL remains feasible even without portals. */
export function route(network:Network,start:number,destination:number,blocked:readonly number[]=[],portals=false):number[] {
  if(blocked.includes(start)||blocked.includes(destination))return [];
  const queue=[start],parents=new Map<number,number>([[start,-1]]);
  for(let i=0;i<queue.length;i++){
    const node=queue[i];if(node===destination){const path=[];for(let at=node;at>=0;at=parents.get(at)! )path.push(at);return path.reverse();}
    const neighbours=[...network.edges[node]];
    if(portals&&network.portals?.includes(node))neighbours.push(network.portals[0]===node?network.portals[1]:network.portals[0]);
    for(const next of neighbours)if(!parents.has(next)&&!blocked.includes(next)){parents.set(next,node);queue.push(next);}
  }
  return [];
}
export function packetPosition(packet:Packet):{x:number;y:number} {
  const {cols}=packet.network,t=packet.to===packet.from?0:Math.min(1,packet.progress/packet.travel);
  return {x:packet.from%cols+(packet.to%cols-packet.from%cols)*t,y:Math.floor(packet.from/cols)+(Math.floor(packet.to/cols)-Math.floor(packet.from/cols))*t};
}
export function canClose(packet:Packet,node:number):boolean {
  if([packet.node,packet.from,packet.to,packet.destination,packet.network.origin,...packet.network.destinations,...(packet.network.portals??[])].includes(node))return false;
  if(packet.patrols.some(patrol=>patrol.route.includes(node)))return false;
  const blocked=[...packet.blocked,node];
  return packet.network.destinations.every(destination=>route(packet.network,packet.node,destination,blocked).length>0)&&route(packet.network,packet.network.origin,packet.destination,blocked).length>0;
}
function beginDelivery(packet:Packet):void {
  const destinations=packet.network.destinations.filter(n=>n!==packet.node&&route(packet.network,packet.node,n,packet.blocked).length>0);
  packet.destination=destinations[(packet.id+packet.level)%destinations.length];
  const path=route(packet.network,packet.node,packet.destination,packet.blocked);
  packet.priority=packet.nextPriority;packet.nextPriority=false;
  packet.initialTTL=Math.max(20,(path.length-1)*.62+15)*(packet.priority?.8:1);packet.ttl=packet.initialTTL;packet.integrity=100;
  packet.from=packet.to=packet.node;packet.progress=0;packet.queued=null;packet.manual=false;packet.holding=null;
  packet.phase='delivery';packet.invulnerable=1;
  packet.notice=`Packet P-${String(packet.id).padStart(3,'0')} → ${destinationName(packet)}. ${packet.priority?'Priority delivery: larger reward, shorter TTL.':'Follow connected paths. Congested links take longer.'}`;packet.noticeTime=5;
}
export function createPacket(level=1,seed=301):Packet {
  level=Math.max(1,Math.min(12,Math.floor(level)));const network=createNetwork(level,seed);
  const packet:Packet={level,seed,network,phase:'delivery',elapsed:0,transition:0,node:network.origin,from:network.origin,to:network.origin,progress:0,travel:.28,queued:null,manual:false,holding:null,
    destination:network.destinations[0],id:1,ttl:0,initialTTL:0,integrity:100,invulnerable:0,portalCooldown:0,
    completed:0,quota:3+Math.min(2,level-1),failures:0,streak:0,score:0,priority:false,nextPriority:false,
    blocked:[],closure:null,nextClosure:level>=2?12:Infinity,patrols:[],checksums:[Math.floor(network.edges.length/2)],boosts:[network.cols*2+2],notice:'',noticeTime:0,events:[]};
  if(level>=2)addPatrol(packet);beginDelivery(packet);return packet;
}
export function destinationName(packet:Packet):string {return ['A1','B2','C3'][packet.network.destinations.indexOf(packet.destination)]??'A1';}
function addPatrol(packet:Packet):void {
  if(packet.patrols.length>=3)return;
  const routeNodes=route(packet.network,packet.network.destinations[0],packet.network.destinations[1],packet.blocked);
  if(routeNodes.length>1)packet.patrols.push({route:routeNodes,index:0,progress:0,forward:true});
}
export function requestDirection(packet:Packet,direction:Direction):void {if(packet.phase==='delivery'){packet.queued=direction;packet.manual=true;}}
export function packetAction(packet:Packet,action:string):void {
  if(action==='priority'){packet.nextPriority=!packet.nextPriority;return;}
  if(action.startsWith('turn-')&&['up','down','left','right'].includes(action.slice(5)))requestDirection(packet,action.slice(5) as Direction);
}
function neighbour(packet:Packet,direction:Direction):number {
  const node=packet.node,cols=packet.network.cols;
  const next=direction==='up'?node-cols:direction==='down'?node+cols:direction==='left'?(node%cols?node-1:-1):(node%cols<cols-1?node+1:-1);
  return packet.network.edges[node].includes(next)&&!packet.blocked.includes(next)?next:-1;
}
function fail(packet:Packet,reason:string):void {
  packet.failures++;packet.streak=0;packet.phase=packet.failures>=3?'over':'transition';packet.transition=1.6;
  packet.notice=reason;packet.noticeTime=3;packet.events.push('fail');packet.node=packet.from=packet.to=packet.network.origin;packet.queued=null;packet.holding=null;
}
function arrive(packet:Packet):void {
  packet.node=packet.to;packet.from=packet.to;packet.progress=0;
  if(packet.network.portals?.includes(packet.node)&&packet.portalCooldown<=0){packet.node=packet.network.portals[0]===packet.node?packet.network.portals[1]:packet.network.portals[0];packet.from=packet.to=packet.node;packet.portalCooldown=1.3;packet.events.push('portal');packet.notice='Portal linked. Cooldown prevents a bounce.';packet.noticeTime=2;}
  if(packet.checksums.includes(packet.node)){packet.integrity=Math.min(100,packet.integrity+35);packet.checksums=packet.checksums.filter(n=>n!==packet.node);packet.events.push('pickup');}
  if(packet.boosts.includes(packet.node)){packet.ttl=Math.min(packet.initialTTL+10,packet.ttl+9);packet.boosts=packet.boosts.filter(n=>n!==packet.node);packet.events.push('pickup');}
  if(packet.node===packet.destination){packet.completed++;packet.streak++;packet.score+=Math.round((250+packet.ttl*8+packet.integrity*2+packet.streak*40)*(packet.priority?1.7:1));packet.events.push('deliver');packet.phase=packet.completed>=packet.quota?'clear':'transition';packet.transition=1.4;packet.notice='Delivered ✓ New packet loading.';packet.noticeTime=2;if(packet.completed===1)addPatrol(packet);}
  else if(packet.network.destinations.includes(packet.node)){packet.notice='Wrong destination. Your packet is still safe. Follow the matching destination ID.';packet.noticeTime=2.3;}
}
export function patrolPosition(patrol:Patrol,cols:number):{x:number;y:number} {
  const current=patrol.route[patrol.index],nextIndex=patrol.index+(patrol.forward?1:-1),next=patrol.route[nextIndex]??current;
  return {x:current%cols+(next%cols-current%cols)*patrol.progress,y:Math.floor(current/cols)+(Math.floor(next/cols)-Math.floor(current/cols))*patrol.progress};
}
export function stepPacket(packet:Packet,dt:number,input:{x:number;y:number}):void {
  if(['clear','over'].includes(packet.phase)||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.05);packet.elapsed+=dt;
  packet.noticeTime=Math.max(0,packet.noticeTime-dt);packet.portalCooldown=Math.max(0,packet.portalCooldown-dt);packet.invulnerable=Math.max(0,packet.invulnerable-dt);
  if(packet.phase==='transition'){packet.transition-=dt;if(packet.transition<=0){packet.id++;beginDelivery(packet);}return;}
  packet.ttl=Math.max(0,packet.ttl-dt);if(packet.ttl===0){fail(packet,'TTL expired. The next packet starts from Origin.');return;}
  const held:Direction|null=Math.abs(input.x)>.1?(input.x<0?'left':'right'):Math.abs(input.y)>.1?(input.y<0?'up':'down'):null;
  if(held!==packet.holding){if(held){packet.queued=held;packet.manual=false;}else if(!packet.manual)packet.queued=null;packet.holding=held;}
  if(packet.to===packet.from){const direction=packet.queued??held;if(direction){const next=neighbour(packet,direction);if(next>=0){packet.to=next;packet.travel=packet.network.congestion.includes(edgeKey(packet.node,next))?.56:.28;packet.progress=0;if(packet.queued===direction){packet.queued=null;packet.manual=false;}}}}
  else {packet.progress+=dt;if(packet.progress>=packet.travel)arrive(packet);}
  if(packet.phase!=='delivery')return;
  if(packet.level>=2&&packet.elapsed>=packet.nextClosure&&!packet.closure){
    const candidate=packet.network.edges.findIndex((_,node)=>canClose(packet,node));
    if(candidate>=0)packet.closure={node:candidate,warning:3,remaining:9};packet.nextClosure=packet.elapsed+24;
  }
  if(packet.closure){const closure=packet.closure;if(closure.warning>0){closure.warning-=dt;if(closure.warning<=0){if(canClose(packet,closure.node)){packet.blocked.push(closure.node);packet.notice='Node Down: take the open alternate route.';packet.noticeTime=3;}else packet.closure=null;}}
    else {closure.remaining-=dt;if(closure.remaining<=0){packet.blocked=packet.blocked.filter(n=>n!==closure.node);packet.closure=null;}}
  }
  for(const patrol of packet.patrols){patrol.progress+=dt/.85;if(patrol.progress>=1){patrol.progress=0;patrol.index+=patrol.forward?1:-1;if(patrol.index===patrol.route.length-1)patrol.forward=false;if(patrol.index===0)patrol.forward=true;}}
  const position=packetPosition(packet);
  for(const patrol of packet.patrols){const enemy=patrolPosition(patrol,packet.network.cols);if(packet.invulnerable===0&&Math.hypot(position.x-enemy.x,position.y-enemy.y)<.5){packet.integrity=Math.max(0,packet.integrity-25);packet.invulnerable=1.5;packet.events.push('hit');packet.notice='Firewall contact: integrity reduced. Brief shield active.';packet.noticeTime=2;}}
  if(packet.integrity===0)fail(packet,'Integrity lost. Avoid the diamond-shaped Firewall Patrol.');
  if(packet.events.length>20)packet.events.splice(0,packet.events.length-20);
}
