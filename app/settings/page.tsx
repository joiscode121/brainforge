'use client';

import ClientLayout from '@/components/ClientLayout';
import { Settings as SettingsIcon, Bell, Moon, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-white/60">Customize your learning experience</p>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-cyan-400" />
                  <span>Daily Reminders</span>
                </div>
                <button className="w-12 h-6 rounded-full bg-white/20 relative">
                  <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Appearance</h3>
            <div className="flex items-center gap-3 mb-2">
              <Moon size={20} className="text-purple-400" />
              <span>Dark Mode</span>
            </div>
            <p className="text-sm text-white/60">Always enabled for optimal focus</p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">About</h3>
            <div className="space-y-2 text-sm text-white/60">
              <div>BrainForge v1.0.0</div>
              <div>Built with Next.js 14 + TypeScript</div>
              <div>Powered by spaced repetition (SM-2)</div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
