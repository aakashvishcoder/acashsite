// src/components/ProjectModal.tsx
import { motion } from 'framer-motion';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-orbitron text-cyan-300">{project.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        <p className="mt-4 text-gray-300 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-6">
          <h3 className="font-rajdhani text-cyan-200 mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-900/40 text-cyan-300 text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModel;