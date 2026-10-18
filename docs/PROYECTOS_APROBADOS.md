# Selección inicial de proyectos

El propietario autorizó 27 repositorios para las fichas de Proyectos durante Feature4. El resto del sitio conserva el contenido de demostración. Esta autorización de contenido no activa el despliegue del sitio ni cambia la visibilidad de ningún repositorio.

Las fichas se mantienen manualmente en `src/data/projects.ts`, en el orden recibido. Los títulos son nombres editoriales para la web; el subtítulo conserva exactamente el nombre del repositorio en GitHub. Las descripciones son resúmenes en español de los README o del código disponible, no citas ni declaraciones de producción. No se atribuyen resultados, métricas, garantías de cumplimiento ni demos desplegadas.

## Fuentes de las fichas

| Proyecto | Repositorio autorizado | Fuente para descripción y tecnologías |
| --- | --- | --- |
| AETHER RAG | [rag-document-intelligence](https://github.com/joanroamora/rag-document-intelligence) | README: consulta documental, recuperación híbrida, citas, FastAPI, Gemini, GCP y Terraform. |
| Kubernetes Internals Lab | [K8SLab2Architecture-Argo](https://github.com/joanroamora/K8SLab2Architecture-Argo) | README: laboratorio sobre VMs, Kubernetes, Argo CD, Terraform, Ansible e inspector de arquitectura. |
| Scout Pulse Engine | [scout-pulse-engine](https://github.com/joanroamora/scout-pulse-engine) | Descripción pública del repositorio: pipeline asíncrono multi-fuente, GCP, Ansible, NoSQL y Grafana. No tiene README disponible al revisar la selección. |
| realStateAux | [realStateAux](https://github.com/joanroamora/realStateAux) | README: asistente con OpenClaw, API FastAPI, datos de prueba e infraestructura GCP/Terraform. |
| pdfRoar | [pdfRoar](https://github.com/joanroamora/pdfRoar) | README: operaciones PDF, PyMuPDF, FastAPI, servicios e infraestructura AWS/Terraform. |
| GridFlow-TX | [gridflow-tx-portfolio](https://github.com/joanroamora/gridflow-tx-portfolio) | README: analítica ERCOT/BESS, Python, AWS, Terraform, Ansible y observabilidad. |
| VideoForge | [videoforge-mlops-aws](https://github.com/joanroamora/videoforge-mlops-aws) | README: generación de vídeo con LTX-Video, FastAPI, PyTorch, ECS y Terraform. |
| Operationalizing Fairness in AI | [operationalizing-fairness-ai](https://github.com/joanroamora/operationalizing-fairness-ai) | README: propuesta de arquitectura, código de apoyo, pruebas de equidad y explicabilidad en MLOps. SHAP y LIME se presentan como parte del marco propuesto. |
| LexShield | [LexShield](https://github.com/joanroamora/LexShield) | README: políticas de licencias, auditoría con Python/Jenkins/Docker e informes ReportLab. |

## Ampliación de la selección

| Título editorial | Repositorio | Fuente y alcance |
| --- | --- | --- |
| Boris · Expedientes bajo la lupa | [Boris-SuperS](https://github.com/joanroamora/Boris-SuperS) | README: extracción administrativa desde PDF con Flask, PyPDF2, Tesseract y OpenAI. Repositorio privado, identificado como tal. |
| VoxLab · Huellas de voz | [voiceClone](https://github.com/joanroamora/voiceClone) | Imports, nombres de funciones y dependencias de `clone_voice.py`: prototipo con PyTorch, Wav2Vec2 y ESPnet. README vacío. No se atribuye calidad de clonación validada. |
| Azure Pilot · La nube, en automático | [PyScript-Azure-Resource-Management-Automation](https://github.com/joanroamora/PyScript-Azure-Resource-Management-Automation) | README: SDK de Azure para recursos de cómputo, redes, SQL y almacenamiento, con registros y configuración por entorno. |
| Azure Atlas · Infraestructura por capas | [Azure-TerraformInfra](https://github.com/joanroamora/Azure-TerraformInfra) | README: Terraform, redes y separación de capas web/datos. Las estrategias de disponibilidad se presentan como diseño, sin garantías de producción. |
| CodeGate · Calidad antes del despliegue | [Jenkins-SonarQube-Docker](https://github.com/joanroamora/Jenkins-SonarQube-Docker) | README: Jenkins, SonarQube, Docker e integración con GitHub. |
| Soundprint · Anatomía de los ochenta | [MusicDataAnalysis](https://github.com/joanroamora/MusicDataAnalysis) | README: dataset musical, limpieza, escalado, valores atípicos y visualización con Python. |
| RankShift · La fragilidad de un ranking | [University-Risk-Analysis__Preprocessing-and-Monte-Carlo-Simulation](https://github.com/joanroamora/University-Risk-Analysis__Preprocessing-and-Monte-Carlo-Simulation) | README: simulación de cambios en rankings y preparación de datos. |
| Europa en perspectiva | [EuropePopulation2024---Dimensional-Analysis-and-MonteCarlo-Simulation](https://github.com/joanroamora/EuropePopulation2024---Dimensional-Analysis-and-MonteCarlo-Simulation) | README: datos 2013–2022, agrupación de años y escenarios de Monte Carlo hasta 2030. No son predicciones oficiales. |
| EchoBrief · De la voz a la idea | [AudioTranscription-SummaryPipeline](https://github.com/joanroamora/AudioTranscription-SummaryPipeline) | README: extracción de audio, Vosk, resumen con Transformers e interfaz Flask. |
| Voz de tinta | [textToAudio-ParlerTTS](https://github.com/joanroamora/textToAudio-ParlerTTS) | README: síntesis con texto y descripción de voz, selección GPU/CPU y salida WAV. |
| Audio a palabras | [m4u-To-Text-Converter](https://github.com/joanroamora/m4u-To-Text-Converter) | README: conversión M4A/WAV y transcripción en fragmentos con Google Speech Recognition. |
| TerraRAG · Los cimientos de una idea | [RAG-webApp-OpSource-IaaC-Terraform-Ansible](https://github.com/joanroamora/RAG-webApp-OpSource-IaaC-Terraform-Ansible) | Árbol de archivos y tipos de recursos Terraform. Solo se atribuye infraestructura AWS: VPC, subredes, rutas, NAT, seguridad y EC2; no se atribuye una app RAG o implementación de Ansible no presente. |
| Entre páginas · Preguntas con contexto | [RAG-OpenAI---pdf---paraphrase-multilingual-embeddings](https://github.com/joanroamora/RAG-OpenAI---pdf---paraphrase-multilingual-embeddings) | README: PDF, fragmentación, embeddings multilingües, LangChain, FAISS y OpenAI. |
| Horizonte 2050 · Energía por habitante | [Predictive_model_energy_consumption_per_capita_UNAD_project](https://github.com/joanroamora/Predictive_model_energy_consumption_per_capita_UNAD_project) | README: preparación de datos, regresión lineal e interfaz Flask. Contexto de proyecto aplicado de grado UNAD indicado expresamente por el propietario. |
| Semilla RAG · El primer índice | [langChainProject](https://github.com/joanroamora/langChainProject) | Imports de `main.py` y dependencias: PDF, fragmentación, Sentence Transformers y Chroma. No hay README. |
| Tinta visible · De imagen a texto | [textRecognizer](https://github.com/joanroamora/textRecognizer) | README: OCR con Tesseract, pytesseract y Pillow. |
| Linux al día | [ScriptLinuxMaintenance](https://github.com/joanroamora/ScriptLinuxMaintenance) | README: mantenimiento con Bash y consulta de información del sistema. |
| Primeras máquinas · Un laboratorio local | [VagrantFirst](https://github.com/joanroamora/VagrantFirst) | Metadatos y archivos de configuración de Vagrant, Ruby, shell y proveedor VirtualBox. No hay README. |

Las nueve fichas iniciales también reciben títulos editoriales y descripción ampliada. FairLens corresponde a `operationalizing-fairness-ai`. El contexto de Machine Learning Fundamentals en Indiana Wesleyan University, EE. UU., procede de la indicación del propietario; no se infieren títulos académicos ni fechas. El tratamiento de equidad, SHAP y LIME conserva el alcance de propuesta del README.

La API de GitHub identificó `Boris-SuperS` como privado y los otros 26 como públicos durante la revisión. El sitio indica cuándo el enlace requiere acceso. No se modificó la visibilidad de ningún repositorio ni se incorporaron secretos, archivos privados de configuración o contactos a las fichas.

## Mantenimiento

Para añadir un proyecto, agregar una ficha a `src/data/projects.ts` con `id` estable, `title`, `summary`, `description` (párrafos), `highlights`, `category`, `group`, `technologies`, `repository` y `order`. El nombre de GitHub se obtiene de la URL. `academic`, `repositoryVisibility`, `demo` e `image` son opcionales. Las imágenes locales llevan ruta, texto alternativo y dimensiones. Si la lista queda vacía, se muestra un estado editorial sin tarjetas.

El catálogo y los detalles se generan como HTML estático. El JavaScript de búsqueda, filtros y diálogo se carga solo en el catálogo. El diálogo usa el elemento nativo, mantiene el foco dentro, se cierra mediante botón, Escape o fondo y devuelve el foco a la tarjeta; se respeta movimiento reducido. Cada enlace de tarjeta apunta a una ruta propia que funciona sin JavaScript. Los iconos se sirven localmente. No se consulta la API ni se necesitan credenciales de GitHub durante el build o en el navegador.
