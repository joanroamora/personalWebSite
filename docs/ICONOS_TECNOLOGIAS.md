# Iconos de tecnologías

Los iconos se sirven desde `public/icons/technologies/`, sin CDN ni peticiones a servicios externos. El texto de la tecnología siempre permanece visible y los iconos son decorativos para lectores de pantalla.

## Fuentes

- [Devicon](https://github.com/devicons/devicon), revisión `6a37858047b0e8d9c9c0e68f4a071fc410652e89`, licencia MIT. La licencia original se conserva en `public/icons/technologies/LICENSE.devicon.txt`.
- [Simple Icons](https://github.com/simple-icons/simple-icons), revisión `4d29a35c954699b389a834aacc97dd6e7e74143c`, licencia CC0. Se utilizan Hugging Face, LangChain, VirtualBox y Google Gemini. La licencia original se conserva en `public/icons/technologies/LICENSE.simple-icons.txt`.
- El icono de OpenAI procede de Simple Icons, etiqueta `13.0.0`, también bajo CC0.

Los SVG se mantienen como recursos locales y no se instala una biblioteca de iconos. Las marcas pertenecen a sus respectivos titulares. Las versiones monocromas se aclaran mediante CSS para conservar contraste en el fondo oscuro; los iconos a color, como Python, conservan sus colores.

`src/data/technology-icons.ts` relaciona los nombres con los recursos. Para conceptos o herramientas sin un icono de marca en esta selección se emplean pictogramas geométricos de código, datos, voz, OCR, modelos o flujos; no se presentan como logotipos oficiales. Los pictogramas se dibujan en SVG en `TechnologyBadge.astro`.
