// Fuente única de nombres, orden y rutas de las secciones principales.
export const navigation = [
  { label: 'Inicio', path: '', description: 'El punto de partida de este pequeño universo.' },
  { label: 'Sobre mí', path: 'sobre-mi/', description: 'La persona detrás de las ideas.' },
  { label: 'Proyectos', path: 'proyectos/', description: 'Código, experimentos y cosas por descubrir.' },
  { label: 'Juegos', path: 'juegos/', description: 'Pequeñas pausas para explorar y jugar.' },
  { label: 'Blog', path: 'blog/', description: 'Notas y relatos desde esta órbita.' },
  { label: 'Trayectoria', path: 'trayectoria/', description: 'Un recorrido de hallazgos y aprendizajes.' },
  { label: 'Contacto', path: 'contacto/', description: 'Un canal para cruzar señales.' },
] as const;
