// Selección aprobada por el propietario. Se mantiene manualmente: no consulta GitHub.
// Las fuentes y el alcance de las descripciones están en docs/PROYECTOS_APROBADOS.md.
export interface Project {
  id: string;
  title: string;
  summary: string;
  description: readonly string[];
  highlights: readonly string[];
  group: 'ai' | 'data' | 'cloud' | 'tools';
  academic?: { institution: string; context: string };
  repositoryVisibility?: 'public' | 'private';
  category: string;
  technologies: readonly string[];
  repository: string;
  order: number;
  demo?: { url: string; label: string };
  image?: { path: string; alt: string; width: number; height: number };
}

export const projects: readonly Project[] = [
  {
    id: 'rag-document-intelligence',
    title: 'AETHER · Inteligencia documental',
    summary: 'Procesamiento y consulta de documentos con recuperación híbrida y respuestas acompañadas de citas. Separa la evidencia encontrada de las inferencias y los pasajes inciertos.',
    category: 'IA documental',
    group: 'ai',
    description: [
      'Un archivo puede contener muchas respuestas y seguir siendo difícil de consultar. AETHER conecta la recepción y el procesamiento de documentos con un sistema de recuperación híbrida que combina búsqueda semántica y coincidencias léxicas.',
      'La generación conserva referencias a los fragmentos utilizados y distingue entre texto observado, pasajes inciertos e hipótesis. La arquitectura reúne FastAPI, Gemini y servicios de GCP, con infraestructura declarada en Terraform y aislamiento por proyecto y organización.',
    ],
    highlights: ['Recuperación semántica y léxica en una misma consulta.', 'Respuestas con citas y separación entre evidencia e inferencia.', 'Procesamiento documental y despliegue definidos como módulos.'],
    technologies: ['Python', 'FastAPI', 'Gemini', 'GCP', 'Terraform'],
    repository: 'https://github.com/joanroamora/rag-document-intelligence',
    order: 1,
  },
  {
    id: 'k8s-architecture-lab',
    title: 'Órbita Kubernetes',
    summary: 'Un laboratorio para inspeccionar, romper y reparar los componentes de Kubernetes. Combina un clúster sobre máquinas virtuales con Argo CD y un visualizador de su arquitectura.',
    category: 'Infraestructura · GitOps',
    group: 'cloud',
    description: [
      'Un laboratorio para mirar Kubernetes por dentro. El clúster vive en máquinas virtuales de Compute Engine y se configura con kubeadm, de modo que sus componentes se puedan inspeccionar directamente: el control plane, los nodos, la red y el almacenamiento de estado.',
      'Terraform prepara la infraestructura y Ansible configura las máquinas. Argo CD introduce el flujo GitOps y un inspector de arquitectura ayuda a relacionar las piezas del sistema. El recorrido incluye experimentar con fallos y reconstruir el entorno.',
    ],
    highlights: ['Clúster sobre VMs con kubeadm, containerd y Flannel.', 'Aprovisionamiento con Terraform y Ansible.', 'Argo CD e inspector visual de la arquitectura.'],
    technologies: ['Kubernetes', 'Argo CD', 'Terraform', 'Ansible', 'GCP'],
    repository: 'https://github.com/joanroamora/K8SLab2Architecture-Argo',
    order: 2,
  },
  {
    id: 'scout-pulse-engine',
    title: 'Scout · Señales entre el ruido',
    summary: 'Pipeline modular de investigación y extracción de datos desde YouTube, Reddit y la web. Plantea procesamiento asíncrono, almacenamiento NoSQL y observabilidad con Grafana.',
    category: 'Datos · Investigación',
    group: 'data',
    description: [
      'La investigación digital suele comenzar con información repartida entre plataformas. Scout plantea un pipeline modular y asíncrono para reunir datos de YouTube, Reddit y sitios web dentro de un mismo flujo de extracción.',
      'El planteamiento conecta despliegue en GCP, automatización mediante Ansible, almacenamiento NoSQL y observabilidad con Grafana. Es una exploración de cómo pasar de fuentes dispersas a un flujo de investigación organizado.',
    ],
    highlights: ['Extracción desde varias fuentes.', 'Organización modular del procesamiento asíncrono.', 'Despliegue y observabilidad incluidos en el planteamiento.'],
    technologies: ['GCP', 'Ansible', 'NoSQL', 'Grafana'],
    repository: 'https://github.com/joanroamora/scout-pulse-engine',
    order: 3,
  },
  {
    id: 'real-state-aux',
    title: 'Charly · Asistente inmobiliario',
    summary: 'Asistente inmobiliario con OpenClaw y una API para explorar propiedades, disponibilidad y consultas frecuentes. Incluye datos de prueba e infraestructura aislada en GCP.',
    category: 'Agentes · Automatización',
    group: 'ai',
    description: [
      'Charly explora cómo un agente puede acompañar las consultas de una operación inmobiliaria. El proyecto conecta OpenClaw con una API que expone inventario de propiedades, disponibilidad de agenda, preguntas frecuentes y contactos sintéticos para las pruebas.',
      'La infraestructura se organiza en capas separadas de frontend, backend y datos sobre GCP. Terraform describe los recursos y FastAPI sirve los datos de demostración, permitiendo estudiar la interacción del asistente sin utilizar información de clientes reales.',
    ],
    highlights: ['Agente OpenClaw y API ligera en FastAPI.', 'Propiedades, agenda y preguntas frecuentes como fuentes.', 'Datos sintéticos y separación de capas en GCP.'],
    technologies: ['OpenClaw', 'Python', 'FastAPI', 'GCP', 'Terraform'],
    repository: 'https://github.com/joanroamora/realStateAux',
    order: 4,
  },
  {
    id: 'pdf-roar',
    title: 'pdfRoar · El taller del PDF',
    summary: 'Herramientas para combinar, dividir, extraer texto y editar documentos PDF. Reúne una API en FastAPI, procesamiento con PyMuPDF y una arquitectura de servicios sobre AWS.',
    category: 'Herramientas · Documentos',
    group: 'tools',
    description: [
      'Un taller de operaciones para documentos PDF: unir archivos, separar páginas, extraer texto y trabajar en su edición. El proyecto combina herramientas de procesamiento con una API en FastAPI y una interfaz para acceder a los distintos flujos.',
      'PyMuPDF participa en el manejo de documentos y la infraestructura se describe con Terraform sobre AWS. El repositorio también explora la integración de PDF4QT a través del navegador y una capa de observabilidad con Prometheus y Grafana.',
    ],
    highlights: ['Unión, separación y extracción de contenido de PDF.', 'API y herramientas de edición reunidas en una interfaz.', 'Infraestructura declarativa y observabilidad del servicio.'],
    technologies: ['Python', 'FastAPI', 'PyMuPDF', 'AWS', 'Terraform'],
    repository: 'https://github.com/joanroamora/pdfRoar',
    order: 5,
  },
  {
    id: 'gridflow-tx',
    title: 'GridFlow · El pulso de la energía',
    summary: 'Infraestructura y servicios en Python para explorar datos energéticos de la red de Texas y sistemas de almacenamiento con baterías. Une automatización, analítica y observabilidad.',
    category: 'Datos · Energía',
    group: 'data',
    description: [
      'GridFlow reúne ingeniería de datos e infraestructura alrededor de la red eléctrica de Texas. Sus módulos en Python exploran información de ERCOT y sistemas de almacenamiento de energía con baterías, junto con servicios para analizar y observar esos procesos.',
      'La plataforma combina recursos de AWS descritos en Terraform, configuración con Ansible y contenedores Docker. Prometheus, Grafana y otros componentes de observabilidad acompañan a los servicios para conectar el análisis con la operación de la plataforma.',
    ],
    highlights: ['Analítica orientada a ERCOT y almacenamiento con baterías.', 'Infraestructura y configuración reproducibles.', 'Métricas, registros y trazas como parte del entorno.'],
    technologies: ['Python', 'AWS', 'Terraform', 'Ansible', 'Grafana'],
    repository: 'https://github.com/joanroamora/gridflow-tx-portfolio',
    order: 6,
  },
  {
    id: 'video-forge',
    title: 'VideoForge · Ideas en movimiento',
    summary: 'Orquestación de generación de vídeo a partir de texto e imágenes con LTX-Video. Conecta una API y una interfaz web con modelos en PyTorch e infraestructura declarativa en AWS.',
    category: 'IA generativa · MLOps',
    group: 'ai',
    description: [
      'Una exploración del recorrido que va de una imagen o un texto a un vídeo generado. VideoForge organiza la recepción de entradas, la ejecución del modelo LTX-Video y la consulta del estado de los trabajos desde una API y una interfaz web.',
      'El proyecto integra PyTorch y herramientas de difusión con servicios de AWS como ECS, ECR y S3. Terraform describe la infraestructura y el código contempla modos de ejecución con GPU y un modo de demostración con CPU.',
    ],
    highlights: ['Entradas de texto e imagen y seguimiento de trabajos.', 'API en FastAPI y generación con PyTorch.', 'Contenedores y recursos de AWS definidos con Terraform.'],
    technologies: ['Python', 'FastAPI', 'PyTorch', 'AWS ECS', 'Terraform'],
    repository: 'https://github.com/joanroamora/videoforge-mlops-aws',
    order: 7,
  },
  {
    id: 'operationalizing-fairness',
    title: 'FairLens · Una mirada al sesgo',
    summary: 'Propuesta de arquitectura y código de apoyo para incorporar pruebas de equidad, explicabilidad y auditoría en pipelines de MLOps. Explora la gobernanza como parte del desarrollo de software.',
    category: 'Investigación · IA responsable',
    group: 'data',
    academic: { institution: 'Indiana Wesleyan University · EE. UU.', context: 'Proyecto académico · Machine Learning Fundamentals' },
    description: [
      'Proyecto académico de Machine Learning Fundamentals en Indiana Wesleyan University, centrado en el análisis del sesgo y la incorporación de la equidad al ciclo de vida de modelos de aprendizaje automático.',
      'El repositorio reúne una propuesta de arquitectura y código de apoyo para convertir criterios de equidad en comprobaciones dentro de CI/CD. También plantea explicabilidad con SHAP y LIME y un componente de auditoría asíncrona, conectando la discusión sobre IA responsable con decisiones concretas de ingeniería.',
    ],
    highlights: ['Contexto académico en Indiana Wesleyan University.', 'Pruebas de equidad como controles del desarrollo.', 'Propuesta de explicabilidad y auditoría dentro de MLOps.'],
    technologies: ['Python', 'MLOps', 'CI/CD', 'SHAP', 'LIME'],
    repository: 'https://github.com/joanroamora/operationalizing-fairness-ai',
    order: 8,
  },
  {
    id: 'lex-shield',
    title: 'LexShield · El código y sus reglas',
    summary: 'Auditoría de licencias open source dentro de CI/CD. Reúne políticas configurables, ejecución aislada con Docker e informes PDF para revisar las dependencias de un proyecto.',
    category: 'Automatización · Licencias',
    group: 'tools',
    description: [
      'Las dependencias también traen condiciones de uso. LexShield incorpora la revisión de licencias al flujo de integración continua mediante un motor en Python y políticas configurables que definen qué licencias acepta un proyecto.',
      'Jenkins orquesta la ejecución de auditorías en contenedores Docker y ReportLab convierte los resultados en documentos PDF. La separación entre políticas, motor de análisis y presentación permite estudiar la gobernanza de dependencias como parte del software.',
    ],
    highlights: ['Políticas de licencias separadas del motor de análisis.', 'Auditorías ejecutadas en contenedores.', 'Informes PDF generados a partir de los resultados.'],
    technologies: ['Python', 'Jenkins', 'Docker', 'ReportLab'],
    repository: 'https://github.com/joanroamora/LexShield',
    order: 9,
  },
  {
    id: 'boris-supers', title: 'Boris · Expedientes bajo la lupa',
    summary: 'Lectura de PDF y extracción de datos administrativos con OCR, Flask y un modelo de lenguaje.',
    category: 'IA documental', group: 'ai',
    technologies: ['Python', 'Flask', 'Tesseract', 'OpenAI'],
    repository: 'https://github.com/joanroamora/Boris-SuperS', repositoryVisibility: 'private', order: 10,
    description: [
      'Boris reúne un flujo de lectura documental orientado a extraer información administrativa de archivos PDF. La aplicación convierte el documento a texto y utiliza un modelo de inteligencia artificial para localizar los datos que necesita la consulta.',
      'Flask proporciona la capa web, PyPDF2 participa en la extracción y Tesseract permite trabajar con documentos escaneados. El código permanece en un repositorio privado; su enlace requiere acceso autorizado en GitHub.',
    ],
    highlights: ['Extracción de texto desde PDF.', 'OCR para documentos escaneados.', 'Consulta de datos administrativos mediante IA.'],
  },
  {
    id: 'voice-clone', title: 'VoxLab · Huellas de voz',
    summary: 'Un laboratorio en Python para experimentar con preparación de audio y componentes de síntesis y clonación de voz.',
    category: 'Audio · Experimentación', group: 'ai',
    technologies: ['Python', 'PyTorch', 'Transformers', 'ESPnet'],
    repository: 'https://github.com/joanroamora/voiceClone', order: 11,
    description: [
      'VoxLab explora el trabajo con una voz de referencia desde el código: cargar audio, preparar sus señales y organizar funciones de experimentación con síntesis y clonación de voz.',
      'El prototipo reúne PyTorch, torchaudio, componentes de Wav2Vec2 y ESPnet. Sus funciones organizan la carga de señales, la preparación del experimento y la generación de audio como etapas de un mismo laboratorio.',
    ],
    highlights: ['Carga y preparación de señales de audio.', 'Componentes de PyTorch, Wav2Vec2 y ESPnet.', 'Experimentación con una voz de referencia.'],
  },
  {
    id: 'azure-pilot', title: 'Azure Pilot · La nube, en automático',
    summary: 'Automatización en Python para gestionar máquinas virtuales, bases de datos y almacenamiento mediante el SDK de Azure.',
    category: 'Cloud · Automatización', group: 'cloud',
    technologies: ['Python', 'Azure'],
    repository: 'https://github.com/joanroamora/PyScript-Azure-Resource-Management-Automation', order: 12,
    description: [
      'Un conjunto de operaciones para administrar recursos de Azure desde Python. El proyecto trabaja con máquinas virtuales, redes, bases de datos SQL y cuentas de almacenamiento mediante las bibliotecas de gestión del proveedor.',
      'La configuración se obtiene de variables de entorno y las operaciones dejan registros para revisar lo ocurrido. El enfoque conecta automatización, manejo de errores y trazabilidad de las tareas habituales de infraestructura.',
    ],
    highlights: ['Gestión de recursos con el SDK de Azure.', 'Configuración mediante variables de entorno.', 'Registros de operación y manejo de errores.'],
  },
  {
    id: 'azure-atlas', title: 'Azure Atlas · Infraestructura por capas',
    summary: 'Una arquitectura web en Azure descrita con Terraform: red, máquinas, balanceo y una capa de base de datos separada.',
    category: 'Cloud · Infraestructura', group: 'cloud',
    technologies: ['Azure', 'Terraform', 'SQL'],
    repository: 'https://github.com/joanroamora/Azure-TerraformInfra', order: 13,
    description: [
      'Azure Atlas organiza la infraestructura de una aplicación en capas de frontend, backend y datos. Terraform describe las redes virtuales, subredes, máquinas, grupos de seguridad y recursos de base de datos que conectan esas capas.',
      'La documentación explora balanceo de carga, disponibilidad por zonas y estrategias entre regiones. Es un estudio de arquitectura e infraestructura como código, con el despliegue y la separación de responsabilidades como hilo conductor.',
    ],
    highlights: ['Infraestructura declarada en Terraform.', 'Separación de frontend, backend y base de datos.', 'Diseño de redes, balanceo y controles de acceso.'],
  },
  {
    id: 'code-gate', title: 'CodeGate · Calidad antes del despliegue',
    summary: 'Un flujo de CI/CD que conecta cambios en GitHub, análisis de código con SonarQube y despliegue con Docker.',
    category: 'DevOps · Calidad', group: 'cloud',
    technologies: ['Jenkins', 'SonarQube', 'Docker', 'GitHub Actions'],
    repository: 'https://github.com/joanroamora/Jenkins-SonarQube-Docker', order: 14,
    description: [
      'CodeGate recorre el camino de un cambio de código hasta una aplicación desplegada en contenedores. El laboratorio conecta GitHub con Jenkins y añade análisis de código mediante SonarQube dentro del proceso de integración.',
      'El repositorio documenta la preparación de servicios en máquinas Ubuntu sobre EC2, su configuración y la relación entre webhooks, orquestación y despliegue. Docker completa el entorno de ejecución de la aplicación web.',
    ],
    highlights: ['Integración entre GitHub y Jenkins.', 'Análisis de código con SonarQube.', 'Despliegue de una aplicación en Docker.'],
  },
  {
    id: 'soundprint', title: 'Soundprint · Anatomía de los ochenta',
    summary: 'Análisis exploratorio de canciones de los años ochenta a través de sus características, correlaciones y representaciones visuales.',
    category: 'Datos · Música', group: 'data',
    technologies: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'scikit-learn'],
    repository: 'https://github.com/joanroamora/MusicDataAnalysis', order: 15,
    description: [
      '¿Qué relaciones aparecen al mirar una década de música como un conjunto de datos? Soundprint toma un dataset de éxitos de los años ochenta y explora sus variables con herramientas estadísticas y visualización.',
      'El flujo incluye revisión de valores faltantes, escalado, filtrado de valores atípicos y gráficos de dispersión y correlación. pandas, NumPy, seaborn y Matplotlib permiten recorrer las canciones desde distintas perspectivas, más allá de una lista de popularidad.',
    ],
    highlights: ['Preparación y escalado de características musicales.', 'Exploración de correlaciones y valores atípicos.', 'Matrices de dispersión, coordenadas paralelas y otras vistas.'],
  },
  {
    id: 'rank-shift', title: 'RankShift · La fragilidad de un ranking',
    summary: 'Simulación de Monte Carlo para explorar cuánto puede cambiar un ranking universitario ante variaciones en sus métricas.',
    category: 'Datos · Simulación', group: 'data',
    technologies: ['Python', 'Monte Carlo'],
    repository: 'https://github.com/joanroamora/University-Risk-Analysis__Preprocessing-and-Monte-Carlo-Simulation', order: 16,
    description: [
      'Una posición en un ranking parece un dato fijo, pero depende de las métricas que la sostienen. RankShift estudia esa sensibilidad mediante variaciones simuladas y observa qué universidades muestran mayor exposición a cambios de posición.',
      'El proyecto separa el preprocesamiento, la simulación de Monte Carlo y la visualización. La salida reúne datos procesados, cambios simulados y una representación de las instituciones con mayor fluctuación dentro del ejercicio.',
    ],
    highlights: ['Limpieza y preparación del dataset universitario.', 'Simulación de variaciones en las métricas.', 'Visualización del riesgo de cambios de posición.'],
  },
  {
    id: 'europa-perspectiva', title: 'Europa en perspectiva',
    summary: 'Análisis de población europea que combina limpieza de datos, agrupación temporal y escenarios de Monte Carlo.',
    category: 'Datos · Demografía', group: 'data',
    technologies: ['Python', 'Monte Carlo'],
    repository: 'https://github.com/joanroamora/EuropePopulation2024---Dimensional-Analysis-and-MonteCarlo-Simulation', order: 17,
    description: [
      'Un ejercicio para pasar de series históricas de población a escenarios demográficos. El proyecto parte de datos de países europeos entre 2013 y 2022 y organiza su limpieza antes de realizar la simulación.',
      'La dimensionalidad se reduce agrupando pares de años y las tasas de crecimiento aleatorias alimentan escenarios de Monte Carlo hasta 2030. Las proyecciones pertenecen al modelo del ejercicio y permiten explorar cómo cambian las trayectorias bajo distintos supuestos.',
    ],
    highlights: ['Imputación y preparación de datos históricos.', 'Agrupación de periodos para simplificar el análisis.', 'Escenarios demográficos mediante simulación.'],
  },
  {
    id: 'echo-brief', title: 'EchoBrief · De la voz a la idea',
    summary: 'Un pipeline para extraer audio de vídeo, transcribirlo y convertir una conversación larga en un texto resumido.',
    category: 'Audio · Procesamiento', group: 'ai',
    technologies: ['Python', 'Flask', 'Vosk', 'Transformers', 'FFmpeg'],
    repository: 'https://github.com/joanroamora/AudioTranscription-SummaryPipeline', order: 18,
    description: [
      'EchoBrief conecta varias etapas que suelen quedar separadas: extraer la pista de audio de un vídeo, convertirla a un formato adecuado para reconocimiento de voz y obtener una transcripción que pueda resumirse.',
      'La aplicación utiliza Flask como interfaz del proceso. MoviePy y PyDub participan en el tratamiento del audio, Vosk realiza la transcripción y Transformers aporta los componentes para el resumen del contenido.',
    ],
    highlights: ['Extracción y normalización del audio.', 'Transcripción con Vosk.', 'Resumen del texto y acceso desde una interfaz web.'],
  },
  {
    id: 'voz-de-tinta', title: 'Voz de tinta',
    summary: 'Síntesis de voz con ParlerTTS a partir de un texto y una descripción de cómo debería sonar la voz.',
    category: 'Audio · IA generativa', group: 'ai',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'ParlerTTS'],
    repository: 'https://github.com/joanroamora/textToAudio-ParlerTTS', order: 19,
    description: [
      'Dar voz a un texto también implica decidir cómo suena. Este experimento utiliza ParlerTTS para combinar el contenido escrito con una descripción de las características deseadas de la voz.',
      'El script prepara los tokens, selecciona GPU o CPU según disponibilidad y genera el audio con el modelo. El resultado se convierte en una señal y se guarda en un archivo WAV para escucharlo fuera del proceso de generación.',
    ],
    highlights: ['Texto y descripción de voz como entradas.', 'Selección de dispositivo con PyTorch.', 'Generación y guardado de audio WAV.'],
  },
  {
    id: 'audio-a-palabras', title: 'Audio a palabras',
    summary: 'Conversión de archivos M4A y transcripción en español, dividida en fragmentos para trabajar con grabaciones largas.',
    category: 'Audio · Herramientas', group: 'tools',
    technologies: ['Python', 'SpeechRecognition', 'Audio'],
    repository: 'https://github.com/joanroamora/m4u-To-Text-Converter', order: 20,
    description: [
      'Una utilidad para convertir grabaciones en texto consultable. El flujo comienza transformando archivos M4A en WAV y divide la grabación en fragmentos antes de solicitar la transcripción en español.',
      'El reconocimiento utiliza Google Speech Recognition a través de la librería correspondiente. Al terminar, la transcripción se guarda en un archivo de texto y se elimina el audio WAV intermedio generado durante la conversión.',
    ],
    highlights: ['Conversión de M4A a WAV.', 'Procesamiento de audio por fragmentos.', 'Salida de texto y limpieza de archivos intermedios.'],
  },
  {
    id: 'terra-rag', title: 'TerraRAG · Los cimientos de una idea',
    summary: 'Una base de infraestructura en AWS para un entorno RAG, centrada en redes, máquinas y reglas de comunicación.',
    category: 'Cloud · Infraestructura', group: 'cloud',
    technologies: ['Terraform', 'AWS'],
    repository: 'https://github.com/joanroamora/RAG-webApp-OpSource-IaaC-Terraform-Ansible', order: 21,
    description: [
      'Antes de una aplicación también está el entorno que la sostiene. TerraRAG reúne la base declarativa de infraestructura para un planteamiento de aplicación RAG con herramientas de código abierto.',
      'Su núcleo está en Terraform: una VPC, subredes, rutas, NAT, grupos de seguridad e instancias EC2. El proyecto se concentra en preparar las redes y máquinas que sirven de base al entorno.',
    ],
    highlights: ['Redes y subredes definidas como código.', 'Instancias EC2 y reglas de seguridad.', 'Separación de conectividad pública y privada.'],
  },
  {
    id: 'entre-paginas', title: 'Entre páginas · Preguntas con contexto',
    summary: 'Una exploración de RAG sobre PDF con fragmentación de texto, embeddings multilingües y generación de respuestas con OpenAI.',
    category: 'IA documental · RAG', group: 'ai',
    technologies: ['Python', 'LangChain', 'OpenAI', 'Hugging Face', 'Jupyter'],
    repository: 'https://github.com/joanroamora/RAG-OpenAI---pdf---paraphrase-multilingual-embeddings', order: 22,
    description: [
      'Un recorrido por las piezas de un asistente que responde a partir de documentos. El proyecto extrae texto de PDF, lo divide en fragmentos y lo transforma en representaciones vectoriales con un modelo multilingüe de Sentence Transformers.',
      'La recuperación de fragmentos relevantes aporta el contexto a la generación con OpenAI. El material explora herramientas de LangChain y almacenes vectoriales como FAISS, mostrando las etapas del proceso en un entorno de experimentación con notebooks.',
    ],
    highlights: ['Carga y fragmentación de documentos PDF.', 'Embeddings multilingües para recuperar contexto.', 'Integración entre recuperación y generación de respuestas.'],
  },
  {
    id: 'horizonte-2050', title: 'Horizonte 2050 · Energía por habitante',
    summary: 'Mi proyecto aplicado de grado en la UNAD: una herramienta para explorar y proyectar consumo energético per cápita con datos históricos.',
    category: 'Datos · Proyecto de grado', group: 'data',
    academic: { institution: 'UNAD', context: 'Proyecto aplicado de grado' },
    technologies: ['Python', 'Flask', 'pandas', 'scikit-learn', 'Matplotlib'],
    repository: 'https://github.com/joanroamora/Predictive_model_energy_consumption_per_capita_UNAD_project', order: 23,
    description: [
      'Mi proyecto aplicado de grado en la UNAD conecta preparación de datos, modelado e interacción web alrededor del consumo energético por habitante. La herramienta permite cargar un dataset histórico, completar valores faltantes y explorar distintos países y años.',
      'Las proyecciones se construyen con regresión lineal y se representan gráficamente, con un horizonte de exploración hasta 2050. Flask proporciona la interfaz y pandas, NumPy, scikit-learn y Matplotlib acompañan el recorrido desde el dato hasta la visualización.',
    ],
    highlights: ['Proyecto aplicado de grado en la UNAD.', 'Imputación de datos y regresión lineal.', 'Selección de país y año en una interfaz interactiva.'],
  },
  {
    id: 'semilla-rag', title: 'Semilla RAG · El primer índice',
    summary: 'Un experimento de indexación documental con LangChain: de las páginas de un PDF a fragmentos y vectores en Chroma.',
    category: 'IA documental · Experimentación', group: 'ai',
    technologies: ['Python', 'LangChain', 'Chroma', 'Sentence Transformers'],
    repository: 'https://github.com/joanroamora/langChainProject', order: 24,
    description: [
      'Un pequeño punto de partida para trabajar con recuperación documental. El código utiliza PyPDFLoader para leer un PDF y un separador recursivo para organizar el texto en fragmentos.',
      'Sentence Transformer Embeddings y Chroma completan las piezas del índice vectorial. El proyecto se concentra en la preparación del conocimiento que podrá alimentar una consulta posterior: cargar, fragmentar, representar y almacenar.',
    ],
    highlights: ['Lectura de PDF mediante LangChain.', 'Fragmentación recursiva del texto.', 'Embeddings y almacenamiento vectorial en Chroma.'],
  },
  {
    id: 'tinta-visible', title: 'Tinta visible · De imagen a texto',
    summary: 'Reconocimiento óptico de caracteres para transformar texto dentro de una imagen en una cadena editable desde Python.',
    category: 'Herramientas · OCR', group: 'tools',
    technologies: ['Python', 'Tesseract', 'Pillow'],
    repository: 'https://github.com/joanroamora/textRecognizer', order: 25,
    description: [
      'Tinta visible parte de una tarea directa: leer los caracteres de una imagen para poder buscar, copiar y transformar su contenido como texto. El proyecto utiliza Tesseract como motor de reconocimiento óptico.',
      'La integración en Python se realiza con pytesseract y Pillow para trabajar con imágenes. La documentación recorre su preparación en Windows y la selección de idiomas de reconocimiento, con la claridad de la imagen como condición del resultado.',
    ],
    highlights: ['OCR sobre imágenes con texto.', 'Integración de Tesseract con Python.', 'Procesamiento de imágenes mediante Pillow.'],
  },
  {
    id: 'linux-al-dia', title: 'Linux al día',
    summary: 'Un script de mantenimiento que reúne actualización de paquetes, revisión de problemas e información básica del sistema.',
    category: 'Herramientas · Sistemas', group: 'tools',
    technologies: ['Linux', 'Bash'],
    repository: 'https://github.com/joanroamora/ScriptLinuxMaintenance', order: 26,
    description: [
      'Una de las primeras formas de automatizar un sistema es reunir sus tareas repetitivas en un script. Linux al día organiza operaciones de mantenimiento desde la terminal y muestra información del equipo.',
      'El recorrido incluye actualización de la lista de paquetes, tareas de resolución de problemas e información de monitorización. Su punto de encuentro es Bash: una herramienta pequeña para hacer más consistente una rutina de administración.',
    ],
    highlights: ['Rutinas de mantenimiento desde la terminal.', 'Revisión de paquetes e información del sistema.', 'Automatización mediante un script Bash.'],
  },
  {
    id: 'primeras-maquinas', title: 'Primeras máquinas · Un laboratorio local',
    summary: 'Primeros entornos con Vagrant, configuración de máquinas virtuales y scripts de aprovisionamiento para explorar infraestructura local.',
    category: 'Infraestructura · Laboratorio', group: 'cloud',
    technologies: ['Vagrant', 'VirtualBox', 'Ruby', 'Bash'],
    repository: 'https://github.com/joanroamora/VagrantFirst', order: 27,
    description: [
      'Un laboratorio de primeras máquinas virtuales descritas desde archivos de configuración. El repositorio conserva Vagrantfiles, configuración en Ruby y scripts de shell para preparar los entornos.',
      'La pieza explora la relación entre una definición de infraestructura y la máquina que aparece al ejecutarla, usando Vagrant y VirtualBox como espacio de aprendizaje local.',
    ],
    highlights: ['Definición de máquinas con Vagrant.', 'Configuración en Ruby y aprovisionamiento con shell.', 'Exploración de entornos locales con VirtualBox.'],
  },
];

export function repositoryName(project: Project): string {
  return project.repository.split('/').filter(Boolean).at(-1) ?? project.id;
}
