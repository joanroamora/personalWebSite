import { expect, test } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';
import { projects } from '../src/data/projects';

const selectedRepositories = [
  'rag-document-intelligence',
  'K8SLab2Architecture-Argo',
  'scout-pulse-engine',
  'realStateAux',
  'pdfRoar',
  'gridflow-tx-portfolio',
  'videoforge-mlops-aws',
  'operationalizing-fairness-ai',
  'LexShield',
  'Boris-SuperS', 'voiceClone', 'PyScript-Azure-Resource-Management-Automation',
  'Azure-TerraformInfra', 'Jenkins-SonarQube-Docker', 'MusicDataAnalysis',
  'University-Risk-Analysis__Preprocessing-and-Monte-Carlo-Simulation',
  'EuropePopulation2024---Dimensional-Analysis-and-MonteCarlo-Simulation',
  'AudioTranscription-SummaryPipeline', 'textToAudio-ParlerTTS', 'm4u-To-Text-Converter',
  'RAG-webApp-OpSource-IaaC-Terraform-Ansible', 'RAG-OpenAI---pdf---paraphrase-multilingual-embeddings',
  'Predictive_model_energy_consumption_per_capita_UNAD_project', 'langChainProject',
  'textRecognizer', 'ScriptLinuxMaintenance', 'VagrantFirst',
];

test.use({ javaScriptEnabled: false });

test('la selección aprobada conserva el orden y permite abrir código con teclado sin JavaScript', async ({ page }) => {
  const githubRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).hostname.endsWith('github.com')) githubRequests.push(request.url());
  });
  await page.goto(`${siteConfig.base}proyectos/`);
  const cards = page.locator('main article');
  await expect(cards).toHaveCount(selectedRepositories.length);
  await expect(page.getByRole('complementary', { name: 'Aviso de contenido de muestra' })).toHaveCount(0);
  for (const [index, repository] of selectedRepositories.entries()) {
    await expect(cards.nth(index).locator('.project-repository')).toHaveText(repository);
    await expect(cards.nth(index).getByRole('link')).toHaveAttribute('href', `${siteConfig.base}proyectos/${projects[index].id}/`);
  }
  expect(githubRequests).toEqual([]);

  const firstRepository = `https://github.com/joanroamora/${selectedRepositories[0]}`;
  const firstLink = cards.first().getByRole('link');
  await firstLink.focus();
  expect(await firstLink.evaluate(element => getComputedStyle(element, '::after').outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`http://127.0.0.1:4321${siteConfig.base}proyectos/${projects[0].id}/`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(projects[0].title);
  await expect(page.getByRole('link', { name: 'Explorar el código en GitHub' })).toHaveAttribute('href', firstRepository);
  await expect(page.locator('[data-project-detail-host]')).toHaveCount(0);
  await page.goBack();
  await expect(cards).toHaveCount(selectedRepositories.length);
  const menu = page.locator('summary[aria-controls="mobile-navigation"]');
  if (await menu.isVisible()) await menu.click();
  await expect(page.locator('nav:visible [aria-current="page"]')).toHaveText('Proyectos');
});
