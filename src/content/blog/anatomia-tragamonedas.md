---
title: 'Anatomía de una tragamonedas de bolsillo'
subtitle: 'Cómo la ingeniería de datos y la IA compiten por tu atención'
slug: anatomia-de-una-tragamonedas-de-bolsillo
date: '2026-10-18'
summary: 'Del gesto de actualizar el feed a los modelos que deciden qué aparece después: una mirada crítica a la ingeniería de la atención, sin confundir metáforas con neurociencia.'
status: published
series: Bajo el cristal
takeaway: 'Un recomendador no necesita saber qué sientes para aprender qué te hace volver. La decisión ética está en qué se mide, qué se recompensa y qué límites se respetan.'
cover:
  src: ../../assets/blog/tragamonedas-de-bolsillo.png
  alt: 'Ilustración de una persona en un café nocturno mirando un teléfono del que se despliega una cinta interminable de imágenes.'
  caption: 'Una escena contemporánea con lenguaje de cartel litográfico, inspirada en Toulouse-Lautrec. No reproduce una obra suya.'
tags:
  - Inteligencia artificial
  - Ingeniería de datos
  - Sociedad digital
---

Son las dos de la mañana. Ibas a mirar una sola cosa. El pulgar baja, la pantalla responde y aparece otra publicación. Después, otra. No has decidido quedarte una hora: has aceptado unos cientos de veces la invitación a permanecer unos segundos más.

El gesto de actualizar el feed tiene algo de palanca. A veces devuelve una conversación importante; otras, una tontería perfecta para ese momento. El siguiente contenido todavía no está a la vista. Esa pequeña incertidumbre es parte de la experiencia.

La comparación con una tragamonedas sirve para hacer una pregunta, no para diagnosticar una adicción: **¿qué ocurre cuando una interfaz aprende, a escala industrial, qué nos hace seguir buscando?** Detrás del cristal no hay una galería inocente ni una máquina que pueda leer la mente. Hay decisiones de producto, datos y modelos estadísticos.

## Desear no es lo mismo que disfrutar

