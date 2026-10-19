import { createHash } from 'node:crypto';
import { projects } from '../data/projects.ts';
import { normalizeText, type Translation } from './locales.ts';

export const reviewedProjectsDigest = '656220eca2324b6069fb154dff4fee47756307531167dadccb0c5cd33c1e9d7b';
if (createHash('sha256').update(JSON.stringify(projects.map(({id,title,summary}) => ({id,title,summary})))).digest('hex') !== reviewedProjectsDigest) {
  throw new Error('El catálogo de proyectos cambió: revisar títulos y resúmenes en src/i18n/projects.ts.');
}

export const summaries: Record<string,Translation> = {
  'rag-document-intelligence': [
    'Document processing and search with hybrid retrieval and cited answers. It separates evidence from inference and uncertain passages.',
    '通过混合检索处理与查询文档，并为回答附上引用，区分证据、推断与不确定内容。',
    'हाइब्रिड रिट्रीवल और स्रोत सहित उत्तरों के साथ दस्तावेज़ प्रोसेसिंग और खोज। प्रमाण, अनुमान और अनिश्चित अंश अलग रखता है।',
    'معالجة المستندات والبحث فيها باسترجاع هجين وإجابات موثقة. يفصل الأدلة عن الاستنتاجات والمقاطع غير المؤكدة.',
    'Traitement et recherche documentaire par récupération hybride et réponses sourcées. Distingue les preuves, les inférences et les passages incertains.',
  ],
  'k8s-architecture-lab': [
    'A lab to inspect, break and repair Kubernetes components. It combines a virtual-machine cluster, Argo CD and an architecture visualizer.',
    '用于检查、破坏与修复 Kubernetes 组件的实验室，结合虚拟机集群、Argo CD 和架构可视化工具。',
    'Kubernetes घटकों को जाँचने, तोड़ने और ठीक करने की लैब। वर्चुअल मशीन क्लस्टर, Argo CD और आर्किटेक्चर विज़ुअलाइज़र जोड़ती है।',
    'مختبر لفحص مكونات Kubernetes وتعطيلها وإصلاحها، يجمع عنقود آلات افتراضية وArgo CD وعارضًا للمعمارية.',
    'Un laboratoire pour inspecter, casser et réparer Kubernetes, avec un cluster de machines virtuelles, Argo CD et une visualisation de l’architecture.',
  ],
  'scout-pulse-engine': [
    'A modular research and data-extraction pipeline for YouTube, Reddit and the web, exploring asynchronous processing, NoSQL storage and Grafana observability.',
    '面向 YouTube、Reddit 和网页的模块化研究与数据提取流水线，探索异步处理、NoSQL 存储与 Grafana 可观测性。',
    'YouTube, Reddit और वेब से शोध व डेटा निष्कर्षण की मॉड्यूलर पाइपलाइन; असिंक्रोनस प्रोसेसिंग, NoSQL और Grafana ऑब्ज़र्वेबिलिटी की रूपरेखा।',
    'خط بحث واستخراج بيانات معياري من YouTube وReddit والويب، يستكشف المعالجة غير المتزامنة وتخزين NoSQL والرصد عبر Grafana.',
    'Un pipeline modulaire de recherche et d’extraction pour YouTube, Reddit et le web, avec traitement asynchrone, stockage NoSQL et observabilité Grafana.',
  ],
  'real-state-aux': [
    'A real-estate assistant using OpenClaw and an API for properties, availability and common questions, with test data and isolated infrastructure on GCP.',
    '使用 OpenClaw 与 API 的房地产助手，可查询房源、可用情况和常见问题，包含测试数据及 GCP 隔离基础设施。',
    'OpenClaw और API वाला रियल एस्टेट सहायक, जो संपत्ति, उपलब्धता और आम सवालों की खोज करता है। GCP पर टेस्ट डेटा और अलग इन्फ्रास्ट्रक्चर।',
    'مساعد عقاري يستخدم OpenClaw وواجهة API للعقارات والتوافر والأسئلة الشائعة، مع بيانات اختبار وبنية معزولة في GCP.',
    'Un assistant immobilier avec OpenClaw et une API pour les biens, disponibilités et questions fréquentes, avec données de test et infrastructure isolée sur GCP.',
  ],
  'pdf-roar': [
    'Tools to merge, split, extract text and edit PDF documents, combining a FastAPI API, PyMuPDF processing and a service architecture on AWS.',
    '合并、拆分、提取文本和编辑 PDF 的工具，结合 FastAPI 接口、PyMuPDF 处理及 AWS 服务架构。',
    'PDF जोड़ने, बाँटने, टेक्स्ट निकालने और संपादन के टूल। FastAPI, PyMuPDF और AWS सेवा आर्किटेक्चर का संयोजन।',
    'أدوات لدمج PDF وتقسيمه واستخراج نصوصه وتحريره، تجمع FastAPI ومعالجة PyMuPDF ومعمارية خدمات على AWS.',
    'Des outils pour fusionner, diviser, extraire et modifier des PDF, avec une API FastAPI, PyMuPDF et une architecture de services sur AWS.',
  ],
  'gridflow-tx': [
    'Python infrastructure and services for exploring Texas power-grid and battery-storage data, bringing together automation, analytics and observability.',
    '用于探索得克萨斯州电网与电池储能数据的 Python 基础设施及服务，融合自动化、分析与可观测性。',
    'टेक्सस ग्रिड और बैटरी भंडारण डेटा की खोज के लिए Python सेवाएँ व इन्फ्रास्ट्रक्चर; स्वचालन, विश्लेषण और ऑब्ज़र्वेबिलिटी साथ लाता है।',
    'بنية وخدمات Python لاستكشاف بيانات شبكة تكساس وتخزين البطاريات، تجمع الأتمتة والتحليلات وقابلية الرصد.',
    'Infrastructure et services Python pour explorer le réseau électrique du Texas et le stockage par batteries, entre automatisation, analyse et observabilité.',
  ],
  'video-forge': [
    'Text- and image-to-video generation orchestration with LTX-Video, connecting an API and web interface to PyTorch models and declarative AWS infrastructure.',
    '使用 LTX-Video 编排文本与图像生成视频，连接 API、网页界面、PyTorch 模型及 AWS 声明式基础设施。',
    'LTX-Video से टेक्स्ट और चित्र के आधार पर वीडियो जनरेशन का ऑर्केस्ट्रेशन। API, वेब इंटरफ़ेस, PyTorch और घोषणात्मक AWS इन्फ्रास्ट्रक्चर जोड़ता है।',
    'تنسيق توليد الفيديو من النص والصور باستخدام LTX-Video، يربط API وواجهة ويب بنماذج PyTorch وبنية AWS تصريحية.',
    'Orchestration de génération vidéo à partir de textes et d’images avec LTX-Video, API, interface web, modèles PyTorch et infrastructure AWS déclarative.',
  ],
  'operationalizing-fairness': [
    'An architecture proposal and supporting code for fairness testing, explainability and auditing in MLOps pipelines, exploring governance as part of software development.',
    '将公平性测试、可解释性和审计融入 MLOps 流水线的架构提案及支持代码，探索软件开发中的治理。',
    'MLOps पाइपलाइन में निष्पक्षता परीक्षण, व्याख्येयता और ऑडिट जोड़ने की आर्किटेक्चर रूपरेखा व सहायक कोड; विकास में गवर्नेंस की खोज।',
    'مقترح معمارية وكود داعم لاختبارات الإنصاف والتفسير والتدقيق في MLOps، يستكشف الحوكمة كجزء من تطوير البرمجيات.',
    'Proposition d’architecture et code d’appui pour les tests d’équité, l’explicabilité et l’audit dans MLOps, avec la gouvernance intégrée au développement.',
  ],
  'lex-shield': [
    'Open-source license auditing in CI/CD, with configurable policies, Docker isolation and PDF reports for reviewing project dependencies.',
    'CI/CD 中的开源许可证审计，结合可配置策略、Docker 隔离与 PDF 报告，审查项目依赖。',
    'CI/CD में ओपन-सोर्स लाइसेंस ऑडिट। कॉन्फ़िगर योग्य नीतियाँ, Docker आइसोलेशन और निर्भरताओं की समीक्षा के लिए PDF रिपोर्ट।',
    'تدقيق تراخيص المصادر المفتوحة في CI/CD بسياسات قابلة للإعداد وعزل Docker وتقارير PDF لمراجعة اعتماديات المشروع.',
    'Audit des licences open source en CI/CD, avec politiques configurables, isolation Docker et rapports PDF sur les dépendances.',
  ],
  'boris-supers': ['PDF reading and administrative-data extraction using OCR, Flask and a language model.','利用 OCR、Flask 与语言模型读取 PDF 并提取行政数据。','OCR, Flask और भाषा मॉडल से PDF पढ़ना और प्रशासनिक डेटा निकालना।','قراءة PDF واستخراج البيانات الإدارية باستخدام OCR وFlask ونموذج لغوي.','Lecture de PDF et extraction de données administratives avec OCR, Flask et un modèle de langage.'],
  'voice-clone': ['A Python lab for experimenting with audio preparation and speech synthesis and voice-cloning components.','在 Python 实验室中探索音频准备、语音合成与声音克隆组件。','ऑडियो तैयारी, स्पीच सिंथेसिस और वॉइस क्लोनिंग घटकों के प्रयोग की Python लैब।','مختبر Python لتجربة إعداد الصوت ومكونات التوليد الصوتي واستنساخ الأصوات.','Un laboratoire Python pour préparer l’audio et expérimenter la synthèse et le clonage de voix.'],
  'azure-pilot': ['Python automation for managing virtual machines, databases and storage through the Azure SDK.','通过 Azure SDK 使用 Python 自动管理虚拟机、数据库与存储。','Azure SDK से वर्चुअल मशीन, डेटाबेस और स्टोरेज प्रबंधन के लिए Python स्वचालन।','أتمتة Python لإدارة الآلات الافتراضية وقواعد البيانات والتخزين عبر Azure SDK.','Automatisation Python de la gestion des machines virtuelles, bases de données et du stockage via le SDK Azure.'],
  'azure-atlas': ['A web architecture on Azure described in Terraform: networking, machines, load balancing and a separate database layer.','使用 Terraform 描述的 Azure 网页架构：网络、虚拟机、负载均衡及独立数据库层。','Terraform में परिभाषित Azure वेब आर्किटेक्चर: नेटवर्क, मशीनें, लोड बैलेंसिंग और अलग डेटाबेस परत।','معمارية ويب على Azure موصوفة بـTerraform: شبكة وآلات وموازنة أحمال وطبقة بيانات منفصلة.','Une architecture web Azure décrite avec Terraform : réseau, machines, répartition de charge et couche de données séparée.'],
  'code-gate': ['A CI/CD workflow connecting GitHub changes, SonarQube code analysis and Docker deployment.','连接 GitHub 变更、SonarQube 代码分析与 Docker 部署的 CI/CD 流程。','GitHub बदलाव, SonarQube कोड विश्लेषण और Docker तैनाती जोड़ने वाला CI/CD वर्कफ़्लो।','مسار CI/CD يربط تغييرات GitHub وتحليل SonarQube ونشر Docker.','Un flux CI/CD reliant les changements GitHub, l’analyse SonarQube et le déploiement Docker.'],
  'soundprint': ['Exploratory analysis of 1980s songs through their features, correlations and visual representations.','通过特征、相关性与可视化探索分析 20 世纪 80 年代歌曲。','गीतों की विशेषताओं, सहसंबंधों और विज़ुअलाइज़ेशन से 1980 के दशक के संगीत का विश्लेषण।','تحليل استكشافي لأغاني الثمانينيات عبر خصائصها وارتباطاتها وتمثيلاتها البصرية.','Analyse exploratoire de chansons des années 1980 : caractéristiques, corrélations et représentations visuelles.'],
  'rank-shift': ['Monte Carlo simulation exploring how university rankings change when their metrics vary.','通过蒙特卡洛仿真探索指标变化对大学排名的影响。','मेट्रिक्स बदलने पर विश्वविद्यालय रैंकिंग के बदलाव की मोंटे कार्लो सिमुलेशन।','محاكاة مونت كارلو لاستكشاف تغير تصنيفات الجامعات عند اختلاف مقاييسها.','Simulation de Monte-Carlo pour explorer la sensibilité des classements universitaires aux variations de leurs indicateurs.'],
  'europa-perspectiva': ['European population analysis combining data cleaning, time-period grouping and Monte Carlo scenarios.','结合数据清理、时间分组和蒙特卡洛情景的欧洲人口分析。','डेटा सफ़ाई, समय समूह और मोंटे कार्लो परिदृश्यों से यूरोपीय आबादी का विश्लेषण।','تحليل سكان أوروبا بجمع تنظيف البيانات وتجميع الفترات وسيناريوهات مونت كارلو.','Analyse démographique européenne combinant nettoyage des données, regroupements temporels et scénarios de Monte-Carlo.'],
  'echo-brief': ['A pipeline for extracting video audio, transcribing it and turning long conversations into summaries.','从视频提取音频、转录，并将长对话整理为摘要的流水线。','वीडियो से ऑडियो निकालने, ट्रांसक्राइब करने और लंबी बातचीत का सार बनाने की पाइपलाइन।','خط لاستخراج صوت الفيديو وتفريغه وتحويل المحادثات الطويلة إلى ملخصات.','Un pipeline pour extraire l’audio d’une vidéo, le transcrire et résumer de longues conversations.'],
  'voz-de-tinta': ['Speech synthesis with ParlerTTS from text and a description of the desired voice.','根据文本及期望声音的描述，使用 ParlerTTS 合成语音。','टेक्स्ट और वांछित आवाज़ के विवरण से ParlerTTS स्पीच सिंथेसिस।','توليد صوت بـParlerTTS انطلاقًا من نص ووصف للصوت المطلوب.','Synthèse vocale avec ParlerTTS à partir d’un texte et de la description de la voix souhaitée.'],
  'audio-a-palabras': ['M4A conversion and Spanish transcription, split into chunks for long recordings.','转换 M4A 并转录为西班牙语，通过分段处理长录音。','लंबी रिकॉर्डिंग को टुकड़ों में बाँटकर M4A रूपांतरण और स्पेनिश ट्रांसक्रिप्शन।','تحويل M4A وتفريغ بالإسبانية مع تقسيم التسجيلات الطويلة إلى مقاطع.','Conversion M4A et transcription en espagnol, par segments pour les longs enregistrements.'],
  'terra-rag': ['AWS infrastructure foundations for a RAG environment, focused on networks, machines and communication rules.','为 RAG 环境提供 AWS 基础设施，专注于网络、机器与通信规则。','RAG वातावरण के लिए नेटवर्क, मशीन और संचार नियमों पर केंद्रित AWS इन्फ्रास्ट्रक्चर आधार।','أساس بنية AWS لبيئة RAG يركز على الشبكات والآلات وقواعد الاتصال.','Les fondations d’une infrastructure AWS pour RAG : réseaux, machines et règles de communication.'],
  'entre-paginas': ['An exploration of PDF-based RAG with text chunking, multilingual embeddings and OpenAI answer generation.','探索基于 PDF 的 RAG，包括文本分块、多语言嵌入及 OpenAI 回答生成。','टेक्स्ट चंकिंग, बहुभाषी एम्बेडिंग और OpenAI उत्तर जनरेशन के साथ PDF RAG की खोज।','استكشاف RAG على PDF بتجزئة النص وتضمينات متعددة اللغات وتوليد إجابات OpenAI.','Exploration du RAG sur PDF : découpage du texte, embeddings multilingues et génération de réponses avec OpenAI.'],
  'horizonte-2050': ['My applied graduation project at UNAD: a tool to explore and project per-capita energy consumption using historical data.','我在 UNAD 的应用毕业项目：使用历史数据探索和预测人均能源消耗的工具。','UNAD में मेरी अनुप्रयुक्त स्नातक परियोजना: ऐतिहासिक डेटा से प्रति व्यक्ति ऊर्जा खपत की खोज और प्रक्षेपण का टूल।','مشروع تخرجي التطبيقي في UNAD: أداة لاستكشاف وتوقع استهلاك الطاقة للفرد باستخدام بيانات تاريخية.','Mon projet appliqué de fin d’études à l’UNAD : explorer et projeter la consommation énergétique par habitant à partir de données historiques.'],
  'semilla-rag': ['A LangChain document-indexing experiment: from PDF pages to chunks and vectors in Chroma.','使用 LangChain 的文档索引实验：从 PDF 页面到 Chroma 中的文本块与向量。','LangChain दस्तावेज़ इंडेक्सिंग प्रयोग: PDF पन्नों से Chroma में चंक और वेक्टर तक।','تجربة فهرسة مستندات بـLangChain: من صفحات PDF إلى مقاطع ومتجهات في Chroma.','Une expérience d’indexation documentaire LangChain : des pages PDF aux fragments et vecteurs dans Chroma.'],
  'tinta-visible': ['Optical character recognition to turn text inside an image into an editable string in Python.','利用光学字符识别，将图像中的文字转换为 Python 中可编辑的字符串。','चित्र के टेक्स्ट को Python में संपादन योग्य स्ट्रिंग बनाने के लिए ऑप्टिकल कैरेक्टर रिकग्निशन।','تعرف ضوئي على الحروف لتحويل نص الصورة إلى سلسلة قابلة للتحرير في Python.','Reconnaissance optique de caractères pour convertir le texte d’une image en chaîne modifiable avec Python.'],
  'linux-al-dia': ['A maintenance script combining package updates, troubleshooting and basic system information.','整合软件包更新、故障排查及基础系统信息的维护脚本。','पैकेज अपडेट, समस्या निवारण और बुनियादी सिस्टम जानकारी जोड़ने वाली रखरखाव स्क्रिप्ट।','سكربت صيانة يجمع تحديث الحزم واستكشاف المشكلات ومعلومات النظام الأساسية.','Un script de maintenance regroupant mises à jour, dépannage et informations système de base.'],
  'primeras-maquinas': ['First Vagrant environments, virtual-machine configuration and provisioning scripts for exploring local infrastructure.','使用 Vagrant 初建环境、配置虚拟机及编写预配脚本，探索本地基础设施。','स्थानीय इन्फ्रास्ट्रक्चर सीखने के लिए शुरुआती Vagrant वातावरण, VM कॉन्फ़िगरेशन और प्रोविज़निंग स्क्रिप्ट।','بيئات أولى بـVagrant وإعداد آلات افتراضية وسكربتات تجهيز لاستكشاف البنية المحلية.','Premiers environnements Vagrant, configuration de machines virtuelles et scripts de provisionnement pour explorer l’infrastructure locale.'],
};
export const projectTitles: Record<string,Translation> = {
  'rag-document-intelligence':['AETHER · Document intelligence','AETHER · 文档智能','AETHER · दस्तावेज़ इंटेलिजेंस','AETHER · ذكاء المستندات','AETHER · Intelligence documentaire'],
  'k8s-architecture-lab':['Kubernetes Orbit','Kubernetes 轨道','Kubernetes कक्षा','مدار Kubernetes','Orbite Kubernetes'],
  'scout-pulse-engine':['Scout · Signals in the noise','Scout · 噪声中的信号','Scout · शोर में संकेत','Scout · إشارات وسط الضجيج','Scout · Des signaux dans le bruit'],
  'real-state-aux':['Charly · Real-estate assistant','Charly · 房地产助手','Charly · रियल एस्टेट सहायक','Charly · مساعد عقاري','Charly · Assistant immobilier'],
  'pdf-roar':['pdfRoar · The PDF workshop','pdfRoar · PDF 工坊','pdfRoar · PDF कार्यशाला','pdfRoar · ورشة PDF','pdfRoar · L’atelier du PDF'],
  'gridflow-tx':['GridFlow · The pulse of energy','GridFlow · 能源脉搏','GridFlow · ऊर्जा की धड़कन','GridFlow · نبض الطاقة','GridFlow · Le pouls de l’énergie'],
  'video-forge':['VideoForge · Ideas in motion','VideoForge · 流动的创意','VideoForge · चलते विचार','VideoForge · أفكار متحركة','VideoForge · Des idées en mouvement'],
  'operationalizing-fairness':['FairLens · A lens on bias','FairLens · 审视偏见','FairLens · पूर्वाग्रह पर नज़र','FairLens · نظرة على التحيز','FairLens · Un regard sur les biais'],
  'lex-shield':['LexShield · Code and its rules','LexShield · 代码与规则','LexShield · कोड और उसके नियम','LexShield · البرمجة وقواعدها','LexShield · Le code et ses règles'],
  'boris-supers':['Boris · Files under the lens','Boris · 细察档案','Boris · फ़ाइलों की पड़ताल','Boris · ملفات تحت المجهر','Boris · Dossiers à la loupe'],
  'voice-clone':['VoxLab · Voiceprints','VoxLab · 声音印记','VoxLab · आवाज़ की छाप','VoxLab · بصمات صوتية','VoxLab · Empreintes vocales'],
  'azure-pilot':['Azure Pilot · Cloud on autopilot','Azure Pilot · 自动化云端','Azure Pilot · स्वचालित क्लाउड','Azure Pilot · السحابة آليًا','Azure Pilot · Le cloud en automatique'],
  'azure-atlas':['Azure Atlas · Layered infrastructure','Azure Atlas · 分层基础设施','Azure Atlas · परतदार इन्फ्रास्ट्रक्चर','Azure Atlas · بنية متعددة الطبقات','Azure Atlas · Infrastructure en couches'],
  'code-gate':['CodeGate · Quality before deployment','CodeGate · 部署前的质量','CodeGate · तैनाती से पहले गुणवत्ता','CodeGate · الجودة قبل النشر','CodeGate · La qualité avant le déploiement'],
  'soundprint':['Soundprint · Anatomy of the eighties','Soundprint · 八十年代剖析','Soundprint · अस्सी के दशक का विश्लेषण','Soundprint · تشريح الثمانينيات','Soundprint · Anatomie des années quatre-vingt'],
  'rank-shift':['RankShift · The fragility of a ranking','RankShift · 排名的脆弱性','RankShift · रैंकिंग की नाज़ुकता','RankShift · هشاشة التصنيف','RankShift · La fragilité d’un classement'],
  'europa-perspectiva':['Europe in perspective','透视欧洲','यूरोप पर एक नज़र','أوروبا في منظور','L’Europe en perspective'],
  'echo-brief':['EchoBrief · From voice to idea','EchoBrief · 从声音到创意','EchoBrief · आवाज़ से विचार तक','EchoBrief · من الصوت إلى الفكرة','EchoBrief · De la voix à l’idée'],
  'voz-de-tinta':['Voice from ink','墨迹之声','स्याही की आवाज़','صوت الحبر','Voix d’encre'],
  'audio-a-palabras':['Audio to words','从音频到文字','ऑडियो से शब्द','من الصوت إلى الكلمات','De l’audio aux mots'],
  'terra-rag':['TerraRAG · Foundations of an idea','TerraRAG · 创意的基础','TerraRAG · एक विचार की नींव','TerraRAG · أساس فكرة','TerraRAG · Les fondations d’une idée'],
  'entre-paginas':['Between pages · Questions with context','书页之间 · 有上下文的提问','पन्नों के बीच · संदर्भ सहित सवाल','بين الصفحات · أسئلة بسياق','Entre les pages · Questions en contexte'],
  'horizonte-2050':['Horizon 2050 · Energy per person','地平线 2050 · 人均能源','क्षितिज 2050 · प्रति व्यक्ति ऊर्जा','أفق 2050 · الطاقة للفرد','Horizon 2050 · Énergie par habitant'],
  'semilla-rag':['RAG Seed · The first index','RAG 种子 · 第一个索引','RAG बीज · पहला इंडेक्स','بذرة RAG · الفهرس الأول','Graine RAG · Le premier index'],
  'tinta-visible':['Visible ink · Image to text','可见的墨迹 · 从图像到文字','दिखती स्याही · चित्र से टेक्स्ट','حبر مرئي · من الصورة إلى النص','Encre visible · De l’image au texte'],
  'linux-al-dia':['Linux up to date','让 Linux 保持更新','अप-टू-डेट Linux','Linux مُحدّث','Linux à jour'],
  'primeras-maquinas':['First machines · A local lab','最初的机器 · 本地实验室','पहली मशीनें · स्थानीय लैब','الآلات الأولى · مختبر محلي','Premières machines · Un labo local'],
};
export const projectTranslations: Record<string,Translation> = {};
for (const project of projects) {
  if (!summaries[project.id] || !projectTitles[project.id]) throw new Error(`Faltan traducciones del proyecto ${project.id}.`);
  projectTranslations[normalizeText(project.summary)] = summaries[project.id];
  projectTranslations[normalizeText(project.title)] = projectTitles[project.id];
}
