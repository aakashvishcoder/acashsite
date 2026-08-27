import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SparkleEffect from './components/SparkleEffect';
import CometCursor from './components/CometCursor';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import BootSequence from './components/BootSequence';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import ProjectModel from './components/ProjectModel';
import Footer from './components/Footer';
import { Project, projects } from './data/projects';
import { allSkills } from './data/skills';
import {
  IconBrandGithub, IconBrandInstagram, IconBrandSnapchat, IconMessage,
  IconBrandSlack, IconBrandLinkedin,
} from '@tabler/icons-react';
import './App.css';

const sections = [
  { id: 'home', title: 'home' },
  { id: 'skills', title: 'skills' },
  { id: 'projects', title: 'projects' },
  { id: 'contact', title: 'contact' },
];

/** The flowing gradient field behind the whole page. */
const LiquidBackground = () => (
  <div className="liquid" aria-hidden="true">
    <div className="liquid-blob b1" />
    <div className="liquid-blob b2" />
    <div className="liquid-blob b3" />
    <div className="liquid-blob b4" />
    <div className="liquid-blob b5" />
    <div className="liquid-sheen" />
  </div>
);

const Card = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`term-panel fiducial ${className}`}>
    <div className="term-bar">
      <span className="text-phos/70">&#9679;</span>
      <span className="truncate">{title}</span>
      <span className="ml-auto hidden sm:block text-etch-bright normal-case tracking-normal">
        &#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;
      </span>
    </div>
    <div className="term-body">{children}</div>
  </div>
);

function App() {
  const [paletteProject, setPaletteProject] = useState<Project | null>(null);

  return (
    <>
      <LiquidBackground />
      <div className="crt-overlay" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />

      <BootSequence />
      <CometCursor />
      <SparkleEffect />
      <CommandPalette onOpenProject={setPaletteProject} />
      <StatusBar />

      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-20 p-4 flex justify-center pointer-events-none">
          <div className="term-panel pointer-events-auto flex items-stretch overflow-hidden">
            <span className="hidden sm:flex items-center border-r border-etch px-3 font-tech text-[11px] uppercase tracking-[0.18em] text-phos-dim">
              tty0
            </span>
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="group px-4 py-2.5 font-mono text-sm text-[#8fa89a] hover:text-phos hover:bg-phos/5 transition-colors border-r border-etch last:border-r-0"
              >
                <span className="text-etch-bright group-hover:text-phos-dim">[</span>
                <span className="px-1">{sec.title}</span>
                <span className="text-etch-bright group-hover:text-phos-dim">]</span>
              </a>
            ))}
          </div>
        </nav>

        {/* ── HOME ─────────────────────────────────────────── */}
        <motion.section
          id="home"
          className="min-h-screen flex items-center justify-center px-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card title="aakash@mckinney: ~" className="max-w-3xl w-full text-left">
            <p className="font-mono text-xs text-phos-dim prompt mb-4">whoami</p>

            <h1 className="font-display text-6xl md:text-8xl leading-none text-phos glow">
              aakash_vishnuvarth
            </h1>

            <div className="rule my-5" />

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-sm">
              <dt className="text-phos-dim">ROLE</dt>
              <dd className="text-[#c3d6cb]">aspiring electrical &amp; computer engineering major</dd>

              <dt className="text-phos-dim">LOC</dt>
              <dd className="text-[#c3d6cb]">
                McKinney, Texas &nbsp;
                <span className="text-etch-bright">33.1976&deg;N 96.6153&deg;W</span>
              </dd>

              <dt className="text-phos-dim">STAT</dt>
              <dd className="text-amber glow-amber">
                <span className="inline-block w-1.5 h-1.5 bg-amber rounded-full mr-2 align-middle animate-blip" />
                online &mdash; building
              </dd>
            </dl>

            <div className="rule my-5" />

            <div className="space-y-1.5 font-mono text-sm leading-relaxed text-[#b8ccc0]">
              <p><span className="text-phos-dim select-none">&gt; </span>i design pcbs, write firmware, and build ai-driven apps that connect the physical and digital.</p>
              <p><span className="text-phos-dim select-none">&gt; </span>i mostly work in javascript, python, and c++, and i love projects that challenge both hardware and software limits.</p>
              <p><span className="text-phos-dim select-none">&gt; </span>right now, i&rsquo;m focused on exploring how intelligent systems can live beyond the screen &mdash; in sensors, circuits, and real-world interactions.</p>
            </div>

            {/* quick counters */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: 'builds', v: projects.length },
                { k: 'parts', v: allSkills.length },
                { k: 'domains', v: 3 },
              ].map((s) => (
                <div key={s.k} className="border border-etch bg-board-700/50 rounded-term px-3 py-2">
                  <div className="font-display text-3xl leading-none text-phos glow tabular-nums">
                    {s.v}
                  </div>
                  <div className="font-tech text-[10px] uppercase tracking-[0.18em] text-phos-dim mt-1">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 font-mono text-xs text-phos-dim prompt caret" />
          </Card>
        </motion.section>

        <SkillsSection />
        <ProjectsSection />

        {/* ── CONTACT ──────────────────────────────────────── */}
        <section id="contact" className="relative z-10 py-20 px-4 flex justify-center">
          <Card title="./contact --interactive" className="max-w-md w-full text-left">
            <h2 className="font-display text-4xl md:text-5xl text-phos glow leading-none">
              {'// get in touch'}
            </h2>

            <div className="rule my-4" />

            <p className="font-mono text-xs text-phos-dim mb-5 prompt">
              open mailto:aakashvish07@gmail.com
            </p>

            <a
              href="mailto:aakashvish07@gmail.com?subject=Hello%20Aakash!&body=I%20just%20visited%20your%20portfolio%20and..."
              className="key w-full"
            >
              <IconMessage size={18} />
              say hello
            </a>

            <div className="rule my-6" />

            <div className="flex justify-between items-center gap-3">
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-etch-bright">
                links
              </span>
              <div className="flex items-center gap-4">
                <a href="https://github.com/aakashvishcoder" target="_blank" rel="noopener noreferrer" className="text-[#7d938a] hover:text-phos transition-colors" aria-label="GitHub">
                  <IconBrandGithub size={22} />
                </a>
                <a href="https://instagram.com/the_aacash" target="_blank" rel="noopener noreferrer" className="text-[#7d938a] hover:text-fault transition-colors" aria-label="Instagram">
                  <IconBrandInstagram size={22} />
                </a>
                <a href="https://snapchat.com/add/aakashvish07" target="_blank" rel="noopener noreferrer" className="text-[#7d938a] hover:text-amber transition-colors" aria-label="Snapchat">
                  <IconBrandSnapchat size={22} />
                </a>
                <a href="https://hackclub.slack.com/team/U096ZFGQB3K" target="_blank" rel="noopener noreferrer" className="text-[#7d938a] hover:text-copper transition-colors" aria-label="Hack Club Slack">
                  <IconBrandSlack size={22} />
                </a>
                <a href="http://www.linkedin.com/in/aakash-vishnuvarth-426b15303" target="_blank" rel="noopener noreferrer" className="text-[#7d938a] hover:text-probe transition-colors" aria-label="Linkedin">
                  <IconBrandLinkedin size={22} />
                </a>
              </div>
            </div>
          </Card>
        </section>

        <Footer />
      </div>

      {/* Palette-launched project detail lives at the root */}
      <AnimatePresence>
        {paletteProject && (
          <ProjectModel project={paletteProject} onClose={() => setPaletteProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
