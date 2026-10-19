# Idiomas — Feature8

El selector es una burbuja en la cabecera, separada del menú móvil. Orden: English, Español, 中文（简体）, हिन्दी, العربية y Français. Los cuatro idiomas adicionales son mandarín escrito en chino simplificado, hindi, árabe y francés; no se presentan como una clasificación universal de importancia.

## Experiencia

- Se conserva el español y sus URLs existentes como fuente y versión predeterminada. Inglés aparece primero en el selector.
- Cada idioma conserva la sección, el proyecto o la entrada actual. Los slugs se mantienen estables; solo cambia el prefijo `en/`, `zh/`, `hi/`, `ar/` o `fr/`.
- Se recuerda la selección en `localStorage`. Al volver a Inicio sin prefijo se recupera la preferencia; una URL de detalle explícita no se sustituye. Si el almacenamiento falla, los enlaces siguen funcionando.
- El desplegable nativo funciona sin JavaScript. La mejora progresiva añade cierre con Escape, clic exterior, navegación por flechas, Home/End y exclusión mutua con el menú móvil. No usa roles de menú de aplicación para una lista de enlaces.
- La interfaz árabe es RTL. El juego, los repositorios y los textos originales tienen dirección explícita cuando corresponde. Los nombres de idiomas se muestran en su propia escritura, sin banderas.
- La 404 enlaza a Inicio en cada idioma: no inventa seis rutas de error inexistentes.

## Alcance editorial de esta entrega

Se traducen navegación, títulos de interfaz, metadatos, Inicio, perfil, biografía, ámbitos, herramientas, experiencia, formación, certificaciones, contacto, títulos y resúmenes de los 27 proyectos, fichas e instrucciones de juegos e índices y resúmenes del blog.

Las descripciones extensas y listas de puntos de proyectos conservan el **original en español**, dentro de un desplegable identificado, junto al resumen traducido. Los cuerpos de las entradas de muestra y su índice de apartados conservan el original identificado con `lang="es"`. No se presentan como traducciones completas. Los nombres oficiales de instituciones, tecnologías, repositorios y credenciales se conservan. Cadete Roa mantiene su interfaz de juego en inglés, como se aprobó en Feature6.

Las traducciones son una versión de trabajo para revisión editorial, no una certificación de traducción profesional. Antes de publicar, revisar especialmente las formulaciones académicas y los matices de los cinco idiomas derivados. No cambian nombres, fechas, canales de contacto ni resultados del perfil.

## Implementación y mantenimiento

Feature12 añade `src/i18n/blog.ts` para títulos, subtítulos, resúmenes, temas y controles de los dos ensayos reales. Se mantiene explícitamente en español el cuerpo extenso, sus fuentes, el resumen «En una línea» y los pies de las ilustraciones. Las rutas y los enlaces entre ensayos se localizan; los originales no se anuncian como traducciones completas. Ver [FEATURE12_BLOG.md](FEATURE12_BLOG.md).

`src/i18n/locales.ts` centraliza códigos, orden, escritura y enlaces. Los catálogos `ui.ts`, `profile.ts`, `projects.ts` y `editorial.ts` permanecen en compilación. `src/middleware.ts` localiza la respuesta HTML durante el prerenderizado: no hay servidor en producción, peticiones a traductores ni un diccionario completo descargado por el visitante.

Las rutas de `src/pages/[locale]/` reutilizan las plantillas actuales por sección. No se importan todas las páginas en un único router: eso cargaría CSS ajeno. El motor del juego sigue aislado en sus seis rutas de Cadete Roa. El build genera 247 documentos: 41 páginas de contenido por seis idiomas y una 404 española.

Se traducen nodos de texto y atributos de interfaz mediante catálogos de frases completas, no reemplazos parciales en HTML crudo. Se preservan scripts, estilos, código y bloques `data-no-translate`. Los enlaces de recursos no reciben prefijos de idioma. Los diálogos clonados desde `template` se localizan antes de enviarlos al navegador. Búsqueda, contador, fechas, canónicas y `hreflang` también se adaptan.

La fuente personal sigue siendo `docs/PERFIL_PUBLICO.md`. Las traducciones derivadas se asocian a una revisión verificada del perfil; un cambio de datos detiene el build hasta revisar los catálogos y actualizar su digest. Los títulos y resúmenes de proyectos tienen la misma protección. No actualizar los digests automáticamente sin comprobar las traducciones.

Para añadir textos de interfaz, incorporar las cinco versiones en `ui.ts` o `editorial.ts`. Para nuevos proyectos, añadir sus títulos y resúmenes a `projects.ts`. Para entradas propias futuras, traducir sus metadatos y decidir si se publicará el cuerpo original o una traducción revisada. Los cuerpos originales no deben etiquetarse como traducciones.

## Comprobaciones

`npm run verify` comprueba tipos, 21 pruebas unitarias, generación estática, enlaces y presupuestos. `tests/languages.spec.ts` cubre seis opciones, navegación de detalle, preferencia, Escape, flechas, funcionamiento sin JavaScript, seis versiones, metadatos, búsqueda traducida, originales identificados, accesibilidad automática, RTL y tamaños de 320 a 1440 px. Se prueba además texto al 200 % en móvil. La suite completa incluye las regresiones de juegos, blog, proyectos y perfil.

Las capturas y el navegador de pruebas permanecen fuera de Git. No se configura un puerto temporal en los archivos del proyecto. La integración en `dev` y la publicación siguen requiriendo autorización.

Resultado local del 18 de octubre de 2026: `npm run verify` correcto, 21 pruebas unitarias, 247 páginas generadas y **91 pruebas de navegador correctas**. Se revisaron capturas del selector en móvil y escritorio y de la versión árabe; las seis portadas respondieron con HTTP 200 en la vista temporal. La suite detectó y permitió corregir un desbordamiento del nuevo contenedor de lectura con bloques de código. La emulación y las pruebas automáticas no sustituyen la revisión editorial ni las pruebas en dispositivos físicos.

Referencias: [rutas estáticas e internacionalización de Astro](https://docs.astro.build/en/guides/internationalization/) y [rutas dinámicas de Astro](https://docs.astro.build/en/reference/routing-reference/).

Feature13 añade los controles y estados del reproductor en `src/i18n/music.ts`, localizados en los seis idiomas. Los títulos y nombres musicales aportados se conservan sin traducir. Ver [FEATURE13_MUSICA.md](FEATURE13_MUSICA.md).
