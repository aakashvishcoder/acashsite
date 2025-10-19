import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-gray-900/30 backdrop-blur-xl border-t border-cyan-500/20 py-6 mt-20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 text-gray-400 text-sm">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer">
                        <img 
                            src="https://assets.hackclub.com/flag-orpheus-left-bw.svg"
                            alt="Hack Club Flag"
                            className="h-6 md:h-8 hover:opacity-90 transition-opacity"
                        />
                    </a>
                    <span>© 2025 Aakash Vishnuvarth</span>
                </div>

                <p className="font-tech text-cyan-300 text-xs md:text-sm mb-4 md:mb-0">
                    📍 McKinney, Texas
                </p>

                <div className="flex items-center gap-4">
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
};
