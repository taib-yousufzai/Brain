'use client';

import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  forceShowManualModal?: boolean;
  onCloseManualModal?: () => void;
}

export default function InstallPrompt({
  forceShowManualModal,
  onCloseManualModal,
}: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem('brain_install_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (iosDevice) {
      const dismissed = localStorage.getItem('brain_install_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (forceShowManualModal) {
      setShowManualModal(true);
    }
  }, [forceShowManualModal]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowManualModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('brain_install_dismissed', 'true');
  };

  const handleCloseModal = () => {
    setShowManualModal(false);
    if (onCloseManualModal) onCloseManualModal();
  };

  return (
    <>
      {/* Bottom Install Banner */}
      {showBanner && !showManualModal && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#131823] border border-[#1e2638] p-4 rounded-lg shadow-xl font-sans text-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-white font-['Plus_Jakarta_Sans']">
                Install Brain App
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Install Brain locally for offline zero-latency workflow access.
              </div>
            </div>
            <button
              onClick={handleDismissBanner}
              className="text-slate-500 hover:text-white cursor-pointer font-mono"
            >
              x
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-medium rounded transition-colors cursor-pointer"
            >
              Install Now
            </button>
            <button
              onClick={handleDismissBanner}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono rounded transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Installation Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
          <div className="bg-[#131823] border border-[#1e2638] max-w-md w-full p-6 rounded-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Application Installation
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                Close
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>To install Brain on iOS (Safari):</p>
                <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px]">
                  <li>Tap the Share button in Safari navigation bar.</li>
                  <li>Scroll down and select "Add to Home Screen".</li>
                  <li>Confirm by tapping "Add".</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>To install Brain on Desktop or Chrome/Edge:</p>
                <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px]">
                  <li>Click the install icon in the browser address bar.</li>
                  <li>Or open browser menu (3 dots) &rarr; "Install Brain".</li>
                </ol>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
