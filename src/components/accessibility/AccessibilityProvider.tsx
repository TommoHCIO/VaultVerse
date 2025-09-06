'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  audioDescriptions: boolean;
  focusIndicators: boolean;
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  skipToContent: () => void;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  keyboardNavigation: true,
  screenReader: false,
  audioDescriptions: false,
  focusIndicators: true,
  colorBlindnessMode: 'none'
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcer, setAnnouncer] = useState<HTMLDivElement | null>(null);

  // Initialize accessibility settings from system preferences and localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('vaultor-accessibility-settings');
    const systemPreferences = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    };

    const initialSettings = {
      ...defaultSettings,
      ...systemPreferences,
      ...(savedSettings ? JSON.parse(savedSettings) : {}),
    };

    setSettings(initialSettings);
    applyAccessibilitySettings(initialSettings);
  }, []);

  // Create screen reader announcer element
  useEffect(() => {
    const announcerElement = document.createElement('div');
    announcerElement.setAttribute('aria-live', 'polite');
    announcerElement.setAttribute('aria-atomic', 'true');
    announcerElement.setAttribute('id', 'vaultor-announcer');
    announcerElement.style.position = 'absolute';
    announcerElement.style.left = '-10000px';
    announcerElement.style.width = '1px';
    announcerElement.style.height = '1px';
    announcerElement.style.overflow = 'hidden';
    
    document.body.appendChild(announcerElement);
    setAnnouncer(announcerElement);

    return () => {
      document.body.removeChild(announcerElement);
    };
  }, []);

  // Apply accessibility settings to document
  const applyAccessibilitySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties for accessibility
    root.style.setProperty('--motion-duration', newSettings.reducedMotion ? '0s' : '0.3s');
    root.style.setProperty('--motion-timing', newSettings.reducedMotion ? 'step-end' : 'cubic-bezier(0.4, 0, 0.2, 1)');
    
    // Apply classes for styling
    root.classList.toggle('high-contrast', newSettings.highContrast);
    root.classList.toggle('large-text', newSettings.largeText);
    root.classList.toggle('focus-indicators', newSettings.focusIndicators);
    root.classList.toggle('reduced-motion', newSettings.reducedMotion);
    root.classList.toggle(`colorblind-${newSettings.colorBlindnessMode}`, newSettings.colorBlindnessMode !== 'none');

    // Font size adjustments
    if (newSettings.largeText) {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    // Persist settings
    localStorage.setItem('vaultor-accessibility-settings', JSON.stringify(newSettings));
    
    // Announce change to screen readers
    announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`);
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
    localStorage.removeItem('vaultor-accessibility-settings');
    announceToScreenReader('Accessibility settings reset to defaults');
  }, []);

  const announceToScreenReader = useCallback((
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear message after announcement
      setTimeout(() => {
        if (announcer) announcer.textContent = '';
      }, 1000);
    }
  }, [announcer]);

  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      announceToScreenReader('Skipped to main content');
    }
  }, [announceToScreenReader]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to content shortcut (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        skipToContent();
      }

      // Focus management for modals and overlays
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[data-close-modal]') as HTMLElement;
          closeButton?.click();
        }
      }

      // Tab trapping for modals
      if (event.key === 'Tab') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (event.shiftKey && document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    if (settings.keyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [settings.keyboardNavigation, skipToContent]);

  // Monitor system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      updateSetting('reducedMotion', e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      updateSetting('highContrast', e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, [updateSetting]);

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    announceToScreenReader,
    skipToContent
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Hook for screen reader announcements
export function useScreenReader() {
  const { announceToScreenReader } = useAccessibility();
  return announceToScreenReader;
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const { settings } = useAccessibility();
  
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    actions: { [key: string]: () => void }
  ) => {
    if (!settings.keyboardNavigation) return;
    
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }, [settings.keyboardNavigation]);

  return handleKeyDown;
}

// Hook for focus management
export function useFocusManagement() {
  const { settings, announceToScreenReader } = useAccessibility();

  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!settings.keyboardNavigation || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      containerRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [settings.keyboardNavigation]);

  const restoreFocus = useCallback((previousElement: HTMLElement | null) => {
    if (previousElement) {
      previousElement.focus();
      announceToScreenReader('Focus restored');
    }
  }, [announceToScreenReader]);

  return { trapFocus, restoreFocus };
}