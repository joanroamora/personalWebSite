# personalWebSite

Base de una web personal estática con Astro, preparada para GitHub Pages. Se construye por etapas con contenido dummy; la información personal se incorporará al final.

## Estado de Feature1

Portada temporal y página 404, layout y metadatos compartidos, estilos iniciales, icono local y configuración de rutas para `/personalWebSite/`. Las demás secciones se muestran como próximas; sus páginas y el menú completo corresponden a las siguientes Features.

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

`npm run check:links` comprueba los destinos locales de los enlaces y recursos del HTML generado, incluidos fragmentos y el prefijo de Pages. Los sitios externos no se consultan. No sustituye la revisión de accesibilidad ni la comprobación visual.

## Organización

```text
src/components/     Cabecera, pie y metadatos
src/layouts/        Estructura compartida
src/pages/          Inicio y 404; siguientes rutas por implementar
src/data/           Mapa central de futuras secciones
src/styles/         Estilos globales
src/utils/          Enlaces que respetan la base de Pages
public/icons/       Iconos locales
scripts/            Comprobación del build y sus pruebas
docs/               Plan e inventario de contenido de demostración
.github/workflows/  CI y despliegue preparado
```

`site.config.mjs` centraliza el título de muestra, el repositorio, el idioma y la URL. `src/data/navigation.ts` conserva los nombres, el orden y las rutas de las siete secciones. Las colecciones de proyectos, blog y juegos se añadirán en sus etapas respectivas.

## Ramas y comprobaciones

Flujo: `dev` → `Feature<N>-<descripcion>` → PR a `dev` → PR de `dev` a `main`. Los commits llevan el prefijo `Feature<N>: `. El propietario decide las integraciones.

GitHub Actions ejecuta `npm ci` y `npm run verify` en pushes a `Feature*`, `dev` y `main`, y en PR hacia `dev` o `main`. Cada Feature debe pasar estas comprobaciones antes de integrarse.

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
