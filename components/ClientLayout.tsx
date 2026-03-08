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
      {/* Main content */}
      <div className="min-h-screen pb-24">
        {children}
      </div>
      
      {/* Bottom navigation — warm surface, no glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-3 mb-3 max-w-lg sm:mx-auto rounded-2xl border border-[--border] shadow-lg overflow-hidden"
             style={{ background: 'var(--bg-elevated)' }}>
          <div className="flex justify-around items-center px-1 py-1.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                    background: isActive ? 'var(--accent-subtle)' : 'transparent',
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
