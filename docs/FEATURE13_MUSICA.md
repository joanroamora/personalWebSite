# Feature13 — música ambiental opcional

Rama `Feature13-musica-ambiental`, creada desde `dev` después de Feature12. El propietario autorizó su integración y push a `dev`; no se modifica `main` ni se publica o despliega el sitio. El servidor temporal del propietario no forma parte de los cambios.

## Uso

Una burbuja fija «Música» abre el reproductor. Incluye activar/pausar, siguiente pista, selección de canción y volumen. Se adapta a pantallas estrechas, orientación horizontal y escritura RTL; tiene controles táctiles de 44 px, teclado, cierre con Escape y textos en los seis idiomas del sitio. Los nombres musicales permanecen intactos.

Las cuatro pistas de `src/sounds/` se registran en `src/data/music.ts`: I Remember Clifford, Tsuioku no Scat, Teresa no Tameiki y Stone River. Los nombres y créditos visibles proceden de los archivos aportados, no de una verificación discográfica. No se inventa intérprete para la primera pista. Las copias anteriores de `public/sounds/` se conservan fuera de esta Feature y no se referencian ni se incluyen en su commit.

## Comportamiento y arquitectura

La música empieza apagada. El elemento `audio` usa `preload="none"` y no recibe `src` hasta una activación explícita. Se reproduce una sola pista a la vez; la lista vuelve al principio al terminar. No hay servicios externos, rastreadores, dependencias nuevas ni archivos multimedia descargados de terceros durante esta tarea.

Se conserva la navegación estática entre documentos. La elección, pista y posición se guardan en `sessionStorage` con la clave `orbital-music-session-v1`; el volumen se recuerda en `localStorage` con `orbital-music-volume-v1`. Una nueva sesión empieza sin autorización de reproducción. El almacenamiento deshabilitado no impide escuchar música en la página actual.

Al cambiar de sección se reanuda aproximadamente desde la posición anterior, con una interrupción breve por la carga del documento; no es reproducción continua sin cortes. Si el navegador bloquea la reanudación, se ofrece un botón para continuar sin borrar la preferencia del usuario. Se contempla el regreso desde la caché del historial, incluyendo una pausa elegida en otra página.

Se suspende al ocultar la pestaña y al abrir cualquiera de los ocho juegos, manteniendo la intención de reproducción para recuperarla al volver o cerrar el juego. Los menús de música, navegación e idioma no quedan abiertos simultáneamente. Se limpia el audio y los eventos al abandonar definitivamente el documento. Sin JavaScript no se muestran controles inactivos ni se solicita audio.

`MusicPlayer.astro` importa las fuentes desde `src/sounds/` mediante URLs de Vite con el prefijo de despliegue; no modifica los MP3 del propietario. `music-state.ts` separa validación, límites y selección de pistas del controlador del navegador.

## Validación y límites

Se comprueban reglas de persistencia y valores inválidos, existencia de las cuatro fuentes MP3, carga opt-in, reproducción real de las cuatro pistas, final de canción, volumen, pausa, navegación, historial, errores de red, bloqueo de autoplay, almacenamiento no disponible, juegos, visibilidad, accesibilidad, seis idiomas y tamaños de 320 a 1440 px. Las capturas quedan excluidas de Git.

Antes de publicación: confirmar los permisos de uso público de las grabaciones aportadas y comprobar el comportamiento de audio en dispositivos físicos, especialmente las políticas de reproducción y controles de volumen del navegador móvil. Esta Feature no constituye aprobación de licencias ni de publicación.

Referencia de comportamiento del navegador: [MDN — Autoplay y tratamiento de los rechazos de play()](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay). No se adopta el router de transiciones para evitar cambiar el ciclo de vida del arcade únicamente por la música.
