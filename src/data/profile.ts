import markdown from '../../docs/PERFIL_PUBLICO.md?raw';
import { parsePublicProfile } from '../utils/profile';
import { projects, repositoryName } from './projects';

export const publicProfile = parsePublicProfile(markdown);

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const featuredProjects = publicProfile.featuredProjects.map(selection => {
  const name = normalize(selection.name);
  const matches = projects.filter(project => normalize(repositoryName(project)).startsWith(name) || normalize(project.title.split('·')[0]) === name);
  if (matches.length !== 1) throw new Error(`El proyecto destacado «${selection.name}» debe corresponder a una ficha aprobada única.`);
  return { ...matches[0], personalSummary: selection.summary };
});
