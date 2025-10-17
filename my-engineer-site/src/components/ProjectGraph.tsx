// src/components/ProjectGraph.tsx
import { useEffect, useRef, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { Project } from '../data/projects';
import ProjectModal from './ProjectModal';

interface ProjectGraphProps {
  projects: Project[];
}

const ProjectGraph = ({ projects }: ProjectGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    // Create nodes and links
    const nodes = projects.map(p => ({ ...p }));
    const links = projects.flatMap(p =>
      p.connections.map(targetId => ({
        source: p.id,
        target: targetId,
      }))
    );

    // D3 force simulation
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        // Update link positions
        svg.querySelectorAll('.link').forEach((link, i) => {
          const l = links[i];
          const source = nodes.find(n => n.id === l.source);
          const target = nodes.find(n => n.id === l.target);
          if (source && target) {
            (link as SVGLineElement).setAttribute('x1', String(source.x ?? 0));
            (link as SVGLineElement).setAttribute('y1', String(source.y ?? 0));
            (link as SVGLineElement).setAttribute('x2', String(target.x ?? 0));
            (link as SVGLineElement).setAttribute('y2', String(target.y ?? 0));
          }
        });

        // Update node positions
        svg.querySelectorAll('.node').forEach((node, i) => {
          const n = nodes[i];
          (node as SVGCircleElement).setAttribute('cx', String(n.x ?? 0));
          (node as SVGCircleElement).setAttribute('cy', String(n.y ?? 0));
        });
      });

    // Clean up
    return () => simulation.stop();
  }, [projects]);

  return (
    <>
      <svg
        ref={svgRef}
        className="w-full h-[600px] bg-transparent"
        style={{ maxHeight: '80vh' }}
      >
        {/* Links */}
        {projects.flatMap(p =>
          p.connections.map((targetId, i) => (
            <line
              key={`${p.id}-${targetId}-${i}`}
              className="link stroke-cyan-500/30"
              strokeWidth={1.5}
            />
          ))
        )}

        {/* Nodes */}
        {projects.map((project) => (
          <circle
            key={project.id}
            className="node fill-cyan-500 cursor-pointer transition hover:fill-cyan-300"
            r="12"
            onClick={() => setSelectedProject(project)}
            style={{ pointerEvents: 'auto' }}
          />
        ))}
      </svg>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectGraph;