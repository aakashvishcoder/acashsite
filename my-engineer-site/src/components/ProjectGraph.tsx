import { useEffect, useRef, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  SimulationNodeDatum,
} from 'd3-force';
import 'd3-transition';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { Project } from '../data/projects';
import ProjectModel from './ProjectModel';

const GROUP_COLORS: Record<string, string> = {
  Hardware: '#ffb454',    
  AI: '#4dff9f',    
  Games: '#57c7ff',       
  Website: '#c87137'
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

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const ProjectGraph = ({ projects: initialProjects }: { projects: Project[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; group: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const { width, height } = svgRef.current.getBoundingClientRect();

    const padding = Math.min(width, height) * 0.08; 
    const bounds = {
      xMin: padding,
      xMax: width - padding,
      yMin: padding,
      yMax: height - padding,
    };

    const nodes = initialProjects.map(p => ({ ...p }));
    const links = getLinks(nodes);

    const nodeRadius = Math.max(8, Math.min(20, width / 100));

    const dragHandler = drag<SVGCircleElement, Project>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = clamp(d.x ?? 0, bounds.xMin, bounds.xMax);
        d.fy = clamp(d.y ?? 0, bounds.yMin, bounds.yMax);
      })
      .on('drag', (event, d) => {
        d.fx = clamp(event.x, bounds.xMin, bounds.xMax);
        d.fy = clamp(event.y, bounds.yMin, bounds.yMax);
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (d.fx != null) d.fx = clamp(d.fx, bounds.xMin, bounds.xMax);
        if (d.fy != null) d.fy = clamp(d.fy, bounds.yMin, bounds.yMax);
      });

    const simulation = forceSimulation(nodes as SimulationNodeDatum[])
      .force('link', forceLink(links)
        .id((d: any) => d.id)
        .distance(100 * (width / 800))
      )
      .force('charge', forceManyBody().strength(-300 * (width / 800))) 
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        nodes.forEach(node => {
          if (node.x != null) node.x = clamp(node.x, bounds.xMin, bounds.xMax);
          if (node.y != null) node.y = clamp(node.y, bounds.yMin, bounds.yMax);
        });

        svg.selectAll<SVGLineElement, LinkData>('.link')
          .attr('x1', d => d.source.x!)
          .attr('y1', d => d.source.y!)
          .attr('x2', d => d.target.x!)
          .attr('y2', d => d.target.y!);

        svg.selectAll<SVGCircleElement, Project>('.node')
          .attr('cx', d => d.x!)
          .attr('cy', d => d.y!)
          .attr('r', nodeRadius)
          .attr('fill', d => GROUP_COLORS[d.group] || '#4dff9f');

        svg.selectAll<SVGTextElement, Project>('.nodelabel')
          .attr('x', d => (d.x ?? 0) + nodeRadius + 5) 
          .attr('y', d => (d.y ?? 0) + 5)
          .attr('font-family', 'JetBrains Mono, Share Tech Mono, monospace')
          .attr('font-size', `${Math.max(10, Math.min(16, width / 80))}px`) 
          .attr('fill', d => GROUP_COLORS[d.group] || '#9fb5a8');

        svg.selectAll<SVGTextElement, LinkData>('.linklabel')
          .attr('x', d => (d.source.x! + d.target.x!) / 2)
          .attr('y', d => (d.source.y! + d.target.y!) / 2 - 8)
          .attr('font-size', `${Math.max(8, Math.min(12, width / 100))}px`); 
      });

    svg.attr('width', width).attr('height', height);

    svg.append('rect')
      .attr('x', bounds.xMin)
      .attr('y', bounds.yMin)
      .attr('width', bounds.xMax - bounds.xMin)
      .attr('height', bounds.yMax - bounds.yMin)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(77, 255, 159, 0.28)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,2')
      .attr('pointer-events', 'none');

    svg.selectAll<SVGLineElement, LinkData>('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => GROUP_COLORS[d.group] || '#4dff9f')
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

    svg.selectAll<SVGCircleElement, Project>('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', nodeRadius) 
      .attr('fill', d => GROUP_COLORS[d.group] || '#4dff9f')
      .attr('cursor', 'move')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedProject(d);
      })
      .call(dragHandler);

    svg.selectAll<SVGTextElement, Project>('.nodelabel')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'nodelabel')
      .attr('x', d => (d.x ?? 0) + nodeRadius + 5) 
      .attr('y', d => (d.y ?? 0) + 5)
      .attr('font-family', 'JetBrains Mono, Share Tech Mono, monospace')
      .attr('font-size', `${Math.max(10, Math.min(16, width / 80))}px`)
      .attr('fill', d => GROUP_COLORS[d.group] || '#9fb5a8')
      .attr('pointer-events', 'none')
      .text(d => d.title);

    svg.selectAll<SVGTextElement, LinkData>('.linklabel')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'linklabel')
      .attr('font-family', 'JetBrains Mono, Share Tech Mono, monospace')
      .attr('font-size', `${Math.max(8, Math.min(12, width / 100))}px`)
      .attr('text-anchor', 'middle')
      .attr('fill', d => GROUP_COLORS[d.group] || '#9fb5a8')
      .attr('pointer-events', 'none')
      .text(d => d.group);

    return () => {
      simulation.stop();
      svg.selectAll('*').remove();
      setTooltip(null);
    };
  }, [initialProjects]);

  return (
    <>
      <div
        className="term-panel fiducial w-full mx-auto overflow-hidden"
        style={{ maxWidth: '1200px' }}
      >
        <div className="term-bar">
          <span className="text-phos/70">&#9679;</span>
          <span>scope --trace project.net</span>
          <span className="ml-auto flex items-center gap-3 normal-case tracking-normal">
            {Object.entries(GROUP_COLORS).map(([group, color]) => (
              <span key={group} className="hidden md:flex items-center gap-1.5 text-[10px]">
                <span
                  className="inline-block w-2 h-2"
                  style={{ backgroundColor: color }}
                />
                {group}
              </span>
            ))}
          </span>
        </div>
        <svg
          ref={svgRef}
          className="w-full bg-transparent cursor-crosshair"
          style={{ height: '600px', maxHeight: '80vh' }}
          onClick={() => setSelectedProject(null)}
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(45, 92, 71, 0.30)"
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
      </div>

      {tooltip && (
        <div
          className="fixed z-40 pointer-events-none border border-etch bg-board-800/95 rounded-term px-2 py-1"
          style={{
            left: tooltip.x + window.scrollX - 60,
            top: tooltip.y + window.scrollY - 30,
          }}
        >
          <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-phos">
            {tooltip.group}
          </span>
        </div>
      )}

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