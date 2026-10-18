// Solo contenido ficticio de demostración. No describe al propietario.
// Sustituirlo con PERFIL_PUBLICO.md en la etapa de contenido aprobado.
export const personalDemo = {
  notice: 'Contenido de muestra. Los textos, intereses e hitos son ficticios y no describen al propietario.',
  home: {
    introduction: 'Este podría ser un pequeño archivo de cosas hechas por curiosidad: código para explorar, juegos para detenerse un rato y textos para seguir una idea.',
    phrase: 'A veces, una buena pregunta es el principio de algo pequeño.',
    featured: {
      title: 'Un experimento por descubrir.',
      description: 'Este espacio espera una pieza elegida: un proyecto, un juego o una idea que merezca una mirada más cercana.',
    },
    latest: {
      title: 'La primera página está en blanco.',
      description: 'Aquí aparecerá la última entrada cuando haya un texto para compartir. Por ahora, puedes visitar el espacio del blog.',
    },
  },
  about: {
    introduction: 'Una presentación de muestra para imaginar a la persona detrás de este archivo.',
    title: 'Seguir el hilo de la curiosidad.',
    biography: [
      'En esta biografía de ejemplo, crear empieza por mirar con un poco más de atención. Una pregunta se convierte en una nota; la nota, en un pequeño experimento; y a veces el experimento encuentra aquí su lugar.',
      'El código, los juegos y la escritura son distintas maneras de probar una idea. Esta historia imaginaria deja espacio para lo inacabado, para aprender despacio y para volver a mirar algo desde otro ángulo.',
    ],
    interests: [
      { title: 'Código y pequeños sistemas', description: 'Explorar cómo unas reglas sencillas pueden dar lugar a algo inesperado.' },
      { title: 'Jugar con las ideas', description: 'Inventar pequeñas pausas interactivas que inviten a probar una vez más.' },
      { title: 'Escribir para observar', description: 'Guardar preguntas, escenas y hallazgos antes de que se pierdan.' },
    ],
    approach: 'Empezar con una pregunta pequeña, probar sin prisa y conservar lo que todavía despierta curiosidad. Un enfoque creativo de muestra, pendiente de una voz propia.',
  },
  journey: {
    introduction: 'Un recorrido de ejemplo contado a través de preguntas, pruebas y descubrimientos.',
    title: 'Un camino que se va haciendo.',
    description: 'Estos capítulos son ficticios. Muestran cómo se podrá contar un recorrido personal, sin fechas ni experiencias atribuidas al propietario.',
    chapters: [
      { title: 'La primera pregunta', description: 'En este relato de muestra, todo comienza al querer entender cómo funciona algo cotidiano. Desarmar una idea, observar sus piezas y volver a juntarlas abre un primer camino.', learning: 'Aprendizaje de muestra: mirar antes de dar una respuesta.' },
      { title: 'Dar forma a una idea', description: 'La curiosidad encuentra una forma concreta en un pequeño experimento. No necesita ser grande: basta con que permita probar, equivocarse y descubrir una posibilidad nueva.', learning: 'Aprendizaje de muestra: una prueba pequeña también cuenta.' },
      { title: 'Dejar una puerta abierta', description: 'El recorrido imaginario llega a un archivo donde conviven pruebas, juegos y notas. Compartirlos no cierra el proceso: deja un punto de partida para lo siguiente.', learning: 'Aprendizaje de muestra: dejar espacio para seguir aprendiendo.' },
    ],
  },
  contact: {
    introduction: 'Un espacio para los canales públicos que se elijan más adelante.',
    title: 'Cruzar una señal.',
    description: 'Los canales de esta página son de muestra. Sus enlaces llevan a destinos de prueba dentro de la propia página.',
    channels: [
      { id: 'correo-de-muestra', title: 'Correo', label: 'Probar enlace de correo', description: 'Para una conversación que empieza con unas líneas.', destinationTitle: 'Destino de prueba: correo', destinationDescription: 'Aquí irá una dirección pública aprobada. Este enlace de muestra no abre el correo ni envía mensajes.' },
      { id: 'perfil-de-muestra', title: 'Perfil de código', label: 'Probar enlace de perfil', description: 'Para seguir el rastro de las ideas hechas con código.', destinationTitle: 'Destino de prueba: perfil', destinationDescription: 'Aquí irá un perfil público aprobado. Este enlace de muestra no representa ninguna cuenta personal.' },
    ],
  },
} as const;
