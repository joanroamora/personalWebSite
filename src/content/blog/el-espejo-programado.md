---
title: El espejo programado
subtitle: 'Visión por computadora, mallas 3D y el negocio de la inseguridad'
slug: el-espejo-programado
date: '2026-10-18'
summary: 'Los filtros no solo cambian una imagen: pueden cambiar el punto desde el que nos comparamos. Así se conectan la geometría facial, la recomendación y la publicidad personalizada.'
status: published
series: Bajo el cristal
takeaway: 'Una malla puede modificar una cara en pantalla. Que esa versión termine convertida en una obligación es una decisión cultural y comercial, no una necesidad de la tecnología.'
cover:
  src: ../../assets/blog/el-espejo-programado.png
  alt: 'Ilustración de una mujer mirando su reflejo artificial en un teléfono, con una malla facial geométrica y etiquetas comerciales sin texto.'
  caption: 'Un espejo contemporáneo imaginado con la textura y las formas del cartel litográfico de Toulouse-Lautrec. Imagen original, no una obra del pintor.'
tags:
  - Visión por computadora
  - Imagen corporal
  - Sociedad digital
---

Camina por una calle y mira alrededor. Hay pieles con textura, cuerpos distintos, rostros cansados, sonrisas torcidas. La luz cambia y nadie lleva un filtro perfectamente adherido a la cara. La diversidad no necesita una explicación: está ahí.

Abre después una red social. En pocos movimientos del dedo puede aparecer un desfile de imágenes seleccionadas, iluminadas, editadas y, a veces, modificadas de formas difíciles de reconocer. No estás mirando una muestra aleatoria de la humanidad. Estás mirando una selección de una selección.

El problema no es que exista una imagen bonita. Es que una imagen fabricada termine funcionando como regla para evaluar un cuerpo que tiene que vivir fuera de la pantalla. Y que, alrededor de esa comparación, haya un mercado dispuesto a vender correcciones.

## La cirugía que ocurre en la imagen

Un filtro puede empezar con algo tan sencillo como localizar una cara. Para seguirla cuando gira o cambia de expresión necesita una representación más rica.

La documentación de [MediaPipe Face Landmarker](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker) ofrece un ejemplo público: modelos que detectan rostros, estiman puntos faciales tridimensionales y producen información para representar expresiones y aplicar transformaciones. No es el código de todos los filtros, pero permite entender la mecánica.

Un recorrido simplificado sería este:

1. **Localizar:** identificar la región del rostro dentro del fotograma.
2. **Estimar:** colocar puntos de referencia y relacionarlos con una geometría facial.
3. **Transformar:** utilizar esa representación para situar o deformar un efecto.
4. **Representar:** componer la imagen modificada y repetir el proceso con los siguientes fotogramas.

Estrechar visualmente una nariz o ampliar unos ojos puede implicar deformar coordenadas; suavizar la piel puede añadir otros procesos sobre su textura. No todos los filtros utilizan la misma técnica, y una malla estimada no es un escaneo clínico. La transformación afecta a la imagen: no al cuerpo que está delante de la cámara.

La precisión visual tiene una consecuencia cultural: cuanto menos evidente resulta el retoque, más fácil es olvidar que está ahí. Lo artificial puede empezar a parecer cotidiano, y lo cotidiano, insuficiente.

## Compararse con una muestra imposible

La comparación social ascendente ocurre cuando tomamos como referencia a alguien que percibimos por encima de nosotros en un aspecto. En apariencia física, una selección de imágenes idealizadas puede inclinar esa referencia sin que lo advirtamos.

