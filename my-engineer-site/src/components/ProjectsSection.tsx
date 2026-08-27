import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IconBrandGithub } from '@tabler/icons-react';
import Carousel from './Carousel';
import ProjectGraph from './ProjectGraph';
import ProjectModel from './ProjectModel';
import { Project, projects } from '../data/projects';

const GROUP_HEX: Record<string, string> = {
  Hardware: '#ffb454',
  AI: '#4dff9f',
  Games: '#57c7ff',
  Website: '#c87137',
};

type View = 'rail' | 'graph';

const ProjectsSection = () => {
  const [view, setView] = useState<View>('rail');
  const [group, setGroup] = useState<string>('all');
  const [open, setOpen] = useState<Project | null>(null);

  const groups = useMemo(
    () => Array.from(new Set(projects.map((p) => p.group))),
    []
  );

  const visible = useMemo(
    () => (group === 'all' ? projects : projects.filter((p) => p.group === group)),
    [group]
  );

  const filters = (
    <div className="hidden md:flex items-center gap-1.5 mr-1">
      <button className="tab" data-active={group === 'all'} onClick={() => setGroup('all')}>
        all
      </button>
      {groups.map((g) => (
        <button key={g} className="tab" data-active={group === g} onClick={() => setGroup(g)}>
          {g}
        </button>
      ))}
    </div>
  );

  return (
    <section id="projects" className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-xs text-phos-dim prompt mb-2">ls ./projects</p>
            <h2 className="font-display text-5xl md:text-6xl text-phos glow leading-none">
              project index
            </h2>
            <p className="mt-2 font-mono text-sm text-[#8fa89a]">
              {projects.length} builds &mdash; open one for the full spec.
            </p>
          </div>

          {/* view switcher */}
          <div className="flex items-center gap-1.5">
            <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-etch-bright mr-1">
              view
            </span>
            <button className="tab" data-active={view === 'rail'} onClick={() => setView('rail')}>
              index
            </button>
            <button className="tab" data-active={view === 'graph'} onClick={() => setView('graph')}>
              network
            </button>
          </div>
        </div>

        {view === 'rail' ? (
          <Carousel
            title={`ls ./projects/${group === 'all' ? '' : group}`}
            label="Projects"
            toolbar={filters}
          >
            {visible.map((p) => {
              const hex = GROUP_HEX[p.group] ?? '#4dff9f';
              return (
                <article
                  key={p.id}
                  className="tcard w-[280px] md:w-[320px] p-0 cursor-pointer"
                  onClick={() => setOpen(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpen(p);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${p.title}`}
                >
                  {/* group stripe, like a keyed connector */}
                  <div
                    className="h-[3px] w-full shrink-0"
                    style={{ background: `linear-gradient(90deg, ${hex}, transparent)` }}
                  />

                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-1.5 h-1.5" style={{ background: hex }} />
                      <span
                        className="font-tech text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: hex }}
                      >
                        {p.group}
                      </span>
                      {p.githubUrl && (
                        <IconBrandGithub size={13} className="ml-auto text-etch-bright" />
                      )}
                    </div>

                    <h3 className="font-mono text-base text-[#dfeee6] leading-snug mb-2">
                      {p.title}
                    </h3>

                    <p className="font-mono text-xs leading-relaxed text-[#8fa89a] line-clamp-4">
                      {p.description}
                    </p>

                    <div className="mt-auto pt-3">
                      <div className="rule mb-2.5" />
                      <div className="flex flex-wrap gap-1">
                        {p.tech.slice(0, 4).map((t) => (
                          <span key={t} className="chip !text-[10px] !px-1.5">{t}</span>
                        ))}
                        {p.tech.length > 4 && (
                          <span className="chip !text-[10px] !px-1.5">+{p.tech.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </Carousel>
        ) : (
          <ProjectGraph projects={projects} />
        )}
      </div>

      <AnimatePresence>
        {open && <ProjectModel project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
