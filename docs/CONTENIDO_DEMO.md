# Inventario del esqueleto y contenido dummy

Este inventario permite construir sin información personal. Los textos de muestra se identifican en la interfaz; no describen al propietario. `PERFIL_PUBLICO.md` se incorporará en la etapa 9.

## Mapa de secciones

Las rutas comparten la base `/personalWebSite/`. Solo Inicio y 404 están implementadas en Feature1. El mapa de navegación se mantiene en `src/data/navigation.ts`.

| Sección | Ruta relativa prevista | Contenido para su etapa |
| --- | --- | --- |
| Inicio | `/` | Presentación dummy, obra destacada y última entrada |
| Sobre mí | `/sobre-mi/` | Biografía dummy e indicación de fotografía pendiente |
| Proyectos | `/proyectos/` | Fichas de demostración y enlaces de prueba identificados |
| Juegos | `/juegos/` | Catálogo dummy y fichas con rutas internas de prueba |
| Blog | `/blog/` | Entradas Markdown de demostración, resumen y estado |
| Trayectoria | `/trayectoria/` | Hitos ficticios etiquetados como muestra |
| Contacto | `/contacto/` | Canales de prueba claramente identificados |

En la etapa de juegos, una ficha dummy podrá enlazar a `/juegos/demo-orbita/`, con un mensaje de demostración e instrucciones temporales. Es una ruta reservada: se implementará junto con la ficha para evitar enlaces rotos. El esqueleto no requiere desarrollar un juego real.

## Sustituciones antes de publicar

- Título provisional «Archivo orbital», presentación y textos en `site.config.mjs` y la portada.
- Descripciones temporales de secciones en `src/data/navigation.ts`.
- Biografía, hitos, fichas de proyectos, juegos, entradas del blog y contactos añadidos en siguientes Features.
- Cualquier imagen de muestra; las fotografías personales quedan pendientes de selección y autorización.
- Rutas y enlaces de prueba que no formen parte del sitio definitivo.
- Etiquetas de muestra y valor `isDemo`, tras comprobar que el contenido personal está aprobado.

Durante el desarrollo, la portada incluye el aviso «Versión de muestra» y los metadatos indican `noindex, nofollow`. La activación de publicación es una decisión independiente del push de una Feature.
