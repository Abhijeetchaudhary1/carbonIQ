// ============================================================================
// Carbon Compass — Footer Component
// ============================================================================

'use client';

import { Leaf, ExternalLink, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-primary to-emerald flex items-center justify-center">
                <Leaf className="w-4 h-4 text-bg-primary" />
              </div>
              <span className="text-lg font-bold text-text-primary">
                Carbon<span className="text-green-primary">Compass</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm">
              Track your environmental impact, discover what drives your emissions, 
              and take actionable steps to reduce your carbon footprint every day.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2">
              {['Assessment', 'Dashboard', 'AI Coach', 'Progress'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-').replace('ai-', '')}`}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              {['How It Works', 'Carbon Science', 'Privacy', 'About'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Carbon Compass. Built for a sustainable future.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose" /> for the planet
            </span>
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-text-muted hover:text-text-secondary transition-colors cursor-pointer" />
              <Globe className="w-4 h-4 text-text-muted hover:text-text-secondary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
