import React, { useState, useMemo } from 'react';
import { Check, X } from "lucide-react";

// Table/Grid colors with names
const GRID_COLORS = [
  // Grayscale
  { name: 'White', hex: '#FFFFFF' }, { name: 'Cloud', hex: '#F9FAFB' }, { name: 'Silver', hex: '#E5E7EB' }, { name: 'Light Gray', hex: '#D1D5DB' }, { name: 'Gray', hex: '#9CA3AF' }, { name: 'Slate', hex: '#64748B' }, { name: 'Charcoal', hex: '#4B5563' }, { name: 'Black', hex: '#000000' },
  
  // Reds & Pinks
  { name: 'Rose', hex: '#FFF1F2' }, { name: 'Mist', hex: '#FFE4E6' }, { name: 'Blush', hex: '#FECDD3' }, { name: 'Pink', hex: '#FDA4AF' }, { name: 'Rose Red', hex: '#FB7185' }, { name: 'Red', hex: '#EF4444' }, { name: 'Crimson', hex: '#DC2626' }, { name: 'Maroon', hex: '#991B1B' },
  
  // Oranges
  { name: 'Peach', hex: '#FFF7ED' }, { name: 'Shell', hex: '#FFEDD5' }, { name: 'Sand', hex: '#FED7AA' }, { name: 'Orange', hex: '#FDBA74' }, { name: 'Tangerine', hex: '#FB923C' }, { name: 'Dark Orange', hex: '#F97316' }, { name: 'Rust', hex: '#EA580C' }, { name: 'Brick', hex: '#C2410C' },
  
  // Yellows/Ambers
  { name: 'Cream', hex: '#FFFBEB' }, { name: 'Butter', hex: '#FEF3C7' }, { name: 'Pale Gold', hex: '#FDE68A' }, { name: 'Lemon', hex: '#FDE047' }, { name: 'Yellow', hex: '#FACC15' }, { name: 'Gold', hex: '#EAB308' }, { name: 'Amber', hex: '#D97706' }, { name: 'Bronze', hex: '#B45309' },
  
  // Greens
  { name: 'Mint', hex: '#F0FDF4' }, { name: 'Pale Green', hex: '#DCFCE7' }, { name: 'Light Green', hex: '#BBF7D0' }, { name: 'Lime', hex: '#86EFAC' }, { name: 'Green', hex: '#4ADE80' }, { name: 'Emerald', hex: '#22C55E' }, { name: 'Forest', hex: '#16A34A' }, { name: 'Pine', hex: '#15803D' },
  
  // Teals/Cyans
  { name: 'Ice', hex: '#F0FDFA' }, { name: 'Frost', hex: '#CCFBF1' }, { name: 'Aqua', hex: '#99F6E4' }, { name: 'Turquoise', hex: '#5EEAD4' }, { name: 'Teal', hex: '#2DD4BF' }, { name: 'Cyan', hex: '#14B8A6' }, { name: 'Dark Teal', hex: '#0D9488' }, { name: 'Deep Sea', hex: '#0F766E' },
  
  // Blues
  { name: 'Sky Blue', hex: '#F0F9FF' }, { name: 'Powder Blue', hex: '#E0F2FE' }, { name: 'Baby Blue', hex: '#BAE6FD' }, { name: 'Blue', hex: '#7DD3FC' }, { name: 'Cerulean', hex: '#38BDF8' }, { name: 'Ocean Blue', hex: '#0EA5E9' }, { name: 'Royal Blue', hex: '#0284C7' }, { name: 'Navy', hex: '#0369A1' },
  
  // Indigos
  { name: 'Indigo Mist', hex: '#EEF2FF' }, { name: 'Pale Indigo', hex: '#E0E7FF' }, { name: 'Lavender Blue', hex: '#C7D2FE' }, { name: 'Indigo', hex: '#A5B4FC' }, { name: 'Deep Indigo', hex: '#818CF8' }, { name: 'Periwinkle', hex: '#6366F1' }, { name: 'Dark Indigo', hex: '#4F46E5' }, { name: 'Midnight', hex: '#4338CA' },
  
  // Purples
  { name: 'Lilac', hex: '#F5F3FF' }, { name: 'Grape', hex: '#EDE9FE' }, { name: 'Orchid', hex: '#DDD6FE' }, { name: 'Violet', hex: '#C4B5FD' }, { name: 'Purple', hex: '#A78BFA' }, { name: 'Amethyst', hex: '#8B5CF6' }, { name: 'Royal Purple', hex: '#7C3AED' }, { name: 'Eggplant', hex: '#6D28D9' },
  
  // Browns
  { name: 'Tan', hex: '#FDF8F6' }, { name: 'Beige', hex: '#F3E8E2' }, { name: 'Coffee', hex: '#D2B48C' }, { name: 'Camel', hex: '#BC8F8F' }, { name: 'Brown', hex: '#A52A2A' }, { name: 'Sienna', hex: '#A0522D' }, { name: 'Chocolate', hex: '#8B4513' }, { name: 'Dark Brown', hex: '#5D4037' },
];

export default function ColorPicker({ value, onChange, label = "Item Color" }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedColor = useMemo(() => {
    return GRID_COLORS.find(c => c.name === value || c.hex === value) || 
           (value ? { name: value, hex: value } : null);
  }, [value]);

  const handleSelect = (color) => {
    onChange({ target: { name: 'color', value: color.name } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block font-bold text-[#7B1C1C] text-lg">{label}</label>
      <p className="text-[11px] text-gray-400 -mt-1 font-medium mb-2">Select a color from the grid below.</p>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full flex items-center justify-between border border-slate-200 rounded-xl px-4 py-4 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all outline-none"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" 
            style={{ backgroundColor: selectedColor?.hex || '#F8FAFC' }}
          />
          <span className={`font-bold ${selectedColor ? 'text-slate-900' : 'text-slate-400'}`}>
            {typeof selectedColor?.name === 'string' ? selectedColor.name : 'Select color'}
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-[110] mt-3 w-full sm:w-[420px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 origin-top left-0 sm:left-auto sm:right-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Color Palette</h4>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50/50 rounded-2xl border border-slate-50">
              {GRID_COLORS.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(color)}
                  title={color.name}
                  className={`group relative aspect-square rounded-md transition-all duration-150 ${
                    (value === color.name || value === color.hex)
                      ? 'scale-110 z-10 ring-2 ring-white ring-offset-2 ring-offset-blue-500 shadow-lg' 
                      : 'hover:scale-110 hover:z-10 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Subtle border for light colors */}
                  <div className="absolute inset-0 border border-black/5 rounded-md" />
                  
                  {value === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Check size={14} className={['White', 'Cloud', 'Silver', 'Lemon', 'Ice', 'Sky Blue'].includes(color.name) ? 'text-slate-900' : 'text-white'} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl shadow-lg border-4 border-white flex-shrink-0" style={{ backgroundColor: selectedColor?.hex || '#F8FAFC' }} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Selected</span>
                  <span className="text-base font-black text-slate-900 truncate max-w-[150px] leading-tight">{selectedColor?.name || 'None'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white text-xs font-black rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20 uppercase tracking-widest"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}