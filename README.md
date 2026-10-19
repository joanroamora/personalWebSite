# personalWebSite

Web personal estática con Astro, preparada para GitHub Pages. Incluye la información personal aportada por el propietario, sus proyectos, dos ensayos y ocho juegos: Cadete Roa, Galactian, Rail Crane, Torque Trail, Blackout Texas, Deploy or Die, Packet Runner y Orbital Rescue. Los textos de prueba del blog y tres conceptos de juegos conservan sus avisos de muestra.

## Feature12 — blog editorial y portafolio ilustrado

Dos ensayos a partir de las propuestas del propietario: «Anatomía de una tragamonedas de bolsillo» y «El espejo programado». Portada y lectura responsive, fuentes primarias enlazadas, índice plegable, navegación sin JavaScript e ilustraciones originales generadas con IA e inspiradas en Toulouse-Lautrec. Astro produce WebP/JPEG adaptables y las imágenes para compartir. Los originales extensos permanecen en español, identificados en las seis versiones del sitio. Las demos se conservan en un archivo separado y no desplazan publicaciones reales. El build genera 301 páginas. Alcance, revisión factual y prompts en [docs/FEATURE12_BLOG.md](docs/FEATURE12_BLOG.md). Rama: `Feature12-blog-editorial`; sin publicación ni despliegue.

La ampliación del portafolio incorpora 27 estudios conceptuales originales inspirados en los cuadernos técnicos de Da Vinci: pergamino, tinta sepia y mecanismos relacionados con cada proyecto. Se comparten entre tarjetas, detalle e Inicio. El destacado cambia aleatoriamente cada tres segundos, con pausa, siguiente, movimiento reducido y carga diferida, sin repetir proyectos dentro del ciclo. Alcance y prompts en [docs/FEATURE12_PORTAFOLIO.md](docs/FEATURE12_PORTAFOLIO.md).

## Feature11 — cuatro nuevos juegos

Blackout Texas combina generación, batería y distribución eléctrica; Deploy or Die, capacidad, incidentes y despliegues; Packet Runner, rutas, amenazas y entregas con TTL; Orbital Rescue, inercia, rescates y acoplamiento. Comparten la integración del arcade, con reglas independientes, interfaces inglesas, teclado/táctil, tutoriales, audio opcional y récords locales. Sin dependencias nuevas. El build actual genera 289 páginas estáticas. Alcance, controles, supuestos y validación en [docs/FEATURE11_JUEGOS.md](docs/FEATURE11_JUEGOS.md). Rama: `Feature11-cuatro-juegos`, con integración y push a `dev` autorizados por el propietario; sin publicación ni despliegue.

## Feature10 — Fotografías personales y Torque Trail

Cuatro fotografías aprobadas: retrato casual en Inicio, retrato formal en Sobre mí y dos imágenes de contexto junto a Formación en Trayectoria. `PersonalPhoto.astro` genera WebP y JPEG adaptables, con dimensiones reservadas, prioridades de carga y textos alternativos en los seis idiomas. Las fuentes se conservan en `src/assets/personal/`; se sustituye el marcador pendiente. No requiere dependencias ni JavaScript adicional. Alcance y mantenimiento en [docs/FEATURE10_FOTOGRAFIAS.md](docs/FEATURE10_FOTOGRAFIAS.md). Rama de trabajo: `Feature10-fotografias`.

La ampliación autorizada añade Torque Trail: moto lateral original en 8 bits, con suspensión de muelle/amortiguador, agarre, inercia, inclinación del piloto y recorridos progresivos con puntos de control. Es el cuarto juego jugable, con teclado, multitouch e interfaz inglesa. Usa la misma ventana y gestión de sesiones que los otros juegos de Canvas. Reglas y alcance físico en [docs/TORQUE_TRAIL.md](docs/TORQUE_TRAIL.md). El build genera 265 páginas estáticas.

Contacto también incorpora el Flickr proporcionado por el propietario, desde `PERFIL_PUBLICO.md`, con el enlace «Ver mis fotografías» localizado en los seis idiomas.

## Feature9 — Galactian y Rail Crane

Dos nuevos juegos completos en `src/games/`, con rutas propias y versiones bajo los seis idiomas del sitio. Sus interfaces siempre permanecen en inglés. Conservan el diálogo 9:16 de Cadete Roa en escritorio y la ventana completa en móvil. Galactian combina combate aéreo, bombas terrestres, combustible y aterrizajes de reabastecimiento. Rail Crane tiene una terminal de 16 vagones, órdenes válidas según la ocupación real, balanceo de carga, errores recuperables y operaciones progresivas.

