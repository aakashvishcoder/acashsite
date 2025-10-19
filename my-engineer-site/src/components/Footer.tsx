// src/components/Footer.tsx
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900/30 backdrop-blur-xl border-t border-cyan-500/20 py-8 mt-20 overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 bg-cyan-300 rounded-full opacity-70 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center text-center md:text-left px-6 text-gray-400 text-sm relative z-10 gap-y-4">
        {/* Left: Hack Club Flag + Signature */}
        <div className="flex justify-center md:justify-start items-center gap-3">
          <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://assets.hackclub.com/flag-orpheus-left-bw.svg"
              alt="Hack Club Flag"
              className="h-8 md:h-10 hover:opacity-90 transition-opacity animate-flag-wave"
            />
          </a>
          <span>© 2025 Aakash Vishnuvarth</span>
        </div>

        {/* Center: Location */}
        <p className="font-tech text-cyan-300 text-xs md:text-sm text-center">
          📍 McKinney, Texas
        </p>

        {/* Right: Socials */}
        <div className="flex justify-center md:justify-end items-center gap-4">
          <a
            href="https://github.com/aakashvishcoder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors"
          >
            <IconBrandGithub size={20} />
          </a>
          <a
            href="https://instagram.com/the_aacash"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            <IconBrandInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com/in/aakash-vishnuvarth-426b15303"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <IconBrandLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
