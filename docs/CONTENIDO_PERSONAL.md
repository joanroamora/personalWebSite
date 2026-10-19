# Información personal: una sola fuente

Por autorización del propietario, la incorporación de sus datos forma parte de `Feature7-calidad-esqueleto`. La fuente es [PERFIL_PUBLICO.md](PERFIL_PUBLICO.md), leída durante la construcción estática. No hay un servidor de datos ni consultas a servicios externos.

## Editar el contenido

Modificar el Markdown fuente, conservando sus encabezados y las etiquetas de los campos. `src/utils/profile.ts` valida y extrae los apartados; `src/data/profile.ts` los ofrece a los componentes. La configuración lee el mismo documento para la identidad y la descripción generales. No es necesario repetir la biografía ni los contactos en TypeScript.

| Apartado de la fuente | Uso en la web |
| --- | --- |
| Identidad y criterio editorial → Nombre visible | Marca, títulos y pie |
| Presentación → Perfil e Introducción breve | Descripción general y portada |
| Sobre mí | Biografía y perspectiva personal de Inicio |
| Ámbitos en los que he aplicado la tecnología | Ámbitos de Sobre mí |
| Lo que hago | Infraestructura, confiabilidad y proyectos propios |
| Experiencia profesional | Recorrido cronológico en Trayectoria |
| Proyectos destacados | Selección editorial; el primero aparece en Inicio |
| Tecnologías y herramientas | Herramientas agrupadas con los iconos disponibles |
| Formación y Certificaciones | Secciones correspondientes de Trayectoria |
| Contacto | Correo, LinkedIn, GitHub, ubicación e invitación |

Las fechas y los resultados se conservan como los proporcionó el propietario, dentro de su relato. Los títulos de presentación son parte del diseño. No se creó una frase personal nueva: Inicio utiliza un párrafo de la biografía aportada.

Los proyectos destacados deben corresponder a fichas de `src/data/projects.ts`. Se resuelven por nombre del repositorio o título editorial. Una selección sin coincidencia única detiene el build. Se conserva el catálogo completo de 27 proyectos.

El lector no ejecuta HTML del documento. Una sección obligatoria ausente o un enlace de contacto fuera de `mailto:` y HTTPS impide generar información incompleta. Mantener las etiquetas `Nombre visible`, `Ubicación`, `Correo`, `LinkedIn` y `GitHub`; las fichas de formación y certificación conservan su título en negrita. Los cambios en la configuración general pueden requerir reiniciar el servidor de desarrollo; cada build vuelve a leer la fuente.

Feature10 permite añadir `- **Flickr:** [nombre visible](URL HTTPS aprobada)` dentro de Contacto. Es un canal opcional: aparece automáticamente al proporcionar la URL real en la fuente. No se deduce el nombre de cuenta a partir de GitHub ni se añade un enlace de muestra. Como modifica los canales del perfil, revisar también el digest de `src/i18n/profile.ts` al incorporar la dirección.

El enlace aprobado a `flickr.com/photos/137785611@N06/` ya está incorporado en Feature10. Se presenta como «Ver mis fotografías», con traducciones en los seis idiomas. No se descargan ni se incrustan fotos externas.

## Revisar el resultado

Ejecutar desde la raíz `npm run verify` y `npm run test:e2e`. Las pruebas comprueban el lector, la correspondencia entre la fuente y las páginas, los contactos, la accesibilidad y los tamaños de pantalla. Los contactos se verifican por sus destinos, sin enviar mensajes ni abrir el correo.

La web sigue en vista previa y con `noindex`. Las entradas demo y los juegos dummy conservan su identificación. Las fotografías aprobadas se incorporan en Feature10. Incorporar contenido personal no activa GitHub Pages: siguen vigentes las reglas de integración y publicación del proyecto.

## Versiones de idioma — Feature8

El Markdown español continúa siendo la fuente de hechos. Las traducciones de `src/i18n/profile.ts` están ligadas a una revisión del perfil: después de modificar datos, revisar también sus cinco traducciones y actualizar el digest solo al finalizar esa revisión. Si los datos cambian sin revisar las traducciones, el build se detiene para evitar publicar versiones incoherentes. No se modifican ni traducen las direcciones de contacto. Ver [IDIOMAS.md](IDIOMAS.md) y [REVISION_CANDIDATA.md](REVISION_CANDIDATA.md).

## Fotografías — Feature10

Las cuatro fotos aportadas están en `src/assets/personal/`. `src/data/photos.ts` contiene sus fichas; `PersonalPhoto.astro` genera versiones WebP y JPEG adaptables durante el build. Inicio muestra el retrato casual, Sobre mí el formal y Trayectoria las dos fotos de contexto. Los textos alternativos y pies tienen versiones en los seis idiomas del sitio. El apartado de fotografías de `PERFIL_PUBLICO.md` registra la selección editorial; el lector de biografía no cambia. Ver [FEATURE10_FOTOGRAFIAS.md](FEATURE10_FOTOGRAFIAS.md).
