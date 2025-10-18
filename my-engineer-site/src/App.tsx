// src/App.tsx
import { motion } from 'framer-motion';
import EarthGlobe from './components/EarthGlobe';
import CometCursor from './components/CometCursor';
import SparkleEffect from './components/SparkleEffect';
import ProjectGraph from './components/ProjectGraph';
import { projects } from './data/projects';
import { IconBrandGithub, IconBrandInstagram, IconBrandSnapchat, IconMessage, IconBrandSlack, IconBrandLinkedin } from '@tabler/icons-react';
import './App.css';

const sections = [
  { id: 'home', title: "Home" },
  { id: 'projects', title: 'Projects' },
  { id: 'about', title: 'About' },
  { id: 'contact', title: "Contact" },
];

const Section = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return (
    <motion.section
      id={id}
      className="min-h-screen flex items-center justify-center px-4 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );
};

// Reusable card component
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-gray-900/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 shadow-lg shadow-cyan-500/10 ${className}`}
  >
    {children}
  </div>
);

function App() {
  return (
    <>
      <CometCursor />
      <SparkleEffect />
      <div className="relative">
        <EarthGlobe />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-20 p-6 flex justify-center">
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-full px-6 py-3 border border-cyan-500/20 shadow-lg">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="font-rajdhani font-medium text-gray-200 hover:text-cyan-300 transition-colors px-4 first:pl-0 last:pr-0"
              >
                {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Home */}
        <Section id="home">
          <Card className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Aakash Vishnuvarth
            </h1>
            <p className="mt-4 text-lg md:text-xl font-rajdhani text-gray-300">
              Aspiring Electrical and Computer Engineering Major
            </p>
            <p className="mt-2 text-cyan-300 font-tech text-sm">
              📍 McKinney, Texas
            </p>
          </Card>
        </Section>


        <Section id="projects">
          <div className="max-w-6xl mx-auto w-full px-4">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-8 text-center text-cyan-300">
              Project Network
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Click any node to explore project details and connections.
            </p>
            <ProjectGraph projects={projects} />
          </div>
        </Section>

        {/* About */}
        <Section id="about">
          <Card className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-6 text-cyan-300">About Me</h2>
            <p className="text-lg leading-relaxed text-gray-200">
              hey, i’m Aakash Vishnuvarth 👋<br />
              i design pcbs, write firmware, and build ai-driven apps that connect the physical and digital.<br />
              i mostly work in javascript, python, and c++, and i love projects that challenge both hardware and software limits.<br />
              right now, i’m focused on exploring how intelligent systems can live beyond the screen — in sensors, circuits, and real-world interactions.
            </p>

            {/* Mini Skills Section */}
            <div className="mt-8">
              <h3 className="text-xl font-rajdhani text-cyan-200 mb-4">Core Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Hardware */}
                <div className="bg-gray-800/40 border border-cyan-500/20 rounded-lg p-3">
                  <span className="text-cyan-300 font-tech text-sm">Hardware</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">PCB Design</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">ESP32</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">RaspberryPI</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">Arduino</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">Embedded C</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">KiCad</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">EasyEDA</span>
                    <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-200 text-xs rounded">Fusion360</span>
                  </div>
                </div>

                {/* Software */}
                <div className="bg-gray-800/40 border border-purple-500/20 rounded-lg p-3">
                  <span className="text-purple-300 font-tech text-sm">Software</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">JavaScript</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">TypeScript</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">React</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">Node.js</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">HTML</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">CSS</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">C++</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">C#</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">Python</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">SQL</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">Solidity</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">Java</span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-200 text-xs rounded">Unity</span>
                  </div>
                </div>

                {/* AI / Systems */}
                <div className="bg-gray-800/40 border border-blue-500/20 rounded-lg p-3 md:col-span-1 col-span-2 mx-auto md:mx-0">
                  <span className="text-blue-300 font-tech text-sm">AI & Systems</span>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">PyTorch</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Transformers</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Machine Learning</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Deep Learning</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">TensorFlow</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Scikit-learn</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Matplotlib</span>
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-200 text-xs rounded">Pandas</span>
                  </div>
                </div>

              </div>
            </div>
          </Card>
        </Section>

        {/* Contact */}
        <Section id="contact">
          <Card className="max-w-md mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-6 text-cyan-300">Get In Touch</h2>
            
            {/* Email Button */}
            <a
              href="mailto:aakashvish07@gmail.com?subject=Hello%20Aakash!&body=I%20just%20visited%20your%20portfolio%20and..."
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full font-rajdhani font-bold transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40"
            >
              <IconMessage size={20} />
              Say Hello!
            </a>

            {/* Social Icons */}
            <div className="mt-8 flex justify-center gap-5">
              {/* GitHub */}
              <a
                href="https://github.com/aakashvishcoder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-cyan-300 transition-colors"
                aria-label="GitHub"
              >
                <IconBrandGithub size={28} />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/the_aacash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <IconBrandInstagram size={28} />
              </a>

              {/* Snapchat */}
              <a
                href="https://snapchat.com/add/aakashvish07"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
                aria-label="Snapchat"
              >
                <IconBrandSnapchat size={28} />
              </a>

              {/* Hack Club Slack */}
              <a
                href="https://hackclub.slack.com/team/U096ZFGQB3K"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
                aria-label="Hack Club Slack"
              >
                <IconBrandSlack size={28} />
              </a>

              {/* Linkedin */}
              <a
                href="http://www.linkedin.com/in/aakash-vishnuvarth-426b15303"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
                aria-label="Linkedin"
              >
                <IconBrandLinkedin size={28} />
              </a>
            </div>
          </Card>
        </Section>
      </div>
    </>
  );
}

export default App;