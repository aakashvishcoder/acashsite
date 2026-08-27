import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-etch bg-board-800/80 backdrop-blur-sm py-8 mt-20 overflow-hidden">
      {/* Idle status LEDs across the backplane */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-[3px] h-[3px] bg-phos-dim animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center text-center md:text-left px-6 font-mono text-xs text-[#7d938a] relative z-10 gap-y-4">
        <div className="flex justify-center md:justify-start items-center gap-3">
          <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://assets.hackclub.com/flag-orpheus-left-bw.svg"
              alt="Hack Club Flag"
              className="h-8 md:h-10 hover:opacity-90 transition-opacity animate-flag-wave"
            />
          </a>
          <span>
            <span className="text-etch-bright">&copy;</span> 2025 aakash_vishnuvarth
          </span>
        </div>

        <p className="font-tech text-phos-dim text-center tracking-[0.12em]">
          <span className="inline-block w-1.5 h-1.5 bg-phos-dim rounded-full mr-2 align-middle animate-blip" />
          33.1976&deg;N 96.6153&deg;W &middot; MCKINNEY, TX
        </p>

        <div className="flex justify-center md:justify-end items-center gap-4">
          <a
            href="https://github.com/aakashvishcoder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-phos transition-colors"
          >
            <IconBrandGithub size={20} />
          </a>
          <a
            href="https://instagram.com/the_aacash"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fault transition-colors"
          >
            <IconBrandInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com/in/aakash-vishnuvarth-426b15303"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-probe transition-colors"
          >
            <IconBrandLinkedin size={20} />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-6 relative z-10">
        <div className="rule mb-2" />
        <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-etch-bright text-center">
          rev 1.0 &middot; built with react + three.js &middot; no cookies, no trackers
        </p>
      </div>
    </footer>
  );
}
