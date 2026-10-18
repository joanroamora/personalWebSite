# Plan de construcción — web personal en GitHub Pages

> Hoja de ruta para avanzar etapa por etapa. Este documento planifica el trabajo; no ordena construir ni publicar el sitio de inmediato. Leerlo junto con `AGENTS.md`, que define el propósito, la navegación y el estilo visual.

## 0. Modo de trabajo actual

La prioridad inmediata es construir un esqueleto navegable con datos dummy y enlaces de prueba. Todo texto de demostración debe estar marcado como tal y conservarse separado de la información personal futura.

La información personal, los proyectos reales, los juegos reales, las fotografías y los canales de contacto se incorporarán al final, en una etapa específica de sustitución y revisión. El esqueleto no se considera la versión pública definitiva.

## 1. Resultado buscado

Construir primero un esqueleto estático, gratuito y adaptable a móvil y escritorio, con todas las rutas, componentes y estructuras de contenido previstas. Usará datos dummy mientras se define la información personal, los proyectos, los juegos, las fotografías y los enlaces reales. La versión pública final conservará la identidad visual minimalista, de inspiración alienígena/ovni y con transiciones suaves, sin enfoque de búsqueda de empleo.

**Tecnología prevista:** Astro con salida estática, HTML/CSS y JavaScript para cada juego; GitHub Actions para comprobar y generar el sitio; GitHub Pages para publicarlo. Las entradas del blog serán archivos Markdown. No se necesita backend para la primera versión.

**Situación de partida de Feature1:** repositorio `joanroamora/personalWebSite`, privado y con `main` como rama predeterminada. La primera entrega de código corresponde a `Feature1-astro-base`; las etapas 0 y 1 preparan su alcance, documentación y ramas. El inventario de contenido dummy está en [CONTENIDO_DEMO.md](CONTENIDO_DEMO.md).

## Entorno y publicación

- No instalar paquetes, CLI ni dependencias del proyecto de forma global. Las dependencias se declaran en `package.json` y `package-lock.json`, se instalan en `node_modules/` y se ejecutan mediante scripts locales. Usar `npm ci` para reproducir la instalación.
- Usar el Node.js existente, con la versión del proyecto indicada en `.nvmrc`. GitHub Actions usa esa versión y el mismo lockfile.
- El objetivo de publicación es GitHub Pages mediante GitHub Actions desde `main`. El despliegue permanece desactivado hasta la autorización final; la variable `PAGES_DEPLOY_ENABLED=true` lo habilita en esa etapa.

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

La numeración de Features cuenta entregas de código: **Feature1** corresponde a la etapa 2 (base de Astro) y **Feature2** a la etapa 3 (sistema visual y navegación). Las etapas 0 y 1 son preparación; continuar con la segunda entrega significa trabajar en `Feature2-sistema-visual`.

### Etapa 0 — Definir el alcance del esqueleto y los datos dummy

**Objetivo:** tener un mapa completo del sitio y contenido de demostración antes de incorporar información personal.

1. Confirmar las rutas del esqueleto: Inicio, Sobre mí, Proyectos, Juegos, Blog, Trayectoria y Contacto.
2. Preparar datos dummy para cada sección, identificados claramente como demostración y sin presentarlos como hechos sobre el propietario.
3. Crear fichas dummy de proyectos y juegos con enlaces funcionales a rutas internas de prueba. Usar destinos externos de ejemplo solo cuando se quiera probar ese comportamiento.
4. Mantener preparados los campos que después necesitará `PERFIL_PUBLICO.md`, sin crear todavía el perfil personal.
5. Registrar qué textos, enlaces, imágenes y fichas deberán sustituirse antes de publicar.

**Salida:** inventario de contenido dummy y rutas de prueba que permitan construir y revisar el sitio sin datos personales.

### Etapa 1 — Crear el repositorio y las reglas de trabajo

**Objetivo:** establecer una base Git limpia antes del código.

1. Comprobar si `personalWebPage` ya está inicializado con Git y si tiene remoto; no sobrescribir historia existente.
2. Crear o conectar el repositorio de GitHub. El remoto actual es privado; revisar la disponibilidad de Pages según el plan y la visibilidad elegida antes de publicar. Un cambio de visibilidad requiere la decisión del propietario.
3. Mantener `AGENTS.md` en la raíz; añadir este plan, `README.md`, `.gitignore` y la licencia solo si se desea una licencia explícita para el código y el contenido.
4. Crear `main`, después `dev` a partir de `main`. Definir `main` como rama predeterminada y aplicar las reglas de protección adecuadas.
5. Documentar en `README.md` cómo arrancar el proyecto, añadir contenido y entender las ramas.

**Salida:** repositorio accesible, `main` y `dev` existentes y sin archivos personales sensibles.

### Etapa 2 — Levantar la base de Astro y la integración continua

**Rama sugerida:** `Feature1-astro-base`.

