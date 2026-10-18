// Fuente única de nombres, orden y rutas de las secciones principales.
export const navigation = [
  { id: 'home', label: 'Inicio', path: '', description: 'El punto de partida de este pequeño universo.' },
  { id: 'about', label: 'Sobre mí', path: 'sobre-mi/', description: 'La persona detrás de las ideas.' },
  { id: 'projects', label: 'Proyectos', path: 'proyectos/', description: 'Código, experimentos y cosas por descubrir.' },
  { id: 'games', label: 'Juegos', path: 'juegos/', description: 'Pequeñas pausas para explorar y jugar.' },
  { id: 'blog', label: 'Blog', path: 'blog/', description: 'Notas y relatos desde esta órbita.' },
  { id: 'journey', label: 'Trayectoria', path: 'trayectoria/', description: 'Un recorrido de hallazgos y aprendizajes.' },
  { id: 'contact', label: 'Contacto', path: 'contacto/', description: 'Un canal para cruzar señales.' },
] as const;

export type SectionId = (typeof navigation)[number]['id'];
