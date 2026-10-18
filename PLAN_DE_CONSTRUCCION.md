# Plan de construcción — web personal en GitHub Pages

> Hoja de ruta para avanzar etapa por etapa. Este documento planifica el trabajo; no ordena construir ni publicar el sitio de inmediato. Leerlo junto con `AGENTS.md`, que define el propósito, la navegación y el estilo visual.

## 1. Resultado buscado

Crear un sitio personal estático, gratuito y adaptable a móvil y escritorio. Mostrará quién soy y mi obra: proyectos de código, minijuegos y textos del blog. La identidad visual será minimalista, de inspiración alienígena/ovni y con transiciones suaves. El sitio no tendrá enfoque de búsqueda de empleo.

**Tecnología prevista:** Astro con salida estática, HTML/CSS y JavaScript para cada juego; GitHub Actions para comprobar y generar el sitio; GitHub Pages para publicarlo. Las entradas del blog serán archivos Markdown. No se necesita backend para la primera versión.

**Situación inicial observada:** el directorio `personalWebPage` contiene `AGENTS.md`; las etapas siguientes parten de un repositorio aún sin aplicación ni estructura del sitio. Confirmar el estado de Git antes de inicializar o crear ramas, por si cambia entretanto.

## 2. Estrategia de ramas para este sitio

Esta estrategia adapta la usada en el proyecto anterior. Los dos archivos compartidos (`00-environment-isolation.md` y `01-project-architecture-and-rag.md`) no especifican ramas; la referencia concreta aparece en los archivos complementarios `ragTest/AGENTS.md` y `ragTest/.agents/rules/02-devops-git-and-gemini-quotas.md`.

| Rama | Uso | Publicación |
| --- | --- | --- |
| `main` | Versión estable, visible al público | GitHub Pages despliega solo desde aquí |
| `dev` | Integración de cambios que ya pasaron sus comprobaciones | No publica |
| `Feature<N>-<descripcion>` | Trabajo acotado de una etapa o tarea, creado desde `dev` | No publica |

Flujo habitual: `dev` → `Feature<N>-<descripcion>` → pull request a `dev` → comprobaciones y revisión → integración en `dev` → pull request de `dev` a `main` → revisión final → publicación automática.

- Numerar las Features de manera consecutiva y usar nombres cortos, por ejemplo `Feature1-astro-base`, `Feature2-sistema-visual` y `Feature6-blog`.
- Cada commit comienza con `Feature<N>: `, por ejemplo `Feature6: add blog collection`. Si se desea incluir un tipo, usar `Feature6: feat(blog): add post index`. Una validación estricta de Conventional Commits debe adaptarse a este prefijo; no activar ambas reglas sin conciliarlas.
- Codex puede preparar ramas, commits, pushes y pull requests cuando se le pida trabajar en una etapa. **Las integraciones a `dev` y `main` requieren la decisión explícita del propietario.** Si trabaja solo, su acción de revisar y fusionar el PR en GitHub cuenta como esa decisión.
- Configurar protección de `main` y, si resulta práctico, de `dev`: exigir pull request y comprobaciones correctas; impedir borrado y `force push`. No exigir una aprobación de otra persona si el repositorio solo tiene un colaborador, porque bloquearía el flujo.
- Crear una comprobación de CI para PR hacia `dev` y `main`; ejecutar el despliegue únicamente al integrar en `main`.
- No crear ramas de entorno `test`, `stage` o `prod`: para un sitio personal estático serían complejidad innecesaria. `dev` sirve para integrar y `main` representa producción.

## 3. Etapas de construcción

Completar una etapa y comprobar su criterio de salida antes de pasar a la siguiente. Las ramas sugeridas son orientativas; si una etapa resulta grande, dividirla en varias Features pequeñas.

### Etapa 0 — Definir identidad y contenido publicable

**Objetivo:** tener materia prima real antes de diseñar páginas personales.

1. Crear por separado `PERFIL_PUBLICO.md` con nombre o seudónimo, presentación corta, biografía, intereses, hitos, proyectos elegidos y enlaces de contacto que se puedan publicar.
2. Elegir idioma inicial y decidir si la web usará nombre real, seudónimo o ambos.
3. Reunir una lista corta de repositorios destacados y una descripción propia para cada uno.
4. Identificar fotos futuras, sin depender de ellas para construir la primera versión.
5. Definir qué contenido aún no existe. Una sección puede quedar preparada sin rellenarla con hechos inventados.

