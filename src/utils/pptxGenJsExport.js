import pptxgen from 'pptxgenjs';

/**
 * Exports a HackForge deck to a genuine, fully-editable Microsoft PowerPoint (.pptx) file
 * using PptxGenJS.
 */
export async function exportDeckWithPptxGenJs(deck) {
  if (!deck || !deck.slides || deck.slides.length === 0) {
    throw new Error('No slides available to export.');
  }

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.author = 'HackForge AI';
  pptx.company = 'HackForge Hackathon Studio';
  pptx.subject = deck.name || 'Hackathon Pitch Deck';
  pptx.title = deck.name || 'Hackathon Presentation';

  // Palette definitions
  const isDarkTheme = deck.theme === 'blueprint' || deck.theme === 'chalkboard';
  const bgColor = isDarkTheme ? (deck.theme === 'blueprint' ? '0F172A' : '18181B') : (deck.theme === 'kraft' ? 'FDFBF7' : 'FFFFFF');
  const textColor = isDarkTheme ? 'F8FAFC' : '0F172A';
  const subtextColor = isDarkTheme ? '94A3B8' : '475569';
  const accentColor = '4F46E5'; // Indigo

  deck.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    s.background = { color: bgColor };

    // Slide Number & Watermark
    s.addText(`Slide ${idx + 1} of ${deck.slides.length} • HackForge AI`, {
      x: 0.8,
      y: 5.2,
      w: 8.4,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: isDarkTheme ? '64748B' : '94A3B8',
      align: 'left'
    });

    // Badge Pill
    if (slide.badge) {
      s.addText(slide.badge.toUpperCase(), {
        x: 0.8,
        y: 0.45,
        w: 4.0,
        h: 0.32,
        fontSize: 10,
        fontFace: 'Arial',
        bold: true,
        color: '4F46E5',
        fill: { color: isDarkTheme ? '1E1B4B' : 'EEF2FF' }
      });
    }

    // Title
    s.addText(slide.title || `Slide ${idx + 1}`, {
      x: 0.8,
      y: 0.85,
      w: 8.4,
      h: 0.7,
      fontSize: 26,
      fontFace: 'Arial',
      bold: true,
      color: textColor
    });

    // Subtitle
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 0.8,
        y: 1.55,
        w: 8.4,
        h: 0.45,
        fontSize: 13,
        fontFace: 'Arial',
        color: subtextColor
      });
    }

    // Layout Specific Content Rendering
    const layout = slide.layout || 'title-hero';

    if (layout === 'title-hero') {
      const bullets = (slide.bulletList || []).map(b => ({
        text: b.replace(/^[⚡🔥🛠️➜•\s]+/, ''),
        options: { bullet: true, fontSize: 13, color: textColor, breakLine: true }
      }));

      if (bullets.length > 0) {
        s.addText(bullets, {
          x: 0.8,
          y: 2.2,
          w: 5.4,
          h: 2.6,
          fontFace: 'Arial',
          valign: 'top',
          lineSpacing: 26
        });
      }

      // Hero Highlight Box on Right
      s.addShape(pptx.ShapeType.roundRect, {
        x: 6.5,
        y: 2.2,
        w: 2.7,
        h: 2.4,
        fill: { color: isDarkTheme ? '1E293B' : 'F1F5F9' },
        line: { color: 'CBD5E1', width: 1 },
        rectRadius: 0.15
      });

      s.addText('HACKATHON MOAT', {
        x: 6.7,
        y: 2.4,
        w: 2.3,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Arial',
        bold: true,
        color: 'F59E0B'
      });

      s.addText(slide.stamp || '100% SHIPPED MVP\nVerified in 24h hackathon sprint with real live API integration.', {
        x: 6.7,
        y: 2.75,
        w: 2.3,
        h: 1.6,
        fontSize: 11,
        fontFace: 'Arial',
        color: subtextColor
      });

    } else if (layout === 'old-vs-new') {
      // Left Box: Broken Legacy
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 2.2,
        w: 4.0,
        h: 2.7,
        fill: { color: isDarkTheme ? '3B1219' : 'FEF2F2' },
        line: { color: 'F87171', width: 1 },
        rectRadius: 0.15
      });

      s.addText(`❌ ${slide.leftCol?.title || 'The Broken Way'}`, {
        x: 1.0,
        y: 2.35,
        w: 3.6,
        h: 0.35,
        fontSize: 13,
        fontFace: 'Arial',
        bold: true,
        color: 'DC2626'
      });

      const leftItems = (slide.leftCol?.items || []).map(it => ({
        text: it,
        options: { bullet: true, fontSize: 11, color: isDarkTheme ? 'FECACA' : '7F1D1D', breakLine: true }
      }));

      s.addText(leftItems, {
        x: 1.0,
        y: 2.8,
        w: 3.6,
        h: 1.9,
        fontFace: 'Arial',
        lineSpacing: 22
      });

      // Right Box: Our Breakthrough
      s.addShape(pptx.ShapeType.roundRect, {
        x: 5.2,
        y: 2.2,
        w: 4.0,
        h: 2.7,
        fill: { color: isDarkTheme ? '062E1F' : 'ECFDF5' },
        line: { color: '34D399', width: 1 },
        rectRadius: 0.15
      });

      s.addText(`✅ ${slide.rightCol?.title || 'Our Hackathon Fix'}`, {
        x: 5.4,
        y: 2.35,
        w: 3.6,
        h: 0.35,
        fontSize: 13,
        fontFace: 'Arial',
        bold: true,
        color: '059669'
      });

      const rightItems = (slide.rightCol?.items || []).map(it => ({
        text: it,
        options: { bullet: true, fontSize: 11, color: isDarkTheme ? 'A7F3D0' : '064E3B', breakLine: true }
      }));

      s.addText(rightItems, {
        x: 5.4,
        y: 2.8,
        w: 3.6,
        h: 1.9,
        fontFace: 'Arial',
        lineSpacing: 22
      });

    } else if (layout === 'solution-pillars' || layout === 'bento-grid') {
      const cards = slide.cards || [
        { title: 'Feature 1', description: 'Core technical foundation', tag: 'Speed' },
        { title: 'Feature 2', description: 'Real-time telemetry parser', tag: 'Scale' },
        { title: 'Feature 3', description: 'Deterministic safety sandbox', tag: 'Safe' }
      ];

      const cardWidth = 2.65;
      cards.slice(0, 3).forEach((c, cIdx) => {
        const xPos = 0.8 + cIdx * (cardWidth + 0.22);
        s.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: 2.2,
          w: cardWidth,
          h: 2.7,
          fill: { color: isDarkTheme ? '1E293B' : 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1 },
          rectRadius: 0.15
        });

        s.addText(c.tag || 'PILLAR', {
          x: xPos + 0.15,
          y: 2.35,
          w: cardWidth - 0.3,
          h: 0.25,
          fontSize: 9,
          fontFace: 'Arial',
          bold: true,
          color: '4F46E5'
        });

        s.addText(c.title || `Pillar ${cIdx + 1}`, {
          x: xPos + 0.15,
          y: 2.65,
          w: cardWidth - 0.3,
          h: 0.45,
          fontSize: 13,
          fontFace: 'Arial',
          bold: true,
          color: textColor
        });

        s.addText(c.description || '', {
          x: xPos + 0.15,
          y: 3.15,
          w: cardWidth - 0.3,
          h: 1.5,
          fontSize: 10,
          fontFace: 'Arial',
          color: subtextColor,
          lineSpacing: 18
        });
      });

    } else if (layout === 'architecture-flow') {
      const steps = slide.steps || [
        { number: '01', title: 'Telemetry Listener', detail: 'Event listener capturing telemetry' },
        { number: '02', title: 'Stateless Queue', detail: 'Worker pipeline for parallel routing' },
        { number: '03', title: 'Execution Core', detail: 'Proprietary reasoning loop' },
        { number: '04', title: 'Verified Output', detail: '1-click deployment output' }
      ];

      const stepWidth = 1.95;
      steps.slice(0, 4).forEach((st, sIdx) => {
        const xPos = 0.8 + sIdx * (stepWidth + 0.2);
        s.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: 2.2,
          w: stepWidth,
          h: 2.6,
          fill: { color: isDarkTheme ? '1E293B' : 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1 },
          rectRadius: 0.15
        });

        s.addText(`STEP ${st.number || sIdx + 1}`, {
          x: xPos + 0.12,
          y: 2.35,
          w: stepWidth - 0.24,
          h: 0.25,
          fontSize: 9,
          fontFace: 'Arial',
          bold: true,
          color: 'F59E0B'
        });

        s.addText(st.title || '', {
          x: xPos + 0.12,
          y: 2.65,
          w: stepWidth - 0.24,
          h: 0.45,
          fontSize: 11,
          fontFace: 'Arial',
          bold: true,
          color: textColor
        });

        s.addText(st.detail || '', {
          x: xPos + 0.12,
          y: 3.15,
          w: stepWidth - 0.24,
          h: 1.4,
          fontSize: 9,
          fontFace: 'Arial',
          color: subtextColor,
          lineSpacing: 16
        });
      });

    } else if (layout === 'metrics-traction') {
      const stats = slide.stats || [
        { value: '10x', label: 'Faster Resolution', note: 'Compared to manual baseline' },
        { value: '99.4%', label: 'Deterministic Accuracy', note: 'Across 150 test suites' },
        { value: '85%', label: 'Cost Reduction', note: 'Through edge caching' }
      ];

      const statWidth = 2.65;
      stats.slice(0, 3).forEach((st, stIdx) => {
        const xPos = 0.8 + stIdx * (statWidth + 0.22);
        s.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: 2.2,
          w: statWidth,
          h: 2.6,
          fill: { color: isDarkTheme ? '1E293B' : 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1 },
          rectRadius: 0.15
        });

        s.addText(st.value || '10x', {
          x: xPos,
          y: 2.5,
          w: statWidth,
          h: 0.7,
          fontSize: 32,
          fontFace: 'Arial',
          bold: true,
          color: 'F59E0B',
          align: 'center'
        });

        s.addText(st.label || 'Benchmark', {
          x: xPos + 0.1,
          y: 3.3,
          w: statWidth - 0.2,
          h: 0.35,
          fontSize: 12,
          fontFace: 'Arial',
          bold: true,
          color: textColor,
          align: 'center'
        });

        s.addText(st.note || '', {
          x: xPos + 0.1,
          y: 3.7,
          w: statWidth - 0.2,
          h: 0.8,
          fontSize: 10,
          fontFace: 'Arial',
          color: subtextColor,
          align: 'center'
        });
      });

    } else {
      // Generic fallback / text layout
      const bullets = (slide.bulletList || []).map(b => ({
        text: b,
        options: { bullet: true, fontSize: 13, color: textColor, breakLine: true }
      }));

      if (bullets.length > 0) {
        s.addText(bullets, {
          x: 0.8,
          y: 2.2,
          w: 8.4,
          h: 2.7,
          fontFace: 'Arial',
          lineSpacing: 24
        });
      }
    }

    // Dynamic overlay elements added by user (shapes, texts)
    (slide.elements || []).forEach(el => {
      // Normalize pixel coords (960x540 canvas to 10 x 5.625 inches)
      const x = ((el.x || 100) / 960) * 10;
      const y = ((el.y || 100) / 540) * 5.625;
      const w = ((el.width || 180) / 960) * 10;
      const h = ((el.height || 100) / 540) * 5.625;

      if (el.type === 'text') {
        s.addText(el.content || 'Text', {
          x, y, w: Math.max(w, 2), h: Math.max(h, 0.4),
          fontSize: el.fontSize ? Math.round(el.fontSize * 0.75) : 14,
          fontFace: 'Arial',
          bold: el.fontWeight === 'bold' || el.fontWeight === '800' || el.fontWeight === '700',
          color: el.color?.replace('#', '') || (isDarkTheme ? 'FFFFFF' : '000000')
        });
      } else if (el.type === 'shape') {
        const shapeType = el.shapeType === 'circle' ? pptx.ShapeType.oval : pptx.ShapeType.roundRect;
        s.addShape(shapeType, {
          x, y, w: Math.max(w, 1.2), h: Math.max(h, 1.2),
          fill: { color: el.fill?.replace('#', '') || '4F46E5' },
          line: { color: el.borderColor?.replace('#', '') || '6366F1', width: 1 }
        });
      } else if (el.type === 'sticky') {
        s.addShape(pptx.ShapeType.roundRect, {
          x, y, w: 2.0, h: 1.5,
          fill: { color: el.color === 'coral' ? 'FECDD3' : el.color === 'cyan' ? 'CFFAFE' : 'FEF08A' },
          line: { color: 'E2E8F0', width: 1 },
          rectRadius: 0.1
        });
        s.addText(el.text || '', {
          x: x + 0.1, y: y + 0.1, w: 1.8, h: 1.3,
          fontSize: 9, fontFace: 'Arial', color: '1E293B', lineSpacing: 14
        });
      }
    });

    // Speaker Notes for Judges
    const notes = [
      slide.speakerNotes ? `🎙️ SPEAKER SCRIPT:\n${slide.speakerNotes}\n` : '',
      slide.judgeQA ? `\n🛡️ JUDGE Q&A:\nQ: ${slide.judgeQA.q}\nA: ${slide.judgeQA.a}\n` : ''
    ].filter(Boolean).join('\n');

    if (notes) {
      s.addNotes(notes);
    }
  });

  const filename = `${(deck.name || 'Hackathon_Pitch').replace(/[^a-z0-9]/gi, '_')}.pptx`;
  await pptx.writeFile({ fileName: filename });
  return filename;
}
