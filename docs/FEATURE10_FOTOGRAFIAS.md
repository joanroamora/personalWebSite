# Feature10 — Fotografías personales y Torque Trail

Rama `Feature10-fotografias`, creada desde `dev` con Feature9 integrada. Alcance autorizado inicial: incorporar las cuatro fotografías del propietario al diseño existente. Por petición posterior, la misma Feature añade el cuarto juego, Torque Trail, descrito en [TORQUE_TRAIL.md](TORQUE_TRAIL.md).

## Distribución

| Archivo recibido | Fuente normalizada | Uso |
| --- | --- | --- |
| `Foto Casual Joan Roa.jpg` | `src/assets/personal/joan-roa-casual.jpg` | Inicio: retrato junto a la presentación, con geometría orbital discreta al fondo |
| `Foto Profesional Joan Roa.png` | `src/assets/personal/joan-roa-retrato.png` | Sobre mí: sustituye el marcador de fotografía pendiente |
| `En el campus.jpg` | `src/assets/personal/en-el-campus.jpg` | Trayectoria: imagen de contexto después de Formación |
| `Ambiente Academico.jpg` | `src/assets/personal/ambiente-academico.jpg` | Trayectoria: segunda imagen de contexto después de Formación |

Los originales aportados se mueven desde `public/images/personal/` a `src/assets/personal/`. Se conserva su contenido y resolución. No se atribuyen las imágenes a universidades, ciudades o fechas concretas. La orientación reflejada de la foto de ambiente académico se mantiene como en el archivo recibido.

## Presentación y carga

`src/data/photos.ts` centraliza las fuentes, textos alternativos, pies y puntos de encuadre. `PersonalPhoto.astro` usa `Picture` de Astro con WebP y JPEG alternativo, calidad 80 y tamaños de 320, 480, 720 y 960 píxeles. `src/i18n/photos.ts` localiza los pies y textos alternativos en los cinco idiomas derivados; los nombres propios se conservan.

Los retratos usan marcos 4:5 y las imágenes de contexto conservan su proporción 4:3. Las dimensiones y el espacio están reservados antes de descargar la imagen. Inicio y Sobre mí priorizan su retrato; las fotos de Trayectoria se cargan de forma diferida. En móvil las fotos de contexto se apilan y en escritorio comparten dos columnas. No se añade JavaScript ni dependencia nueva.

Para cambiar una foto, reemplazar su fuente en `src/assets/personal/`, revisar su ficha en `src/data/photos.ts`, las traducciones y la referencia editorial de [PERFIL_PUBLICO.md](PERFIL_PUBLICO.md). Ejecutar `npm run verify` y revisar Inicio, Sobre mí y Trayectoria en móvil y escritorio.

## Validación realizada

La siguiente revisión corresponde al montaje inicial de las fotografías, antes de ampliar la Feature con el cuarto juego:

- `npm run verify`: 107 archivos sin diagnósticos, 34 pruebas correctas, 259 páginas generadas y comprobaciones de enlaces, metadatos y presupuestos aprobadas.
- 55 pruebas de Chromium en escritorio y móvil: perfil, idiomas, accesibilidad, navegación sin JavaScript, texto al 200 %, estabilidad de carga y presentación/pausa de Cadete Roa.
- Revisión visual de los retratos y de ambas fotos de contexto; carga correcta y ausencia de desbordamientos a 320, 390, 844 y 1280 píxeles, incluida orientación horizontal.
- 32 variantes generadas entre WebP y JPEG. Los WebP pesan entre 9 y 144 KB; no se descargan los originales de varios MB para mostrar las fotos.

Las comprobaciones móviles usan emulación de Chromium; la revisión editorial y en dispositivos físicos continúa formando parte de la candidata.

### Verificación de la ampliación con Torque Trail

`npm run verify` pasa con 115 archivos sin diagnósticos, 42 pruebas y 265 páginas estáticas. Las 24 pruebas de arcade y Torque Trail, más las 32 de Cadete Roa, perfil e idiomas, pasan en Chromium de escritorio y móvil. Se revisaron visualmente presentación, conducción, recuperación y orientación horizontal. El motor de Torque Trail y la sesión compartida suman aproximadamente 9,1 KB gzip de JavaScript, aislado en las rutas del juego.

## Flickr

El propietario proporcionó y autorizó [su perfil de Flickr](https://www.flickr.com/photos/137785611@N06/). Se incorpora en Contacto desde `PERFIL_PUBLICO.md`, con el enlace «Ver mis fotografías» traducido en los seis idiomas. Se revisa el digest del perfil conservando la biografía y las traducciones existentes. Las fotografías no se incrustan ni se cargan desde Flickr; se muestra el enlace público elegido.

## Alcance de la entrega

El propietario autorizó el commit, la integración en `dev` y el push de ambas ramas, conservando `Feature10-fotografias` en remoto. La publicación sigue pendiente de decisión. Se conservan los tres juegos anteriores y se añade Torque Trail; las muestras restantes del blog y los tres conceptos dummy siguen identificados. Los artefactos del servidor y las pruebas locales quedan excluidos de Git.
