// src/data/skills.ts
import { Project, projects } from './projects';

export type Accent = 'phos' | 'amber' | 'probe' | 'copper';

export type SkillCategory = {
  id: string;
  ref: string;
  label: string;
  tagline: string;
  accent: Accent;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: 'hardware',
    ref: 'U1',
    label: 'hardware',
    tagline: 'schematic capture, board layout, and bring-up',
    accent: 'amber',
    items: ['PCB Design', 'ESP32', 'RaspberryPI', 'Arduino', 'Embedded C', 'KiCad', 'EasyEDA', 'Fusion360'],
  },
  {
    id: 'software',
    ref: 'U2',
    label: 'software',
    tagline: 'application and systems code, front to back',
    accent: 'phos',
    items: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS', 'C++', 'C#', 'Python', 'SQL', 'Solidity', 'Java', 'Unity'],
  },
  {
    id: 'ai',
    ref: 'U3',
    label: 'ai & systems',
    tagline: 'models, training loops, and data plumbing',
    accent: 'probe',
    items: ['PyTorch', 'Transformers', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Scikit-learn', 'Matplotlib', 'Pandas'],
  },
];

export type Skill = {
  name: string;
  categoryId: string;
  categoryLabel: string;
  ref: string;
  accent: Accent;
};

export const allSkills: Skill[] = skillCategories.flatMap((c) =>
  c.items.map((name) => ({
    name,
    categoryId: c.id,
    categoryLabel: c.label,
    ref: c.ref,
    accent: c.accent,
  }))
);

/**
 * Project `tech` strings are hand-entered and inconsistently cased
 * ('Javascript' vs 'JavaScript'), so match on a normalized key.
 */
const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

export const projectsForSkill = (skill: string): Project[] =>
  projects.filter((p) => p.tech.some((t) => norm(t) === norm(skill)));

/** Precomputed usage count so cards can show it without re-scanning. */
export const skillUsage: Record<string, number> = Object.fromEntries(
  allSkills.map((s) => [s.name, projectsForSkill(s.name).length])
);

type AccentSet = {
  text: string;
  border: string;
  borderHover: string;
  bg: string;
  dot: string;
  hex: string;
};

export const ACCENTS: Record<Accent, AccentSet> = {
  phos: {
    text: 'text-phos',
    border: 'border-phos-dim/50',
    borderHover: 'hover:border-phos',
    bg: 'bg-phos/5',
    dot: 'bg-phos',
    hex: '#4dff9f',
  },
  amber: {
    text: 'text-amber',
    border: 'border-amber-dim/50',
    borderHover: 'hover:border-amber',
    bg: 'bg-amber/5',
    dot: 'bg-amber',
    hex: '#ffb454',
  },
  probe: {
    text: 'text-probe',
    border: 'border-probe-dim/50',
    borderHover: 'hover:border-probe',
    bg: 'bg-probe/5',
    dot: 'bg-probe',
    hex: '#57c7ff',
  },
  copper: {
    text: 'text-copper',
    border: 'border-copper-dim/50',
    borderHover: 'hover:border-copper',
    bg: 'bg-copper/5',
    dot: 'bg-copper',
    hex: '#c87137',
  },
};
