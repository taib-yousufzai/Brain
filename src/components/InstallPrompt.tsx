'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Monitor, Smartphone, Share, Sparkles, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export default function InstallPrompt({ forceOpen, onCloseForceOpen }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // silent catch
      });
    }

    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(iosDevice);

    // Listen for browser PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user dismissed prompt recently
      const dismissed = localStorage.getItem('brain_install_dismissed');
      if (!dismissed) {
        // Delay popup slightly for smooth UX
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setInstallSuccess(true);
    });

    // If dismissed is not set and is iOS, show prompt after delay
    const dismissed = localStorage.getItem('brain_install_dismissed');
    if (iosDevice && !dismissed && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle forceOpen trigger from Header
  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      if (!deferredPrompt && isIOS) {
        setShowInstructions(true);
      }
    }
  }, [forceOpen, deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt failed:', err);
      }
    } else {
      // Show manual guide modal
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowInstructions(false);
    localStorage.setItem('brain_install_dismissed', 'true');
    if (onCloseForceOpen) onCloseForceOpen();
  };

  if (isInstalled && !forceOpen) return null;

  return (
    <>
      {/* Floating Bottom Glass Banner Popup */}
      <AnimatePresence>
        {isVisible && !showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-3rem)] p-5 rounded-2xl bg-[#0b0d14]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_20px_50px_rgba(99,102,241,0.2)] text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-wide font-['Plus_Jakarta_Sans'] text-white">
                    Install Brain App
                  </h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Fast offline engine & instant access
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-indigo-300/80 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
              <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Native window • Desktop & Mobile app</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="cursor-pointer py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-xs transition-colors"
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Installation Instructions Modal (Fallback / Manual) */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full p-6 rounded-2xl bg-[#0d0f18] border border-white/10 text-white shadow-2xl relative"
            >
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                  <Download className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                    How to Install Brain
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Follow these simple steps for your device
                  </p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3 my-4 text-xs text-gray-300 font-sans">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                      1
                    </span>
                    <p className="flex-1">
                      Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> <strong>Share</strong> button in Safari toolbar.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                      2
                    </span>
                    <p className="flex-1">
                      Scroll down and select <strong>Add to Home Screen</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                      3
                    </span>
                    <p className="flex-1">
                      Tap <strong>Add</strong> in the top right corner.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 my-4 text-xs text-gray-300 font-sans">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                      1
                    </span>
                    <p className="flex-1">
                      Click the <Monitor className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> <strong>Install</strong> or <strong>App Icon</strong> in your browser address bar.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                      2
                    </span>
                    <p className="flex-1">
                      Or open browser menu (<code>...</code>) & select <strong>Save & Share → Install page as app</strong>.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDismiss}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success notification if installed */}
      <AnimatePresence>
        {installSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-lg backdrop-blur-xl"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Brain installed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
