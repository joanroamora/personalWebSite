# Feature11 — cuatro nuevas partidas

Rama: `Feature11-cuatro-juegos`, creada desde `dev` después de Feature10. El propietario autorizó su integración y push a `dev` tras la entrega local. No incluye publicación, despliegue ni integración en `main`.

El catálogo reúne ocho juegos jugables y conserva tres conceptos dummy claramente identificados. Cadete Roa, Galactian, Rail Crane y Torque Trail ya estaban implementados y mantienen sus reglas. Cada nuevo juego tiene ruta española y cinco rutas localizadas; su interfaz interna siempre es inglesa, incluso en árabe. El build genera 289 páginas.

## Integración y mantenimiento

- Fichas en `src/data/games.ts`, traducciones de las fichas en `src/i18n/games.ts` y dibujos originales en `Feature11Artwork.astro`.
- Un directorio independiente por juego en `src/games/`, con modelo de reglas, adaptador de interfaz y componente Astro. Packet Runner y Orbital Rescue separan además el renderizador Canvas.
- Se reutiliza `ArcadeWindow` y la sesión de `shared/arcade.ts`: diálogo 9:16 de Cadete Roa en escritorio, ventana del navegador en móvil, apertura/cierre, pausa, entrada, audio opcional y récords. Estos cuatro juegos no solicitan pantalla completa ni fuerzan orientación.
- Estados de sesión: presentación, instrucciones/tutorial, partida, pausa y resultados. La presentación ofrece Play y How to Play; Play abre una breve guía antes de Start Playing. Pausa ofrece Resume, Restart y Exit; resultados incluyen estadísticas, récord, Play Again, Exit y siguiente jornada/nivel/misión al ganar.
- Gestión con paneles HTML desplazables; movimiento con coordenadas Canvas de 360 × 480 y mundo independiente de la resolución. Redimensionar no reinicia la partida. En ventanas de escritorio excepcionalmente bajas se compacta el interior, conservando el tamaño externo; ampliar la ventana mejora la lectura.
- Un único RAF por sesión. HUD como máximo a 10 Hz, modelos de gestión a 4 Hz y vuelo subintegrado a 120 Hz. Objetos, historial de métricas y sonidos simultáneos acotados. Sin bibliotecas ni dependencias nuevas.
- Pérdida de foco/visibilidad pausa y exige reanudación manual. Cerrar detiene entrada, animaciones y sonidos; abandonar la ruta aborta listeners y cierra el audio. Los retornos por historial se inicializan de nuevo.
- Pointer Events, cancelación y captura de punteros, multitouch, botones de al menos 44 px. Teclado no bloquea los controles nativos de gestión. El juego activo impide desplazar la página; sus paneles sí permiten scroll interno.
- Claves independientes `<slug>:best:v1` y `<slug>:sound:v1`. Si falla localStorage se puede jugar sin persistencia. Audio sintetizado únicamente tras interacción; comienza apagado. Movimiento reducido elimina efectos decorativos, no la simulación necesaria para jugar.

## Blackout Texas

Ruta: `/juegos/blackout-texas/`. Jornada inicial de 180 segundos.

Seleccionar plantas/distritos con clic o toque; Start Gas, ajustes de ±10 MW y deslizador de asignación. Charge, Hold y Discharge son excluyentes. Auto Balance respeta demanda, capacidades y prioridad del Hospital, pero no arranca gas ni repara. Seleccionar una falla y Dispatch Crew envía la única cuadrilla: siete segundos de trabajo y doce de descanso.

Supuesto explícito de tiempo: **un segundo real representa un minuto de red**. Generación, demanda y transmisión están en MW; la batería está en MWh. Se integra `MW × segundos de red / 3600`, con eficiencia del 92 %, capacidad y potencia máximas. Solo se carga con excedente y solo se descarga para cubrir déficit; el resto se recorta sin derrota instantánea.

