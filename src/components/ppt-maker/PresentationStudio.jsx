import React, { useState, useEffect } from 'react';
import PresentationTopToolbar from './PresentationTopToolbar';
import SlideThumbnailsSidebar from './SlideThumbnailsSidebar';
import SlideCanvas from './SlideCanvas';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import PresenterMode from '../PresenterMode';
import AIPitchWizard from '../AIPitchWizard';
import ShareModal from '../collaboration/ShareModal';
import { useRealtimeCollaboration } from '../collaboration/useRealtimeCollaboration';
import { exportDeckWithPptxGenJs } from '../../utils/pptxGenJsExport';
import { exportDeckToPdf } from '../../utils/pdfExport';
import { HACKATHON_LAYOUTS } from '../../data/hackathonLayouts';
import { HACKATHON_DECKS } from '../../data/hackathonTemplates';
import { normalizeDeck, normalizeSlide } from '../../utils/canvaHelpers';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'hackforge_active_presentation_v2';

export default function PresentationStudio({
  initialDeck,
  onBackToDashboard,
  onSaveDeck,
  userRole = 'Editor'
}) {
  // 1. Restore from localStorage or initialDeck
  const [deck, setDeck] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.slides && parsed.slides.length > 0) {
          return normalizeDeck(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not restore presentation from storage', e);
    }
    return normalizeDeck(initialDeck || HACKATHON_DECKS[0]);
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Undo / Redo History
  const [history, setHistory] = useState(() => [JSON.stringify(deck)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync when initialDeck changes
  useEffect(() => {
    if (initialDeck && initialDeck.id) {
      const normalized = normalizeDeck(initialDeck);
      setDeck(normalized);
      setActiveSlideIndex(0);
      setSelectedElementId(null);
      setHistory([JSON.stringify(normalized)]);
      setHistoryIndex(0);
    }
  }, [initialDeck?.id]);

  // Modals
  const [isAIWizardOpen, setIsAIWizardOpen] = useState(false);
  const [isPresenterOpen, setIsPresenterOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Real-Time Collaboration WebSocket Engine
  const {
    isConnected: isWsConnected,
    activeUsers: onlineCollaborators,
    remoteSelections,
    permissionError: wsPermissionError,
    broadcastSlideUpdate,
    broadcastElementUpdate,
    broadcastSelectElement,
    broadcastDeselectElement,
    broadcastAddElement,
    broadcastDeleteElement,
    broadcastAddSlide,
    broadcastDeleteSlide,
    broadcastMoveSlide
  } = useRealtimeCollaboration({
    projectId: deck.id || 'default-deck',
    currentUser: {
      id: 'user-alex',
      name: 'Alex Rivera',
      role: userRole
    },
    onRemoteSlideUpdate: (slideIdx, updates) => {
      setDeck(prev => {
        const slides = [...prev.slides];
        if (slides[slideIdx]) {
          slides[slideIdx] = { ...slides[slideIdx], ...updates };
        }
        return { ...prev, slides };
      });
    },
    onRemoteElementUpdate: (slideIdx, elId, updates) => {
      setDeck(prev => {
        const slides = [...prev.slides];
        if (slides[slideIdx]) {
          const elems = (slides[slideIdx].elements || []).map(el =>
            el.id === elId ? { ...el, ...updates } : el
          );
          slides[slideIdx] = { ...slides[slideIdx], elements: elems };
        }
        return { ...prev, slides };
      });
    },
    onRemoteAddElement: (slideIdx, elem) => {
      setDeck(prev => {
        const slides = [...prev.slides];
        if (slides[slideIdx]) {
          slides[slideIdx] = { ...slides[slideIdx], elements: [...(slides[slideIdx].elements || []), elem] };
        }
        return { ...prev, slides };
      });
    },
    onRemoteDeleteElement: (slideIdx, elId) => {
      setDeck(prev => {
        const slides = [...prev.slides];
        if (slides[slideIdx]) {
          slides[slideIdx] = {
            ...slides[slideIdx],
            elements: (slides[slideIdx].elements || []).filter(el => el.id !== elId)
          };
        }
        return { ...prev, slides };
      });
    },
    onRemoteAddSlide: (slide) => {
      setDeck(prev => ({ ...prev, slides: [...prev.slides, slide] }));
    },
    onRemoteDeleteSlide: (slideIdx) => {
      setDeck(prev => ({ ...prev, slides: prev.slides.filter((_, i) => i !== slideIdx) }));
    },
    onRemoteMoveSlide: (fromIdx, toIdx) => {
      setDeck(prev => {
        const slides = [...prev.slides];
        const [moved] = slides.splice(fromIdx, 1);
        slides.splice(toIdx, 0, moved);
        return { ...prev, slides };
      });
    }
  });

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 2. Autosave to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    } catch (e) {
      console.warn('Autosave error:', e);
    }
    if (onSaveDeck) {
      onSaveDeck(deck);
    }
  }, [deck]);

  // Push to history on intentional edit
  const pushToHistory = (newDeck) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.stringify(newDeck));
    if (updatedHistory.length > 30) updatedHistory.shift();
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const updateDeckWithHistory = (newDeck) => {
    pushToHistory(newDeck);
    setDeck(newDeck);
  };

  // 3. Undo / Redo Handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setDeck(JSON.parse(prev));
      setHistoryIndex(historyIndex - 1);
      setSelectedElementId(null);
      showToast('Undo action');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setDeck(JSON.parse(next));
      setHistoryIndex(historyIndex + 1);
      setSelectedElementId(null);
      showToast('Redo action');
    }
  };

  // Keyboard Shortcuts (Undo, Redo, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        handleDeleteSelectedElement();
      } else if (e.key === 'Escape') {
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, historyIndex, history]);

  // Current Slide & Selected Element
  const activeSlide = deck.slides[activeSlideIndex] || deck.slides[0] || {};
  const selectedElement = (activeSlide.elements || []).find(el => el.id === selectedElementId);

  // 4. Slide Management (Add, Delete, Duplicate, Move, Apply Layout)
  const handleAddSlide = () => {
    const defaultLayout = HACKATHON_LAYOUTS[3]; // Solution pillars
    const newSlide = normalizeSlide({
      id: `slide-${Date.now()}`,
      layout: defaultLayout.id,
      ...defaultLayout.defaultData,
      elements: []
    });

    const newSlides = [...deck.slides, newSlide];
    updateDeckWithHistory({ ...deck, slides: newSlides });
    setActiveSlideIndex(newSlides.length - 1);
    setSelectedElementId(null);
    showToast('New slide added');
  };

  const handleDuplicateSlide = (idx) => {
    const target = deck.slides[idx];
    if (!target) return;

    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`
    };

    const newSlides = [...deck.slides];
    newSlides.splice(idx + 1, 0, duplicated);
    updateDeckWithHistory({ ...deck, slides: newSlides });
    setActiveSlideIndex(idx + 1);
    showToast('Slide duplicated');
  };

  const handleDeleteSlide = (idx) => {
    if (deck.slides.length <= 1) {
      showToast('Cannot delete the only slide');
      return;
    }

    const newSlides = deck.slides.filter((_, i) => i !== idx);
    const newIdx = Math.min(idx, newSlides.length - 1);
    updateDeckWithHistory({ ...deck, slides: newSlides });
    setActiveSlideIndex(newIdx);
    setSelectedElementId(null);
    showToast('Slide deleted');
  };

  const handleMoveSlide = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= deck.slides.length) return;
    const newSlides = [...deck.slides];
    const [moved] = newSlides.splice(fromIdx, 1);
    newSlides.splice(toIdx, 0, moved);
    updateDeckWithHistory({ ...deck, slides: newSlides });
    setActiveSlideIndex(toIdx);
  };

  const handleApplyLayout = (layoutId) => {
    const layoutConfig = HACKATHON_LAYOUTS.find(l => l.id === layoutId);
    if (!layoutConfig || !activeSlide) return;

    const updatedSlide = {
      ...activeSlide,
      layout: layoutId,
      ...layoutConfig.defaultData
    };

    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    showToast(`Applied layout: ${layoutConfig.name}`);
  };

  // 5. Element & Slide Content Updaters
  const handleUpdateSlide = (updates) => {
    if (!activeSlide) return;
    const updatedSlide = { ...activeSlide, ...updates };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
  };

  const handleUpdateSelectedElement = (updates) => {
    if (!selectedElementId || !activeSlide) return;
    const updatedElements = (activeSlide.elements || []).map(el =>
      el.id === selectedElementId ? { ...el, ...updates } : el
    );
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
  };

  const handleUpdateElementById = (id, updates) => {
    if (!activeSlide) return;
    const updatedElements = (activeSlide.elements || []).map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    setDeck({ ...deck, slides: updatedSlides });
  };

  const handleDuplicateSelectedElement = () => {
    if (!selectedElement || !activeSlide) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(selectedElement)),
      id: `el-${Date.now()}`,
      x: (selectedElement.x || 100) + 20,
      y: (selectedElement.y || 100) + 20
    };
    const updatedElements = [...(activeSlide.elements || []), duplicated];
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    setSelectedElementId(duplicated.id);
    showToast('Element duplicated');
  };

  const handleDeleteSelectedElement = () => {
    if (!selectedElementId || !activeSlide) return;
    const updatedElements = (activeSlide.elements || []).filter(el => el.id !== selectedElementId);
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    setSelectedElementId(null);
    showToast('Element deleted');
  };

  const handleBringForward = () => {
    if (!selectedElement || !activeSlide) return;
    handleUpdateSelectedElement({ zIndex: (selectedElement.zIndex || 30) + 1 });
  };

  const handleSendBackward = () => {
    if (!selectedElement || !activeSlide) return;
    handleUpdateSelectedElement({ zIndex: Math.max(1, (selectedElement.zIndex || 30) - 1) });
  };

  // 6. Add Custom Elements (Text, Shapes, Images)
  const handleAddText = (kind) => {
    const defaultTexts = {
      headline: { content: 'Bold Pitch Headline', fontSize: 32, fontWeight: '800' },
      subtitle: { content: 'Sub-headline describing your unfair advantage.', fontSize: 18, fontWeight: '600' },
      bullets: { content: '• Sub-second response time\n• Zero runtime dependencies\n• 100% verified test suite', fontSize: 14, fontWeight: 'normal' }
    };

    const textData = defaultTexts[kind] || defaultTexts.headline;
    const newElem = {
      id: `el-${Date.now()}`,
      type: 'text',
      x: 200 + Math.floor(Math.random() * 60),
      y: 180 + Math.floor(Math.random() * 60),
      rotation: 0,
      zIndex: 35,
      color: deck.theme === 'blueprint' || deck.theme === 'chalkboard' ? '#FFFFFF' : '#18191B',
      ...textData
    };

    const updatedElements = [...(activeSlide.elements || []), newElem];
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    setSelectedElementId(newElem.id);
    showToast('Added Text element');
  };

  const handleAddShape = (shapeType) => {
    const newElem = {
      id: `el-${Date.now()}`,
      type: shapeType === 'sticky' ? 'sticky' : 'shape',
      shapeType: shapeType,
      x: 250 + Math.floor(Math.random() * 60),
      y: 180 + Math.floor(Math.random() * 60),
      width: shapeType === 'circle' ? 100 : shapeType === 'badge' ? 180 : 160,
      height: shapeType === 'circle' ? 100 : shapeType === 'badge' ? 44 : 110,
      fill: shapeType === 'sticky' ? '#FEF08A' : shapeType === 'badge' ? '#F59E0B' : '#4F46E5',
      text: shapeType === 'sticky' ? 'Important Judge Talking Point' : '',
      rotation: 0,
      zIndex: 32
    };

    const updatedElements = [...(activeSlide.elements || []), newElem];
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    setSelectedElementId(newElem.id);
    showToast(`Added ${shapeType} shape`);
  };

  const handleAddImage = (imageUrl) => {
    const newElem = {
      id: `el-${Date.now()}`,
      type: 'image',
      url: imageUrl,
      x: 200 + Math.floor(Math.random() * 40),
      y: 160 + Math.floor(Math.random() * 40),
      width: 240,
      height: 160,
      rotation: 0,
      zIndex: 30
    };

    const updatedElements = [...(activeSlide.elements || []), newElem];
    const updatedSlide = { ...activeSlide, elements: updatedElements };
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    updateDeckWithHistory({ ...deck, slides: updatedSlides });
    setSelectedElementId(newElem.id);
    showToast('Added Image element');
  };

  // 7. Genuine PPTX Export using PptxGenJS (Requirement 9)
  const handleExportPptx = async () => {
    try {
      showToast('Generating editable .pptx with PptxGenJS...');
      const filename = await exportDeckWithPptxGenJs(deck);
      showToast(`Exported ${filename}!`);
    } catch (err) {
      console.error(err);
      alert('Error exporting PPTX: ' + err.message);
    }
  };

  // 8. Genuine PDF Export using jsPDF (Requirement 10)
  const handleExportPdf = async () => {
    try {
      showToast('Generating landscape 16:9 PDF...');
      const filename = await exportDeckToPdf(deck);
      showToast(`Exported ${filename}!`);
    } catch (err) {
      console.error(err);
      alert('Error exporting PDF: ' + err.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#121316] text-stone-100 flex flex-col overflow-hidden font-sans select-none">
      
      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl border border-indigo-400 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* READ ONLY BANNER FOR VIEWERS */}
      {userRole === 'Viewer' && (
        <div className="h-7 bg-amber-500/20 border-b border-amber-500/30 text-amber-300 px-4 flex items-center justify-between text-[11px] font-mono font-bold">
          <span>🔒 Read-Only Viewer Mode • Slide modifications are disabled</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected to Live Session</span>
          </span>
        </div>
      )}

      {/* 1. TOP TOOLBAR (Text, Shapes, Images, Undo, Redo, Zoom, Present, Export) */}
      <PresentationTopToolbar
        deckTitle={deck.name}
        onUpdateDeckTitle={(title) => updateDeckWithHistory({ ...deck, name: title })}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoomLevel={zoomLevel}
        onZoomIn={() => setZoomLevel(prev => Math.min(150, prev + 15))}
        onZoomOut={() => setZoomLevel(prev => Math.max(50, prev - 15))}
        onZoomReset={() => setZoomLevel(100)}
        onAddText={handleAddText}
        onAddShape={handleAddShape}
        onAddImage={handleAddImage}
        onOpenPresenter={() => setIsPresenterOpen(true)}
        onOpenAIWizard={() => setIsAIWizardOpen(true)}
        onExportPptx={handleExportPptx}
        onExportPdf={handleExportPdf}
        onBackToDashboard={onBackToDashboard}
        isAutosaved={true}
        onOpenShare={() => setIsShareModalOpen(true)}
        activeCollaborators={onlineCollaborators}
      />

      {/* 2. MAIN THREE-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Slide Thumbnails Sidebar */}
        <SlideThumbnailsSidebar
          slides={deck.slides}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={(idx) => {
            setActiveSlideIndex(idx);
            setSelectedElementId(null);
          }}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
          onApplyLayout={handleApplyLayout}
          onOpenAIWizard={() => setIsAIWizardOpen(true)}
        />

        {/* CENTER COLUMN: Interactive Editable Slide Canvas */}
        <SlideCanvas
          slide={activeSlide}
          theme={deck.theme}
          fontStyle={deck.fontStyle}
          highlighterColor={deck.highlighterColor}
          zoomLevel={zoomLevel}
          selectedElementId={selectedElementId}
          onSelectElement={(elId) => {
            if (selectedElementId) broadcastDeselectElement(selectedElementId);
            setSelectedElementId(elId);
            if (elId) broadcastSelectElement(elId);
          }}
          onUpdateElement={(id, updates) => {
            handleUpdateElementById(id, updates);
            broadcastElementUpdate(activeSlideIndex, id, updates);
          }}
          onUpdateSlideContent={(updates) => {
            handleUpdateSlide(updates);
            broadcastSlideUpdate(activeSlideIndex, updates);
          }}
          remoteSelections={remoteSelections}
          isReadOnly={userRole === 'Viewer'}
        />

        {/* RIGHT COLUMN: Element & Slide Properties Panel */}
        <ElementPropertiesPanel
          selectedElement={selectedElement}
          onUpdateSelectedElement={(updates) => {
            handleUpdateSelectedElement(updates);
            if (selectedElementId) broadcastElementUpdate(activeSlideIndex, selectedElementId, updates);
          }}
          onDuplicateSelectedElement={handleDuplicateSelectedElement}
          onDeleteSelectedElement={() => {
            if (selectedElementId) broadcastDeleteElement(activeSlideIndex, selectedElementId);
            handleDeleteSelectedElement();
          }}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          activeSlide={activeSlide}
          onUpdateSlide={(updates) => {
            handleUpdateSlide(updates);
            broadcastSlideUpdate(activeSlideIndex, updates);
          }}
          theme={deck.theme}
          onUpdateTheme={(th) => updateDeckWithHistory({ ...deck, theme: th })}
          onApplyLayout={(lId) => {
            handleApplyLayout(lId);
          }}
        />

      </div>

      {/* FULLSCREEN PRESENTER STAGE */}
      {isPresenterOpen && (
        <PresenterMode
          slides={deck.slides}
          activeSlideIndex={activeSlideIndex}
          theme={deck.theme}
          fontStyle={deck.fontStyle}
          highlighterColor={deck.highlighterColor}
          onClose={() => setIsPresenterOpen(false)}
          onSlideChange={setActiveSlideIndex}
        />
      )}

      {/* AI PITCH WIZARD */}
      <AIPitchWizard
        isOpen={isAIWizardOpen}
        onClose={() => setIsAIWizardOpen(false)}
        onGenerateDeck={(genDeck) => {
          updateDeckWithHistory(normalizeDeck(genDeck));
          setActiveSlideIndex(0);
          setSelectedElementId(null);
          showToast('Generated 8-slide presentation with AI!');
        }}
      />

      {/* REAL-TIME COLLABORATION SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectId={deck.id || 'default-deck'}
        projectName={deck.name || 'Hackathon Pitch Deck'}
      />

    </div>
  );
}