1. Crear el proyecto Astro en modo estático, con dependencias y versiones declaradas en el repositorio.
2. Preparar diseño compartido, metadatos básicos, página de inicio temporal y páginas de error necesarias.
3. Configurar `site: https://joanroamora.github.io` y `base: /personalWebSite/` según el remoto existente. Centralizar estos valores en `site.config.mjs`; la URL prevista es `https://joanroamora.github.io/personalWebSite/`.
4. Crear CI para instalar dependencias, comprobar tipos o contenido cuando corresponda, ejecutar el build y detectar enlaces o rutas rotas con una comprobación apropiada.
5. Preparar el workflow de GitHub Pages, limitado a `main` y condicionado a `PAGES_DEPLOY_ENABLED=true`. La activación de Pages con fuente **GitHub Actions** queda para la etapa de publicación.
6. Abrir PR hacia `dev` y comprobar el build remoto antes de integrarlo.

**Salida:** portada y 404 estáticas, dependencias locales con lockfile, comprobación de tipos y enlaces, build correcto en CI y PR a `dev` para revisión. La URL y el workflow quedan preparados; habilitar Pages y el despliegue corresponde a la etapa 10.

### Etapa 3 — Sistema visual y navegación

**Rama sugerida:** `Feature2-sistema-visual`.

**Dependencia:** Feature1 debe revisarse e integrarse en `dev` antes de integrar Feature2. Mientras su PR esté abierto, se puede incorporar su base dentro de la rama Feature2 para desarrollar y verificar esta entrega sin modificar `dev` ni `main`.

1. Definir variables de color, tipografía, espaciado y componentes reutilizables según `AGENTS.md`.
2. Construir cabecera, menú, pie de página y estados activos para Inicio, Sobre mí, Proyectos, Juegos, Blog, Trayectoria y Contacto.
3. Implementar el menú móvil y comprobar teclado, foco visible, contraste y tamaños táctiles.
4. Añadir un motivo visual alienígena sutil que no interfiera con la lectura.
5. Incorporar transiciones discretas entre páginas; respetar `prefers-reduced-motion` y mantener navegación normal como alternativa.
6. Comprobar las siete rutas y la sección activa en escritorio y móvil, el menú nativo sin JavaScript, Escape y foco, navegación táctil, historial y ausencia de desbordamiento. Ejecutar las pruebas de navegador en GitHub Actions y conservar capturas para la revisión visual.

**Salida:** todas las rutas base son navegables y se ven bien en móvil y escritorio, aunque parte del contenido siga pendiente.

### Etapa 4 — Página principal y páginas personales dummy

**Rama sugerida:** `Feature3-paginas-personales`.

1. Crear Inicio con una presentación breve de demostración y accesos a obra, juegos y blog.
2. Completar Sobre mí y Trayectoria con textos dummy claramente marcados como contenido temporal.
3. Crear Contacto con enlaces dummy y destinos de prueba claramente identificados.
4. Reservar un lugar para fotografías personales futuras sin usar imágenes de sustitución.
5. Revisar textos, estados vacíos y enlaces en móvil y escritorio.

**Salida:** las rutas personales tienen una estructura completa y dejan claro qué contenido deberá sustituirse antes de publicar.

### Etapa 5 — Proyectos de código dummy

**Rama sugerida:** `Feature4-proyectos`.

1. Crear una colección o archivo de datos para fichas de proyectos: título, resumen, tecnologías, repositorio dummy, demo opcional, imagen opcional y orden destacado.
2. Construir el índice de proyectos y sus tarjetas o páginas de detalle si el contenido lo justifica.
3. Añadir fichas de demostración sin atribuirlas al propietario ni presentarlas como proyectos reales.
4. Comprobar que los enlaces dummy funcionan y están identificados como temporales.

**Salida:** selección de demostración fácil de sustituir por proyectos reales sin rehacer la navegación.

### Etapa 6 — Blog modular con contenido dummy

**Rama sugerida:** `Feature5-blog`.

1. Configurar una colección de contenido para entradas Markdown con título, fecha, resumen, etiquetas opcionales y estado `draft`, demo o publicado.
2. Crear índice, página de entrada, navegación entre entradas si aporta valor y formato cómodo de lectura.
3. Definir una plantilla de entrada y documentar el proceso: crear un archivo, escribir, revisar, abrir PR y publicar.
4. Añadir una o más entradas de demostración claramente marcadas. Excluirlas de la publicación final cuando se incorporen los textos reales.

**Salida:** una nueva publicación se añade mediante un Markdown y aparece automáticamente al integrar el cambio en `main`.

### Etapa 7 — Catálogo y rutas dummy para minijuegos

**Rama sugerida:** `Feature6-juegos`.

