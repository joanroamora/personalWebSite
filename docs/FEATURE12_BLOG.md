# Feature12 — blog editorial e ilustraciones

Rama de trabajo: `Feature12-blog-editorial`, creada desde `dev` después de Feature11. El propietario autorizó el commit, la conservación de la rama remota y la integración y push a `dev` el 18 de octubre de 2026. No incluye publicación, despliegue ni cambios en `main`.

Ampliación posterior autorizada: ilustraciones del portafolio inspiradas en los planos de Da Vinci y destacado aleatorio de Inicio cada tres segundos. Detalles, archivos y prompts en [FEATURE12_PORTAFOLIO.md](FEATURE12_PORTAFOLIO.md).

## Contenido

Dos ensayos originales desarrollados a partir de las propuestas del propietario:

- `src/content/blog/anatomia-tragamonedas.md`: «Anatomía de una tragamonedas de bolsillo», con el subtítulo «Cómo la ingeniería de datos y la IA compiten por tu atención».
- `src/content/blog/el-espejo-programado.md`: «El espejo programado», con el subtítulo «Visión por computadora, mallas 3D y el negocio de la inseguridad».

Se usa el 18 de octubre de 2026 como fecha editorial de esta incorporación. `status: published` significa que son contenido real visible del blog; no habilita Pages ni publica la web. `isDemo` y `noindex` permanecen activos. Los tres textos de muestra conservan sus slugs y avisos, separados en «Archivo de pruebas»; su navegación anterior/siguiente no se mezcla con la de los ensayos. El borrador sigue excluido.

## Criterio editorial y fuentes

Se conserva el tono crítico y divulgativo, separando opinión, analogía, documentación e investigación. Cada afirmación concreta enlaza su fuente primaria junto al párrafo correspondiente. Los enlaces se consultaron el 18 de octubre de 2026.

- Dopamina: se explica la distinción entre motivación y placer sin afirmar que un feed programe una sustancia o reduzca de forma general receptores D2. No se atribuye un apagado metabólico frontal a todo uso de redes.
- Telemetría: capacidad de instrumentación no equivale a práctica universal, dato biométrico, lectura de emociones ni diagnóstico. El JSON es ficticio y didáctico; no se añade telemetría al sitio.
- Recomendación: el artículo de Google de 2016 es una arquitectura histórica concreta. LinUCB es un ejemplo publicado, no una afirmación sobre todos los sistemas actuales. Las notificaciones agrupadas también pueden reducir interrupciones.
- Desinformación: la cifra de seis veces se limita al tiempo necesario para alcanzar a 1.500 personas en el conjunto de rumores de Twitter estudiado entre 2006 y 2017; no se presenta como ley universal ni como prueba de control electoral.
- Filtros: malla estimada y transformación de imagen no son cirugía real ni escaneo clínico. Personalización publicitaria no demuestra detección exacta de tristeza. La «dismorfia de Snapchat» se contextualiza como una expresión de discusión clínica, no como un diagnóstico independiente.
- Salud mental: no se atribuye toda depresión o preocupación corporal a una causa única ni se cuantifica una epidemia sin evidencia. Se conserva una nota de alcance en cada ensayo.

Fuentes enlazadas en el contenido: Berridge y Robinson, Google Research, TensorFlow Recommenders, Li y colaboradores, LinkedIn Engineering, Feast, Vosoughi/Roy/Aral, MediaPipe, Meta Engineering, Google Ads, Kleemans y colaboradoras, Rajanala/Maymone/Vashi y el aviso de salud juvenil del Surgeon General.

## Interfaz y mantenimiento

Portada editorial con ilustraciones, tipografía y espaciado adaptables; sin scroll infinito ni dependencias nuevas. Lectura de ancho limitado, índice de apartados plegable nativo y lateral en escritorio, resumen «En una línea», citas y fuentes con enlaces reales, y navegación entre ensayos. Todo funciona sin JavaScript del blog.

La colección añade los campos opcionales `subtitle`, `series`, `takeaway` y `cover` (`src`, `alt`, `caption`). Se validan durante el build. `PostCover.astro` reutiliza la optimización de Astro: WebP y JPEG, anchos de 400 a 1536 px, dimensiones reservadas, carga prioritaria solo cuando corresponde. Las entradas incluyen imagen Open Graph JPEG de 1280 px. Las fuentes PNG no se sirven directamente.

Títulos, subtítulos, resúmenes y controles se localizan en los seis idiomas existentes. El cuerpo extenso, los pies y el resumen editorial permanecen explícitamente en español; no se presentan como traducciones completas.

## Ilustraciones originales

Modo utilizado: herramienta integrada de generación de imágenes, no CLI/API de pago configurada por el proyecto. Son interpretaciones contemporáneas inspiradas en el lenguaje litográfico de Henri de Toulouse-Lautrec, no reproducciones, fotografías del propietario ni obras atribuidas al pintor. Los pies identifican el uso de IA.

