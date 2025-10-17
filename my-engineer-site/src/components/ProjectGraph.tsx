// src/components/ProjectGraph.tsx
import { useEffect, useRef, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, SimulationNodeDatum } from 'd3-force';
import { Project } from '../data/projects';
import ProjectModel from './ProjectModel';

interface ProjectGraphProps {
  projects: Project[];
}

const ProjectGraph = ({ projects: initialProjects }: ProjectGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    // Clone projects to avoid mutating original data
    const nodes = initialProjects.map(p => ({ ...p }));
    const links = nodes.flatMap(node =>
      node.connections.map(targetId => ({
        source: node.id,
        target: targetId,
      }))
    );

    // Cast to SimulationNodeDatum to satisfy D3 types
    const simulation = forceSimulation(nodes as SimulationNodeDatum[])
      .force('link', forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        // Update links
        svg.querySelectorAll('.link').forEach((link, i) => {
          const l = links[i];
          const source = nodes.find(n => n.id === l.source);
          const target = nodes.find(n => n.id === l.target);
          if (source && target && source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
            (link as SVGLineElement).setAttribute('x1', String(source.x));
            (link as SVGLineElement).setAttribute('y1', String(source.y));
            (link as SVGLineElement).setAttribute('x2', String(target.x));
            (link as SVGLineElement).setAttribute('y2', String(target.y));
          }
        });

        // Update nodes
        svg.querySelectorAll('.node').forEach((node, i) => {
          const n = nodes[i];
          if (n.x !== undefined && n.y !== undefined) {
            (node as SVGCircleElement).setAttribute('cx', String(n.x));
            (node as SVGCircleElement).setAttribute('cy', String(n.y));
          }
        });
      });

    // ✅ Correct cleanup: stop simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [initialProjects]);

  return (
    <>
      <svg
        ref={svgRef}
        className="w-full h-[600px] bg-transparent"
        style={{ maxHeight: '80vh' }}
      >
        {/* Render links */}
        {initialProjects.flatMap(p =>
          p.connections.map((targetId) => (
            <line
              key={`${p.id}-${targetId}`}
              className="link stroke-cyan-500/30"
              strokeWidth={1.5}
            />
          ))
        )}

        {/* Render nodes */}
        {initialProjects.map((project) => (
          <circle
            key={project.id}
            className="node fill-cyan-500 cursor-pointer transition hover:fill-cyan-300"
            r="12"
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </svg>

      {selectedProject && (
        <ProjectModel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectGraph;