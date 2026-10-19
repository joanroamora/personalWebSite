# Instrucciones para Codex — sitio personal

## Estado y propósito

El trabajo autorizado consiste en construir el esqueleto de la web por etapas, con datos dummy claramente identificados. La información personal aprobada se incorporará al final, antes de la publicación. Seguir el alcance de cada Feature en `docs/PLAN_DE_CONSTRUCCION.md`.

La web es un espacio para mostrar quién es el propietario y su obra: código, minijuegos y textos. No es una página orientada a buscar empleo. Evitar mensajes comerciales, métricas inventadas, testimonios y llamadas a la acción como «Contrátame».

## Dirección visual

- Diseño minimalista, cuidado y contemporáneo, con temática alienígena y de ovnis sugerida mediante formas orbitales, halos, señales y geometría sutil. Evitar una estética recargada de ciencia ficción.
- Base oscura casi negra (`#080D10`), superficies verde petróleo (`#111D1D`), texto marfil frío (`#E8F0E9`), acento verde extraterrestre moderado (`#A7E88B`) y acento secundario cian tenue (`#83C7C5`). Ajustar los tonos al implementar, conservando contraste legible.
- Espacio en blanco generoso, tipografía clara, jerarquía editorial y detalles luminosos muy contenidos. El contenido debe ser el protagonista.
- Animaciones y transiciones entre páginas muy suaves, breves y coherentes; preferir desvanecimientos y movimientos mínimos. Sin efectos que retrasen la lectura o la interacción.
- Respetar `prefers-reduced-motion` y ofrecer navegación funcional aunque el navegador no admita transiciones.
- Preparar espacios para fotografías personales futuras. No inventar retratos ni colocar fotos de otras personas como sustitutos. Los marcadores visuales deben identificarse como temporales.

## Experiencia y navegación

Navegación principal, en este orden:

1. **Inicio** — presentación breve, una frase personal, obra destacada, última entrada y acceso claro a las secciones.
2. **Sobre mí** — biografía, intereses, enfoque creativo y futuras fotografías.
3. **Proyectos** — selección editorial de repositorios de GitHub. Cada proyecto puede mostrar nombre, descripción propia, tecnologías, imagen opcional y enlace al repositorio o demo. No mostrar todos los repositorios automáticamente ni dejar que datos externos dicten la narrativa.
4. **Juegos** — catálogo de minijuegos propios. Cada juego tendrá ficha, instrucciones breves y página o ruta propia para jugar.
5. **Blog** — índice de entradas y páginas de lectura. Facilitar la publicación de nuevas entradas sin modificar la navegación ni componentes.
6. **Trayectoria** — recorrido personal y creativo: hitos, aprendizajes y experiencias que el propietario decida compartir. Presentarlo como relato, no como CV de contratación.
7. **Contacto** — canales públicos elegidos por el propietario; de inicio bastan enlaces a correo o perfiles. No incluir formulario que dependa de un servidor si no se ha elegido una solución específica.

En escritorio, usar una cabecera compacta con enlaces visibles. En móvil, usar un menú accesible y fácil de abrir; mantener los nombres y el orden. Marcar la sección activa. Usar enlaces reales y rutas compartibles, no pestañas que oculten todo dentro de una sola URL.

## Tecnología y alojamiento

- Opción recomendada: **Astro con salida estática** y despliegue en **GitHub Pages mediante GitHub Actions**. Mantener el sitio prerenderizado y sin servidor.
- Usar componentes Astro para cabecera, navegación, pie, tarjetas, metadatos y diseño compartido. Reservar JavaScript del navegador para interacciones necesarias y para los juegos.
- Gestionar el blog como colección de archivos Markdown con metadatos estructurados. Cada entrada debe tener como mínimo título, fecha, resumen, estado de publicación y etiquetas opcionales. Preparar enlaces permanentes estables.
- Mantener los datos de proyectos y juegos en colecciones o archivos de datos independientes de las páginas. Añadir un proyecto, juego o entrada debe consistir principalmente en crear una ficha o archivo nuevo.
- Los minijuegos se desarrollarán como módulos JavaScript independientes, con recursos propios. Evitar que un juego cargue su código y sus imágenes en el resto del sitio.
- Para las transiciones, empezar con las transiciones nativas entre documentos cuando el soporte y la experiencia lo permitan. Evaluar el router de transiciones de Astro solo si mejora de forma verificable la navegación; probar especialmente la inicialización y limpieza de los juegos al entrar, salir y volver. Mantener una navegación normal como alternativa.
- Configurar correctamente `site` y, si corresponde, `base` para la URL concreta de GitHub Pages. No asumir un dominio propio.
- Objetivo de publicación: GitHub Pages, el servicio de páginas estáticas de GitHub, mediante GitHub Actions desde `main`. El despliegue se habilitará al aprobar la publicación mediante la variable de repositorio `PAGES_DEPLOY_ENABLED=true`.
- No instalar paquetes, CLI ni dependencias del proyecto de forma global. Declarar las dependencias en `package.json` y el lockfile, ejecutar los comandos mediante scripts o herramientas locales y hacer que GitHub Actions use esas mismas versiones.
- Usar el Node.js existente y las dependencias locales de `node_modules/`, excluidas de Git. Instalar de forma reproducible con `npm ci`; ejecutar `npm run verify` antes de subir una Feature.
- Crear las ramas `Feature<N>-<descripcion>` desde `dev` y usar el prefijo `Feature<N>: ` en los commits. La integración en `dev` o `main` requiere la decisión explícita del propietario.

