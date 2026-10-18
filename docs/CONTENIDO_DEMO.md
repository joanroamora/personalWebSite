# Inventario del esqueleto y contenido dummy

Inicio, Sobre mí, Trayectoria y Contacto ya utilizan la información real de [PERFIL_PUBLICO.md](PERFIL_PUBLICO.md), incorporada por petición del propietario en la misma rama de Feature7. Los proyectos corresponden a la selección aprobada y Cadete Roa es un prototipo jugable. El blog, tres conceptos de juegos y la fotografía pendiente conservan sus avisos de muestra o de contenido pendiente.

## Mapa de secciones

Las rutas comparten la base `/personalWebSite/`. El mapa de rutas se mantiene en `src/data/navigation.ts`. El contenido personal se lee del Markdown mediante `src/data/profile.ts`; no hay una segunda copia de la biografía en TypeScript.

| Sección | Ruta relativa | Contenido para su etapa |
| --- | --- | --- |
| Inicio | `/` | Presentación real, pdfRoar destacado y última entrada demo identificada |
| Sobre mí | `/sobre-mi/` | Biografía, ámbitos y herramientas reales; fotografía pendiente |
| Proyectos | `/proyectos/` | 27 repositorios reales seleccionados por el propietario, con detalles y contexto académico aprobado |
| Juegos | `/juegos/` | Cadete Roa jugable en desarrollo y tres fichas de muestra con rutas propias |
| Blog | `/blog/` | Entradas Markdown de demostración, resumen y estado |
| Trayectoria | `/trayectoria/` | Experiencias, formación y certificaciones proporcionadas por el propietario |
| Contacto | `/contacto/` | Correo, LinkedIn, GitHub y ubicación general autorizados |

Feature6 incorpora `/juegos/cadete-roa/` como prototipo jugable autorizado. Las rutas `/juegos/orbita-de-bolsillo/`, `/juegos/senal-perdida/` y `/juegos/jardin-lunar/` son conceptos de muestra en desarrollo: no contienen un juego ni un botón falso de jugar. Sus títulos y descripciones son temporales. Datos en `src/data/games.ts`; mantenimiento en `JUEGOS.md`.

## Entrega original de Feature3 — sustituida en Feature7

Los siguientes puntos describen la entrega histórica. Sus datos personales ficticios y destinos de prueba ya se retiraron, al igual que el archivo de datos dummy y el componente de paneles vacíos; son recuperables desde el historial Git. La fotografía pendiente mantiene su identificación. El estado actual figura en la tabla anterior.

- **Inicio:** presentación ficticia y frase sin atribución; espacios vacíos de obra destacada y última entrada que enlazan a los índices existentes. No hay proyectos ni publicaciones inventados.
- **Sobre mí:** biografía, tres intereses y enfoque creativo ficticios; aviso explícito de muestra. `PhotoPlaceholder.astro` reserva una fotografía mediante geometría y un pie que indica «Marcador temporal», sin cargar una imagen ni simular un retrato.
- **Trayectoria:** tres capítulos ficticios numerados, con aprendizajes de muestra y sin fechas, empresas o credenciales.
- **Contacto:** los enlaces de correo y perfil llevan a `/contacto/#correo-de-muestra` y `/contacto/#perfil-de-muestra` bajo la base de Pages. Los destinos indican que son pruebas; no se abre un cliente de correo, se envían mensajes ni se enlaza una cuenta personal.
- **Componentes:** los avisos visibles de `DemoNotice.astro` y el encabezado de `PageIntro.astro` acompañan a las páginas personales. Proyectos, Juegos y Blog tienen índices propios.

## Entrega de Feature5

El blog contiene tres textos ficticios y fechas de muestra en `src/content/blog/`: «Lo pequeño también tiene gravedad», «Un juego empieza antes de la primera partida» y «Dejar una idea por escrito». Todos usan `status: demo`, con aviso visible en índice y lectura. Inicio muestra automáticamente la última entrada visible, también identificada como muestra. `borrador-de-muestra.md` usa `status: draft` y no genera ninguna página ni aparece en los índices.

Las demos se excluyen de rutas, índice, navegación entre entradas e Inicio al cambiar `siteConfig.isDemo` a `false`. Retirar o sustituir los textos demo durante la etapa de contenido. No atribuirlos al propietario ni convertirlos en publicaciones reales cambiando únicamente su estado. La plantilla está fuera de la colección, en `docs/plantillas/entrada.md`. Ver [BLOG.md](BLOG.md).

La información personal ya se incorporó usando `docs/PERFIL_PUBLICO.md`. Se conservan las fechas, experiencias y resultados aportados por el propietario. Inicio usa un párrafo de su biografía en vez de inventar una frase personal. El mantenimiento de esta fuente se explica en [CONTENIDO_PERSONAL.md](CONTENIDO_PERSONAL.md).

## Sustituciones antes de publicar

Las fichas de proyectos y la información personal ya están aprobadas para mostrarse y no se consideran dummy. Mantener esos contenidos al retirar las muestras restantes.

- Sustituir o retirar las tres entradas demo del blog y su borrador de prueba.
- Decidir qué hacer con los tres conceptos dummy de juegos.
- Incorporar fotografías aprobadas y textos alternativos, o retirar su marcador si no se usará una fotografía.
- Revisar personalmente los datos reales renderizados, incluidos contactos, fechas y resultados de la fuente.
- Retirar las etiquetas de vista previa y cambiar `isDemo` cuando no quede contenido de muestra por revisar.

Durante el desarrollo, la cabecera indica «Vista previa» y los metadatos conservan `noindex, nofollow`. La activación de publicación es una decisión independiente del push de una Feature.

Feature8 mantiene las mismas muestras en las seis versiones de idioma; traducir su interfaz y resúmenes no las convierte en publicaciones o juegos reales. Los cuerpos de entradas demo y descripciones extensas de proyectos conservan el original español identificado mientras se revisa la localización completa. La lista de decisiones está en [REVISION_CANDIDATA.md](REVISION_CANDIDATA.md).
