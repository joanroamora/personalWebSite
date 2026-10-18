export interface ProfileEntry {
  title: string;
  description: string;
}
export interface ProfileExperience {
  title: string;
  period: string;
  paragraphs: string[];
}
export interface PublicProfile {
  name: string;
  summary: string;
  introduction: string[];
  biography: string[];
  applications: string[];
  practice: string[];
  experience: ProfileExperience[];
  featuredProjects: { name: string; summary: string }[];
  technologies: { area: string; tools: string[] }[];
  education: ProfileEntry[];
  certifications: ProfileEntry[];
  contact: { location: string; invitation: string; channels: { title: string; label: string; href: string }[] };
}

/** Lee los apartados editoriales del Markdown sin ejecutar HTML ni código del documento. */
export function parsePublicProfile(markdown: string): PublicProfile {
  const text = markdown.replace(/\r\n?/g, '\n');
  const section = (source: string, title: string, level = 2): string => {
    const lines = source.split('\n');
    const start = lines.findIndex(line => line.trim() === `${'#'.repeat(level)} ${title}`);
    if (start < 0) throw new Error(`PERFIL_PUBLICO.md: falta el apartado «${title}».`);
    const end = lines.findIndex((line, index) => index > start && new RegExp(`^#{1,${level}} `).test(line));
    return lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim();
  };
  const plain = (value: string) => value.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
  const paragraphs = (value: string) => value.split(/\n\s*\n/).map(plain).filter(Boolean);
  const field = (source: string, name: string): string => {
    const line = source.split('\n').find(line => line.startsWith(`- **${name}:** `));
    if (!line) throw new Error(`PERFIL_PUBLICO.md: falta el campo «${name}».`);
    return line.slice(`- **${name}:** `.length).trim();
  };
  const entries = (source: string): ProfileEntry[] => source.split('\n').filter(line => line.startsWith('- ')).map(line => {
    const match = line.match(/^- \*\*(.+?)\*\*[,.:]?\s*(.*)$/);
    if (!match) throw new Error('PERFIL_PUBLICO.md: una ficha de formación o certificación no tiene título en negrita.');
    return { title: match[1], description: match[2] };
  });
  const chapters = (source: string) => source.split(/^### /m).slice(1).map(part => {
    const [title, ...lines] = part.split('\n');
    return { title: title.trim(), body: lines.join('\n').trim() };
  });
  const identity = section(text, 'Identidad y criterio editorial');
  const presentation = section(text, 'Presentación');
  const contact = section(text, 'Contacto');
  const channels = ['Correo', 'LinkedIn', 'GitHub'].map(title => {
    const match = field(contact, title).match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match || !(title === 'Correo' ? /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/ : /^https:\/\//).test(match[2])) {
      throw new Error(`PERFIL_PUBLICO.md: enlace público inválido para «${title}».`);
    }
    return { title, label: match[1], href: match[2] };
  });
  const technologies = section(text, 'Tecnologías y herramientas').split('\n')
    .filter(line => line.startsWith('|') && !/^\|\s*(Área|---)/.test(line))
    .map(line => {
      const [area, tools] = line.split('|').slice(1, -1).map(value => value.trim());
      if (!area || !tools) throw new Error('PERFIL_PUBLICO.md: fila de tecnologías incompleta.');
      return { area, tools: tools.split(',').map(tool => tool.trim()) };
    });
  const profile: PublicProfile = {
    name: field(identity, 'Nombre visible').replace(/\.$/, ''),
    summary: section(presentation, 'Perfil', 3),
    introduction: paragraphs(section(presentation, 'Introducción breve', 3)),
    biography: paragraphs(section(text, 'Sobre mí')),
    applications: section(text, 'Ámbitos en los que he aplicado la tecnología').split('\n').filter(line => line.startsWith('- ')).map(line => plain(line.slice(2))),
    practice: paragraphs(section(text, 'Lo que hago')),
    experience: chapters(section(text, 'Experiencia profesional')).map(({ title, body }) => {
      const [period, ...rest] = paragraphs(body);
      return { title, period, paragraphs: rest };
    }),
    featuredProjects: chapters(section(text, 'Proyectos destacados')).map(({ title, body }) => ({
      name: title,
      summary: body.split(/\n\s*\n/).find(paragraph => paragraph.trim() && !paragraph.trim().startsWith('**'))?.trim() ?? '',
    })),
    technologies,
    education: entries(section(text, 'Formación')),
    certifications: entries(section(text, 'Certificaciones')),
    contact: {
      location: field(contact, 'Ubicación').replace(/\.$/, ''),
      invitation: section(contact, 'Invitación al contacto', 3),
      channels,
    },
  };
  if (!profile.name || !profile.summary || profile.introduction.length < 1 || profile.biography.length < 2 || !profile.practice.length || !profile.experience.length || !profile.featuredProjects.length || !profile.education.length || !profile.certifications.length || !technologies.length) {
    throw new Error('PERFIL_PUBLICO.md: el perfil contiene apartados vacíos o incompletos.');
  }
  return profile;
}