Gas con ocho segundos de arranque y rampa de 5 MW/s; solar con curva visible y eólica suave. Heat Wave, Wind Drop, Generator Fault, Line Overload y Evening Peak tienen aviso previo. Una línea sobreasignada durante ocho segundos se desconecta; subrayados discontinuos, símbolos y texto distinguen sobrecarga y corte. La estabilidad tiene siete segundos de emergencia al llegar a cero. Hospital y continuidad pesan más. Siguientes jornadas aumentan demanda y recursos, combinando eventos desde la segunda/tercera.

Es una red ficticia arcade, no un modelo del mercado eléctrico ni una herramienta de operación real.

## Deploy or Die

Ruta: `/juegos/deploy-or-die/`. Turno inicial de 195 segundos.

Clic o toque para seleccionar servidores/base de datos; pestañas Platform y Release. Scale Up arranca un servidor en seis segundos; Scale Down conserva al menos uno. Restart limpia fugas de memoria en tres segundos, pero no repara hardware. Repair tarda seis segundos o nueve mediante ayuda gratuita si falta presupuesto. Optimize Database mejora temporalmente el límite de la base de datos: añadir servidores no lo elimina.

Solicitudes por segundo, capacidad efectiva mínima entre aplicaciones saludables y base de datos, cola FIFO de 450 solicitudes con caducidad a cinco segundos. Métricas de errores/latencia sobre veinte segundos recientes. Ingresos por solicitudes atendidas, gastos operativos y ayudas limitadas permiten recuperarse con pocos fondos. Error Budget tiene siete segundos de emergencia.

Las características de doce versiones se generan al inicio mediante semilla y no cambian después: estable, pesada, con errores o mejora de rendimiento. Run Tests tarda tres segundos; Deploy Canary envía el 10 % y exige seis segundos de observación antes de Promote. Promoción tarda cuatro segundos y se valida después; Rollback restaura la última estable en tres segundos. Las acciones tienen costes distintos visibles. Un rollback oportuno es una respuesta válida.

Traffic Spike, Memory Leak, Server Down, Database Slowdown y Buggy Release muestran componente, síntomas e intervención. Turnos posteriores combinan incidentes y aumentan tráfico moderadamente.

## Packet Runner

Ruta: `/juegos/packet-runner/`. WASD/flechas o cruceta táctil: toque para un enlace, mantener para continuar; se guarda el siguiente giro. Soltar detiene al terminar el salto actual. Sin movimiento diagonal ni enlaces inventados.

Laberintos reproducibles por semilla, con bucles y tamaños progresivos de hasta 99 nodos. BFS verifica destinos alcanzables; TTL deriva de una ruta física viable, sin depender de usar portales, con margen para congestión y reacción. Emparejar el ID del destino; otro destino solo avisa. Tres fallos terminan la partida. TTL se detiene al pausar.

Congestion ralentiza, Firewall Patrol causa daño con invulnerabilidad breve, Checksum repara, TTL Boost añade tiempo. Desde nivel dos hay portales con enfriamiento y cierres de nodos anunciados, revalidados antes de activarse para conservar rutas y no cerrar sobre el jugador. Priority Packet es opcional para la próxima entrega: menos tiempo, más puntos. Tres entregas iniciales completan el nivel y habilitan Next Network.

## Orbital Rescue

Ruta: `/juegos/orbital-rescue/`. A/D o flechas laterales giran; W/↑ impulsa, S/↓ frena. Botones táctiles separados permiten giro y empuje simultáneos. Launch sale de la estación; Next Beacon cambia el objetivo. Rescate y acoplamiento son automáticos al cumplir las condiciones.

Posición, velocidad, aceleración y velocidad angular independientes; inercia al soltar, frenado asistido con consumo y gravedad inversa al cuadrado acotada. Planeta sólido, daño por velocidad relativa con límite de 25, invulnerabilidad y bordes del mundo comunicados. Cámara suave, indicadores fuera de pantalla, rumbo relativo, distancias y minimapa.

