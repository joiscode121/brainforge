'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, RotateCcw, TrendingUp, Settings } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/domains', icon: BookOpen, label: 'Domains' },
  { href: '/review', icon: RotateCcw, label: 'Review' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' }
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Animated gradient background */}
      <div className="gradient-bg">
        <div className="gradient-orb-1" />
        <div className="gradient-orb-2" />
      </div>
      
      {/* Main content */}
      <div className="min-h-screen pb-28">
        {children}
      </div>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="glass-card mx-4 mb-4 p-2 max-w-lg sm:mx-auto">
          <div className="flex justify-around items-center">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
