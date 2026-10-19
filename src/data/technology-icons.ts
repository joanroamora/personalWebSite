// SVG locales. Fuentes, revisiones y licencias: docs/ICONOS_TECNOLOGIAS.md.
export const technologyIcons: Partial<Record<string, { file: string; monochrome?: boolean }>> = {
  Python: { file: 'python' }, FastAPI: { file: 'fastapi' }, Gemini: { file: 'googlegemini', monochrome: true },
  GCP: { file: 'googlecloud' }, Terraform: { file: 'terraform' }, Kubernetes: { file: 'kubernetes' },
  'Google Cloud Platform': { file: 'googlecloud' }, 'Microsoft Azure': { file: 'azure' },
  'Docker Compose': { file: 'docker' },
  'Argo CD': { file: 'argocd' }, Ansible: { file: 'ansible' }, Grafana: { file: 'grafana' },
  AWS: { file: 'aws', monochrome: true }, 'AWS ECS': { file: 'aws', monochrome: true },
  PyTorch: { file: 'pytorch' }, Jenkins: { file: 'jenkins' }, Docker: { file: 'docker' },
  Azure: { file: 'azure' }, SonarQube: { file: 'sonarqube' }, pandas: { file: 'pandas' },
  NumPy: { file: 'numpy' }, Matplotlib: { file: 'matplotlib' }, 'scikit-learn': { file: 'scikitlearn' },
  Flask: { file: 'flask', monochrome: true }, 'Hugging Face': { file: 'huggingface', monochrome: true },
  LangChain: { file: 'langchain', monochrome: true }, Linux: { file: 'linux' }, Bash: { file: 'bash' },
  Vagrant: { file: 'vagrant' }, VirtualBox: { file: 'virtualbox', monochrome: true }, Ruby: { file: 'ruby' },
  Jupyter: { file: 'jupyter' }, 'GitHub Actions': { file: 'githubactions' },
  OpenAI: { file: 'openai', monochrome: true },
};

export function technologyGlyph(name: string): 'code' | 'data' | 'audio' | 'scan' | 'model' | 'flow' {
  if (['NoSQL', 'SQL', 'Chroma', 'pandas', 'Monte Carlo'].includes(name)) return 'data';
  if (['Audio', 'Vosk', 'SpeechRecognition', 'ParlerTTS', 'ESPnet', 'FFmpeg'].includes(name)) return 'audio';
  if (['Tesseract', 'Pillow', 'PyMuPDF', 'ReportLab'].includes(name)) return 'scan';
  if (['OpenAI', 'Transformers', 'Sentence Transformers', 'SHAP', 'LIME', 'OpenClaw'].includes(name)) return 'model';
  if (['CI/CD', 'MLOps'].includes(name)) return 'flow';
  return 'code';
}
