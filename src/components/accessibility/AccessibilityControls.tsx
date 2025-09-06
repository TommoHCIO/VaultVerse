'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Eye,
  Type,
  MousePointer,
  Volume2,
  Contrast,
  Zap,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Accessibility
} from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings, announceToScreenReader } = useAccessibility();

  const togglePanel = () => {
    setIsOpen(!isOpen);
    announceToScreenReader(
      isOpen ? 'Accessibility panel closed' : 'Accessibility panel opened'
    );
  };

  const colorBlindOptions = [
    { value: 'none', label: 'No Filter' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Accessibility Toggle Button */}
      <motion.button
        onClick={togglePanel}
        className={`
          w-14 h-14 rounded-full shadow-lg
          bg-gradient-to-br from-neon-purple to-neon-cyan
          text-white flex items-center justify-center
          hover:scale-105 transition-transform
          focus:outline-none focus:ring-4 focus:ring-neon-purple/50
          ${settings.focusIndicators ? 'focus:ring-4' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close accessibility controls' : 'Open accessibility controls'}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="accessibility-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
            className={`
              absolute bottom-16 right-0 w-80 max-w-[90vw]
              glass-card rounded-2xl p-6 shadow-2xl
              border border-glass-border
            `}
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-modal="false"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 id="accessibility-title" className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-neon-cyan" />
                  Accessibility
                </h2>
                <button
                  onClick={togglePanel}
                  className={`
                    p-2 rounded-lg bg-glass-bg hover:bg-glass-bg-light
                    transition-colors text-gray-400 hover:text-white
                    focus:outline-none focus:ring-2 focus:ring-neon-cyan
                    ${settings.focusIndicators ? 'focus:ring-2' : ''}
                  `}
                  aria-label="Close accessibility panel"
                  data-close-modal
                >
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>

              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visual
                </h3>
                
                <div className="space-y-3">
                  {/* High Contrast */}
                  <AccessibilityToggle
                    id="high-contrast"
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                    icon={<Contrast className="w-4 h-4" />}
                    checked={settings.highContrast}
                    onChange={(checked) => updateSetting('highContrast', checked)}
                  />

                  {/* Large Text */}
                  <AccessibilityToggle
                    id="large-text"
                    label="Large Text"
                    description="Increase font size for better readability"
                    icon={<Type className="w-4 h-4" />}
                    checked={settings.largeText}
                    onChange={(checked) => updateSetting('largeText', checked)}
                  />

                  {/* Reduced Motion */}
                  <AccessibilityToggle
                    id="reduced-motion"
                    label="Reduce Motion"
                    description="Minimize animations and transitions"
                    icon={<Zap className="w-4 h-4" />}
                    checked={settings.reducedMotion}
                    onChange={(checked) => updateSetting('reducedMotion', checked)}
                  />

                  {/* Focus Indicators */}
                  <AccessibilityToggle
                    id="focus-indicators"
                    label="Focus Indicators"
                    description="Enhanced keyboard focus visibility"
                    icon={<MousePointer className="w-4 h-4" />}
                    checked={settings.focusIndicators}
                    onChange={(checked) => updateSetting('focusIndicators', checked)}
                  />
                </div>
              </div>

              {/* Color Blindness Filter */}
              <div className="space-y-3">
                <label 
                  htmlFor="colorblind-filter" 
                  className="block text-sm font-semibold text-gray-300"
                >
                  Color Blindness Filter
                </label>
                <select
                  id="colorblind-filter"
                  value={settings.colorBlindnessMode}
                  onChange={(e) => updateSetting('colorBlindnessMode', e.target.value as any)}
                  className={`
                    w-full p-3 rounded-lg bg-glass-bg border border-glass-border
                    text-white focus:border-neon-cyan focus:outline-none
                    ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan/50' : ''}
                  `}
                >
                  {colorBlindOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-vaultor-dark">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Audio & Screen Reader
                </h3>
                
                <div className="space-y-3">
                  {/* Screen Reader */}
                  <AccessibilityToggle
                    id="screen-reader"
                    label="Screen Reader Support"
                    description="Enhanced support for screen readers"
                    checked={settings.screenReader}
                    onChange={(checked) => updateSetting('screenReader', checked)}
                  />

                  {/* Audio Descriptions */}
                  <AccessibilityToggle
                    id="audio-descriptions"
                    label="Audio Descriptions"
                    description="Audio descriptions for visual content"
                    checked={settings.audioDescriptions}
                    onChange={(checked) => updateSetting('audioDescriptions', checked)}
                  />
                </div>
              </div>

              {/* Keyboard Navigation */}
              <div className="space-y-3">
                <AccessibilityToggle
                  id="keyboard-navigation"
                  label="Keyboard Navigation"
                  description="Enhanced keyboard navigation support"
                  icon={<MousePointer className="w-4 h-4" />}
                  checked={settings.keyboardNavigation}
                  onChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-glass-border">
                <button
                  onClick={resetSettings}
                  className={`
                    w-full p-3 rounded-lg bg-glass-bg hover:bg-glass-bg-light
                    text-gray-300 hover:text-white transition-colors
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-neon-cyan
                    ${settings.focusIndicators ? 'focus:ring-2' : ''}
                  `}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="text-xs text-gray-500 bg-glass-bg rounded-lg p-3">
                <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
                <div className="space-y-1">
                  <div><kbd className="bg-glass-border px-1 rounded">Alt + S</kbd> Skip to content</div>
                  <div><kbd className="bg-glass-border px-1 rounded">Esc</kbd> Close dialogs</div>
                  <div><kbd className="bg-glass-border px-1 rounded">Tab</kbd> Navigate elements</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccessibilityToggleProps {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function AccessibilityToggle({
  id,
  label,
  description,
  icon,
  checked,
  onChange
}: AccessibilityToggleProps) {
  const { settings } = useAccessibility();

  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="text-neon-cyan mt-1">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-white cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
      
      <motion.button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-description`}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors focus:outline-none
          ${checked ? 'bg-neon-green' : 'bg-glass-bg'}
          ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-vaultor-dark' : ''}
        `}
        whileTap={{ scale: 0.95 }}
      >
        <span className="sr-only">{label}</span>
        <motion.span
          animate={{
            x: checked ? 20 : 2,
          }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
        />
      </motion.button>
    </div>
  );
}