**Salida:** texto y enlaces aprobados para publicación, o una lista explícita de pendientes. No subir datos privados al repositorio.

### Etapa 1 — Crear el repositorio y las reglas de trabajo

**Objetivo:** establecer una base Git limpia antes del código.

1. Comprobar si `personalWebPage` ya está inicializado con Git y si tiene remoto; no sobrescribir historia existente.
2. Crear o conectar el repositorio público de GitHub. Con GitHub Free, GitHub Pages para este caso requiere un repositorio público.
3. Mantener `AGENTS.md` en la raíz; añadir este plan, `README.md`, `.gitignore` y la licencia solo si se desea una licencia explícita para el código y el contenido.
4. Crear `main`, después `dev` a partir de `main`. Definir `main` como rama predeterminada y aplicar las reglas de protección adecuadas.
5. Documentar en `README.md` cómo arrancar el proyecto, añadir contenido y entender las ramas.

**Salida:** repositorio accesible, `main` y `dev` existentes y sin archivos personales sensibles.

### Etapa 2 — Levantar la base de Astro y la integración continua

**Rama sugerida:** `Feature1-astro-base`.

1. Crear el proyecto Astro en modo estático, con dependencias y versiones declaradas en el repositorio.
2. Preparar diseño compartido, metadatos básicos, página de inicio temporal y páginas de error necesarias.
3. Elegir la URL: `https://<usuario>.github.io/` si el repositorio se llama `<usuario>.github.io`, o `https://<usuario>.github.io/personalWebPage/` si se conserva ese nombre. Configurar `site` y `base` según la elección.
4. Crear CI para instalar dependencias, comprobar tipos o contenido cuando corresponda, ejecutar el build y detectar enlaces o rutas rotas con una comprobación apropiada.
5. Preparar el workflow de despliegue de Astro para GitHub Pages, activado solo desde `main`. En GitHub, configurar Pages con fuente **GitHub Actions**.
6. Abrir PR hacia `dev` y comprobar el build remoto antes de integrarlo.

**Salida:** el sitio se genera correctamente en CI y la ruta de publicación está configurada, aunque aún no se haya publicado la versión completa.

### Etapa 3 — Sistema visual y navegación

**Rama sugerida:** `Feature2-sistema-visual`.

1. Definir variables de color, tipografía, espaciado y componentes reutilizables según `AGENTS.md`.
2. Construir cabecera, menú, pie de página y estados activos para Inicio, Sobre mí, Proyectos, Juegos, Blog, Trayectoria y Contacto.
3. Implementar el menú móvil y comprobar teclado, foco visible, contraste y tamaños táctiles.
4. Añadir un motivo visual alienígena sutil que no interfiera con la lectura.
5. Incorporar transiciones discretas entre páginas; respetar `prefers-reduced-motion` y mantener navegación normal como alternativa.

**Salida:** todas las rutas base son navegables y se ven bien en móvil y escritorio, aunque parte del contenido siga pendiente.

### Etapa 4 — Página principal y páginas personales

**Rama sugerida:** `Feature3-paginas-personales`.

1. Crear Inicio con presentación breve y accesos a obra, juegos y blog.
2. Completar Sobre mí y Trayectoria usando solo datos aprobados de `PERFIL_PUBLICO.md`.
3. Crear Contacto con los canales públicos autorizados.
4. Reservar un lugar para fotografías personales futuras sin hacerlas obligatorias para el diseño.
5. Revisar textos y enlaces en móvil y escritorio.

**Salida:** alguien que visita la web comprende quién es su autor y qué puede explorar, sin ver biografía inventada ni llamadas a contratación.

### Etapa 5 — Proyectos de código

**Rama sugerida:** `Feature4-proyectos`.

1. Crear una colección o archivo de datos para fichas de proyectos: título, resumen personal, tecnologías, repositorio, demo opcional, imagen opcional y orden destacado.
2. Construir el índice de proyectos y sus tarjetas o páginas de detalle si el contenido lo justifica.
3. Añadir solo repositorios seleccionados. Los nuevos proyectos deberán poder incorporarse creando una ficha, sin rehacer el menú.
4. Comprobar que todos los enlaces externos funcionan.

**Salida:** selección curada de proyectos reales, fácil de ampliar.

### Etapa 6 — Blog modular

**Rama sugerida:** `Feature5-blog`.

