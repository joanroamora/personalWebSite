# personalWebSite

Base de una web personal estática con Astro, preparada para GitHub Pages. Se construye por etapas con contenido dummy; la información personal se incorporará al final.

## Estado de Feature6

39 páginas estáticas: las siete secciones principales, 404, 27 detalles de proyectos y cuatro fichas de juegos. La cabecera muestra los siete enlaces en escritorio y un menú nativo en móvil, con la sección activa marcada.

Inicio incluye presentación y frase de muestra, espacios reservados para obra destacada y última entrada, y accesos a proyectos, juegos, blog y el resto de secciones. Sobre mí incorpora biografía, intereses, enfoque creativo y un marcador de fotografía futura. Trayectoria presenta tres capítulos ficticios, sin fechas ni experiencias atribuidas al propietario. Contacto ofrece dos enlaces internos de prueba con destinos explicados, sin direcciones ni perfiles personales. Blog conserva su panel de preparación: Feature5 queda pendiente al adelantar Feature6 por petición del propietario.

Juegos incorpora Cadete Roa, prototipo jugable de runner 3D low poly con presentación en inglés, controles táctiles y de teclado, obstáculos y plataformas, récord local, pausa y reintento. Se abre en una ventana vertical en escritorio y ocupa la ventana del celular. WebGL y alternativa Canvas 2D, calidad automática/Eco y audio opcional, sin dependencias adicionales. Los otros tres juegos son fichas de muestra «En desarrollo». El motor solo se carga en la ruta de Cadete Roa. Ver `docs/JUEGOS.md`.

Proyectos incorpora 27 repositorios reales elegidos por el propietario. Cada tarjeta tiene un título editorial, el nombre original de GitHub como subtítulo y tecnologías con iconos locales. Al abrirla aparece un diálogo con descripción ampliada, contexto, tecnologías y enlace al código. El catálogo permite buscar y filtrar por tema. Cada proyecto tiene además una ruta estática propia que funciona sin JavaScript. La selección se mantiene en `src/data/projects.ts`, sin consultas a GitHub durante el build ni desde el navegador. Las fuentes se documentan en `docs/PROYECTOS_APROBADOS.md` y las licencias de los iconos en `docs/ICONOS_TECNOLOGIAS.md`. Los demás contenidos siguen siendo de muestra.

El proyecto energético se identifica como proyecto aplicado de grado en la UNAD y FairLens como proyecto de Machine Learning Fundamentals en Indiana Wesleyan University, según la información aprobada por el propietario. Boris conserva su indicación de repositorio privado; el sitio no modifica permisos ni visibilidad en GitHub.

El sistema visual comparte colores, tipografías, espaciado, foco y tamaños táctiles. Las transiciones nativas usan un desvanecimiento breve; se desactivan con movimiento reducido. La navegación sigue funcionando sin JavaScript ni soporte para transiciones.

Los textos personales y el nombre «Archivo orbital» son de demostración; las fichas de Proyectos corresponden a repositorios reales aprobados. La web aún no está publicada.

## Desarrollo local

Usar el Node.js existente, versión `24.19.0` indicada en `.nvmrc`, y npm 11. No instalar herramientas ni paquetes globales.

```sh
npm ci
npm run dev
```

Abrir `http://localhost:4321/personalWebSite/`. En PowerShell se puede usar `npm.cmd` en lugar de `npm` si la política de scripts bloquea `npm.ps1`.

Las dependencias se instalan en `node_modules/`, excluido de Git. `package-lock.json` fija sus versiones; los scripts usan los ejecutables del proyecto.

```sh
npm run verify   # tipos, pruebas del verificador, build y enlaces locales
npm run preview  # sirve dist/ después del build
```

Las pruebas de navegador se ejecutan en GitHub Actions con Chromium. Comprueban navegación, teclado, menú táctil, uso sin JavaScript, movimiento reducido y las cuatro páginas personales en tamaños de 320 a 1440 píxeles, incluida orientación horizontal. Los contactos de prueba deben llevar al destino visible y transferirle el foco incluso sin JavaScript. El CI conserva el informe y las capturas durante siete días.

Para ejecutar esas pruebas voluntariamente en local, después del build:

```sh
npm run test:e2e:install
npm run test:e2e
```

Este comando instala el navegador de pruebas dentro de `node_modules/playwright-core/.local-browsers/`. Los comandos de desarrollo habituales no requieren esa descarga.

`npm run check:links` comprueba los destinos locales de los enlaces y recursos del HTML generado, incluidos fragmentos y el prefijo de Pages. Los sitios externos no se consultan. No sustituye la revisión de accesibilidad ni la comprobación visual.

## Organización

```text
src/components/     Cabecera, pie y metadatos
src/layouts/        Estructura compartida
src/pages/          Inicio, 404 y rutas estáticas generadas desde el menú
src/data/           Fuente central de nombres, orden y rutas
src/scripts/        Mejoras del menú nativo
src/styles/         Estilos globales
src/utils/          Enlaces que respetan la base de Pages
public/icons/       Iconos locales
scripts/            Comprobación del build y sus pruebas
tests/              Pruebas de navegador y capturas en CI
docs/               Plan e inventario de contenido de demostración
.github/workflows/  CI y despliegue preparado
```

`site.config.mjs` centraliza el título de muestra, el repositorio, el idioma y la URL. `src/data/navigation.ts` conserva los identificadores, nombres, orden y rutas; `sectionHref()`, `projectHref()` y `gameHref()` resuelven los enlaces. `src/pages/[section].astro` genera las secciones personales y paneles de preparación; `src/pages/proyectos/` y `src/pages/juegos/` contienen sus catálogos y rutas propias. El catálogo de proyectos carga sus filtros y diálogo; Cadete Roa carga su motor aislado en `src/games/cadete-roa/`. Blog tendrá su colección en Feature5.

Los textos ficticios de las páginas personales están en `src/data/personal-demo.ts`, separados de su presentación en `src/components/personal/`. `DemoNotice`, `PageIntro` y `PhotoPlaceholder` son componentes compartidos. Para revisar los textos de muestra, editar ese archivo de datos; para sustituirlos por información real, seguir la etapa 9 y el inventario de `docs/CONTENIDO_DEMO.md`. No hay fotografías de sustitución ni datos personales nuevos.

## Ramas y comprobaciones

Flujo: `dev` → `Feature<N>-<descripcion>` → PR a `dev` → PR de `dev` a `main`. Los commits llevan el prefijo `Feature<N>: `. El propietario decide las integraciones.

GitHub Actions ejecuta `npm ci`, `npm run verify` y las pruebas de navegador en pushes a `Feature*`, `dev` y `main`, y en PR hacia `dev` o `main`. Cada Feature debe pasar estas comprobaciones antes de integrarse.

Feature1 a Feature4 ya se integraron en `dev`. `Feature6-juegos` parte de esa base y adelanta el catálogo por petición del propietario; Feature5-blog queda pendiente. La integración de cada nueva Feature requiere la decisión del propietario.

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
- [Astro: configuración de GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
