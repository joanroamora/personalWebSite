import {mountArcade,type ArcadeGame,type Beep} from '../shared/arcade';
import {text,button,clock} from '../shared/presentation';
import {createOps,stepOps,opsAction,candidateRelease,releaseErrors,releaseCapacity} from './model';
function createGame(beep:Beep):ArcadeGame {
 let run=createOps(),view='platform',notice=run.notice;
 return {
  reset(){run=createOps();view='platform';notice=run.notice;},next(){run=createOps(run.level+1,run.seed+13);view='platform';notice=run.notice;},
  update(dt){stepOps(run,dt);if(run.notice!==notice){if(/WARNING|CRITICAL/.test(run.notice))beep(180,.13,'triangle');notice=run.notice;}},
  action(action){if(action.startsWith('tab-')){view=action.slice(4);return;}if(opsAction(run,action))beep(420,.045,'triangle');},draw(){},
  hud(root){
   text(root,'[data-ops-traffic]',`${Math.round(run.traffic)} req/s`);text(root,'[data-ops-capacity]',`${Math.round(run.capacity)} req/s`);text(root,'[data-ops-latency]',`${Math.round(run.latency*1000)} ms`);text(root,'[data-ops-errors]',`${Math.ceil(run.errorBudget)}%`);text(root,'[data-ops-budget]',`$${Math.floor(run.budget)}`);text(root,'[data-ops-time]',clock(run.duration-run.elapsed));text(root,'[data-ops-score]',String(run.score));text(root,'[data-ops-notice]',run.notice);
   root.querySelector<HTMLElement>('[data-ops-platform]')!.hidden=view!=='platform';root.querySelector<HTMLElement>('[data-ops-release]')!.hidden=view!=='release';for(const name of ['platform','release'])root.querySelector(`[data-action="tab-${name}"]`)!.setAttribute('aria-pressed',String(view===name));
   for(let i=0;i<5;i++){const node=root.querySelector<HTMLButtonElement>(`[data-server-slot="${i}"]`)!,server=run.servers[i];node.hidden=i>=Math.max(3,run.servers.length+1);node.disabled=!server;node.dataset.action=`server-${server?.id??0}`;node.dataset.health=server?.state??'empty';node.setAttribute('aria-pressed',String(server?.id===run.selected));if(server){text(node,'[data-server-title]',`▣ App ${server.id}`);text(node,'[data-server-health]',`${server.state==='down'?'× ':server.state==='leaking'?'! ':'✓ '}${server.state}${server.remaining>0?' / '+Math.ceil(server.remaining)+'s':''}`);text(node,'[data-server-load]',`${server.state==='healthy'?70:server.state==='leaking'?34:0} req/s base`);}else{text(node,'[data-server-title]','Empty rack');text(node,'[data-server-health]','Use Scale Up');text(node,'[data-server-load]','6s boot time');}}
   text(root,'[data-ops-queue]',`Queue ${Math.ceil(run.queued)} / 450 · Requests expire after 5s`);text(root,'[data-ops-db]',`${run.dbSlow?'! SLOW / ':''}${Math.round(run.database)} req/s${run.dbBoost>0?' / Boost '+Math.ceil(run.dbBoost)+'s':''}`);root.querySelector('[data-action="database"]')!.setAttribute('aria-pressed',String(run.selected===-1));
   run.servers.forEach((server,i)=>{if(['healthy','leaking'].includes(server.state))text(root.querySelector(`[data-server-slot="${i}"]`)!,'[data-server-load]',`${Math.round(Math.min(1,run.traffic/Math.max(1,run.capacity))*100)}% load · ${server.state==='leaking'?34:70} req/s base`);});
   text(root,'[data-ops-availability]',`Served ${Math.floor(run.served)} · Failed ${Math.floor(run.failed)} · Recent errors ${(run.failRate*100).toFixed(1)}%`);
   const server=run.servers.find(s=>s.id===run.selected);text(root,'[data-ops-selection]',run.selected===-1?'DATABASE / Optimize from the Platform panel':`APP ${server?.id??'—'} / ${server?.state??'Select a component'}`);
   button(root,'[data-action="scale-up"]',run.servers.length>=5||run.budget<28);button(root,'[data-action="scale-down"]',run.servers.length<=1);button(root,'[data-action="repair"]',server?.state!=='down',run.budget<18?'Emergency Repair / free':'Repair / $18');button(root,'[data-action="restart"]',!server||!['healthy','leaking'].includes(server.state)||run.budget<6);
   button(root,'[data-action="optimize"]',run.dbCooldown>0||run.budget<18,run.dbCooldown>0?`Database cooldown / ${Math.ceil(run.dbCooldown)}s`:'Optimize Database / $18');
   const release=candidateRelease(run),available=run.elapsed>=run.availableAt;const status=available?run.rollout.toUpperCase():`ARRIVES IN ${Math.ceil(run.availableAt-run.elapsed)}s`;
   text(root,'[data-ops-version]',`RELEASE ${release.id}`);text(root,'[data-ops-release-tab]',release.id);text(root,'[data-ops-rollout]',status);text(root,'[data-ops-tests]',run.testRemaining>0?`Tests running / ${Math.ceil(run.testRemaining)}s`:run.testSignal);
   text(root,'[data-ops-canary]',run.rollout==='canary'?`CANARY / Candidate error rate ${(releaseErrors(release.kind)*100).toFixed(0)}% · Capacity ${Math.round(releaseCapacity(release.kind)*100)}% · Observed ${Math.floor(run.canaryTime)}s / 6s`:'Canary routes 10% to the candidate. Promote changes all servers; Rollback takes 3s.');
   button(root,'[data-action="tests"]',!available||run.tested||run.testRemaining>0||run.budget<8,run.tested?'Tests complete':run.testRemaining>0?'Tests running…':'Run Tests / $8');button(root,'[data-action="canary"]',!available||run.rollout!=='idle'||run.budget<10);button(root,'[data-action="promote"]',run.rollout!=='canary'||run.canaryTime<6||run.budget<12);button(root,'[data-action="rollback"]',!['starting-canary','canary','promoting','production'].includes(run.rollout));
   text(root,'[data-ops-deployments]',`Healthy deployments ${run.deployments} · Rollbacks ${run.rollbacks}`);
   return run.notice.replace(/\d+%/g,'critical');
  },
  result(){return run.phase==='playing'?null:{score:run.score,title:run.phase==='won'?'Still online':'Incident review',message:`${Math.floor(run.served)} requests served · ${Math.floor(run.failed)} failed · ${run.deployments} healthy deployments · ${run.rollbacks} rollbacks · $${Math.floor(run.budget)} left. ${run.notice}`,next:run.phase==='won'?'Next Shift':undefined};},
 };
}
const mount=()=>mountArcade('deploy-or-die',createGame);mount();window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
