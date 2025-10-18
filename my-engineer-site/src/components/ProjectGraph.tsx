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

// Group color mapping
const GROUP_COLORS: Record<string, string> = {
  Hardware: '#ff6b6b',    
  AI: '#4ecdc4',    
  Games: '#45b7d1',       
  Website: '#ffffe0'
};

const getLinks = (projects: Project[]) => {
  const links = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      if (projects[i].group === projects[j].group) {
        links.push({
          source: projects[i],
          target: projects[j],
          group: projects[i].group,
        });
      }
    }
  }
  return links;
};

interface LinkData {
  source: Project;
  target: Project;
  group: string;
}

// Clamp value between min and max
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const ProjectGraph = ({ projects: initialProjects }: { projects: Project[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; group: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Define bounding box (with padding)
    const padding = 50;
    const bounds = {
      xMin: padding,
      xMax: width - padding,
      yMin: padding,
      yMax: height - padding,
    };

    const nodes = initialProjects.map(p => ({ ...p }));
    const links: LinkData[] = getLinks(nodes);

    const dragHandler = drag<SVGCircleElement, Project>()
      .on('start', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = clamp(d.x ?? 0, bounds.xMin, bounds.xMax);
        d.fy = clamp(d.y ?? 0, bounds.yMin, bounds.yMax);
      })
      .on('drag', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        d.fx = clamp(event.x, bounds.xMin, bounds.xMax);
        d.fy = clamp(event.y, bounds.yMin, bounds.yMax);
      })
      .on('end', (event: D3DragEvent<SVGCircleElement, Project, unknown>, d: Project) => {
        if (!event.active) simulation.alphaTarget(0);
        // Keep fixed position within bounds
        if (d.fx != null) d.fx = clamp(d.fx, bounds.xMin, bounds.xMax);
        if (d.fy != null) d.fy = clamp(d.fy, bounds.yMin, bounds.yMax);
      });

    const simulation = forceSimulation(nodes as SimulationNodeDatum[])
      .force('link', forceLink(links as SimulationLinkDatum<SimulationNodeDatum>[])
        .id((d: any) => d.id)
        .distance(100)
      )
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        // Constrain nodes to bounds
        nodes.forEach(node => {
          if (node.x != null) node.x = clamp(node.x, bounds.xMin, bounds.xMax);
          if (node.y != null) node.y = clamp(node.y, bounds.yMin, bounds.yMax);
        });

        // Update links
        svg.selectAll<SVGLineElement, LinkData>('.link')
          .attr('x1', d => d.source.x!)
          .attr('y1', d => d.source.y!)
          .attr('x2', d => d.target.x!)
          .attr('y2', d => d.target.y!);

        // Update nodes
        svg.selectAll<SVGCircleElement, Project>('.node')
          .attr('cx', d => d.x!)
          .attr('cy', d => d.y!)
          .attr('fill', d => GROUP_COLORS[d.group] || '#00f0ff');

        // Update node labels
        svg.selectAll<SVGTextElement, Project>('.nodelabel')
          .attr('x', d => (d.x ?? 0) + 20)
          .attr('y', d => (d.y ?? 0) + 5)
          .attr('fill', d => GROUP_COLORS[d.group] || '#e0f7ff');

        // Update link labels
        svg.selectAll<SVGTextElement, LinkData>('.linklabel')
          .attr('x', d => (d.source.x! + d.target.x!) / 2)
          .attr('y', d => (d.source.y! + d.target.y!) / 2 - 8);
      });

    // Create bounding box border
    svg.append('rect')
      .attr('x', bounds.xMin)
      .attr('y', bounds.yMin)
      .attr('width', bounds.xMax - bounds.xMin)
      .attr('height', bounds.yMax - bounds.yMin)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 240, 255, 0.3)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,2')
      .attr('pointer-events', 'none');

    // Create links
    svg.selectAll<SVGLineElement, LinkData>('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => GROUP_COLORS[d.group] || '#00f0ff')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .on('mouseover', (event, d) => {
        setTooltip({
          x: (d.source.x! + d.target.x!) / 2,
          y: (d.source.y! + d.target.y!) / 2,
          group: d.group,
        });
      })
      .on('mouseout', () => setTooltip(null))
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr('opacity', 0.6);

    // Create nodes
    svg.selectAll<SVGCircleElement, Project>('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 14)
      .attr('fill', d => GROUP_COLORS[d.group] || '#00f0ff')
      .attr('cursor', 'move')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedProject(d);
      })
      .call(dragHandler);

    // Create node labels
    svg.selectAll<SVGTextElement, Project>('.nodelabel')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'nodelabel')
      .attr('x', d => (d.x ?? 0) + 20)
      .attr('y', d => (d.y ?? 0) + 5)
      .attr('font-family', 'Rajdhani, sans-serif')
      .attr('font-size', '12px')
      .attr('fill', d => GROUP_COLORS[d.group] || '#e0f7ff')
      .attr('pointer-events', 'none')
      .text(d => d.title);

    // Create midpoint link labels
    svg.selectAll<SVGTextElement, LinkData>('.linklabel')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'linklabel')
      .attr('font-family', 'Rajdhani, sans-serif')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('fill', d => GROUP_COLORS[d.group] || '#e0f7ff')
      .attr('pointer-events', 'none')
      .text(d => d.group);

    // Cleanup
    return () => {
      simulation.stop();
      svg.selectAll('.link').remove();
      svg.selectAll('.node').remove();
      svg.selectAll('.nodelabel').remove();
      svg.selectAll('.linklabel').remove();
      svg.selectAll('rect').remove(); // Remove bounding box
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
              stroke="rgba(0, 240, 255, 0.1)"
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
          className="fixed z-40 pointer-events-none bg-gray-900/80 backdrop-blur border border-cyan-500/30 rounded-lg p-2 text-xs"
          style={{
            left: tooltip.x + window.scrollX - 60,
            top: tooltip.y + window.scrollY - 30,
          }}
        >
          <span className="text-cyan-300 font-rajdhani">{tooltip.group}</span>
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