## Organización prevista del proyecto

```text
src/
  components/          # navegación, tarjetas, elementos compartidos
  layouts/             # estructura visual y metadatos comunes
  pages/               # Inicio, Sobre mí, Proyectos, Juegos, Blog, Trayectoria, Contacto
  content/             # entradas de blog y fichas de contenido
  games/               # un directorio independiente por minijuego
  data/                # configuración de menú, enlaces y datos generales
  styles/              # variables visuales y estilos globales
public/
  images/              # fotografías e imágenes públicas aprobadas
  icons/               # iconos y elementos gráficos
.github/workflows/     # publicación automática en GitHub Pages
```

La estructura exacta puede adaptarse a la versión de Astro elegida, pero conservar la separación entre contenido, presentación y juegos. Centralizar las rutas y los elementos del menú para que una sección nueva no requiera editar varias páginas.

## Calidad para la primera versión

- Diseñar primero para pantallas pequeñas y ampliar con cuidado a escritorio. Verificar tamaños intermedios, orientación horizontal y navegación táctil.
- Mantener buen contraste, estados de foco visibles, navegación por teclado, textos alternativos y HTML semántico.
- Priorizar carga rápida: imágenes optimizadas y de tamaño apropiado, fuentes limitadas, JavaScript mínimo fuera de los juegos y animaciones basadas en propiedades eficientes.
- Evitar dependencias innecesarias, rastreadores y servicios de pago. Los enlaces externos deben abrir destinos reales y tener nombres claros.
- No inventar datos biográficos, experiencia, proyectos, publicaciones, fotografías ni enlaces. Si faltan, utilizar contenido de muestra claramente marcado durante el desarrollo y retirarlo antes de publicar.
- Antes de publicar, revisar el sitio en móvil y escritorio; comprobar navegación, transiciones, accesibilidad básica, páginas del blog y funcionamiento aislado de cada juego.

## Información del propietario

La fuente principal de información personal es `docs/PERFIL_PUBLICO.md`, aportada por el propietario. Consultarla para sustituir los datos dummy y para cualquier actualización del contenido personal. El documento se mantiene junto a los demás Markdown de referencia en `docs/`. Conviene incluir:

- Nombre o seudónimo visible, pronombres si se desean e idioma del sitio.
- Presentación corta (una o dos frases) y biografía larga.
- Temas creativos, intereses y tono de voz deseado.
- Hitos para «Trayectoria», con fechas solo si el propietario quiere mostrarlas.
- Repositorios seleccionados, con una breve explicación personal de cada uno.
- Juegos que se quieran publicar y su estado.
- Primeras ideas o textos para el blog.
- Canales de contacto públicos y perfiles sociales autorizados.
- Fotos elegidas, texto alternativo y preferencias de uso.
- Qué datos **no** deben mostrarse.

No incluir direcciones privadas, teléfonos privados, claves, tokens ni información sensible en ese archivo si va a subirse a un repositorio público. Un borrador privado puede existir fuera del repositorio, pero solo trasladar al sitio lo aprobado para publicación.

## Referencias técnicas para la futura implementación

- [Astro: despliegue en GitHub Pages](https://docs.astro.build/es/guides/deploy/github/)
- [Astro: colecciones de contenido](https://docs.astro.build/en/guides/content-collections/)
- [Astro: transiciones entre vistas](https://docs.astro.build/en/guides/view-transitions/)