Reglas, controles y decisiones en [docs/FEATURE9_JUEGOS.md](docs/FEATURE9_JUEGOS.md). Se generan 259 páginas estáticas; cada motor se carga solo en su ruta, sin dependencias nuevas. La entrega se desarrolló en `Feature9-galactian-rail-crane`; el propietario autorizó su integración y push a `dev` después de la revisión local.

## Estado de Feature8 — Idiomas y revisión de contenido

Feature8 añade una burbuja de idioma con inglés, español, mandarín simplificado, hindi, árabe y francés. Conserva la página al cambiar, recuerda la elección y funciona sin JavaScript mediante enlaces reales. El español mantiene las URLs actuales; los cinco idiomas derivados usan prefijos. Árabe tiene lectura RTL. Se generan 247 páginas estáticas, sin servicios externos de traducción ni dependencias nuevas.

Se traducen la interfaz, el perfil y los títulos y resúmenes de proyectos y blog. Las descripciones extensas de proyectos y los cuerpos de las entradas de muestra conservan su original español, identificado; Cadete Roa continúa en inglés. Alcance y mantenimiento en [docs/IDIOMAS.md](docs/IDIOMAS.md). La revisión de la candidata y las decisiones pendientes están en [docs/REVISION_CANDIDATA.md](docs/REVISION_CANDIDATA.md).

## Base integrada — Calidad e información personal

42 páginas estáticas: las siete secciones principales, 404, 27 detalles de proyectos, cuatro fichas de juegos y tres entradas de blog demo. La cabecera muestra los siete enlaces en escritorio y un menú nativo en móvil, con la sección activa marcada.

Feature7 corrige nombres accesibles de los enlaces, desbordamientos con texto al 200 % y el cierre del juego mientras la pantalla completa aún está pendiente. Añade auditoría automática de accesibilidad en móvil y escritorio, comprobaciones de metadatos en las 42 páginas, estabilidad de carga y presupuestos de tamaño que también protegen el aislamiento del juego. Detalles y alcance en [docs/CALIDAD_ESQUELETO.md](docs/CALIDAD_ESQUELETO.md).

Por petición del propietario, esta misma rama incorpora su información desde `docs/PERFIL_PUBLICO.md`. Inicio muestra su presentación, una perspectiva de su biografía, pdfRoar destacado y la última entrada demo identificada. Sobre mí reúne biografía, ámbitos y herramientas. Feature10 añade fotografías reales en Inicio, Sobre mí y Trayectoria. Trayectoria presenta experiencias, formación y certificaciones de la fuente. Contacto ofrece correo, LinkedIn y GitHub públicos, sin formulario. Ver [docs/CONTENIDO_PERSONAL.md](docs/CONTENIDO_PERSONAL.md).

Blog incorpora un índice editorial y lectura con índice de apartados, metadatos, etiquetas y enlaces entre entradas. Las entradas son Markdown con un slug permanente explícito y estados `draft`, `demo` y `published`. Los borradores no generan rutas; las demos se ocultan cuando `isDemo` es `false`. Inicio selecciona automáticamente la última entrada visible. No requiere dependencias nuevas ni JavaScript de lectura. Ver [docs/BLOG.md](docs/BLOG.md) y [la plantilla](docs/plantillas/entrada.md).

Juegos incorpora Cadete Roa, prototipo jugable de runner 3D low poly con presentación en inglés, controles táctiles y de teclado, obstáculos y plataformas, récord local, pausa y reintento. Se abre en una ventana vertical en escritorio y ocupa la ventana del celular. WebGL y alternativa Canvas 2D, calidad automática/Eco y audio opcional, sin dependencias adicionales. Los otros tres juegos son fichas de muestra «En desarrollo». El motor solo se carga en la ruta de Cadete Roa. Ver `docs/JUEGOS.md`.

Proyectos incorpora 27 repositorios reales elegidos por el propietario. Cada tarjeta tiene un título editorial, el nombre original de GitHub como subtítulo y tecnologías con iconos locales. Al abrirla aparece un diálogo con descripción ampliada, contexto, tecnologías y enlace al código. El catálogo permite buscar y filtrar por tema. Cada proyecto tiene además una ruta estática propia que funciona sin JavaScript. La selección se mantiene en `src/data/projects.ts`, sin consultas a GitHub durante el build ni desde el navegador. Las fuentes se documentan en `docs/PROYECTOS_APROBADOS.md` y las licencias de los iconos en `docs/ICONOS_TECNOLOGIAS.md`. Los demás contenidos siguen siendo de muestra.

El proyecto energético se identifica como proyecto aplicado de grado en la UNAD y FairLens como proyecto de Machine Learning Fundamentals en Indiana Wesleyan University, según la información aprobada por el propietario. Boris conserva su indicación de repositorio privado; el sitio no modifica permisos ni visibilidad en GitHub.

El sistema visual comparte colores, tipografías, espaciado, foco y tamaños táctiles. Las transiciones nativas usan un desvanecimiento breve; se desactivan con movimiento reducido. La navegación sigue funcionando sin JavaScript ni soporte para transiciones.

La marca y las páginas personales ya usan la información real de [docs/PERFIL_PUBLICO.md](docs/PERFIL_PUBLICO.md), leído al generar el sitio. Se conserva «Vista previa» y `noindex` mientras se revisan los contenidos restantes. La web aún no está publicada.

## Desarrollo local

Usar el Node.js existente, versión `24.19.0` indicada en `.nvmrc`, y npm 11. No instalar herramientas ni paquetes globales.

```sh
npm ci
npm run dev
```

Abrir `http://localhost:4321/personalWebSite/`. En PowerShell se puede usar `npm.cmd` en lugar de `npm` si la política de scripts bloquea `npm.ps1`.

Las dependencias se instalan en `node_modules/`, excluido de Git. `package-lock.json` fija sus versiones; los scripts usan los ejecutables del proyecto.

```sh
npm run verify   # tipos, pruebas, build, enlaces, metadatos y presupuestos
npm run preview  # sirve dist/ después del build
```

Las pruebas de navegador se ejecutan en GitHub Actions con Chromium y axe, instalado únicamente como dependencia de desarrollo. Comprueban navegación, teclado, menú táctil, uso sin JavaScript, movimiento reducido, accesibilidad automática, texto al 200 %, estabilidad y tamaños de 320 a 1440 píxeles, incluida orientación horizontal. También comparan las páginas personales con la fuente y comprueban los destinos de contacto sin enviar mensajes. El CI conserva el informe y las capturas durante siete días.

Para ejecutar esas pruebas voluntariamente en local, después del build:

```sh
npm run test:e2e:install
npm run test:e2e
```

Este comando instala el navegador de pruebas dentro de `node_modules/playwright-core/.local-browsers/`. Los comandos de desarrollo habituales no requieren esa descarga.

`npm run check:links` comprueba los destinos locales de los enlaces y recursos del HTML generado, incluidos fragmentos y el prefijo de Pages. Los sitios externos no se consultan. No sustituye la revisión de accesibilidad ni la comprobación visual.

`npm run check:quality` revisa metadatos, estructura, imágenes y presupuestos gzip de `dist/`, incluida la carga aislada del juego. Forma parte de `verify` y no añade código al sitio. Las auditorías de navegador guardan los resultados y el árbol accesible como adjuntos del informe.

## Organización

```text
src/components/     Cabecera, pie y metadatos
src/content/blog/   Entradas Markdown y borradores
src/content.config.ts Esquema y cargador de la colección del blog
src/layouts/        Estructura compartida
src/i18n/           Idiomas y traducciones de compilación
src/middleware.ts   Localización del HTML durante el prerenderizado
src/pages/          Inicio, 404 y rutas estáticas generadas desde el menú
src/data/           Fuente central de nombres, orden y rutas
src/assets/personal/ Fotografías fuente para optimización en el build
src/scripts/        Mejoras del menú nativo
src/styles/         Estilos globales
src/utils/          Enlaces que respetan la base de Pages
public/icons/       Iconos locales
scripts/            Comprobación del build y sus pruebas
tests/              Pruebas de navegador y capturas en CI
docs/               Plan e inventario de contenido de demostración
.github/workflows/  CI y despliegue preparado
```