1. Configurar una colección de contenido para entradas Markdown con título, fecha, resumen, etiquetas opcionales y estado `draft` o publicado.
2. Crear índice, página de entrada, navegación entre entradas si aporta valor y formato cómodo de lectura.
3. Definir una plantilla de entrada y documentar el proceso: crear un archivo, escribir, revisar, abrir PR y publicar.
4. Añadir una primera entrada real si el autor la proporciona. Si aún no hay texto, no publicar una entrada ficticia.

**Salida:** una nueva publicación se añade mediante un Markdown y aparece automáticamente al integrar el cambio en `main`.

### Etapa 7 — Catálogo y base para minijuegos

**Rama sugerida:** `Feature6-juegos`.

1. Crear fichas de juegos en una colección o archivo de datos, independientes de la navegación principal.
2. Definir `src/games/<slug>/` para código y recursos de cada minijuego; cada uno tendrá ruta propia, controles, instrucciones y enlace para volver al catálogo.
3. Cargar el JavaScript de cada juego solo en su página. Mantener aislados estado, eventos y estilos entre juegos.
4. Verificar interacción con teclado y pantalla táctil según cada juego.
5. Probar entrada, salida y regreso a un juego después de las transiciones; si el sistema de transiciones interfiere con su inicialización, usar recarga de página para esa ruta.

**Salida:** catálogo listo para agregar juegos y, cuando exista el primero, jugable tanto en PC como en móvil. No inventar un juego solo para llenar la sección.

### Etapa 8 — Revisión de calidad y preparación de la primera versión

**Rama sugerida:** `Feature7-calidad-lanzamiento`, o cambios pequeños sobre las Features anteriores.

1. Revisar todas las rutas, enlaces, metadatos, títulos de página y textos alternativos de imágenes.
2. Comprobar tamaños de pantalla pequeños, medianos y grandes; teclado; lector de pantalla en puntos clave; reducción de movimiento.
3. Optimizar imágenes, fuentes y JavaScript. Medir y corregir problemas reales de carga o estabilidad.
4. Confirmar que los borradores del blog y la información privada no salen en el build público.
5. Validar el build de `dev` mediante CI y revisar el sitio final con contenido real.

**Salida:** PR de `dev` a `main` listo para revisión del propietario.

### Etapa 9 — Publicar en GitHub Pages

1. Revisar y aprobar explícitamente el PR de `dev` a `main`.
2. Integrar el PR. El workflow de `main` construirá y desplegará la versión pública.
3. Comprobar en la URL real la navegación, las rutas internas con `base`, el blog, los juegos y la vista móvil.
4. Registrar la URL final en `README.md`. Configurar HTTPS si GitHub Pages no lo tiene ya activo.
5. Si falla el despliegue, corregir en una Feature y repetir el flujo; no editar manualmente los archivos generados en Pages.

**Salida:** primera versión pública accesible y verificada.

### Etapa 10 — Mantener y ampliar

- **Nueva entrada:** Markdown nuevo → PR a `dev` → revisión → promoción a `main`.
- **Nuevo proyecto:** ficha nueva y enlaces verificados → mismo flujo.
- **Nuevo juego:** directorio aislado, ficha y ruta nueva → probar controles y ciclo de vida → mismo flujo.
- **Fotos personales:** añadir solo imágenes elegidas por el propietario, optimizadas y con texto alternativo.
- Revisar dependencias, enlaces y funcionamiento del build periódicamente. Mantener un historial breve de cambios importantes.

## 4. Decisiones pendientes antes de la etapa 1

- Usuario de GitHub y nombre definitivo del repositorio; esto determina la URL y el valor `base` de Astro.
- Nombre o seudónimo público e idioma inicial.
- Repositorios que aparecerán en la primera versión.
- Canales de contacto que se harán públicos.
- Si la primera publicación contendrá una entrada real de blog y algún juego, o solo dejará listas esas secciones.
- Si el propietario quiere que también las comprobaciones se ejecuten exclusivamente en GitHub Actions. La regla de «cero cómputo local» del proyecto RAG no se traslada automáticamente a esta web; es una preferencia que debe decidirse para este proyecto.

## 5. Fuentes técnicas para verificar al implementar

- [GitHub Docs — Qué es GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Docs — Publicación mediante GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Docs — Protección de ramas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Astro Docs — Despliegue en GitHub Pages](https://docs.astro.build/es/guides/deploy/github/)
- [Astro Docs — Colecciones de contenido](https://docs.astro.build/en/guides/content-collections/)
- [Astro Docs — Transiciones](https://docs.astro.build/en/guides/view-transitions/)
