# Feature12 — cuaderno de inventos del portafolio

Ampliación solicitada durante `Feature12-blog-editorial`. Conserva las dos entradas y la interfaz del blog descritas en [FEATURE12_BLOG.md](FEATURE12_BLOG.md). Tras la revisión local, el propietario autorizó el commit y la integración y push a `dev` el 18 de octubre de 2026. Se conserva la rama de Feature en remoto; no se publica ni despliega el sitio ni se modifica `main`.

## Dirección artística y archivos

Una ilustración original por cada uno de los 27 proyectos aprobados: metáforas mecánicas de su propósito, tinta sepia, rayado fino, cortes y vistas explotadas sobre papel envejecido. Inspiración en los cuadernos de invenciones de Leonardo da Vinci, sin copiar una obra ni atribuirle estas imágenes. Son estudios conceptuales generados con IA, no capturas, planos verificados ni afirmaciones de una arquitectura implementada.

Se utilizó la herramienta integrada `image_gen`, una llamada independiente por proyecto; no el CLI ni una API configurada con credenciales del repositorio. Los archivos seleccionados están guardados en `src/assets/projects/<id>.webp`. La conversión mecánica a WebP mantiene encuadre y contenido, con calidad 86, sin dependencias nuevas. Los PNG originales permanecen en la carpeta de salida de la herramienta, fuera del repositorio. Las fuentes optimizadas sí forman parte del proyecto.

El conjunto exacto de prompts se registra en [portfolio-artwork.json](portfolio-artwork.json): `basePrompt + subject` reproduce el prompt completo de cada imagen. Cada registro incluye ID, descripción, nombre de la salida original y ruta final. La misma ilustración aparece en tarjeta, diálogo, ruta individual e Inicio; no se duplican archivos por contexto o idioma.

`ProjectArtwork.astro` genera imágenes WebP con alternativa JPEG en 360, 600, 900 y 1200 píxeles. Reserva proporción 3:2, usa `sizes`, carga diferida y texto alternativo localizado. El detalle identifica expresamente «Ilustración conceptual · Generada con IA».

## Destacado de Inicio

Se sustituye el dibujo orbital del antiguo destacado por la ilustración del proyecto. Se conserva pdfRoar como primera ficha estática y su descripción personal aprobada; después se recorre el catálogo completo mediante una bolsa aleatoria, sin repetir hasta haber mostrado todos los proyectos del ciclo.

«Todos los proyectos» se interpreta como las 27 fichas ya aprobadas en `src/data/projects.ts`, no como acceso automático a todos los repositorios de GitHub. No se consultan servicios externos ni se modifican permisos de repositorios.

Cada cambio sustituye conjuntamente imagen, título, resumen, tecnologías y enlace permanente. Intervalo: tres segundos mientras el carrusel está visible y no hay interacción. Transición decorativa breve, sin animación bajo movimiento reducido.

Controles: siguiente proyecto y activar/pausar rotación; teclado y toque, objetivos de al menos 44 px. Se detiene con foco dentro, cursor de ratón encima, pestaña oculta o componente fuera de pantalla. Tras una interrupción deja tres segundos completos antes del siguiente cambio. Movimiento reducido inicia sin reproducción automática, pero permite navegación manual y activar la rotación explícitamente. Las actualizaciones automáticas no se anuncian cada tres segundos al lector de pantalla; solo la navegación manual actualiza un estado accesible.

Las fichas alternativas son plantillas inertes: sus imágenes no se descargan hasta mostrarse. No hay framework de carrusel ni nueva dependencia. La navegación sin JavaScript mantiene la ilustración y el enlace iniciales, sin botones inactivos. Se limpian temporizador y observador al abandonar la página y se contempla la restauración de la caché de navegación.

## Validación

Pruebas de reglas: cobertura completa de la bolsa aleatoria, ausencia de duplicados y repetición inmediata, catálogo vacío/unitario, correspondencia de los 27 archivos WebP y sus prompts, y límite de peso por fuente.

Pruebas de navegador: tarjetas y detalle, navegación sin JavaScript, intervalo y cobertura de 27 proyectos, coherencia de imagen/enlace, descarga diferida, pausa manual y por foco/visibilidad, movimiento reducido, teclado, seis idiomas de controles, RTL, tamaños de 320 a 1440 px y accesibilidad automatizada.

Resultados finales: `npm run verify` correcto; 153 archivos comprobados sin errores, advertencias ni sugerencias, 71 pruebas de reglas/contenido y 301 páginas generadas. Enlaces, metadatos, aislamiento de juegos y presupuestos correctos. Inicio utiliza aproximadamente 2,1 KB de JavaScript gzip. Las 27 fuentes WebP son distintas y suman 11.398.690 bytes; la mayor pesa 540.322 bytes. Astro sirve versiones adaptadas, no esas fuentes a tamaño completo.

La regresión completa final de Chromium pasó **155/155 casos en 7,4 minutos**, incluyendo los ocho juegos y ambos ensayos. La primera pasada detectó una discrepancia entre el nombre accesible y el texto visible del botón de pausa; se corrigió usando su texto visible como nombre, sin desactivar la regla de accesibilidad. Se revisaron visualmente capturas de móvil, escritorio y RTL.

En Windows, la primera ejecución enfocada pasó sus 24 casos pero el cierre de la vista previa administrada por el fixture produjo un aviso de espera. Para la comprobación completa final se reutilizó una vista previa temporal propia del build; la ejecución terminó con código 0 y se cerró ese proceso después. No se cambió la configuración del servidor del propietario.

No se modifica el servidor temporal del propietario ni se añaden sus archivos al repositorio. La revisión en Safari/Firefox y dispositivos físicos sigue pendiente antes de publicar.
