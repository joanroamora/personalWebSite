# Revisión de calidad del esqueleto — Feature7

La revisión conserva las 42 rutas y el diseño del sitio. Por autorización del propietario, esta misma rama incorpora la información de [PERFIL_PUBLICO.md](PERFIL_PUBLICO.md) a Inicio, Sobre mí, Trayectoria y Contacto. El blog y los juegos dummy conservan sus avisos; la fotografía sigue pendiente. La integración se documenta en [CONTENIDO_PERSONAL.md](CONTENIDO_PERSONAL.md).

## Resultado local — 18 de octubre de 2026

- `npm run verify`: correcto, con 17 pruebas unitarias, 42 páginas generadas y sin errores de tipos, enlaces o calidad estática tras incorporar el perfil.
- Suite completa: 74 pruebas de navegador correctas, incluidas accesibilidad, calidad, correspondencia con el perfil, navegación, proyectos, blog y juegos.
- Capturas revisadas en móvil, escritorio y con texto ampliado; la vista temporal local responde correctamente.
- JavaScript equivalente gzip: 416 B en las páginas editoriales habituales, 1.631 B en el catálogo de proyectos y 7.995 B en la ruta de Cadete Roa. El catálogo tiene el HTML mayor, 21.504 B gzip; todas las páginas quedan dentro de los presupuestos indicados más abajo.
- La validación remota de Feature7 se realizará mediante el workflow existente cuando se suba la rama.

## Problemas encontrados y corregidos

- **Nombres accesibles:** el enlace de marca omitía «Versión de muestra» en su nombre accesible y los enlaces de secciones de Inicio omitían sus descripciones visibles. Se retiraron las etiquetas que sobrescribían esos textos, para que los nombres accesibles coincidan con lo que se ve y puedan utilizarse con control por voz.
- **Texto ampliado:** la portada podía ensanchar el documento al aumentar el texto al 200 %. Se permite partir palabras cuando el espacio lo exige, se ajusta la columna flexible de la cabecera y se permite envolver los nombres largos de tecnologías. No se oculta el desbordamiento para tapar contenido.
- **Pantalla completa:** cerrar Cadete Roa antes de que terminara una solicitud de pantalla completa podía dejar el navegador en ese estado después de cerrar el diálogo. El cierre espera la solicitud pendiente, sale de la pantalla completa que pertenece al juego y devuelve el foco al botón de apertura. La prueba de regresión retrasa la respuesta de la API para reproducir el fallo de forma controlada.

## Comprobaciones reproducibles

```sh
npm ci
npm run verify
npm run test:e2e:install
npm run test:e2e
```

`npm run verify` incluye tipos, pruebas unitarias, build, enlaces y `check:quality`. Este último analiza todo el HTML generado, no solo las páginas de muestra de las pruebas de navegador:

- Un título no vacío y diferente por página, descripción, idioma, viewport y metadatos Open Graph.
- URL canónica y `og:url` coherentes con la base de Pages; las páginas de error no anuncian una canónica válida.
- Un único `main` y `h1`, ausencia de IDs duplicados y `alt`, ancho y alto explícitos en las imágenes.
- `noindex` mientras el sitio sea de muestra, y siempre en la página 404.
- Presupuestos de tamaño de HTML, JavaScript y CSS, y aislamiento del módulo de Cadete Roa fuera de su ruta.

La auditoría de tamaño recorre también los imports JavaScript locales. El HTML de las plantillas inertes se revisa en su estado abierto mediante las pruebas del diálogo. Los resultados de tamaño son equivalentes calculados con gzip en local; no representan una medición de transferencia o caché de GitHub Pages.

| Recurso por página | Presupuesto gzip |
| --- | --- |
| HTML | 32 KiB |
| JavaScript fuera del juego | 8 KiB |
| JavaScript en Cadete Roa | 24 KiB |
| CSS | 12 KiB |

Los presupuestos tienen margen respecto al build revisado y buscan detectar regresiones; no se presentan como una puntuación de rendimiento. El JavaScript inline se comprime por separado para estimar su tamaño, aunque forma parte de la transferencia del HTML.

## Navegador, accesibilidad y estabilidad

`tests/accessibility.spec.ts` usa axe como dependencia exclusivamente de desarrollo. Revisa las siete secciones, un proyecto académico, una ficha dummy, una entrada, la ficha de Cadete Roa y la página 404, en escritorio y móvil. También analiza el diálogo de proyecto, el menú móvil abierto y la presentación y pausa del juego. No se desactivan reglas ni se excluyen elementos para ocultar resultados.

Los resultados incluyen los hallazgos no concluyentes de axe y una representación del árbol accesible de las páginas. Se conservan como adjuntos de Playwright. La auditoría automática y el árbol accesible no equivalen a una prueba manual con un lector de pantalla real. Como explica la [guía de accesibilidad de Playwright](https://playwright.dev/docs/accessibility-testing), las comprobaciones automáticas solo cubren una parte de los problemas posibles.

`tests/quality.spec.ts` comprueba texto al 200 %, navegación del menú con ese tamaño, ausencia de peticiones de terceros, estabilidad de la carga en las principales páginas editoriales y la solicitud de pantalla completa pendiente. La estabilidad se observa con Layout Instability API y un límite de 0,1 en el escenario local; no es un dato de usuarios reales. Se espera a las fuentes y a los fotogramas de presentación, sin descargar las imágenes diferidas que siguen fuera de pantalla.

Las pruebas previas siguen cubriendo tamaños de 320 a 1440 px, horizontal, teclado, controles táctiles, foco, historial, movimiento reducido, navegación sin JavaScript, búsquedas y filtros, blog y ciclo de vida del juego con WebGL y alternativa Canvas. Chromium móvil es emulación; la revisión en dispositivos físicos y con lector de pantalla queda para la candidata a publicación.

## CI y contenido

Los workflows existentes ejecutan las nuevas comprobaciones mediante los mismos scripts y versiones del lockfile. Playwright usa dos workers y un límite global de cinco minutos para la suite ampliada. Los informes y capturas siguen excluidos de Git y se conservan como artefactos de CI durante siete días. La ejecución remota de esta entrega corresponde al push de la rama; no sustituye la decisión del propietario de integrar en `dev` o `main`.

La cabecera indica «Vista previa»; el blog y los juegos dummy conservan avisos específicos. Las páginas personales muestran la información real sin etiquetarla como ficticia. El Markdown fuente está fuera de `public/` y de la colección del blog y solo se usa para generar las páginas. El despliegue sigue limitado a `main` y a la variable de autorización existente.
