export interface Game {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  genre: string;
  status: 'prototype' | 'playable' | 'development';
  color: string;
  symbol: 'cadet' | 'galactian' | 'crane' | 'bike' | 'orbit' | 'signal' | 'garden';
  instructions: readonly string[];
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