Rescate: radio de 23 m, velocidad relativa máxima de 9 m/s y mantener 1,4 s. Cabina para dos. Acoplamiento: radio de 34 m, velocidad máxima de 11 m/s y orientación dentro de ±0,8 rad; guía y progreso de 1,2 s, seguido de captura asistida. Entrega pasajeros, repara y recarga antes de volver a salir. Combustible principal más veinte unidades de reserva de emergencia, identificadas claramente.

Primera misión de entrenamiento: dos astronautas cercanos, sin oxígeno limitado, límite de tiempo ni escombros. Las siguientes introducen oxígeno individual, ventana de cinco minutos, más balizas, gravedad y escombros. Las balizas perdidas permanecen señaladas. Victoria al entregar el objetivo; derrota por destrucción, plazo posterior o insuficientes astronautas supervivientes.

## Validación

- `npm run verify`: tipos, pruebas de reglas/contenido, build, enlaces, metadatos, aislamiento de motores y presupuestos de recursos.
- `scripts/feature11-model.test.mjs`: batería y balance, hospital/capacidades, arranque/averías/cuadrilla, jornadas recuperables; cola/capacidad, versiones inmutables, canary/promoción/rollback y recuperación con presupuesto cero; conectividad, TTL, portales, cierres y daños; recursos/física a 30/120 Hz, rescate, acoplamiento y las ocho misiones completas usando solo entradas de vuelo.
- `tests/feature11.spec.ts`: apertura, guía, pausa, reinicio, salida/regreso, inglés en páginas RTL, accesibilidad Axe, almacenamiento bloqueado, tamaños, teclado, multitouch/cancelación y recorridos jugables desde la interfaz.
- Los tests existentes conservan cobertura de Cadete Roa, Galactian, Rail Crane y Torque Trail.

Resultado local: 66 pruebas de reglas/contenido y 56 casos de navegador de los cuatro conjuntos del arcade. Se corrigió una expectativa antigua de Torque Trail: la prueba separa el frenado antes de una rampa del recorrido completo desde una partida nueva; las físicas no se modificaron. Verificación de tipos sin errores, advertencias ni sugerencias; build, enlaces, aislamiento y presupuestos correctos.

Las pruebas de navegador emulan pantallas y tacto en Chromium; no sustituyen la revisión en dispositivos físicos ni en Safari/Firefox antes de publicar. Las capturas/servidores de comprobación son locales y no forman parte del repositorio. No se han añadido despliegues ni servicios externos.

## Corrección responsive de Orbital Rescue antes de publicar

El fallo de CI se reprodujo forzando objetivo y aviso a dos líneas: en 320 × 568, el HUD terminaba en y=220,98 y el campo comenzaba en y=196,80, un solapamiento real de unos 24 px. Un desplazamiento fijo en rem no reservaba la altura variable del texto entre fuentes y sistemas.

Orbital Rescue usa ahora una cuadrícula interna: HUD de altura intrínseca, campo flexible y controles en su propia fila. Conserva el diálogo externo 9:16 en escritorio y la ventana móvil. En móvil horizontal mantiene tres columnas; la ventana baja de escritorio usa una composición vertical compacta. Se explicitan las alturas de línea y se elimina el desplazamiento fijo del campo; no se modifican físicas, reglas ni el resto de juegos.

Las pruebas toman las tres cajas en una misma lectura de layout y esperan su estabilización tras un cambio de tamaño. Se conservan las mismas tolerancias de separación, el campo mínimo de 40 px y los controles mínimos de 44 px. Una nueva regresión comprueba textos de dos líneas, fuentes Arial/Georgia y tamaños 320 × 568, 768 × 1024 y 844 × 390 en escritorio y táctil. Fallaba antes del ajuste y pasa después. No se omiten pruebas ni se añaden reintentos globales.
