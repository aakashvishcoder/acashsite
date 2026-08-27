import { motion } from 'framer-motion';
import { IconBrandGithub } from '@tabler/icons-react';
import { Project } from '../data/projects';

interface ProjectModelProps {
  project: Project;
  onClose: () => void;
}

const ProjectModel = ({ project, onClose }: ProjectModelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-board-900/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="term-panel fiducial max-w-2xl w-full text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* window chrome */}
        <div className="term-bar">
          <span className="text-phos/70">&#9679;</span>
          <span className="truncate">less ./projects/{project.title}</span>
          <button
            onClick={onClose}
            className="ml-auto px-1.5 -mr-1 text-etch-bright hover:text-fault transition-colors text-sm leading-none"
            aria-label="Close"
          >
            [x]
          </button>
        </div>

        <div className="term-body">
          <h2 className="font-display text-4xl md:text-5xl text-phos glow leading-none">
            {project.title}
          </h2>

          <div className="rule my-4" />

          <p className="font-mono text-sm leading-relaxed text-[#b8ccc0]">
            <span className="text-phos-dim select-none">&gt; </span>
            {project.description}
          </p>

          <div className="mt-6">
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="font-tech text-xs uppercase tracking-[0.22em] text-phos">
                dependencies
              </h3>
              <span className="font-tech text-[10px] text-etch-bright">
                {project.tech.length} linked
              </span>
            </div>
            <div className="rule mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech, i) => (
                <span key={i} className="chip">{tech}</span>
              ))}
            </div>
          </div>

          {project.githubUrl && (
            <>
              <div className="rule my-6" />
              <div className="flex justify-between items-center gap-3">
                <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-etch-bright">
                  source
                </span>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="key"
                >
                  <IconBrandGithub size={16} />
                  git clone
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModel;
