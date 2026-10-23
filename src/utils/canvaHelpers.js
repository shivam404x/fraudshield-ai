export function normalizeSlide(slide) {
  if (!slide) return null;

  const elements = slide.elements ? [...slide.elements] : [];

  if (elements.length === 0) {
    (slide.stickyNotes || []).forEach((sn, idx) => {
      elements.push({
        id: sn.id || `el-sn-${idx}`,
        type: 'sticky',
        title: sn.title || 'NOTE',
        text: sn.text || '',
        color: sn.color || 'yellow',
        x: 680,
        y: 120 + idx * 160,
        rotation: parseInt(sn.angle) || 0,
        zIndex: 25
      });
    });

    (slide.stickers || []).forEach((st, idx) => {
      elements.push({
        id: `el-st-${idx}`,
        type: st.type === 'stamp' ? 'stamp' : st.type === 'arrow' ? 'arrow' : 'sticker',
        stickerType: st.type,
        label: st.label,
        direction: st.direction,
        color: st.color || (st.type === 'stamp' ? 'red' : '#D97706'),
        x: parseInt(st.x) ? (parseInt(st.x) * 9.6) : 750,
        y: parseInt(st.y) ? (parseInt(st.y) * 5.4) : 80,
        rotation: parseInt(st.rotation) || 0,
        zIndex: 28
      });
    });
  }

  return {
    ...slide,
    elements,
    drawings: slide.drawings || []
  };
}

export function normalizeDeck(deck) {
  if (!deck) return null;
  return {
    ...deck,
    slides: (deck.slides || []).map(normalizeSlide)
  };
}
