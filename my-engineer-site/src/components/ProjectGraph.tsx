// src/components/ProjectGraph.tsx
import { useEffect, useRef, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import 'd3-transition';
import { drag, D3DragEvent } from 'd3-drag';
import { select } from 'd3-selection';
import { Project } from '../data/projects';
import ProjectModel from './ProjectModel';

// Compute links + shared tech names
const getLinks = (projects: Project[]) => {
  const links = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const shared = projects[i].tech.filter(t => projects[j].tech.includes(t));
      if (shared.length > 0) {
        links.push({
          source: projects[i],
          target: projects[j],
          strength: shared.length,
          sharedTech: shared,
        });
      }
    }
  }
  return links;
};

interface LinkData {
  source: Project;
  target: Project;
  strength: number;
  sharedTech: string[];
}

const ProjectGraph = ({ projects: initialProjects }: { projects: Project[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; tech: string[] } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes = initialProjects.map(p => ({ ...p }));
    const links: LinkData[] = getLinks(nodes);

    const dragHandler = drag<SVGCircleElement, Project>()
      .on('start', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x ?? 0;
        d.fy = d.y ?? 0;
      })
      .on('drag', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const simulation = forceSimulation(nodes as SimulationNodeDatum[])
      .force('link', forceLink(links as SimulationLinkDatum<SimulationNodeDatum>[])
        .id((d: any) => d.id)
        .distance(d => 120 - ((d as LinkData).strength - 1) * 30)
      )
      .force('charge', forceManyBody().strength(-400))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        svg.selectAll<SVGLineElement, LinkData>('.link')
          .attr('x1', d => d.source.x!)
          .attr('y1', d => d.source.y!)
          .attr('x2', d => d.target.x!)
          .attr('y2', d => d.target.y!);

        svg.selectAll<SVGCircleElement, Project>('.node')
          .attr('cx', d => d.x!)
          .attr('cy', d => d.y!);
        
        // Update label positions
        svg.selectAll<SVGTextElement, Project>('.nodelabel')
          .attr('x', d => (d.x ?? 0) + 20)
          .attr('y', d => (d.y ?? 0) + 5);
      });

    // Create links with animation
    const linkElements = svg.selectAll<SVGLineElement, LinkData>('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#00f0ff')
      .attr('stroke-width', d => 1 + d.strength * 0.8)
      .attr('opacity', 0)
      .on('mouseover', (event, d) => {
        setTooltip({
          x: (d.source.x! + d.target.x!) / 2,
          y: (d.source.y! + d.target.y!) / 2,
          tech: d.sharedTech,
        });
      })
      .on('mouseout', () => setTooltip(null))
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr('opacity', d => 0.3 + d.strength * 0.2);

    // Create nodes
    const nodeElements = svg.selectAll<SVGCircleElement, Project>('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 14)
      .attr('fill', '#00f0ff')
      .attr('cursor', 'move')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedProject(d);
      })
      .call(dragHandler);

    // Create labels
    const labelElements = svg.selectAll<SVGTextElement, Project>('.nodelabel')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'nodelabel')
      .attr('x', d => (d.x ?? 0) + 20) // offset to right of node
      .attr('y', d => (d.y ?? 0) + 5)
      .attr('font-family', 'Rajdhani, sans-serif')
      .attr('font-size', '12px')
      .attr('fill', '#e0f7ff')
      .attr('pointer-events', 'none') // don't block hover/click
      .text(d => d.title);
    // Cleanup
    return () => {
      simulation.stop();
      svg.selectAll('.link').remove();
      svg.selectAll('.node').remove();
      svg.selectAll('.nodelabel').remove();
      setTooltip(null);
    };
  }, [initialProjects]);

  return (
    <>
      <svg
        ref={svgRef}
        className="w-full h-[600px] bg-transparent cursor-grab"
        style={{ maxHeight: '80vh' }}
        onClick={() => setSelectedProject(null)}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(0, 240, 255, 0.15)"  // brighter for testing
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#grid)"
          pointerEvents="none"
        />
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-40 pointer-events-none bg-gray-900/80 backdrop-blur border border-cyan-500/30 rounded-lg p-3 max-w-xs"
          style={{
            left: tooltip.x + window.scrollX - 80,
            top: tooltip.y + window.scrollY - 40,
          }}
        >
          <p className="text-cyan-300 font-rajdhani text-sm">Shared Technologies:</p>
          <ul className="mt-1 text-gray-200 text-xs">
            {tooltip.tech.map((tech, i) => (
              <li key={i} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
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