import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors"
        >
          Labs
        </a>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('overview');
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#capabilities"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('capabilities');
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Capabilities
          </a>
          <a
            href="#chemistry"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('chemistry');
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Chemistry
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('how-it-works');
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            How It Works
          </a>
          <a
            href="#roadmap"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('roadmap');
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Roadmap
          </a>
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection('chemistry')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            Explore Experiments
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
          <button
            onClick={() => scrollToSection('overview')}
            className="block w-full text-left py-2 px-3 rounded text-slate-700 hover:bg-slate-100"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('capabilities')}
            className="block w-full text-left py-2 px-3 rounded text-slate-700 hover:bg-slate-100"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollToSection('chemistry')}
            className="block w-full text-left py-2 px-3 rounded text-slate-700 hover:bg-slate-100"
          >
            Chemistry Experiments
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 px-3 rounded text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('roadmap')}
            className="block w-full text-left py-2 px-3 rounded text-slate-700 hover:bg-slate-100"
          >
            Future Expansion
          </button>
          <div className="pt-2">
            <button
              onClick={() => scrollToSection('chemistry')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 rounded-lg text-center"
            >
              Explore Experiments
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
