'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function triggerPWAInstall() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('trigger-pwa-install'));
  }
}

interface PWAInstallPromptProps {
  appName?: string;
  themeGradient?: string;
}

export function PWAInstallPrompt({
  appName = "CAT App",
  themeGradient = "from-cyan-500 to-purple-600"
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PWA ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA ServiceWorker registration failed:', err);
        });
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      const dismissed = sessionStorage.getItem('pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const handleTrigger = () => {
      handleInstallClick();
    };
    window.addEventListener('trigger-pwa-install', handleTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('trigger-pwa-install', handleTrigger);
    };
  }, [deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert('To install this app on your device:\n\n1. In Chrome / Browser: Tap the 3 dots (⋮) menu at top right.\n2. Tap "Install app" or "Add to Home Screen".\n\nIt will install directly on your home screen like an APK!');
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${themeGradient} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Install {appName}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 rounded font-medium">Free PWA / APK</span>
                </p>
                <p className="text-[11px] text-slate-300 truncate">
                  Fast offline access &amp; instant home screen icon
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className={`bg-gradient-to-r ${themeGradient} hover:opacity-90 text-white font-bold text-xs px-3 py-1.5 h-8 rounded-lg shadow-md flex items-center transition`}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Install
              </button>
              <button
                onClick={dismissBanner}
                className="text-slate-400 hover:text-white p-1 rounded-md transition"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${themeGradient} flex items-center justify-center text-white`}>
                  <Smartphone className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-white text-base">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Apple Safari does not allow automatic 1-click installation. Follow these 2 easy steps:
            </p>

            <div className="space-y-3 text-xs bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">1</div>
                <p className="text-slate-200">
                  Tap the <Share2 className="h-4 w-4 inline text-cyan-400 mx-1" /> <strong>Share</strong> button at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">2</div>
                <p className="text-slate-200">
                  Scroll down and tap <PlusSquare className="h-4 w-4 inline text-purple-400 mx-1" /> <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className={`w-full bg-gradient-to-r ${themeGradient} text-white font-semibold rounded-xl text-xs py-2`}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
