import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parsePublicProfile } from '../utils/profile.ts';
import { normalizeText, type Translation } from './locales.ts';

const p = parsePublicProfile(readFileSync('docs/PERFIL_PUBLICO.md','utf8'));
// Evita asociar por posición traducciones antiguas a nuevos hechos personales.
// Feature10: se añade únicamente el Flickr aprobado; su etiqueta se localiza en ui.ts.
export const reviewedProfileDigest = 'bcb6b83e3ef92ac6e9d1402afadc709205e5346535e38b58313717691519a791';
if (createHash('sha256').update(JSON.stringify(p)).digest('hex') !== reviewedProfileDigest) {
  throw new Error('El perfil cambió: revisar src/i18n/profile.ts antes de generar las versiones traducidas.');
}
const rows: [string,Translation][] = [
  [p.summary,['DevOps engineer with experience in platform reliability.','具有平台可靠性经验的 DevOps 工程师。','प्लेटफ़ॉर्म विश्वसनीयता में अनुभव रखने वाला DevOps इंजीनियर।','مهندس DevOps ذو خبرة في موثوقية المنصات.','Ingénieur DevOps avec une expérience en fiabilité des plateformes.']],
  [p.introduction[0],[
    'I’m Joan Ricardo Roa Mora, a DevOps engineer. I have always been interested in technology and what we can do with new advances. I approach technological development through a humanist lens, paying attention to the contexts in which it is used.',
    '我是 Joan Ricardo Roa Mora，一名 DevOps 工程师。我一直对技术以及新进展能带来的可能性感兴趣。我倾向于以人文视角看待技术发展，并理解它的使用背景。',
    'मैं Joan Ricardo Roa Mora हूँ, एक DevOps इंजीनियर। तकनीक और नई प्रगति से हम क्या कर सकते हैं, इसमें मेरी हमेशा रुचि रही है। मैं तकनीकी विकास को मानवीय नज़रिए से देखता हूँ और उसके उपयोग के संदर्भ को समझना चाहता हूँ।',
    'أنا Joan Ricardo Roa Mora، مهندس DevOps. لطالما اهتممت بالتكنولوجيا وما يمكننا فعله بالتطورات الجديدة. أتعامل مع التطور التقني بنظرة إنسانية تهتم بالسياقات التي يُستخدم فيها.',
    'Je suis Joan Ricardo Roa Mora, ingénieur DevOps. La technologie et les possibilités offertes par les avancées récentes m’ont toujours intéressé. J’aborde le développement technologique avec un regard humaniste, attentif à ses contextes d’utilisation.',
  ]],
  [p.introduction[1],[
    'I am currently in the United States, progressing through my technology master’s studies and developing solutions with AI agents and frontier models.',
    '目前我在美国继续攻读技术领域的硕士课程，同时利用人工智能智能体与前沿模型开发解决方案。',
    'फ़िलहाल मैं अमेरिका में तकनीक के अपने मास्टर कार्यक्रमों में आगे बढ़ रहा हूँ और एआई एजेंट तथा फ़्रंटियर मॉडल से समाधान विकसित कर रहा हूँ।',
    'أقيم حاليًا في الولايات المتحدة، وأواصل دراساتي في الماجستير في التكنولوجيا، وأطور حلولًا بوكلاء الذكاء الاصطناعي والنماذج المتقدمة.',
    'Je suis actuellement aux États-Unis, où je poursuis mes études de master en technologie et développe des solutions avec des agents d’IA et des modèles de pointe.',
  ]],
  [p.biography[0],[
    'I have always been curious about technology. I enjoy exploring new advances, trying tools and understanding how they can solve concrete problems. Over time, this interest has taken me into different fields, from cloud infrastructure to data analysis and public-sector applications.',
    '我一直对技术充满好奇。我喜欢了解最新进展、尝试工具，并理解它们如何解决具体问题。随着时间推移，这种兴趣让我涉足了不同领域，从云基础设施到数据分析和公共部门应用。',
    'तकनीक को लेकर मैं हमेशा जिज्ञासु रहा हूँ। नई प्रगति जानना, टूल आज़माना और ठोस समस्याएँ सुलझाने में उनका उपयोग समझना मुझे पसंद है। इस रुचि ने मुझे क्लाउड इन्फ्रास्ट्रक्चर से लेकर डेटा विश्लेषण और सार्वजनिक क्षेत्र के अनुप्रयोगों तक पहुँचाया है।',
    'لطالما كنت فضوليًا تجاه التكنولوجيا. أحب متابعة التطورات وتجربة الأدوات وفهم كيف تحل مشكلات ملموسة. ومع الوقت، قادني هذا الاهتمام إلى مجالات مختلفة، من البنية السحابية إلى تحليل البيانات وتطبيقات القطاع العام.',
    'J’ai toujours été curieux de technologie. J’aime découvrir les avancées, essayer des outils et comprendre comment ils peuvent résoudre des problèmes concrets. Cet intérêt m’a conduit vers des domaines variés, de l’infrastructure cloud à l’analyse de données et aux applications du secteur public.',
  ]],
  [p.biography[1],[
    'Law and the humanities have also been part of my journey, shaping how I understand technology. When I think about a solution, I want to understand who will use it, in what context and what it means for people.',
    '法律与人文学科也是我经历的一部分，影响着我对技术的理解。思考一个解决方案时，我关心谁会使用它、使用的背景，以及它对人的意义。',
    'कानून और मानविकी भी मेरी यात्रा का हिस्सा रहे हैं और उन्होंने तकनीक के प्रति मेरी समझ को आकार दिया है। किसी समाधान पर सोचते समय मैं जानना चाहता हूँ कि उसे कौन, किस संदर्भ में उपयोग करेगा और लोगों पर उसका क्या असर होगा।',
    'كان القانون والعلوم الإنسانية أيضًا جزءًا من رحلتي، وأثّرا في فهمي للتكنولوجيا. عندما أفكر في حل، أهتم بمن سيستخدمه، وفي أي سياق، وماذا يعني للناس.',
    'Le droit et les sciences humaines font aussi partie de mon parcours et influencent ma compréhension de la technologie. Face à une solution, je cherche à comprendre qui l’utilisera, dans quel contexte et ce qu’elle implique pour les personnes.',
  ]],
  [p.biography[2],[
    'I have used and developed technologies for the energy sector in Texas, public administration in Colombia and work concerning victims of armed conflict. I have also worked with simulation, data extraction and profile construction and analysis. These experiences have connected technical work with the needs of different sectors.',
    '我曾为得克萨斯州能源行业、哥伦比亚公共行政，以及与武装冲突受害者相关的领域应用和开发技术。我也从事过仿真、数据提取，以及档案构建与分析。这些经历让我把技术与不同领域的问题和需求联系起来。',
    'मैंने टेक्सस के ऊर्जा क्षेत्र, कोलंबिया के सार्वजनिक प्रशासन और सशस्त्र संघर्ष के पीड़ितों से जुड़े क्षेत्र के लिए तकनीक का उपयोग और विकास किया है। मैंने सिमुलेशन, डेटा निष्कर्षण तथा प्रोफ़ाइल निर्माण और विश्लेषण पर भी काम किया है। इन अनुभवों ने तकनीकी काम को विभिन्न क्षेत्रों की ज़रूरतों से जोड़ा है।',
    'استخدمت وطورت تقنيات لقطاع الطاقة في تكساس والإدارة العامة في كولومبيا والمجالات المتعلقة بضحايا النزاع المسلح. وعملت أيضًا في المحاكاة واستخراج البيانات وبناء الملفات وتحليلها. ربطت هذه التجارب الجانب التقني باحتياجات قطاعات مختلفة.',
    'J’ai utilisé et développé des technologies pour l’énergie au Texas, l’administration publique en Colombie et le domaine des victimes du conflit armé. J’ai aussi travaillé sur la simulation, l’extraction de données et la construction et l’analyse de profils. Ces expériences relient la technique aux besoins de différents secteurs.',
  ]],
  [p.biography[3],[
    'As an engineer, I have worked on projects for HP, Coupa and Home Depot, automating processes, moving applications to the cloud and improving platform reliability. I enjoy understanding how systems work and finding ways to make their operation simpler and more stable.',
    '作为工程师，我参与过 HP、Coupa 和 Home Depot 的项目，致力于流程自动化、应用上云，以及提升平台可靠性。我喜欢理解系统如何运作，并寻找让运行更简单、更稳定的方法。',
    'इंजीनियर के रूप में मैंने HP, Coupa और Home Depot की परियोजनाओं में प्रक्रियाएँ स्वचालित कीं, एप्लिकेशन क्लाउड पर पहुँचाए और प्लेटफ़ॉर्म की विश्वसनीयता सुधारी। सिस्टम को समझना और उसका संचालन सरल व स्थिर बनाना मुझे पसंद है।',
    'عملت مهندسًا في مشاريع لصالح HP وCoupa وHome Depot، على أتمتة العمليات ونقل التطبيقات إلى السحابة وتحسين موثوقية المنصات. أحب فهم عمل الأنظمة وتبسيط تشغيلها وجعله أكثر استقرارًا.',
    'Comme ingénieur, j’ai travaillé sur des projets pour HP, Coupa et Home Depot : automatisation, migration d’applications vers le cloud et fiabilité des plateformes. J’aime comprendre les systèmes et rendre leur fonctionnement plus simple et plus stable.',
  ]],
  [p.biography[4],[
    'Today I am in the United States, continuing my master’s programs with an emphasis on AI, software engineering and distributed systems. At the same time, I develop technologies with AI agents and frontier models, continuing to explore technological advances and their applications.',
    '如今我在美国继续攻读硕士课程，重点是人工智能、软件工程与分布式系统。同时，我也使用人工智能智能体和前沿模型开发技术，继续探索技术进步及其应用。',
    'आज मैं अमेरिका में एआई, सॉफ़्टवेयर इंजीनियरिंग और वितरित सिस्टम पर केंद्रित अपने मास्टर कार्यक्रम जारी रख रहा हूँ। साथ ही एआई एजेंट और फ़्रंटियर मॉडल से तकनीक विकसित करता हूँ, ताकि नई प्रगति और उसके उपयोगों की खोज जारी रहे।',
    'أواصل اليوم في الولايات المتحدة برامج الماجستير مع التركيز على الذكاء الاصطناعي وهندسة البرمجيات والأنظمة الموزعة. وبالتوازي، أطور تقنيات بوكلاء الذكاء الاصطناعي والنماذج المتقدمة، مستكشفًا التطورات وتطبيقاتها.',
    'Aujourd’hui aux États-Unis, je poursuis mes masters en privilégiant l’IA, le génie logiciel et les systèmes distribués. Je développe aussi des technologies avec des agents d’IA et des modèles de pointe, pour continuer à explorer les avancées et leurs applications.',
  ]],
  [p.practice[0],[
    'I work with infrastructure on AWS, Google Cloud and Azure. I use Terraform and Ansible to automate configuration and keep environments consistent. I also prepare processes to build, review and deploy applications with fewer manual steps.',
    '我使用 AWS、Google Cloud 和 Azure 基础设施，通过 Terraform 和 Ansible 自动配置并保持环境一致。我还搭建构建、审查和部署应用的流程，减少手动步骤。',
    'मैं AWS, Google Cloud और Azure इन्फ्रास्ट्रक्चर पर काम करता हूँ। Terraform और Ansible से कॉन्फ़िगरेशन स्वचालित कर वातावरण एकसमान रखता हूँ। एप्लिकेशन बनाने, जाँचने और तैनात करने की प्रक्रियाओं में मैन्युअल चरण भी कम करता हूँ।',
    'أعمل على البنية التحتية في AWS وGoogle Cloud وAzure. أستخدم Terraform وAnsible لأتمتة الإعداد وتوحيد البيئات، وأجهز عمليات بناء التطبيقات ومراجعتها ونشرها بخطوات يدوية أقل.',
    'Je travaille sur l’infrastructure AWS, Google Cloud et Azure. Avec Terraform et Ansible, j’automatise la configuration et garde des environnements cohérents. Je prépare aussi les processus de construction, de revue et de déploiement pour réduire les étapes manuelles.',
  ]],
  [p.practice[1],[
    'Another part of my work is reliability. I bring together metrics, logs and traces to understand services, detect problems and help recovery. I also incorporate security analysis and collaborate with development teams to improve application operations.',
    '我的另一部分工作是可靠性。我整合指标、日志和链路追踪，理解服务状态、发现问题并协助恢复。同时引入安全分析，与开发团队合作改善应用运行。',
    'मेरे काम का दूसरा भाग विश्वसनीयता है। सेवाओं को समझने, समस्याएँ पहचानने और बहाली आसान बनाने के लिए मेट्रिक्स, लॉग और ट्रेस जोड़ता हूँ। सुरक्षा विश्लेषण शामिल करता हूँ और विकास टीमों के साथ संचालन सुधारता हूँ।',
    'جانب آخر من عملي هو الموثوقية. أجمع المقاييس والسجلات والتتبعات لفهم الخدمات واكتشاف المشكلات وتسهيل التعافي، مع دمج التحليل الأمني والتعاون مع فرق التطوير لتحسين تشغيل التطبيقات.',
    'La fiabilité est un autre volet de mon travail. Je réunis métriques, journaux et traces pour comprendre les services, détecter les problèmes et faciliter leur reprise. J’intègre l’analyse de sécurité et collabore avec les équipes de développement pour améliorer l’exploitation.',
  ]],
  [p.practice[2],[
    'In my own projects, I have applied this knowledge to PDF processing and energy data analysis. I am also currently developing solutions with AI agents and frontier models.',
    '在个人项目中，我将这些知识应用于 PDF 处理与能源数据分析。目前也在利用人工智能智能体和前沿模型开发解决方案。',
    'निजी परियोजनाओं में मैंने यह ज्ञान PDF प्रोसेसिंग और ऊर्जा डेटा विश्लेषण में लगाया है। अभी एआई एजेंट और फ़्रंटियर मॉडल से समाधान भी विकसित कर रहा हूँ।',
    'طبقت هذه المعرفة في مشاريعي على معالجة PDF وتحليل بيانات الطاقة. وأطور حاليًا حلولًا بوكلاء الذكاء الاصطناعي والنماذج المتقدمة.',
    'Dans mes projets personnels, j’applique ces connaissances au traitement des PDF et à l’analyse de données énergétiques. Je développe aussi des solutions avec des agents d’IA et des modèles de pointe.',
  ]],
  [p.contact.location,['Houston metropolitan area, Texas, United States','美国得克萨斯州休斯敦都市区','ह्यूस्टन महानगरीय क्षेत्र, टेक्सस, अमेरिका','منطقة هيوستن الحضرية، تكساس، الولايات المتحدة','Région métropolitaine de Houston, Texas, États-Unis']],
  [p.contact.invitation,['If you have a project in mind or would like to talk about technology, AI or any of these subjects, write to me and we can talk.','如果你有一个项目构想，或想聊聊技术、人工智能以及这里的任何主题，欢迎写信交流。','अगर आपके मन में कोई परियोजना है या तकनीक, एआई या इन विषयों पर बात करना चाहते हैं, तो मुझे लिखें।','إن كان لديك مشروع أو رغبة في الحديث عن التكنولوجيا أو الذكاء الاصطناعي أو أحد هذه المواضيع، فاكتب لي لنتحدث.','Si vous avez un projet en tête ou souhaitez discuter de technologie, d’IA ou de l’un de ces sujets, écrivez-moi et échangeons.']],
  [p.featuredProjects[0].summary,['I designed and provisioned AWS microservices infrastructure with deployment automation, configuration management and end-to-end distributed observability.','我设计并配置了 AWS 微服务基础设施，包括部署自动化、配置管理及端到端分布式可观测性。','मैंने AWS पर माइक्रोसर्विस इन्फ्रास्ट्रक्चर बनाया और प्रोविज़न किया, जिसमें स्वचालित तैनाती, कॉन्फ़िगरेशन प्रबंधन और संपूर्ण वितरित ऑब्ज़र्वेबिलिटी शामिल थी।','صممت وجهزت بنية خدمات مصغرة على AWS مع أتمتة النشر وإدارة الإعداد وقابلية الرصد الموزعة من البداية إلى النهاية.','J’ai conçu et provisionné une infrastructure de microservices sur AWS, avec automatisation des déploiements, gestion de configuration et observabilité distribuée de bout en bout.']],
];

