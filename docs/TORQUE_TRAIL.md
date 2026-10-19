# Torque Trail — ampliación de Feature10

Cuarto juego jugable del sitio. Juego original de moto lateral, con una paleta y formas de 8 bits como homenaje al género de motocross de NES. El nombre es provisional; no utiliza gráficos, música, marcas ni circuitos de Excitebike.

## Jugar

- W / arriba: acelerar. S / abajo: frenar. Soltar ambos: rodar por inercia.
- A / izquierda: inclinar hacia atrás. D / derecha: inclinar hacia delante. También funciona en el aire.
- E / Recover: volver a la última bandera después de una caída. Tres intentos por recorrido.
- P / Escape: pausa. En móvil, Gas, Brake y los botones de inclinación admiten varias pulsaciones simultáneas.

La meta completa el recorrido, guarda el récord y permite jugar Next Trail. Los recorridos posteriores tienen más obstáculos y mayores desniveles; la dificultad geométrica se limita a cinco escalones. Restart y Play Again comienzan de nuevo en el primer recorrido. La puntuación combina distancia máxima, aterrizajes limpios, tiempo y los intentos conservados.

## Física y obstáculos

`model.ts` usa metros, segundos y radianes. El chasis es un cuerpo rígido con masa e inercia angular, gravedad y dos contactos con suspensión de muelle y amortiguador. El motor empuja la rueda trasera; aceleración y frenada están limitadas por el agarre disponible, dependiente de la carga normal de cada rueda. La resistencia reduce la velocidad al soltar el acelerador. Sin contacto, el motor no añade empuje horizontal. Las fuerzas de los contactos y el equilibrio del piloto afectan al cabeceo.

La integración usa pasos de hasta 1/120 s. Las reglas son independientes del tamaño visual y no dependen del número de fotogramas. El control de inclinación representa el cambio de peso del piloto mediante un par acotado; es una aproximación de juego, no una simulación completa de neumáticos, transmisión, articulaciones o del cuerpo humano. No existe un salto artificial: la velocidad y las rampas producen el despegue.

Los obstáculos se diseñan en secuencia: colinas suaves, mesetas, baches y huecos de 2,2 m con rampa de salida y recepción más baja. Se separan por 23 m de pista libre. El primer hueco llega después de varios obstáculos de aprendizaje. Hay una vista compacta del recorrido y avisos anticipados de rampas o huecos. Los puntos de control están en aproximaciones planas y recuperan la posición sin restaurar intentos ni duplicar puntos.

## Integración

`src/games/torque-trail/` separa reglas, dibujo Canvas, adaptación de controles y componente Astro. Usa la ventana y el ciclo de vida de Galactian y Rail Crane: 9:16 en escritorio, ventana completa en móvil, pausa al perder visibilidad, cierre accesible, récord y preferencia de sonido locales. Toda la interfaz del juego está en inglés; su ficha editorial se localiza en los seis idiomas. Ruta: `/juegos/torque-trail/` bajo la base de Pages.

El renderer dibuja recursos originales con rectángulos y una paleta reducida. Terreno, efectos y objetos están acotados. No requiere dependencias nuevas. El control de calidad protege la carga aislada del motor y aplica el presupuesto específico de juegos.

## Comprobaciones

`scripts/torque-model.test.mjs` comprueba reposo y suspensión, aceleración/freno/inercia, ausencia de propulsión en el aire, equilibrio, geometría y checkpoints, llegada a meta, recuperación sin acumular puntos, límite de intentos e independencia de fotogramas. `tests/torque-trail.spec.ts` comprueba conducción con teclado, meta, siguiente recorrido, récord, caídas, recuperación y multitouch con cambios de tamaño. Las pruebas comunes de arcade incluyen su presentación, ayuda, pausa, reinicio, cierre, historial, accesibilidad, almacenamiento bloqueado y movimiento reducido.

Resultado: siete pruebas específicas del modelo aprobadas; `verify` completo con 42 pruebas y 265 páginas. Las 24 pruebas de navegador del arcade y la moto pasan, al igual que otras 32 de Cadete Roa, perfil e idiomas. Revisión visual en móvil, escritorio y horizontal. La validación móvil es emulada; queda la revisión en hardware físico.
