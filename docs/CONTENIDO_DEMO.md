# Inventario del esqueleto y contenido dummy

Este inventario permite construir con textos de muestra identificados en la interfaz; no describen al propietario. La excepción aprobada durante Feature4 es la selección real de Proyectos, documentada en `PROYECTOS_APROBADOS.md`. Las demás secciones siguen con contenido dummy. `PERFIL_PUBLICO.md` se incorporará en la etapa 9.

## Mapa de secciones

Las rutas comparten la base `/personalWebSite/`. Feature1 implementa Inicio y 404; Feature2 añade las otras seis páginas y la navegación completa. Feature3 desarrolla las cuatro páginas personales con contenido de muestra separado en `src/data/personal-demo.ts`. El mapa de rutas se mantiene en `src/data/navigation.ts`.

| Sección | Ruta relativa | Contenido para su etapa |
| --- | --- | --- |
| Inicio | `/` | Presentación dummy, obra destacada y última entrada |
| Sobre mí | `/sobre-mi/` | Biografía dummy e indicación de fotografía pendiente |
| Proyectos | `/proyectos/` | 27 repositorios reales seleccionados por el propietario, con detalles y contexto académico aprobado |
| Juegos | `/juegos/` | Catálogo dummy y fichas con rutas internas de prueba |
| Blog | `/blog/` | Entradas Markdown de demostración, resumen y estado |
| Trayectoria | `/trayectoria/` | Hitos ficticios etiquetados como muestra |
| Contacto | `/contacto/` | Canales de prueba claramente identificados |

En la etapa de juegos, una ficha dummy podrá enlazar a `/juegos/demo-orbita/`, con un mensaje de demostración e instrucciones temporales. Es una ruta reservada: se implementará junto con la ficha para evitar enlaces rotos. El esqueleto no requiere desarrollar un juego real.

## Entrega de Feature3

- **Inicio:** presentación ficticia y frase sin atribución; espacios vacíos de obra destacada y última entrada que enlazan a los índices existentes. No hay proyectos ni publicaciones inventados.
- **Sobre mí:** biografía, tres intereses y enfoque creativo ficticios; aviso explícito de muestra. `PhotoPlaceholder.astro` reserva una fotografía mediante geometría y un pie que indica «Marcador temporal», sin cargar una imagen ni simular un retrato.
- **Trayectoria:** tres capítulos ficticios numerados, con aprendizajes de muestra y sin fechas, empresas o credenciales.
- **Contacto:** los enlaces de correo y perfil llevan a `/contacto/#correo-de-muestra` y `/contacto/#perfil-de-muestra` bajo la base de Pages. Los destinos indican que son pruebas; no se abre un cliente de correo, se envían mensajes ni se enlaza una cuenta personal.
- **Componentes:** los avisos visibles de `DemoNotice.astro` y el encabezado de `PageIntro.astro` acompañan a las páginas personales. Proyectos, Juegos y Blog mantienen `SectionPlaceholder.astro`.

En la etapa 9 se sustituirán tanto los datos de `personal-demo.ts` como los títulos y textos temporales de los componentes personales y de Inicio. También se reemplazarán los destinos de contacto por los canales públicos aprobados y los espacios vacíos de Inicio por la selección real de obra y entradas.

## Sustituciones antes de publicar

Las fichas de `src/data/projects.ts` y sus enlaces están aprobados para mostrarse y no se consideran dummy. Mantener esta selección al retirar el contenido de muestra. Inicio conserva su espacio reservado de obra destacada hasta elegir una pieza para la portada.

- Título provisional «Archivo orbital», presentación y textos en `site.config.mjs` y la portada.
- Descripciones temporales de secciones en `src/data/navigation.ts`.
- Texto «Esta sección está tomando forma» y paneles de `src/components/SectionPlaceholder.astro`.
- Textos ficticios en `src/data/personal-demo.ts`, encabezados y textos de apoyo en Inicio y `src/components/personal/`.
- Marcador `PhotoPlaceholder.astro` y destinos internos de contacto de Feature3.
- Biografía, hitos, fichas dummy de juegos, entradas de muestra del blog y contactos añadidos en siguientes Features.
- Cualquier imagen de muestra; las fotografías personales quedan pendientes de selección y autorización.
- Rutas y enlaces de prueba que no formen parte del sitio definitivo.
- Etiquetas de muestra y valor `isDemo`, tras comprobar que el contenido personal está aprobado.

Durante el desarrollo, la portada incluye el aviso «Versión de muestra» y los metadatos indican `noindex, nofollow`. La activación de publicación es una decisión independiente del push de una Feature.
