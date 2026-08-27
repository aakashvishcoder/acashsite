import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Carousel from './Carousel';
import ProjectModel from './ProjectModel';
import { Project } from '../data/projects';
import { ACCENTS, allSkills, projectsForSkill, skillCategories, skillUsage } from '../data/skills';

const SkillsSection = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? allSkills : allSkills.filter((s) => s.categoryId === filter)),
    [filter]
  );

  const linked = selected ? projectsForSkill(selected) : [];
  const selectedSkill = allSkills.find((s) => s.name === selected) ?? null;

  return (
    <section id="skills" className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <p className="font-mono text-xs text-phos-dim prompt mb-2">ls ./skills --long</p>
          <h2 className="font-display text-5xl md:text-6xl text-phos glow leading-none">
            bill of materials
          </h2>
          <p className="mt-2 font-mono text-sm text-[#8fa89a]">
            {allSkills.length} parts across {skillCategories.length} blocks &mdash; select one to trace where it&rsquo;s used.
          </p>
        </div>

        <Carousel
          title={`ls ./skills/${filter === 'all' ? '' : filter}`}
          label="Skills"
          toolbar={
            <div className="hidden md:flex items-center gap-1.5 mr-1">
              <button className="tab" data-active={filter === 'all'} onClick={() => setFilter('all')}>
                all
              </button>
              {skillCategories.map((c) => (
                <button
                  key={c.id}
                  className="tab"
                  data-active={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          }
        >
          {visible.map((skill) => {
            const a = ACCENTS[skill.accent];
            const uses = skillUsage[skill.name] ?? 0;
            const isOn = selected === skill.name;
            return (
              <button
                key={skill.name}
                className={`tcard w-[190px] p-3 ${isOn ? 'border-phos bg-board-600/85' : ''}`}
                onClick={() => setSelected(isOn ? null : skill.name)}
                aria-pressed={isOn}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-1.5 h-1.5 ${a.dot}`} />
                  <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-etch-bright">
                    {skill.ref}
                  </span>
                  <span className="ml-auto font-tech text-[10px] text-etch-bright">
                    {uses > 0 ? `${uses}×` : '—'}
                  </span>
                </div>

                <span className={`font-mono text-sm leading-tight ${isOn ? 'text-phos' : 'text-[#c3d6cb]'}`}>
                  {skill.name}
                </span>

                <span className="mt-auto pt-3 font-tech text-[10px] uppercase tracking-[0.14em] text-phos-dim">
                  {skill.categoryLabel}
                </span>

                {/* pin-1 notch */}
                <span className="absolute top-0 right-0 w-2 h-2 border-l border-b border-etch" />
              </button>
            );
          })}
        </Carousel>

        {/* Trace readout — which projects consume the selected part */}
        <AnimatePresence initial={false}>
          {selectedSkill && (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="term-panel mt-3 p-4 md:p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-phos-dim prompt">
                    grep -rl &quot;{selectedSkill.name}&quot; ./projects
                  </span>
                  <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-etch-bright">
                    {linked.length} match{linked.length === 1 ? '' : 'es'}
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="ml-auto font-mono text-xs text-etch-bright hover:text-fault transition-colors"
                  >
                    [x] close
                  </button>
                </div>

                <div className="rule my-3" />

                {linked.length === 0 ? (
                  <p className="font-mono text-sm text-[#7d938a]">
                    <span className="text-phos-dim select-none">&gt; </span>
                    no public project references this part yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {linked.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setOpenProject(p)}
                        className="chip hover:!text-phos hover:!border-phos-dim"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectModel project={openProject} onClose={() => setOpenProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SkillsSection;
