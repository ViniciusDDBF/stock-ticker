import { useState, useEffect, useRef } from 'react';
import { generateColorVariations } from '../utils/colorUtils';

// Theme presets
const THEME_PRESETS = [
  { name: 'Orange Spark', color: '#ff7a00', emoji: '🔥' },
  { name: 'Ocean Blue', color: '#0ea5e9', emoji: '🌊' },
  { name: 'Royal Purple', color: '#8b5cf6', emoji: '👑' },
  { name: 'Emerald Dream', color: '#10b981', emoji: '💎' },
  { name: 'Cherry Red', color: '#ef4444', emoji: '🍒' },
  { name: 'Sunset Pink', color: '#ec4899', emoji: '🌅' },
  { name: 'Electric Indigo', color: '#6366f1', emoji: '⚡' },
  { name: 'Aqua Mint', color: '#06b6d4', emoji: '🌿' },
  { name: 'Golden Hour', color: '#f59e0b', emoji: '☀️' },
  { name: 'Violet Storm', color: '#7c3aed', emoji: '🌪️' },
];

// Icons
const ChevronDownIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const PaletteIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// LocalStorage helpers
const getStoredColor = (): string => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme-color') || '#ff7a00';
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
  return '#ff7a00';
};

const setStoredColor = (color: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme-color', color);
    }
  } catch (error) {
    console.warn('Failed to save color to localStorage:', error);
  }
};

// Apply CSS variable updates
const applyThemeVariables = (baseColor: string) => {
  const variations = generateColorVariations(baseColor);
  const root = document.documentElement;

  Object.entries(variations).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

const ThemePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ff7a00');
  const [customColor, setCustomColor] = useState('#ff7a00');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load color from localStorage on mount
  useEffect(() => {
    const storedColor = getStoredColor();
    setCurrentColor(storedColor);
    setCustomColor(storedColor);
    applyThemeVariables(storedColor);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentPreset = () => {
    const match = THEME_PRESETS.find(
      (p) => p.color.toLowerCase() === currentColor.toLowerCase()
    );
    return match || { name: 'Custom', color: currentColor, emoji: '🎨' };
  };

  const currentPreset = getCurrentPreset();

  const handlePresetSelect = (preset: (typeof THEME_PRESETS)[0]) => {
    setCurrentColor(preset.color);
    setCustomColor(preset.color);
    setStoredColor(preset.color);
    applyThemeVariables(preset.color);
    setIsOpen(false);

    // trigger reactivity for other listeners
    window.dispatchEvent(new Event('storage'));
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setCurrentColor(color);
    setStoredColor(color);
    applyThemeVariables(color);

    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex flex-col justify-center relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black-800 hover:bg-black-700 border border-black-600 hover:border-black-500 transition-all duration-200 text-white  cursor-pointer"
      >
        <div
          className="w-4 h-4 rounded-full border border-gray-600"
          style={{ backgroundColor: currentColor }}
        />
        <span className="hidden sm:inline text-sm font-medium">
          {currentPreset.name}
        </span>
        <span className="sm:hidden">{currentPreset.emoji}</span>
        <ChevronDownIcon size={16} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-black-800  rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-black-700 bg-gradient-to-r from-black-800 to-gray-750">
            <div className="flex items-center gap-2">
              <PaletteIcon size={18} />
              <h3 className="font-semibold text-white">Theme Settings</h3>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Choose your perfect color
            </p>
          </div>

          {/* Custom Picker */}
          <div className="p-4 border-b border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-black-600 cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-black-700 border border-black-600 rounded-lg text-white text-sm font-mono focus:ring-2 focus:ring-500 focus:border-transparent outline-none"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="p-2">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Quick Presets
            </h4>
            <div className="grid grid-cols-2 gap-2  max-h-64 overflow-x-hidden">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    currentColor === preset.color
                      ? 'bg-black-700 border-black-500 shadow-lg'
                      : 'bg-black-800 border-black-600 hover:bg-black-700 hover:border-black-500'
                  }`}
                >
                  <div className="relative">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-500"
                      style={{ backgroundColor: preset.color }}
                    />
                    {currentColor === preset.color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckIcon size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.emoji}</span>
                      <span className="font-medium text-white text-sm">
                        {preset.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {preset.color}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
