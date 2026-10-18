# personalWebSite

Base de una web personal estática con Astro, preparada para GitHub Pages. Se construye por etapas con contenido dummy; la información personal se incorporará al final.

## Estado de Feature3

Ocho páginas estáticas: Inicio, Sobre mí, Proyectos, Juegos, Blog, Trayectoria, Contacto y 404. La cabecera muestra los siete enlaces en escritorio y un menú nativo en móvil, con la sección activa marcada.

Inicio incluye presentación y frase de muestra, espacios reservados para obra destacada y última entrada, y accesos a proyectos, juegos, blog y el resto de secciones. Sobre mí incorpora biografía, intereses, enfoque creativo y un marcador de fotografía futura. Trayectoria presenta tres capítulos ficticios, sin fechas ni experiencias atribuidas al propietario. Contacto ofrece dos enlaces internos de prueba con destinos explicados, sin direcciones ni perfiles personales. Proyectos, Juegos y Blog conservan sus paneles de preparación hasta sus respectivas Features.

El sistema visual comparte colores, tipografías, espaciado, foco y tamaños táctiles. Las transiciones nativas usan un desvanecimiento breve; se desactivan con movimiento reducido. La navegación sigue funcionando sin JavaScript ni soporte para transiciones.

Los textos y el nombre «Archivo orbital» son de demostración. La web aún no está publicada.

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

`site.config.mjs` centraliza el título de muestra, el repositorio, el idioma y la URL. `src/data/navigation.ts` conserva los identificadores, nombres, orden y rutas; `sectionHref()` resuelve los enlaces editoriales desde ese mismo mapa. `src/pages/[section].astro` genera las rutas y selecciona el componente personal o el panel de preparación correspondiente. Las colecciones de proyectos, blog y juegos se añadirán en sus etapas respectivas.

Los textos ficticios de las páginas personales están en `src/data/personal-demo.ts`, separados de su presentación en `src/components/personal/`. `DemoNotice`, `PageIntro` y `PhotoPlaceholder` son componentes compartidos. Para revisar los textos de muestra, editar ese archivo de datos; para sustituirlos por información real, seguir la etapa 9 y el inventario de `docs/CONTENIDO_DEMO.md`. No hay fotografías de sustitución ni datos personales nuevos.

## Ramas y comprobaciones

Flujo: `dev` → `Feature<N>-<descripcion>` → PR a `dev` → PR de `dev` a `main`. Los commits llevan el prefijo `Feature<N>: `. El propietario decide las integraciones.

GitHub Actions ejecuta `npm ci`, `npm run verify` y las pruebas de navegador en pushes a `Feature*`, `dev` y `main`, y en PR hacia `dev` o `main`. Cada Feature debe pasar estas comprobaciones antes de integrarse.

Feature1 y Feature2 ya se integraron en `dev`. `Feature3-paginas-personales` parte de esa base y se prepara para revisión mediante PR hacia `dev`; su integración requiere la decisión del propietario.

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
- [Astro: configuración de GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
