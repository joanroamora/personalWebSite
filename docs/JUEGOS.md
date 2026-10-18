# Juegos — Feature6, Feature9 y Feature10

Feature10 añade Torque Trail como cuarto juego jugable: moto lateral de 8 bits con suspensión, agarre, inercia, equilibrio y puntos de control. Controles, reglas y límites de la aproximación física en [TORQUE_TRAIL.md](TORQUE_TRAIL.md).

Feature9 incorpora Galactian y Rail Crane como juegos independientes con una capa de ventana y sesión compartida. Las reglas de Cadete Roa se conservan. Controles, recursos, progresión y supuestos de los dos nuevos juegos en [FEATURE9_JUEGOS.md](FEATURE9_JUEGOS.md).

Feature6 se adelantó por petición del propietario y el blog de Feature5 ya se completó. Cadete Roa es un prototipo jugable en desarrollo; Órbita de bolsillo, Señal perdida y Jardín lunar son conceptos dummy, no juegos terminados. No hay servicios externos ni cambios de publicación.

## Catálogo y rutas

`src/data/games.ts` contiene las fichas. `gameHref()` respeta la base de Pages. El catálogo y las tres páginas dummy funcionan sin JavaScript. Para añadir una ficha en desarrollo basta añadir un objeto con identificador estable, título, resumen, género, símbolo e instrucciones. La página dinámica genera su ruta automáticamente.

Los juegos jugables usan una página propia para importar su componente y sus recursos. Cadete Roa vive en `src/games/cadete-roa/` y solo se importa en `src/pages/juegos/cadete-roa.astro`. Ni el catálogo ni otras secciones cargan su motor, sonidos o simulación.

## Cadete Roa

- **Controles:** ←/→ o A/D cambian de carril; Espacio/↑/W salta; P/Escape pausa. En pausa, Escape cierra la ventana. Deslizar a los lados o hacia arriba hace lo equivalente; también hay botones de 44 px o más y un toque en la pista permite saltar.
- **Reglas:** corre automáticamente; granadas y paredes causan fin de partida. Las trincheras necesitan salto o desvío. Es posible aterrizar en contenedores y tanques y volver a saltar. Cada fila conserva al menos un carril libre. Las insignias suman 25 puntos; la distancia suma un punto por metro. La velocidad aumenta hasta un límite.
- **Presentación:** interfaz en inglés. Diálogo nativo vertical en escritorio, ventana completa en móvil/táctil, también en horizontal. Al comenzar se solicita pantalla completa en móviles que admiten la API; si el navegador no la ofrece, se ocupa su ventana. Cerrar espera cualquier solicitud pendiente y sale de la pantalla completa si la solicitó el juego. La ruta permanece compartible.
- **Pausa:** al perder foco, ocultarse la pestaña, cerrar el diálogo o perderse el contexto WebGL. Nunca se reanuda automáticamente. Salir de la ruta cancela RAF, temporizadores y listeners, desconecta ResizeObserver y libera recursos gráficos y de audio. Regresar desde el historial vuelve a inicializar la pantalla de presentación.
- **Guardado:** solo el mejor puntaje, en `localStorage` bajo `cadete-roa:best:v1`. Si el almacenamiento está bloqueado, la partida funciona y el récord solo dura en memoria. Sin cuentas, red ni analítica.
- **Audio:** sonidos sintetizados opcionales, apagados inicialmente. No hay descargas de audio. El contexto se crea tras una interacción y se suspende en pausa.

## Gráficos y rendimiento

Geometría 3D original de pocas caras, colores planos, niebla y luces por cara. WebGL 1, sin bibliotecas externas, texturas, sombras dinámicas ni efectos de posprocesado. Una llamada de dibujo por fotograma y un buffer reutilizable. Escenario reciclado y cantidades acotadas de obstáculos. Resolución limitada a 1000 px en el lado mayor y densidad máxima 1.5; Eco reduce resolución y limita a 30 fps. Auto también reduce calidad cuando detecta una sucesión de fotogramas lentos. La simulación sigue pasos fijos de 1/60, desacoplados del dibujo, con un máximo de tiempo recuperable por fotograma.

Si WebGL no está disponible, se proyecta la misma geometría en Canvas 2D, con recorte del plano cercano, resolución máxima de 580 px y dibujo hasta 30 fps. No se garantiza rendimiento idéntico en todos los dispositivos: verificar en hardware físico antes de publicar. Movimiento reducido elimina transiciones decorativas, balanceo del personaje y giro de insignias; el desplazamiento necesario para jugar se conserva y se puede pausar.

## Verificación

`npm run verify` comprueba tipos, simulación, build y enlaces. Las pruebas de simulación cubren los cuatro obstáculos, saltos, aterrizajes, carriles, pausa, puntaje, generación y límites de una partida larga. `npm run test:e2e` comprueba catálogo sin JavaScript, rutas dummy, ventana vertical/móvil, teclado/táctil, pausa, reintento, récord, regreso, movimiento reducido y la alternativa Canvas con almacenamiento bloqueado. Las capturas se guardan en los artefactos de Playwright excluidos de Git.

Referencias de implementación: [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).
