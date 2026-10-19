import {packetPosition,patrolPosition,destinationName,type Packet} from './model';
export function networkLayout(packet:Packet):{cell:number;left:number;top:number} {
 const cell=Math.min(320/(packet.network.cols-1),400/(packet.network.rows-1));
 return {cell,left:(360-(packet.network.cols-1)*cell)/2,top:(480-(packet.network.rows-1)*cell)/2};
}
export function drawPacket(c:CanvasRenderingContext2D,packet:Packet,reduced:boolean):void {
 const {network}=packet,{cell,left,top}=networkLayout(packet),point=(node:number)=>({x:left+node%network.cols*cell,y:top+Math.floor(node/network.cols)*cell});
 c.fillStyle='#081c29';c.fillRect(0,0,360,480);
 c.strokeStyle='#123545';c.lineWidth=1;for(let x=0;x<360;x+=20){c.beginPath();c.moveTo(x,0);c.lineTo(x,480);c.stroke();}for(let y=0;y<480;y+=20){c.beginPath();c.moveTo(0,y);c.lineTo(360,y);c.stroke();}
 for(let node=0;node<network.edges.length;node++)for(const next of network.edges[node])if(next>node){const a=point(node),b=point(next),down=packet.blocked.includes(node)||packet.blocked.includes(next),congested=network.congestion.includes(`${node}:${next}`);c.strokeStyle=down?'#634b63':congested?'#f4c683':'#436776';c.lineWidth=congested?5:3;c.setLineDash(down?[3,7]:congested?[6,4]:[]);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
 c.setLineDash([]);
 for(let node=0;node<network.edges.length;node++){const p=point(node);c.fillStyle='#8dafb5';c.fillRect(p.x-3,p.y-3,6,6);if(packet.blocked.includes(node)){c.fillStyle='#ffaca8';c.fillRect(p.x-9,p.y-9,18,18);c.fillStyle='#182734';c.font='bold 15px monospace';c.textAlign='center';c.fillText('×',p.x,p.y+5);}}
 const origin=point(network.origin);c.strokeStyle='#b7dbe2';c.lineWidth=2;c.strokeRect(origin.x-10,origin.y-10,20,20);c.fillStyle='#e7eff1';c.font='bold 9px monospace';c.textAlign='center';c.fillText('O',origin.x,origin.y+3);
 network.destinations.forEach((node,i)=>{const p=point(node),active=node===packet.destination;c.fillStyle=active?'#b0f3c7':'#96adc9';c.strokeStyle=active?'#e3ffe3':'#849bb0';c.lineWidth=2;c.beginPath();if(i===0){c.moveTo(p.x,p.y-11);c.lineTo(p.x+11,p.y+9);c.lineTo(p.x-11,p.y+9);}else if(i===1){c.moveTo(p.x,p.y-12);c.lineTo(p.x+12,p.y);c.lineTo(p.x,p.y+12);c.lineTo(p.x-12,p.y);}else c.rect(p.x-10,p.y-10,20,20);c.closePath();c.fill();c.fillStyle='#102831';c.font='bold 10px monospace';c.fillText(['A1','B2','C3'][i],p.x,p.y+4);if(active){c.strokeStyle='#dbf9b2';c.strokeRect(p.x-15,p.y-15,30,30);}});
 network.portals?.forEach((node,i)=>{const p=point(node);c.strokeStyle='#cab1ff';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y,11,0,Math.PI*2);c.stroke();c.fillStyle='#e2d3ff';c.font='bold 10px monospace';c.fillText(i===0?'I':'II',p.x,p.y+3);});
 for(const [nodes,symbol,color] of [[packet.checksums,'+','#a7edb8'],[packet.boosts,'T','#ffe6a1']] as const)for(const node of nodes){const p=point(node);c.fillStyle='#153a44';c.fillRect(p.x-8,p.y-8,16,16);c.strokeStyle=color;c.strokeRect(p.x-8,p.y-8,16,16);c.fillStyle=color;c.font='bold 11px monospace';c.fillText(symbol,p.x,p.y+4);}
 if(packet.closure&&packet.closure.warning>0){const p=point(packet.closure.node);c.strokeStyle='#ffe498';c.lineWidth=2;c.strokeRect(p.x-12,p.y-12,24,24);c.fillStyle='#ffe498';c.font='bold 11px monospace';c.fillText('!',p.x,p.y+4);}
 for(const patrol of packet.patrols){const position=patrolPosition(patrol,network.cols),x=left+position.x*cell,y=top+position.y*cell;c.fillStyle='#ff9a9b';c.beginPath();c.moveTo(x,y-10);c.lineTo(x+10,y);c.lineTo(x,y+10);c.lineTo(x-10,y);c.closePath();c.fill();c.fillStyle='#241c30';c.font='bold 10px monospace';c.fillText('F',x,y+4);}
 const position=packetPosition(packet),x=left+position.x*cell,y=top+position.y*cell;
 if(packet.invulnerable>0){c.strokeStyle='#eff8cf';c.lineWidth=2;c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.stroke();}
 c.globalAlpha=!reduced&&packet.invulnerable>0&&Math.floor(packet.elapsed*8)%2?.55:1;c.fillStyle='#f0faf3';c.fillRect(x-9,y-7,18,14);c.strokeStyle='#12384c';c.lineWidth=2;c.strokeRect(x-9,y-7,18,14);c.beginPath();c.moveTo(x-8,y-6);c.lineTo(x,y);c.lineTo(x+8,y-6);c.stroke();c.globalAlpha=1;
 c.textAlign='left';c.fillStyle='#b9d1dc';c.font='9px monospace';c.fillText('O ORIGIN   + CHECKSUM   T TTL BOOST',12,465);
 if(packet.phase==='transition'){c.fillStyle='#091e2bea';c.fillRect(40,190,280,73);c.textAlign='center';c.fillStyle='#b5f2cd';c.font='bold 20px monospace';c.fillText(packet.ttl===0||packet.integrity===0?'PACKET LOST':'DELIVERED',180,219);c.font='10px monospace';c.fillText('Next packet in '+Math.max(0,packet.transition).toFixed(1)+'s',180,244);}
 c.textAlign='left';c.fillStyle='#b5d6dd';c.font='10px monospace';c.fillText(`NETWORK ${String(packet.level).padStart(2,'0')} / DEST ${destinationName(packet)}`,12,20);
}
