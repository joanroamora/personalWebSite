# Blog: escribir y mantener el cuaderno

El blog usa la colección local de Astro declarada en `src/content.config.ts`. Cada entrada es un archivo Markdown en `src/content/blog/`; no requiere editar páginas, el menú ni componentes. El build genera el índice, las rutas de lectura, el índice de apartados, los enlaces entre entradas y la última entrada de Inicio.

Feature12 incorpora las dos primeras entradas reales, a partir de las propuestas del propietario, con ilustraciones originales y fuentes enlazadas. La portada usa `EditorialBlog.astro` cuando existen publicaciones y conserva el formato anterior como alternativa para un blog exclusivamente de muestra. Las demos quedan en un archivo nativo plegable; conservan sus rutas. Alcance, fuentes y prompts en [FEATURE12_BLOG.md](FEATURE12_BLOG.md).

## Crear una entrada

1. Copiar [la plantilla](plantillas/entrada.md) a `src/content/blog/mi-entrada.md`.
2. Sustituir el título, el resumen, la fecha, el slug y el cuerpo por contenido propio aprobado. Mantener `status: draft` mientras se escribe.
3. Usar `##` y `###` en los apartados. El título principal viene de los metadatos. Las tablas, listas, citas y bloques de código admiten el Markdown habitual.
4. Para revisar en el sitio de muestra, cambiar temporalmente el estado a `demo`. Todas las demos se identifican en el índice, Inicio y la lectura. Cambiarlo a `published` solo cuando el texto esté listo para publicarse.
5. Ejecutar `npm run verify` y revisar el resultado en móvil y escritorio. Crear el commit y el PR a `dev` siguiendo las reglas de ramas del proyecto.
6. La integración en `dev` y la promoción a `main` requieren la decisión del propietario. La web solo se despliega desde `main` cuando la publicación está habilitada.

El archivo de plantilla vive fuera de la colección para que nunca genere una página por accidente. Los borradores tampoco se renderizan en el servidor de desarrollo; para verlos es necesario cambiar su estado.

## Metadatos

| Campo | Uso |
| --- | --- |
| `title` | Título visible, obligatorio y no vacío |
| `slug` | Enlace permanente único, con minúsculas sin tildes, números y guiones |
| `date` | Fecha editorial entre comillas, formato `'AAAA-MM-DD'`; se conserva en UTC |
| `summary` | Resumen obligatorio para índice, Inicio y metadatos |
| `status` | `draft`, `demo` o `published`; no tiene valor por defecto |
| `tags` | Lista opcional de temas; si se omite, se usa una lista vacía |
| `subtitle` | Subtítulo editorial opcional, separado del título |
| `series` | Serie o agrupación editorial opcional |
| `takeaway` | Resumen opcional «En una línea», mostrado antes del cuerpo |
| `cover` | Objeto opcional con `src`, `alt` y `caption`; `src` referencia una imagen local validada por Astro |

Ejemplo de enlace: un `slug: mi-entrada` genera `/personalWebSite/blog/mi-entrada/`. El enlace depende del slug explícito, no del título ni del nombre del archivo. Conservarlo al editar una entrada ya compartida. Un slug duplicado hace fallar el build, incluso si una de las fichas está en borrador.

Las publicaciones tienen prioridad sobre las demos, incluso si una demo tiene fecha posterior. Dentro de cada grupo se ordena de más reciente a más antigua y, en fechas iguales, por slug. La navegación anterior/siguiente solo enlaza entradas del mismo estado. La estimación de lectura es orientativa, se calcula sobre el cuerpo a 200 palabras por minuto y no incluye bloques de código. No se carga JavaScript del blog ni del motor de juegos en las páginas de lectura.

Las portadas fuente viven en `src/assets/blog/`. Por ejemplo, `cover.src: ../../assets/blog/mi-portada.png` dentro de un Markdown de la colección. `PostCover.astro` genera WebP/JPEG en varios tamaños, con `sizes`, dimensiones y carga diferida/prioritaria. El texto alternativo y el pie son obligatorios si se declara una portada. Las imágenes generadas se identifican como tales; conservar su procedencia y prompts en la documentación de la Feature. Los cuerpos y pies permanecen en español mientras no existan traducciones extensas aprobadas.

## Estados y contenido de muestra

| Estado | Con `siteConfig.isDemo: true` | Con `siteConfig.isDemo: false` |
| --- | --- | --- |
| `draft` | Excluido | Excluido |
| `demo` | Visible e identificado como muestra | Excluido |
| `published` | Visible | Visible |

La misma selección alimenta el índice, Inicio, las rutas y los enlaces entre entradas. Al desactivar el modo de muestra, ninguna demo genera HTML. Si no quedan entradas, el blog y la portada muestran su estado vacío, sin enlaces rotos.

`draft` controla la generación del sitio, no la privacidad del repositorio: un archivo versionado sigue formando parte del historial Git. No guardar información privada en un borrador del repositorio.

Feature5 incorpora tres textos ficticios con fechas de ejemplo: «Lo pequeño también tiene gravedad», «Un juego empieza antes de la primera partida» y «Dejar una idea por escrito». Un cuarto archivo prueba el estado `draft`. Retirarlos o sustituirlos al preparar la versión pública; no cambiar su estado a `published` como si fueran textos del propietario.

## Organización y comprobaciones

- `src/data/blog.ts`: consulta central de entradas.
- `src/utils/blog.ts`: visibilidad, orden, unicidad de slugs y formato de fechas.
- `src/components/blog/`: portada editorial y metadatos de lectura.
- `src/pages/blog/`: índice y rutas estáticas de entradas.
- `src/styles/blog.css`: estilos de lectura que solo se cargan en las entradas.
- `scripts/blog.test.mjs`: visibilidad, borradores, duplicados, orden y fechas.
- `tests/blog.spec.ts`: navegación, lectura sin JavaScript, apartados, borradores, metadatos, movimiento reducido y tamaños de pantalla.

La implementación utiliza las [colecciones de contenido de Astro](https://docs.astro.build/en/guides/content-collections/), con carga y renderizado durante la construcción estática.