`site.config.mjs` centraliza la identidad derivada del perfil, el repositorio, el idioma y la URL. `src/data/navigation.ts` conserva los identificadores, nombres, orden y rutas; `sectionHref()`, `projectHref()`, `gameHref()` y `postHref()` resuelven los enlaces. `src/pages/[section].astro` genera las secciones personales; Proyectos, Juegos y Blog contienen sus índices y rutas propias. El catálogo de proyectos carga sus filtros y diálogo; Cadete Roa carga su motor aislado en `src/games/cadete-roa/`. La colección Markdown del blog se consulta desde `src/data/blog.ts`.

Los componentes personales consumen `src/data/profile.ts`, que lee `docs/PERFIL_PUBLICO.md`. Se retiraron los textos ficticios y destinos de contacto de Feature3. `PersonalPhoto` presenta únicamente las fotografías aportadas por el propietario y registradas en `src/data/photos.ts`. El inventario de `docs/CONTENIDO_DEMO.md` recoge las muestras que aún faltan por sustituir.

## Ramas y comprobaciones

Flujo: `dev` → `Feature<N>-<descripcion>` → PR a `dev` → PR de `dev` a `main`. Los commits llevan el prefijo `Feature<N>: `. El propietario decide las integraciones.

GitHub Actions ejecuta `npm ci`, `npm run verify` y las pruebas de navegador en pushes a `Feature*`, `dev` y `main`, y en PR hacia `dev` o `main`. Cada Feature debe pasar estas comprobaciones antes de integrarse.

Feature1 a Feature11 ya se integraron en `dev` (el blog de Feature5 se completó después de los juegos). Feature7 incluyó calidad y perfil público; Feature8 incorporó idiomas; Feature10, fotografías, Torque Trail y Flickr; Feature11 amplió el arcade a ocho juegos. Feature12 incorpora dos ensayos, una presentación editorial y el portafolio ilustrado con destacado rotativo; el propietario autorizó su integración y push a `dev`. La integración de cada nueva Feature y la publicación requieren la decisión del propietario; esta aprobación no publica el sitio.

## Publicación futura en GitHub Pages

Destino previsto según el remoto: `https://joanroamora.github.io/personalWebSite/`. `site` y `base` ya están configurados; esa URL todavía no representa un despliegue activo.

El repositorio es actualmente privado. En la etapa de publicación se revisará la disponibilidad de Pages según el plan de GitHub y la visibilidad elegida por el propietario.

Antes de publicar:

1. Sustituir o retirar el contenido dummy según el inventario; revisar los datos aprobados y cambiar `isDemo` en `site.config.mjs` cuando corresponda.
2. Elegir **Settings → Pages → Build and deployment → Source: GitHub Actions** cuando Pages esté disponible.
3. Crear la variable de repositorio `PAGES_DEPLOY_ENABLED` con el valor `true` al autorizar la publicación.
4. Integrar la versión aprobada en `main`. El workflow verificará, generará y desplegará `dist/`. También permite ejecución manual únicamente desde `main`.

Con la variable ausente o desactivada, el workflow omite el despliegue. La documentación, los archivos fuente y las dependencias no forman parte de `dist/`.

## Documentación

- [Instrucciones para el agente](AGENTS.md)
- [Plan de construcción y etapas](docs/PLAN_DE_CONSTRUCCION.md)
- [Inventario de contenido dummy](docs/CONTENIDO_DEMO.md)
- [Selección de proyectos aprobada](docs/PROYECTOS_APROBADOS.md)
- [Iconos y licencias](docs/ICONOS_TECNOLOGIAS.md)
- [Catálogo y mantenimiento de juegos](docs/JUEGOS.md)
- [Blog y proceso de publicación de entradas](docs/BLOG.md)
- [Revisión de calidad y comprobaciones](docs/CALIDAD_ESQUELETO.md)
- [Fuente principal de información personal](docs/PERFIL_PUBLICO.md)
- [Mantenimiento del contenido personal](docs/CONTENIDO_PERSONAL.md)
- [Idiomas y mantenimiento de traducciones](docs/IDIOMAS.md)
- [Revisión de la candidata y decisiones pendientes](docs/REVISION_CANDIDATA.md)
- [Fotografías personales y mantenimiento](docs/FEATURE10_FOTOGRAFIAS.md)
- [Torque Trail: controles, física y arquitectura](docs/TORQUE_TRAIL.md)
- [Feature11: cuatro juegos, controles y validación](docs/FEATURE11_JUEGOS.md)
- [Feature12: blog, fuentes e ilustraciones](docs/FEATURE12_BLOG.md)
- [Astro: configuración de GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
