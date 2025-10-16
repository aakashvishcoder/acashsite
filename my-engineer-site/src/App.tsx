import { motion } from 'framer-motion';
import Background3d from './components/Background3d';
import './App.css';

const sections = [
  { id: 'home', title:"Home"},
  { id: 'projects', title: 'Projects'},
  { id: 'about', title: 'About'},
  { id: 'contact', title: "Contact"},
];

const Section = ({ id, children }: { id: string, children: React.ReactNode }) => {
  return (
    <motion.section
      id={id}
      className="min-h-screen flex items-center justify-center px-4 relative z-10"
      initial={{ opacity: 0}}
      whileInView={{ opacity: 1}}
      transition={{ duration: 0.8}}
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );
};

function App() {
  return (
    <div className="relative">
      <Background3d />

      <nav className="fixed top-0 left-0 right-0 z-20 p-6 flex justify-center">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex space-x-6">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="font-rajdhani font-medium hover:text-cyan-300 transition-colors"
            >
              {sec.title}
            </a>
          ))}
        </div>
      </nav>

      <Section id="home">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Aakash Vishnuvarth
          </h1>
          <p className="mt-4 text-lg font-rajdhani">Aspiring Electrical and Computer Engineering Major</p>  
        </div>
      </Section>

      <Section id="projects">
        <h2 className="text-4xl font-orbitron mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30">
              <h3 className="text-2xl font-rajdhani">ESP32 Devboard</h3>
              <p className="mt-2 text-gray-300">Designed using EasyEDA.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="about">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-orbitron mb-6">About Me</h2>
          <p className="text-lg leading-relaxed">
            Passionate about electrical and computer engineering.
            I bridge circuitry and pcb design with embedded systems.
          </p>
        </div>
      </Section>

      <Section id="contact">
        <h2 className="text-4xl font-orbitron mb-6">Get In Touch</h2>
        <a
          href="mailto:aakashvish07@gmail.com"
          className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-full font-rajdhani font-bold transition-colors"
        >
          Say Hello!
        </a>
      </Section>
    </div>
  );
};

export default App;