En un [experimento sobre fotografías de Instagram manipuladas y la imagen corporal de chicas adolescentes](https://www.tandfonline.com/doi/abs/10.1080/15213269.2016.1257392), Kleemans y sus colaboradoras observaron efectos negativos sobre la imagen corporal tras la exposición a fotografías modificadas, especialmente entre participantes con mayor tendencia a compararse. El estudio no equivale a demostrar una enfermedad ni a describir a todas las personas que usan filtros. Su diseño y su población delimitan lo que podemos concluir.

Hay una diferencia importante entre disfrutar un personaje digital y sentir que esa versión es la cara que deberíamos tener siempre. La misma herramienta puede participar en experiencias muy distintas.

## Del contenido al escaparate

El feed y la publicidad pueden compartir información sobre intereses e interacciones, aunque no sean el mismo sistema. Uno decide qué contenido recomendar; otro selecciona oportunidades comerciales entre anuncios y sus condiciones de entrega.

La [descripción de Andromeda publicada por Meta](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/) explica una etapa de recuperación personalizada de anuncios dentro de un sistema de varias fases. La ingeniería busca reducir un catálogo enorme a candidatos relevantes con restricciones de latencia. Después intervienen otras decisiones de ordenación y entrega. No hace falta suponer un único algoritmo omnipotente para entender el valor económico de predecir intereses.

Como contexto adicional, Meta también describe [modelos publicitarios que aprenden de secuencias de interacciones](https://engineering.fb.com/2024/11/19/data-infrastructure/sequence-learning-personalized-ads-recommendations/). El historial puede convertirse en una señal para futuras predicciones. Esto documenta personalización, no lectura directa del estado de ánimo.

Una subasta añade la competencia entre anunciantes por una oportunidad de aparecer. No tiene por qué ganar simplemente quien ofrece más dinero: la [explicación de Google Ads para sus búsquedas](https://support.google.com/google-ads/answer/142918?hl=en), por ejemplo, combina puja, calidad y contexto en la clasificación. Es un producto distinto, no la fórmula de un feed social; ilustra por qué recuperar candidatos, ordenarlos y decidir una entrega son piezas diferentes de una misma cadena comercial.

Imagina ahora una secuencia posible: una persona consume contenido sobre una transformación corporal y después ve publicidad de productos relacionados. Esa proximidad puede reforzar la impresión de que su cuerpo es un problema pendiente de compra. **Es un riesgo interpretativo y de diseño; la secuencia, por sí sola, no prueba que el sistema haya detectado tristeza ni decidido explotarla.**

## Una pausa no es una emoción descifrada

Los sistemas pueden utilizar señales como la permanencia ante una publicación; [LinkedIn documenta ese uso en su feed](https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time). Pero una pausa admite muchas explicaciones: interés, desacuerdo, sorpresa, una distracción o simplemente haber dejado el teléfono sobre la mesa.

Por eso sería excesivo afirmar que un algoritmo reconoce el instante exacto en que una comparación deprime a alguien y coloca un anuncio como respuesta consciente. Un modelo puede estimar una probabilidad de interacción o compra sin saber qué siente esa persona. La opacidad y el poder comercial merecen escrutinio; atribuirles certeza psicológica no los explica mejor.

## Cuando el filtro se convierte en exigencia

En 2018, [Rajanala, Maymone y Vashi](https://pubmed.ncbi.nlm.nih.gov/30073294/) llamaron la atención sobre pacientes que deseaban parecerse a versiones filtradas de sus propias fotografías. La expresión «dismorfia de Snapchat» nombra esa preocupación en la discusión clínica y pública. No debe confundirse con un diagnóstico independiente ni usarse para etiquetar a cualquiera que quiera verse mejor en una foto.

El trastorno dismórfico corporal es un asunto clínico serio, no un adjetivo para describir vanidad. También sería irresponsable atribuir toda depresión juvenil o toda preocupación muscular a los filtros. La salud mental tiene múltiples factores; el [aviso del Surgeon General sobre redes sociales y jóvenes](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html) plantea riesgos y reconoce incertidumbres, no una causa única para cada caso.

Lo que sí podemos discutir sin diagnosticar a nadie es el incentivo comercial: si una experiencia insiste en señalar una supuesta carencia y coloca al lado algo que promete remediarla, hay una relación que merece ser examinada. La frase «fabricar la herida y vender el vendaje» expresa aquí una crítica editorial a ese patrón; no una intención demostrada de todas las empresas o de cada ingeniero.

## La tecnología no obliga a elegir este negocio

La visión por computadora también permite crear herramientas de accesibilidad, efectos artísticos y sistemas de apoyo en contextos sanitarios. Compartir una familia de técnicas no vuelve equivalentes sus riesgos ni garantiza que cualquier aplicación médica sea fiable. Importan la finalidad, la validación y las condiciones de uso.

Podemos imaginar filtros que revelen sus cambios en lugar de ocultarlos, recomendaciones que amplíen la diversidad visible y publicidad que no convierta una característica corporal en un defecto que deba corregirse. Son decisiones de diseño y de responsabilidad, no límites impuestos por una malla de puntos.

También necesitamos separar el juego de la obligación: experimentar con una cara digital no debería exigir que la cara real se disculpe por existir.

> El rostro que necesita una explicación es el del filtro, no el tuyo.

La cuestión no es prohibir el espejo ni renunciar a la imaginación. Es poder reconocer cuándo estamos mirando una construcción, quién se beneficia de convertirla en norma y qué espacio queda para salir a la calle sin sentir que llevamos una versión incompleta de nosotros mismos.

## Fuentes y alcance

Este es un ensayo de divulgación y opinión, no una evaluación clínica. La documentación técnica muestra posibilidades y arquitecturas concretas, no el funcionamiento privado de todos los filtros o plataformas. Los estudios citados tienen poblaciones y métodos delimitados; no justifican diagnosticar a una persona por su actividad en redes ni establecer una causa única de su malestar.