Archivos fuente guardados en el repositorio:

- `src/assets/blog/tragamonedas-de-bolsillo.png` — 1536 × 1024.
- `src/assets/blog/el-espejo-programado.png` — 1536 × 1024.

### Prompt de la primera portada

```text
Use case: illustration-story. Asset type: original landscape editorial cover illustration for a thoughtful Spanish-language technology essay, approximately 3:2 composition. Primary request: an original contemporary scene inspired by Henri de Toulouse-Lautrec's lithographic posters: expressive ink contours, flattened asymmetrical forms, cropped silhouettes, warm uncoated paper grain and restrained color blocks. An adult sitting at a tiny late-night cafe table, looking at a smartphone whose luminous feed subtly resembles the reels of a small slot machine; an endlessly curling paper ribbon of abstract image tiles follows the movement of a thumb. Suggest the economics of attention and repetitive searching, not a literal brain mechanism. Palette: parchment ivory, charcoal-black, muted ochre, restrained vermilion and dark petrol green; a quiet, elegant illustration that works beside a minimal near-black website. Composition: bold readable central silhouette, generous breathing space, details large enough to survive mobile cropping, no important subject at the extreme edges. The expression is absorbed and reflective, not grotesque. No text, letters, numbers, logos, watermark or artist signature. Not a reproduction of an existing Lautrec composition; no copyrighted app interfaces, no medical imagery. Opaque background.
```

### Prompt de la segunda portada

```text
Use case: illustration-story. Asset type: original landscape editorial cover illustration for a Spanish-language essay about beauty filters and computer vision, approximately 3:2 composition. Primary request: an original contemporary scene inspired by Henri de Toulouse-Lautrec's lithographic posters: expressive hand-drawn dark contours, flattened elegant silhouettes, off-center framing, tactile uncoated paper, limited color blocks. An adult woman with an ordinary, dignified, individual face looks into a handheld smartphone that acts as a small theatrical mirror. A faint geometric facial mesh is visible only inside the phone reflection; the reflection becomes a smooth theatrical mask, clearly an artificial overlay, not a claim about what beauty should be. A restrained ribbon of blank shopping-label shapes near the mirror hints at advertising and commerce. The person outside the screen remains nuanced, human and unaltered. Palette coordinated with a companion attention-economy cover: parchment ivory, charcoal-black, ochre, muted vermilion and deep petrol green. Sophisticated, contemplative, critical without horror or body shaming. Composition: clear subject, large graphic shapes, generous negative space, essential face and phone retained in a mobile crop. No text, letters, numbers, brands, watermark or signature. Do not copy an existing Lautrec painting or poster. No before/after cosmetic advertisement and no clinical diagram. Opaque background.
```

## Validación

`npm run verify`: tipos, reglas de contenido, build, enlaces, metadatos, aislamiento y presupuestos. El build pasa de 289 a 301 páginas al añadir dos rutas en seis idiomas, manteniendo las demos antiguas.

Pruebas enfocadas: selección y separación de publicaciones/demos, estimación de lectura, existencia y dimensiones de las dos portadas, contratos del Markdown, traducciones de las fichas, imágenes adaptables y metadatos, índice/paginación sin JavaScript, accesibilidad, teclado, movimiento reducido, tamaños intermedios, móvil horizontal y texto ampliado. Las capturas y servidores de comprobación permanecen locales, excluidos de Git.

La suite completa alcanza 145 casos de navegador. Se amplía su límite total de cinco a diez minutos y el del job de CI de diez a quince, sin relajar los límites individuales de las pruebas. La regresión identificó una prueba de Orbital Rescue sensible al tiempo real que transcurría entre las aserciones: se congela su reloj entre maniobras; no se cambian el juego ni sus físicas.

Resultados locales: `npm run verify` correcto, sin errores, advertencias ni sugerencias de tipos; 69 pruebas de reglas/contenido y 301 páginas. La suite general terminó en 6,4 minutos con 144 casos correctos y el fallo de sincronización de Orbital Rescue descrito arriba. Tras corregir la sincronización, ese caso pasó tres repeticiones consecutivas. La ejecución final enfocada del blog pasó sus 14 casos en 27,2 segundos: accesibilidad de los dos artículos, navegación sin JavaScript, tamaños, metadatos e idiomas, en escritorio y móvil.

Pendiente antes de publicación: revisión editorial del propietario, traducción completa de los cuerpos si se desea y revisión en dispositivos físicos/Safari/Firefox. No se cambia el servidor local del propietario ni su exclusión de Git.

Tras la ampliación del portafolio, la verificación final comprende 71 pruebas de reglas/contenido y la regresión completa de 155 casos de navegador, todos correctos. Incluye de nuevo ambos ensayos y los ocho juegos. Los resultados anteriores de esta sección corresponden al alcance inicial del blog; detalles finales en [FEATURE12_PORTAFOLIO.md](FEATURE12_PORTAFOLIO.md).
