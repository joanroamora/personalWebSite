# Feature9 — Galactian y Rail Crane

Rama: `Feature9-galactian-rail-crane`, creada desde `dev` después de integrar Feature8. Alcance autorizado: dos juegos funcionales, catálogo, pruebas y documentación. Tras la revisión local, el propietario autorizó el merge y el push a `dev`, conservando la rama Feature9 en remoto para el historial. No incluye publicación de la web ni despliegue.

## Integración y arquitectura

La referencia fue `src/games/cadete-roa/`: ficha central en `src/data/games.ts`, ruta propia compartible, apertura automática tras la transición nativa y botón para reabrir. Se conservan su anchura máxima de 27 rem, proporción 9:16 en escritorio, backdrop desenfocado, cierre animado, foco restituido y ventana completa en móvil. La pantalla completa real depende del navegador y se solicita mediante Play, nunca automáticamente al cargar.

Los nuevos módulos separan `model.ts` (reglas sin DOM), `renderer.ts` (arte Canvas original), `game.ts` (adaptador de interfaz) y el componente Astro. `src/games/shared/` contiene ventana, controles y ciclo de vida; Cadete Roa conserva su implementación existente. Las páginas localizadas importan la misma ruta de juego. `data-no-translate`, `lang="en"` y `dir="ltr"` mantienen todos los textos internos en inglés incluso en la web árabe.

Canvas usa coordenadas fijas de 360 × 480, escaladas sin deformación con `object-fit: contain`. Cambiar tamaño u orientación no reinicia la simulación. No hay imágenes, audio o servicios externos. Los sprites, escenarios y portadas son originales y dibujados mediante Canvas/SVG; no hay recursos ajenos ni paquetes nuevos.

La simulación avanza a pasos de 1/60 s, con recuperación máxima de 0,1 s por fotograma. El dibujo baja a 30 fps cuando se detecta una sucesión de fotogramas lentos. El HUD se actualiza a 10 Hz. Ocultar la pestaña, perder foco, cerrar o salir de pantalla completa pausa la partida y limpia la entrada; regresar requiere Resume. El cierre detiene RAF y osciladores, suspende audio y espera cualquier solicitud de fullscreen pendiente. `pagehide` aborta listeners y libera audio; `pageshow` permite regresar desde bfcache sin duplicar sesiones.

El sonido se sintetiza solo después de una interacción; está apagado por defecto. Cada juego guarda su mejor puntuación y preferencia en `<slug>:best:v1` y `<slug>:sound:v1` de `localStorage`. Si está bloqueado, se puede jugar y activar sonido, con el récord solo en memoria. La auditoría estática comprueba presupuesto gzip y aislamiento del motor para los tres juegos.

## Galactian

- **Objetivo:** combate continuo sobre un planeta de orcos, reparando y reabasteciendo en bases aliadas.
- **Teclado:** WASD/flechas mueven; Space mantenido dispara; B/X lanza una bomba; Shift mantenido reduce la velocidad; E aterriza o despega; P/Escape pausa. Otro Escape desde pausa cierra.
- **Táctil:** joystick independiente, disparo automático en vuelo, Bomb, Slow mantenido, Land/Take Off contextual y pausa. Se gestionan punteros por identificador: joystick y botones aceptan dedos simultáneos.
- **Armas:** los disparos ilimitados dañan solo aviones; las 5 bombas alcanzan objetivos terrestres dentro del círculo de impacto, después de una breve caída. Los enemigos incluyen cazas, exploradores, grupos de orcos, torretas y vehículos.
- **Recursos:** combustible e integridad de 0–100. Vuelo normal consume 1,8 unidades/s; lento, 0,95. A cero quedan 9 s de emergencia para alcanzar una base. Los impactos tienen 1,6 s de invulnerabilidad, con parpadeo desactivado bajo movimiento reducido.
- **Aterrizaje:** bases cada 1300 unidades, aproximadamente 30 s de avance normal. El indicador muestra dirección y distancia aproximada; el área se identifica en el terreno. Land requiere alineación de menos de 38 unidades en ambos ejes y velocidad inferior a 19. Slow desacelera de 44 a 12. Al iniciar la maniobra se bloquea el avance para conservar la base: 1,4 s de descenso, 2,7 s de servicio y espera indefinida hasta Take Off. Reparación, combustible y bombas vuelven a sus máximos. Una base ya atendida no concede servicio ni puntos repetidos.
- **Progresión:** primeras oleadas pequeñas y espaciadas; después cambian combinaciones, movimiento y frecuencia. Hay un corredor abierto por formación y límites de enemigos, disparos y efectos. La partida termina por integridad o emergencia agotada.

