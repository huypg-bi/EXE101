import { Outlet } from 'react-router-dom';
import Particles from '../../features/landing/components/Particles';
import { useTheme } from '../context/ThemeContext';
import { Palette } from 'lucide-react';

export default function PublicLayout() {
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen text-white overflow-x-hidden selection:bg-brand-primary/30 font-sans relative theme-transition">
      <Particles />
      <Outlet />
      
      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:scale-110 transition-transform group shadow-[0_0_15px_var(--theme-glow)]"
        title="Toggle Theme"
      >
        <Palette className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
      </button>
    </div>
  );
}
