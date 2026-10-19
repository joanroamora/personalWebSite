export interface Game {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  genre: string;
  status: 'prototype' | 'playable' | 'development';
  color: string;
  symbol: 'cadet' | 'galactian' | 'crane' | 'bike' | 'grid' | 'deploy' | 'packet' | 'rescue' | 'orbit' | 'signal' | 'garden';
  instructions: readonly string[];
  fullscreen?: boolean;
}

export const games: readonly Game[] = [
  {
    id: 'cadete-roa', title: 'Cadete Roa', subtitle: 'Keep moving. Find your way.',
    summary: 'Un entrenamiento que nunca sigue el mismo camino. Corre entre trincheras, salta sobre contenedores y encuentra tu siguiente carril.',
    genre: 'Endless runner · 3D low poly', status: 'prototype', color: 'sand', symbol: 'cadet',
    instructions: ['Cambia de carril con ← y → o A y D. En el celular, desliza a los lados o usa los botones.', 'Salta con Espacio, ↑ o W. También puedes deslizar hacia arriba o tocar JUMP.', 'Evita las granadas y las trincheras. Puedes saltar y aterrizar sobre contenedores y tanques.', 'Recoge las insignias y supera tu distancia. P o Escape pausa la partida.'],
  },
  {
    id: 'galactian', title: 'Galactian', subtitle: 'A small ship. A stubborn planet.',
    summary: 'Un shooter vertical sobre un planeta ocupado por orcos. Combate en el aire, bombardea el terreno y aterriza en bases aliadas para reparar y reabastecer tu nave.',
    genre: 'Arcade shooter · Pixel art', status: 'playable', color: 'green', symbol: 'galactian',
    instructions: ['WASD or arrows to move. Hold Space to fire; B or X drops a ground bomb.', 'Hold Shift to slow down. Align inside an allied landing zone and press E to Land.', 'Wait for fuel, repairs and bombs, then press E to Take Off. P or Escape pauses.', 'On touchscreens: move with the joystick, fire automatically, and use Bomb, Slow and Land.'],
  },
  {
    id: 'rail-crane', title: 'Rail Crane', subtitle: 'A long train. A short window.',
    summary: 'Opera una grúa en una terminal ferroviaria: identifica la carga, recorre el tren y coloca cada contenedor en su posición antes de la salida. Nombre provisional.',
    genre: 'Logistics arcade · Crane operation', status: 'playable', color: 'sand', symbol: 'crane',
    instructions: ['WASD or arrows move the trolley and hook. Space picks up or releases a container.', 'Match the container ID and slot number. Raise the load before travelling, then lower and release over the wagon.', 'Q / E, separate View buttons or the yard slider explore the train. Moving sideways follows the crane again.', 'Correct misplaced loads by picking them up again. P or Escape pauses; touch buttons support simultaneous movement.'],
  },
  {
    id: 'torque-trail', title: 'Torque Trail', subtitle: '8-bit trails. Real momentum.',
    summary: 'Una moto de tierra en 8 bits, con suspensión, agarre e inercia. Acelera, frena e inclina al piloto para superar rampas, baches y saltos entre puntos de control.',
    genre: 'Motorbike trials · 8-bit', status: 'playable', color: 'sand', symbol: 'bike',
    instructions: ['W / Up accelerates. S / Down brakes. Release both to coast.', 'A / Left leans back. D / Right leans forward, on the ground and in the air.', 'Read the track preview, build speed before a gap and align both wheels with the landing.', 'Three attempts per trail. E or Recover returns to the last checkpoint after a crash. P / Escape pauses. Touch controls support gas and balance together.'],
  },
  {
    id:'blackout-texas',title:'Blackout Texas',subtitle:'Keep the lights. Keep your nerve.',
    summary:'Una red eléctrica ficticia de Texas en hora pico. Equilibra generación, batería y cuatro distritos; anticipa eventos y envía la cuadrilla antes de que se apaguen las luces.',
    genre:'Grid strategy · Control room',status:'playable',color:'green',symbol:'grid',fullscreen:false,
    instructions:['Start Gas, then select plants and districts to adjust MW assignments. Auto Balance respects capacity and hospital priority.', 'Choose Charge, Hold or Discharge. MW is power; MWh is stored energy. One real second represents one grid minute.', 'Watch event warnings. Reduce overloaded assignments and send the crew to selected faults.', 'Survive the three-minute shift. All controls work by click, keyboard focus or touch. P / Escape pauses.'],
  },
  {
    id:'deploy-or-die',title:'Deploy or Die',subtitle:'Ship carefully. Breathe occasionally.',
    summary:'Un pequeño centro de operaciones bajo presión. Escala servidores, atiende incidentes y prueba versiones en canary sin agotar el presupuesto ni la paciencia de la plataforma.',
    genre:'Operations strategy · Incident arcade',status:'playable',color:'cyan',symbol:'deploy',fullscreen:false,
    instructions:['Platform and Release tabs keep controls compact. Select a server to Repair broken hardware or Restart a memory leak.', 'Scale Up takes 6 seconds. Database throughput is a separate bottleneck; Optimize Database helps temporarily.', 'Run Tests, Deploy Canary, observe for 6 seconds, then Promote or Rollback. Release traits stay fixed throughout the run.', 'Survive the 3:15 shift with error budget remaining. Use clicks or touch; P / Escape pauses.'],
  },
  {
    id:'packet-runner',title:'Packet Runner',subtitle:'One packet. Find a way through.',
    summary:'Lleva un paquete por una red de laberintos conectados. Elige rutas, evita patrullas y usa portales para llegar al destino correcto antes de que se agote su tiempo de vida.',
    genre:'Maze arcade · Route finding',status:'playable',color:'cyan',symbol:'packet',fullscreen:false,
    instructions:['WASD or arrows move along connected paths. Turns can be buffered before junctions. Release to stop after the current hop.', 'Match the destination ID. Orange dashed links are congested; F diamonds are Firewall Patrols.', 'Collect + for integrity or T for time. Paired portals and safely warned node closures arrive from level 2.', 'Three failed packets end the run. Touch the large direction pad; Priority Packet optionally raises the next delivery reward and difficulty. P / Escape pauses.'],
  },
  {
    id:'orbital-rescue',title:'Orbital Rescue',subtitle:'Bring somebody home.',
    summary:'Pilota una nave con inercia, rescata astronautas y vuelve a la estación. Aprende a frenar, cuida el combustible y alinea el acoplamiento antes de explorar misiones más lejanas.',
    genre:'Spaceflight arcade · Rescue',status:'playable',color:'cyan',symbol:'rescue',fullscreen:false,
    instructions:['A / D or left / right rotates. W / Up applies thrust; S / Down brakes. Touch controls allow turning and thrust together.', 'Approach an astronaut below 9 m/s and hold inside the rescue ring for 1.4 seconds. Pickup is automatic; cabin capacity is two.', 'Return to Station below 11 m/s, point upward and hold inside the docking box. Docking delivers passengers, refuels and repairs.', 'The first mission teaches flying without oxygen pressure or debris. Later missions add both. Emergency reserve remains after main fuel runs out. P / Escape pauses.'],
  },
  {
    id: 'orbita-de-bolsillo', title: 'Órbita de bolsillo', subtitle: 'Un pequeño sistema por descubrir.',
    summary: 'Ficha de muestra para un futuro juego de precisión entre pequeñas órbitas. Por ahora, solo una idea dando vueltas.',
    genre: 'Precisión · Ficha de muestra', status: 'development', color: 'green', symbol: 'orbit',
    instructions: ['Este espacio es una ficha de demostración.', 'Los controles y las reglas se definirán cuando comience el desarrollo.'],
  },
  {
    id: 'senal-perdida', title: 'Señal perdida', subtitle: 'Hay algo al otro lado.',
    summary: 'Un espacio reservado para explorar señales, patrones y pequeños misterios. Concepto de muestra, todavía sin juego.',
    genre: 'Puzles · Ficha de muestra', status: 'development', color: 'cyan', symbol: 'signal',
    instructions: ['Esta ficha temporal prepara el lugar de un futuro juego.', 'Todavía no hay niveles ni una mecánica jugable.'],
  },
  {
    id: 'jardin-lunar', title: 'Jardín lunar', subtitle: 'Algo crece en la tranquilidad.',
    summary: 'Una pausa imaginaria para cultivar lejos de aquí. Ficha de demostración para un futuro experimento tranquilo.',
    genre: 'Exploración · Ficha de muestra', status: 'development', color: 'lilac', symbol: 'garden',
    instructions: ['El jardín es un concepto de muestra en desarrollo.', 'Su mundo, controles y recursos se añadirán en una futura entrega.'],
  },
];
