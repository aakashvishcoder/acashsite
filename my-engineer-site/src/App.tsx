// src/App.tsx
import { motion } from 'framer-motion';
import EarthGlobe from './components/EarthGlobe';
import CometCursor from './components/CometCursor';
import SparkleEffect from './components/SparkleEffect';
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

        {/* Projects */}
        <Section id="projects">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-10 text-center text-cyan-300">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <h3 className="text-xl md:text-2xl font-rajdhani text-cyan-200">ESP32 Devboard</h3>
                  <p className="mt-3 text-gray-300 leading-relaxed">
                    Designed using EasyEDA with custom power regulation and debug headers.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 text-xs rounded">PCB Design</span>
                    <span className="px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded">Embedded C</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* About */}
        <Section id="about">
          <Card className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-6 text-cyan-300">About Me</h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Passionate about electrical and computer engineering.  
              I bridge circuitry and PCB design with embedded systems to build efficient, real-world solutions.
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full">ECE</span>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full">Embedded</span>
              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full">Hardware</span>
            </div>
          </Card>
        </Section>

        {/* Contact */}
        <Section id="contact">
          <Card className="max-w-md mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-6 text-cyan-300">Get In Touch</h2>
            <a
              href="mailto:aakashvish07@gmail.com"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full font-rajdhani font-bold transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40"
            >
              Say Hello!
            </a>
            <p className="mt-4 text-gray-400 text-sm">aakashvish07@gmail.com</p>
          </Card>
        </Section>
      </div>
    </>
  );
}

export default App;