
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, User, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Catálogo', href: '#productos' },
    { name: 'Probador Virtual', href: '#probador' },
    { name: 'Citas', href: '#citas' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo Placeholder */}
            <div className="flex flex-col items-center">
                <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-black' : 'text-via-red'}`}>VIA OPTIC'S</span>
                <span className="text-[8px] uppercase tracking-widest -mt-1 font-medium">Salud Visual</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-via-red transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#citas"
              className="bg-via-red text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-black transition-all duration-300 flex items-center gap-2"
            >
              <Calendar size={16} />
              Reservar Cita
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-via-red hover:bg-gray-50 rounded-md"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#citas"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-bold text-via-red bg-red-50 rounded-md"
            >
              Agendar ahora
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