const applications: Translation[] = [
  ['Texas energy sector: power-grid monitoring and analysis and battery energy storage.','得克萨斯州能源行业：电网监测与分析及电池储能。','टेक्सस ऊर्जा क्षेत्र: ग्रिड निगरानी, विश्लेषण और बैटरी ऊर्जा भंडारण।','قطاع الطاقة في تكساس: مراقبة الشبكة وتحليلها وتخزين الطاقة بالبطاريات.','Énergie au Texas : suivi et analyse du réseau électrique et stockage par batteries.'],
  ['Public sector and public administration in Colombia.','哥伦比亚公共部门与公共行政。','कोलंबिया का सार्वजनिक क्षेत्र और प्रशासन।','القطاع العام والإدارة العامة في كولومبيا.','Secteur public et administration publique en Colombie.'],
  ['Technology related to victims of armed conflict in Colombia.','与哥伦比亚武装冲突受害者相关的技术。','कोलंबिया में सशस्त्र संघर्ष के पीड़ितों से जुड़ी तकनीक।','تقنيات تتعلق بضحايا النزاع المسلح في كولومبيا.','Technologies liées aux victimes du conflit armé en Colombie.'],
  ['Simulation and scenario analysis.','仿真与情景分析。','सिमुलेशन और परिदृश्य विश्लेषण।','المحاكاة وتحليل السيناريوهات.','Simulation et analyse de scénarios.'],
  ['Data extraction and profile construction and analysis.','数据提取及档案构建与分析。','डेटा निष्कर्षण और प्रोफ़ाइल निर्माण व विश्लेषण।','استخراج البيانات وبناء الملفات وتحليلها.','Extraction de données, construction et analyse de profils.'],
  ['Predictive analysis of electricity consumption using historical data.','基于历史数据的用电量预测分析。','ऐतिहासिक डेटा से बिजली खपत का पूर्वानुमान विश्लेषण।','تحليل تنبؤي لاستهلاك الكهرباء ببيانات تاريخية.','Analyse prédictive de la consommation électrique à partir de données historiques.'],
  ['PDF document processing with microservices platforms.','通过微服务平台处理 PDF 文档。','माइक्रोसर्विस प्लेटफ़ॉर्म से PDF दस्तावेज़ प्रोसेसिंग।','معالجة مستندات PDF بمنصات الخدمات المصغرة.','Traitement de PDF avec des plateformes de microservices.'],
  ['Cloud migration of applications and infrastructure.','应用与基础设施的云迁移。','एप्लिकेशन और इन्फ्रास्ट्रक्चर की क्लाउड माइग्रेशन।','نقل التطبيقات والبنية التحتية إلى السحابة.','Migration des applications et infrastructures vers le cloud.'],
  ['Infrastructure and software-delivery automation.','基础设施与软件交付自动化。','इन्फ्रास्ट्रक्चर और सॉफ़्टवेयर डिलीवरी स्वचालन।','أتمتة البنية التحتية وتسليم البرمجيات.','Automatisation de l’infrastructure et de la livraison logicielle.'],
  ['Application monitoring, failure analysis and automated service recovery.','应用监控、故障分析与自动化服务恢复。','एप्लिकेशन निगरानी, विफलता विश्लेषण और स्वचालित सेवा बहाली।','مراقبة التطبيقات وتحليل الأعطال والتعافي الآلي للخدمات.','Suivi des applications, analyse des pannes et reprise automatisée.'],
  ['Security analysis integrated into development workflows.','在开发流程中集成安全分析。','विकास प्रक्रियाओं में सुरक्षा विश्लेषण।','دمج التحليل الأمني في عمليات التطوير.','Intégration de l’analyse de sécurité au développement.'],
  ['Solutions built with AI agents and frontier models.','使用人工智能智能体与前沿模型开发解决方案。','एआई एजेंट और फ़्रंटियर मॉडल से समाधान।','حلول بوكلاء الذكاء الاصطناعي والنماذج المتقدمة.','Solutions avec des agents d’IA et des modèles de pointe.'],
];
const areas: Translation[] = [
  ['Cloud','云','क्लाउड','السحابة','Cloud'],['Infrastructure and configuration','基础设施与配置','इन्फ्रास्ट्रक्चर और कॉन्फ़िगरेशन','البنية التحتية والإعداد','Infrastructure et configuration'],
  ['Containers','容器','कंटेनर','الحاويات','Conteneurs'],['CI/CD and security','CI/CD 与安全','CI/CD और सुरक्षा','CI/CD والأمان','CI/CD et sécurité'],
  ['Observability','可观测性','ऑब्ज़र्वेबिलिटी','قابلية الرصد','Observabilité'],['Incident management','事件管理','घटना प्रबंधन','إدارة الحوادث','Gestion des incidents'],
  ['Services and architecture','服务与架构','सेवाएँ और आर्किटेक्चर','الخدمات والمعمارية','Services et architecture'],['Programming and data','编程与数据','प्रोग्रामिंग और डेटा','البرمجة والبيانات','Programmation et données'],
];
const experienceTitles: Translation[] = [
  ['DevOps and platforms for HP','为 HP 提供 DevOps 与平台工作','HP के लिए DevOps और प्लेटफ़ॉर्म','DevOps ومنصات لصالح HP','DevOps et plateformes pour HP'],
  ['Platform reliability at Hyperion for Coupa','在 Hyperion 为 Coupa 提供平台可靠性工作','Hyperion में Coupa के लिए प्लेटफ़ॉर्म विश्वसनीयता','موثوقية المنصات في Hyperion لصالح Coupa','Fiabilité des plateformes chez Hyperion pour Coupa'],
  ['Platform reliability at Taller Technologies for Home Depot','在 Taller Technologies 为 Home Depot 提供平台可靠性工作','Taller Technologies में Home Depot के लिए प्लेटफ़ॉर्म विश्वसनीयता','موثوقية المنصات في Taller Technologies لصالح Home Depot','Fiabilité des plateformes chez Taller Technologies pour Home Depot'],
];
const experience: Translation[][] = [
  [
    ['I built and maintained CI/CD pipelines, reusable templates and operating-system base images and ISOs. I integrated Veracode into delivery workflows for automated security analysis of Python, Go and Java code and build artifacts.','我构建和维护 CI/CD 流水线、可复用模板、操作系统基础镜像和 ISO，并将 Veracode 集成到交付流程中，自动分析 Python、Go、Java 代码及构建产物的安全性。','मैंने CI/CD पाइपलाइन, पुनः उपयोग योग्य टेम्पलेट, ऑपरेटिंग सिस्टम बेस इमेज और ISO बनाए और बनाए रखे। Python, Go, Java और बिल्ड आर्टिफ़ैक्ट के स्वचालित सुरक्षा विश्लेषण के लिए Veracode जोड़ा।','بنيت وصنت خطوط CI/CD وقوالب قابلة لإعادة الاستخدام وصور أنظمة تشغيل وISO. ودمجت Veracode لتحليل أمان كود Python وGo وJava ومخرجات البناء آليًا.','J’ai construit et maintenu des pipelines CI/CD, des modèles réutilisables, des images système de base et des ISO. J’ai intégré Veracode pour analyser automatiquement la sécurité du code Python, Go et Java et des artefacts de construction.'],
    ['Scheduling automated infrastructure-template execution reduced manual operations by approximately 40% and improved consistency between environments.','通过计划任务自动执行基础设施模板，使手动操作减少约 40%，并改善了环境之间的一致性。','शेड्यूल किए गए कार्यों से इन्फ्रास्ट्रक्चर टेम्पलेट चलाने पर मैन्युअल संचालन लगभग 40% कम हुआ और वातावरण में एकरूपता बढ़ी।','قللت أتمتة تنفيذ قوالب البنية التحتية بالمهام المجدولة العمليات اليدوية بنحو 40% وحسنت اتساق البيئات.','L’exécution automatisée et planifiée des modèles d’infrastructure a réduit les opérations manuelles d’environ 40 % et amélioré la cohérence des environnements.'],
  ],
  [
    ['I managed core infrastructure and helped coordinate software releases. I also maintained internal deployment platforms based on Jenkins and Chef.','我负责核心基础设施，并参与协调软件发布，同时维护基于 Jenkins 和 Chef 的内部部署平台。','मैंने मुख्य इन्फ्रास्ट्रक्चर सँभाला और सॉफ़्टवेयर रिलीज़ के समन्वय में भाग लिया। Jenkins और Chef पर आधारित आंतरिक तैनाती प्लेटफ़ॉर्म भी बनाए रखे।','أدرت البنية التحتية الأساسية وساهمت في تنسيق إصدارات البرمجيات، وصنت منصات نشر داخلية تعتمد على Jenkins وChef.','J’ai géré l’infrastructure centrale et participé à la coordination des versions logicielles, tout en maintenant des plateformes internes de déploiement basées sur Jenkins et Chef.'],
    ['I developed automated recovery tasks for critical server failures and implemented observability and proactive monitoring for development environments. These changes reduced mean time to detection by approximately 25%.','我开发了关键服务器故障的自动恢复任务，并为开发环境实施可观测性与主动监控。这些改进使平均问题发现时间减少约 25%。','मैंने गंभीर सर्वर विफलताओं से बहाली के स्वचालित कार्य बनाए और विकास वातावरण में ऑब्ज़र्वेबिलिटी व सक्रिय निगरानी लागू की। औसत समस्या पहचान समय लगभग 25% घटा।','طورت مهام تعافٍ آلية لأعطال الخوادم الحرجة وطبقت الرصد والمراقبة الاستباقية لبيئات التطوير. قلّ متوسط وقت اكتشاف المشكلات بنحو 25%.','J’ai automatisé la reprise après des pannes critiques de serveurs et mis en place observabilité et surveillance proactive des environnements de développement. Le délai moyen de détection a diminué d’environ 25 %.'],
  ],
  [
    ['I led application migrations from on-premises environments to Google Cloud using Terraform and developed deployment pipelines for GCP workloads.','我使用 Terraform 主导应用从本地环境迁移到 Google Cloud，并为 GCP 工作负载开发部署流水线。','मैंने Terraform से ऑन-प्रिमाइसेस एप्लिकेशन Google Cloud पर माइग्रेट करने का नेतृत्व किया और GCP वर्कलोड के लिए तैनाती पाइपलाइन बनाई।','قدت نقل التطبيقات من البيئات المحلية إلى Google Cloud باستخدام Terraform، وطورت خطوط نشر لأحمال GCP.','J’ai piloté la migration d’applications locales vers Google Cloud avec Terraform et développé des pipelines de déploiement pour les charges GCP.'],
    ['I also defined and monitored service-level objectives (SLOs) and error budgets for critical services, working with engineering teams to prioritize reliability improvements and maintain 99.9% availability.','我还为关键服务制定和监督服务级别目标（SLO）与错误预算，与工程团队合作优先改善可靠性，并维持 99.9% 的可用性。','मैंने महत्वपूर्ण सेवाओं के SLO और एरर बजट तय किए और उनकी निगरानी की। इंजीनियरिंग टीमों के साथ विश्वसनीयता सुधार प्राथमिकता देकर 99.9% उपलब्धता बनाए रखी।','حددت وتابعت أهداف مستوى الخدمة SLO وميزانيات الأخطاء للخدمات الحرجة، بالتعاون مع فرق الهندسة لتحديد أولويات الموثوقية والحفاظ على توافر 99.9%.','J’ai défini et suivi les objectifs de niveau de service (SLO) et les budgets d’erreur des services critiques, avec les équipes d’ingénierie, afin de prioriser la fiabilité et de maintenir une disponibilité de 99,9 %.'],
  ],
];
const education: Translation[] = [
  ['Indiana Wesleyan University. Since 2026; in progress.','Indiana Wesleyan University。2026 年起，在读。','Indiana Wesleyan University। 2026 से; जारी।','Indiana Wesleyan University. منذ 2026؛ قيد الدراسة.','Indiana Wesleyan University. Depuis 2026 ; en cours.'],
  ['Maharishi International University. Since 2025; in progress.','Maharishi International University。2025 年起，在读。','Maharishi International University। 2025 से; जारी।','Maharishi International University. منذ 2025؛ قيد الدراسة.','Maharishi International University. Depuis 2025 ; en cours.'],
  ['Universidad Nacional Autónoma de México (UNAM), 2024. Data modeling, data warehousing and database administration.','Universidad Nacional Autónoma de México（UNAM），2024 年。数据建模、数据仓库与数据库管理。','Universidad Nacional Autónoma de México (UNAM), 2024। डेटा मॉडलिंग, डेटा वेयरहाउसिंग और डेटाबेस प्रशासन।','Universidad Nacional Autónoma de México (UNAM)، 2024. نمذجة البيانات ومستودعاتها وإدارة قواعد البيانات.','Universidad Nacional Autónoma de México (UNAM), 2024. Modélisation, entrepôts de données et administration de bases de données.'],
  ['Universidad Nacional Abierta y a Distancia (UNAD), 2021–2024.','Universidad Nacional Abierta y a Distancia（UNAD），2021–2024 年。','Universidad Nacional Abierta y a Distancia (UNAD), 2021–2024।','Universidad Nacional Abierta y a Distancia (UNAD)، 2021–2024.','Universidad Nacional Abierta y a Distancia (UNAD), 2021–2024.'],
];
p.applications.forEach((source,i) => rows.push([source,applications[i]]));
p.technologies.forEach((entry,i) => rows.push([entry.area,areas[i]]));
p.experience.forEach((entry,i) => { rows.push([entry.title,experienceTitles[i]]); entry.paragraphs.forEach((source,j) => rows.push([source,experience[i][j]])); });
p.education.forEach((entry,i) => rows.push([entry.description,education[i]]));
rows.push(['Ingeniería de Sistemas',['Systems Engineering','系统工程','सिस्टम इंजीनियरिंग','هندسة الأنظمة','Ingénierie des systèmes']]);
rows.push(['Bootcamp de Data Analytics',['Data Analytics Bootcamp','数据分析训练营','डेटा एनालिटिक्स बूटकैंप','معسكر تحليل البيانات','Bootcamp d’analyse de données']]);
for (const entry of p.certifications) {
  const provider = entry.description.split('.')[0];
  const year = entry.description.match(/\d{4}/)![0];
  rows.push([entry.description,[`${provider}. Valid through ${year}.`,`${provider}。有效期至 ${year} 年。`,`${provider}। ${year} तक मान्य।`,`${provider}. صالحة حتى ${year}.`,`${provider}. Valide jusqu’en ${year}.`]]);
}
rows.push(['sistemas distribuidos',['distributed systems','分布式系统','वितरित सिस्टम','أنظمة موزعة','systèmes distribués']]);
export const profileTranslations = Object.fromEntries(rows.map(([source,translation]) => [normalizeText(source),translation]));