1. Crear fichas dummy de juegos en una colección o archivo de datos, independientes de la navegación principal.
2. Definir `src/games/<slug>/` para las rutas y recursos de prueba de cada minijuego; cada ficha tendrá instrucciones temporales y enlace para volver al catálogo.
3. Cargar código de juego solo en su página cuando exista una demo interactiva. El catálogo debe funcionar aunque el juego real aún no exista.
4. Verificar los enlaces, estados vacíos y navegación con teclado y pantalla táctil.
5. Probar entrada, salida y regreso a una ruta dummy después de las transiciones.

**Salida:** catálogo navegable con enlaces dummy funcionales y estructura lista para sustituirlos por juegos propios. No presentar las demos como juegos reales.

### Etapa 8 — Revisión de calidad del esqueleto

**Rama sugerida:** `Feature7-calidad-esqueleto`, o cambios pequeños sobre las Features anteriores.

1. Revisar todas las rutas, enlaces dummy, metadatos, títulos de página y textos alternativos de imágenes.
2. Comprobar tamaños de pantalla pequeños, medianos y grandes; teclado; lector de pantalla en puntos clave; reducción de movimiento.
3. Optimizar imágenes, fuentes y JavaScript. Medir y corregir problemas reales de carga o estabilidad.
4. Confirmar que todo el contenido dummy está identificado y que no se ha incorporado información personal.
5. Validar el build de `dev` mediante CI y revisar el esqueleto completo.

**Salida:** esqueleto navegable y revisado, listo para recibir el contenido aprobado.

### Etapa 9 — Incorporar información personal aprobada

**Objetivo:** sustituir el contenido dummy por la información que el propietario apruebe para publicar.

1. Crear o completar `PERFIL_PUBLICO.md` con nombre o seudónimo, biografía, intereses, hitos, proyectos, juegos, textos y contactos autorizados.
2. Reemplazar los textos, fichas, enlaces e imágenes dummy por contenido aprobado.
3. Retirar las rutas, datos y marcadores dummy que ya no sean necesarios.
4. Comprobar que no aparecen datos privados, enlaces de prueba ni afirmaciones inventadas.
5. Revisar personalmente toda la versión candidata antes de preparar la publicación.

**Salida:** versión candidata con contenido personal aprobado y sin placeholders.

### Etapa 10 — Publicar en GitHub Pages

1. Revisar y aprobar explícitamente el PR de `dev` a `main`. Confirmar que Pages está disponible con el plan y la visibilidad elegidos; configurar la fuente **GitHub Actions** y habilitar `PAGES_DEPLOY_ENABLED=true` al autorizar la publicación.
2. Integrar el PR. El workflow de `main` comprobará, construirá y desplegará la versión pública.
3. Comprobar en la URL real la navegación, las rutas internas con `base`, el blog, los juegos y la vista móvil.
4. Registrar la URL final en `README.md`. Configurar HTTPS si GitHub Pages no lo tiene ya activo.
5. Si falla el despliegue, corregir en una Feature y repetir el flujo; no editar manualmente los archivos generados en Pages.

**Salida:** primera versión pública accesible y verificada.

### Etapa 11 — Mantener y ampliar

- **Nueva entrada:** Markdown nuevo → PR a `dev` → revisión → promoción a `main`.
- **Nuevo proyecto:** ficha nueva y enlaces verificados → mismo flujo.
- **Nuevo juego:** directorio aislado, ficha y ruta nueva → probar controles y ciclo de vida → mismo flujo.
- **Fotos personales:** añadir solo imágenes elegidas por el propietario, optimizadas y con texto alternativo.
- Revisar dependencias, enlaces y funcionamiento del build periódicamente. Mantener un historial breve de cambios importantes.

## 4. Decisiones pendientes

### Para construir el esqueleto

- URL de GitHub Pages resuelta según el remoto: `https://joanroamora.github.io/personalWebSite/`. Revisarla si el repositorio cambia de nombre.
- Si el propietario quiere que las comprobaciones se ejecuten exclusivamente en GitHub Actions. La regla de «cero cómputo local» del proyecto RAG no se traslada automáticamente a esta web; es una preferencia que debe decidirse para este proyecto.
- Qué rutas dummy se quieren revisar primero y qué nivel de interacción necesitan las demos de juegos.

### Antes de sustituir el contenido dummy y publicar

- Nombre o seudónimo público e idioma inicial.
- Repositorios y proyectos que aparecerán en la versión pública.
- Juegos y textos del blog que se quieran publicar.
- Canales de contacto que se harán públicos.
- Fotografías autorizadas, textos alternativos y preferencias de uso.
- Revisión completa de `PERFIL_PUBLICO.md` y aprobación explícita del contenido final.

## 5. Fuentes técnicas para verificar al implementar

- [GitHub Docs — Qué es GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Docs — Publicación mediante GitHub Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Docs — Protección de ramas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Astro Docs — Despliegue en GitHub Pages](https://docs.astro.build/es/guides/deploy/github/)
- [Astro Docs — Colecciones de contenido](https://docs.astro.build/en/guides/content-collections/)
- [Astro Docs — Transiciones](https://docs.astro.build/en/guides/view-transitions/)