## Rail Crane — nombre provisional

- **Objetivo:** completar las órdenes antes de la salida. Tren de 16 posiciones, más largo que el área visible; todas tienen número propio.
- **Teclado:** A/D o flechas desplazan el carro; W/S o flechas suben/bajan el gancho; Space ejecuta Pick Up/Release. Q/E y botones View desplazan la cámara, con slider separado. Mover el carro vuelve al seguimiento.
- **Táctil:** cruceta de 44 px por botón, con movimiento diagonal simultáneo; botón contextual Pick Up/Release y navegación View separada.
- **Lectura:** orden activa fija en el HUD; cada contenedor usa color, símbolo y código C-xx. El minimapa marca carga, destino, carro y sección visible. El gancho y el botón señalan alineación válida.
- **Operaciones:** la primera pide 3 entregas en 180 s con 6 contenedores. Next Operation aumenta gradualmente hasta 8 órdenes, 12 contenedores, destinos más lejanos y tolerancia menor, manteniendo 16 vagones. Play Again y Restart vuelven a la primera operación. La puntuación se acumula al continuar operaciones.
- **Órdenes válidas:** después de cada entrega, se elige un contenedor existente no entregado y una posición realmente libre dentro del alcance de esa operación. Una colocación equivocada conserva la orden actual. No se solicitan destinos ocupados ni contenedores ya entregados.
- **Carga:** recoger exige alineación y altura de techo. Hay aceleración amortiguada y balanceo leve. Elevar permite cruzar la zona de almacenamiento. La vía está en un plano paralelo: bajar hacia un vagón no queda bloqueado por un contenedor en almacenamiento a la misma coordenada horizontal. Soltar cerca de un vagón libre y a baja velocidad ajusta la carga suavemente durante 0,35 s.
- **Errores recuperables:** posición/carga equivocada resta 8 s y 75 puntos, reinicia la racha y permite recogerla de nuevo. No se puede sobrescribir un vagón ocupado. Soltar fuera de los destinos resta 6 s y 50 puntos; devuelve la carga a su espacio de origen, sin perderla. Devolverla deliberadamente a su propio espacio no penaliza.
- **Puntuación:** 500 puntos por entrega más rapidez y racha, +12 s por carga correcta y bono de tiempo al despachar. El resumen indica entregas, errores, mejor racha, puntuación y récord. Completar la operación o agotar el plazo representa 3 s de salida del tren; después muestra resultados.

## Validación

`npm run verify` incluye pruebas enfocadas en aterrizajes, reservas, emergencia, invulnerabilidad, armas, límites, generación de órdenes, ocupación, correcciones, entrega real a través de la zona de almacenamiento, timeout y progresión. La suite `tests/arcade.spec.ts` comprueba sesiones, teclado, vuelo-aterrizaje-despegue, carga de un vagón, cámara, timeout, multitouch, orientación, accesibilidad, idiomas, sonido y almacenamiento bloqueado. `tests/games.spec.ts` conserva las regresiones de Cadete Roa. Las capturas e informes están en carpetas ignoradas de Playwright.

La comprobación móvil usa Chromium emulado; queda pendiente una sesión en teléfonos físicos, especialmente para fullscreen y ergonomía. En pantallas pequeñas la zona interna conserva su proporción mediante bandas, mientras controles y HUD mantienen su escala de lectura. No se garantiza compatibilidad con navegadores antiguos sin Canvas 2D o `<dialog>`.
