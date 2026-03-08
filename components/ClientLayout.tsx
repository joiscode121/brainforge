'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, RotateCcw, TrendingUp, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
      {/* Animated gradient background (visible in Forge mode only via CSS) */}
      <div className="gradient-bg">
        <div className="gradient-orb-1" />
        <div className="gradient-orb-2" />
      </div>

      {/* Theme toggle - fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="min-h-screen pb-24">
        {children}
      </div>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-3 mb-3 max-w-lg sm:mx-auto rounded-2xl border overflow-hidden"
             style={{ 
               background: 'var(--bg-elevated)', 
               borderColor: 'var(--border)',
               boxShadow: 'var(--shadow-lg)',
               backdropFilter: `blur(var(--glass-blur))`,
               WebkitBackdropFilter: `blur(var(--glass-blur))`,
             }}>
          <div className="flex justify-around items-center px-1 py-1.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)',
                    background: isActive ? 'var(--nav-bg-active)' : 'transparent',
                  }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="text-[11px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