La distinción entre *liking* y *wanting* ayuda a entender por qué buscar otra recompensa no siempre equivale a disfrutar la que acaba de llegar. La investigación de [Berridge y Robinson](https://pubmed.ncbi.nlm.nih.gov/27977239/) diferencia componentes del placer y de la motivación, y describe el papel de los sistemas dopaminérgicos en esta última. No reduce toda conducta a una sola sustancia.

La caja de condicionamiento de Skinner es una analogía útil para pensar en acciones y recompensas. Pero un usuario no es una rata de laboratorio, ni un feed reproduce por completo ese experimento. Entre ambos están la vida social, el contexto, las decisiones personales y muchas diferencias individuales. La metáfora ilumina una parte del problema; no es una explicación clínica completa.

## El pulgar se convierte en datos

No hace falta pulsar «me gusta» para producir una señal. [LinkedIn ha documentado](https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time) cómo usa el tiempo de permanencia, o *dwell time*, para mejorar la ordenación de su feed. Mirar y pasar de largo también pueden convertirse en información para un modelo.

Una aplicación puede instrumentar cuándo una tarjeta entra en pantalla, cuánto permanece visible o si un vídeo termina. Medir desplazamiento y tiempo también permite calcular una velocidad aproximada. Que algo sea técnicamente posible no demuestra que todas las plataformas lo registren, ni que lo hagan con la misma precisión.

Este registro ficticio muestra la idea; no es una captura real ni telemetría de esta web:

```json
{
  "event": "content_view",
  "content_id": "example-42",
  "visible_ms": 1840,
  "completed": false
}
```

En una arquitectura de ejemplo, los eventos viajan por una cola, un proceso de streaming calcula agregados y un servicio los deja disponibles para predecir. El modelo no necesita recorrer todo el historial cada vez: puede consultar variables ya preparadas. Un *online feature store*, como el que describe [Feast](https://docs.feast.dev/getting-started/components/online-store), sirve valores de características con baja latencia. No tiene por qué guardar todo en memoria ni conservar allí el historial completo.

Esto es telemetría de comportamiento. Llamarla «sensor biométrico» sin más sería impreciso: una pausa no es una medición de dopamina, una emoción identificada ni un diagnóstico.

## Dos puertas antes del próximo vídeo

Imagina una biblioteca demasiado grande para revisar cada libro antes de hacer una recomendación. Primero necesitas reunir candidatos; después, ordenarlos con más cuidado.

El artículo de [Covington, Adams y Sargin sobre YouTube, de 2016](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/) describe precisamente dos etapas: generación de candidatos y ranking, con modelos profundos separados. Es una arquitectura publicada en un momento concreto, no el plano universal de todas las redes actuales.

En la primera etapa, los *embeddings* representan información mediante vectores: coordenadas aprendidas que permiten buscar afinidades sin revisar cada elemento uno por uno. La [guía de recuperación de TensorFlow Recommenders](https://www.tensorflow.org/recommenders/examples/basic_retrieval) muestra un ejemplo de estas representaciones. Un universo enorme se convierte en una lista manejable. El ranking examina esa lista con más señales y asigna puntuaciones según los objetivos elegidos.

Una puntuación no expresa cuánto merece tu tiempo un contenido en sentido humano. Expresa lo que el sistema ha aprendido a predecir. Tampoco todos los rankings son una regresión logística ponderada: las arquitecturas y sus funciones de entrenamiento varían. **No es lo mismo predecir una acción que decidir si esa acción te beneficia.**

## El crupier matemático: explorar o repetir

Si un sistema solo muestra lo que ya funcionó, nunca aprende sobre intereses nuevos. Si prueba cosas diferentes todo el tiempo, puede resultar irrelevante. Ese equilibrio entre explotación y exploración es un problema técnico real.

Los *contextual bandits* ofrecen una forma de abordarlo. [Li y sus colaboradores](https://arxiv.org/abs/1003.0146) estudiaron la recomendación de noticias mediante este enfoque. LinUCB combina una estimación de recompensa con un margen de incertidumbre: puede merecer la pena probar una opción sobre la que todavía se sabe poco.

La recompensa es una definición de quien construye el sistema. Puede ser un clic, una lectura útil o alguna combinación de señales. No es una medida directa del bienestar. Explicar LinUCB tampoco autoriza a afirmar que una aplicación concreta lo use hoy, ni que controle todas sus recomendaciones y notificaciones.

## Cuando el teléfono decide avisar

Recomendar contenido y decidir cuándo enviar una notificación son problemas relacionados, pero distintos. [Air Traffic Controller, de LinkedIn](https://www.linkedin.com/blog/engineering/messaging-notifications/air-traffic-controller-member-first-notifications-at-linkedin), documenta decisiones sobre canal, momento y frecuencia, además de la agregación de avisos. También considera preferencias del usuario y el rechazo a recibir demasiados mensajes.

Agrupar notificaciones no es, por sí mismo, una trampa. Puede reducir interrupciones. También sería posible optimizar una política de avisos para provocar más regresos. Un modelo de abandono, o *churn prediction*, estima probabilidades de desconexión; no detecta con certeza el instante íntimo en que alguien ha decidido recuperar su noche.

La pregunta crítica es qué objetivo gobierna esa política y cuánto control conserva la persona. No basta con observar una ráfaga de avisos para demostrar una estrategia deliberada de manipulación.

## El problema está en lo que se recompensa

Las colas de eventos, los vectores y la predicción no son herramientas malvadas. Pueden ayudar a detectar fraude, encontrar información o descubrir una obra que de otro modo pasaría inadvertida. El conflicto aparece cuando una medida fácil de optimizar ocupa el lugar de todo lo que importa.

Si imaginamos un producto cuya única recompensa es prolongar la sesión, el cansancio del usuario no cuenta como coste mientras no afecte a esa cifra. Esta es una crítica a ese objetivo hipotético, no una descripción verificada de cada plataforma. Los sistemas reales pueden combinar satisfacción, seguridad, relevancia y negocio; corresponde examinar cómo equilibran esas metas y con qué resultados.

La conversación pública también entra en juego. El [estudio de Vosoughi, Roy y Aral publicado en *Science* en 2018](https://politics.media.mit.edu/papers/Vosoughi_Science.pdf) encontró, en su conjunto de rumores de Twitter de 2006 a 2017, que las noticias verdaderas tardaban unas seis veces más que las falsas en alcanzar a 1.500 personas. No significa que toda falsedad viaje siempre seis veces más rápido, ni demuestra por sí solo que un algoritmo decida un voto. Su alcance concreto ya es suficientemente inquietante.

## Una crítica fuerte no necesita exagerar la evidencia

No sería riguroso asegurar que deslizar el feed reduce físicamente los receptores D2 de cualquier persona o «apaga» su lóbulo frontal. Las fuentes citadas aquí no establecen esa cadena causal. Tampoco es correcto trasladar sin más resultados sobre sustancias o poblaciones clínicas a todo uso de redes sociales.

Eso no obliga a minimizar los riesgos. El [aviso del Surgeon General de Estados Unidos sobre redes sociales y salud mental juvenil](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html) señala tanto preocupaciones como lagunas de conocimiento. Asociación, mecanismo plausible y causalidad demostrada no son la misma cosa.

## Diseñar una salida también es diseñar

Una interfaz puede ofrecer un final, una pausa visible o avisos que respeten el descanso. Un recomendador puede dar más peso a lo que alguien considera valioso después de cerrar la aplicación, no solo a lo que hizo mientras estaba dentro. Nada de eso ocurre por arte de magia: requiere decidir qué se mide y aceptar límites.

> El éxito de una pantalla no debería medirse solo por lo difícil que resulta abandonarla.

La pregunta no es si podemos construir sistemas que aprendan de nosotros. Ya lo hacemos. La pregunta es para qué queremos que aprendan, quién puede revisar sus incentivos y si la persona al otro lado del cristal tiene una salida real.

## Fuentes y alcance

Este ensayo combina explicación técnica y opinión. Los enlaces junto a cada afirmación permiten distinguir documentación de ingeniería, investigación y valoración editorial. Los ejemplos de arquitectura son didácticos; no reconstruyen el sistema privado de una aplicación. La analogía de la tragamonedas no constituye un diagnóstico ni implica que cualquier uso frecuente sea una adicción.
