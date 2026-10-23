import React from 'react';
import { 
  Layers, Shapes, Type, LayoutGrid, 
  PenTool, Palette, Sparkles, FolderKanban 
} from 'lucide-react';

export default function CanvaSidebar({
  activeTab = 'elements',
  onSelectTab,
  isDrawerOpen = true
}) {
  const tabs = [
    { id: 'templates', label: 'Decks', icon: Layers },
    { id: 'elements', label: 'Elements', icon: Shapes },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'layouts', label: 'Layouts', icon: LayoutGrid },
    { id: 'draw', label: 'Draw', icon: PenTool },
    { id: 'brand', label: 'Theme', icon: Palette }
  ];

  return (
    <aside className="w-18 bg-[#18191B] border-r border-stone-800 flex flex-col items-center py-3 select-none shrink-0 z-20">
      <div className="flex-1 flex flex-col gap-1 w-full px-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && isDrawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group relative ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-stone-400'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
