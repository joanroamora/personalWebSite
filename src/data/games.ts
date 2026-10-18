export interface Game {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  genre: string;
  status: 'prototype' | 'development';
  color: string;
  symbol: 'cadet' | 'orbit' | 'signal' | 'garden';
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
