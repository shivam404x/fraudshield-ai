/**
 * Zero-dependency pure PDF 1.4 generator for HackForge AI.
 * Produces genuine multi-page landscape PDF files that open in all PDF viewers
 * and downloads directly as a `.pdf` file.
 */

function escapePdfText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E\n]/g, ' '); // Clean non-ASCII for basic PDF fonts
}

export async function exportDeckToPdf(deck) {
  if (!deck || !deck.slides || deck.slides.length === 0) {
    throw new Error('No slides to export.');
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length; // 1-based obj number
  };

  // Obj 1: Catalog placeholder
  // Obj 2: Pages placeholder
  // Obj 3: Font Helvetica
  // Obj 4: Font Helvetica-Bold

  const fontHelveticaId = 3;
  const fontHelveticaBoldId = 4;

  const pageIds = [];
  const slideCount = deck.slides.length;

  // Pre-allocate slots
  objects.push(''); // 1: Catalog
  objects.push(''); // 2: Pages
  objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`); // 3
  objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`); // 4

  const isDark = deck.theme === 'blueprint' || deck.theme === 'chalkboard';
  const bgR = isDark ? (deck.theme === 'blueprint' ? 0.06 : 0.09) : (deck.theme === 'kraft' ? 0.98 : 1.0);
  const bgG = isDark ? (deck.theme === 'blueprint' ? 0.09 : 0.09) : (deck.theme === 'kraft' ? 0.96 : 1.0);
  const bgB = isDark ? (deck.theme === 'blueprint' ? 0.16 : 0.11) : (deck.theme === 'kraft' ? 0.93 : 1.0);

  const textR = isDark ? 0.97 : 0.06;
  const textG = isDark ? 0.98 : 0.09;
  const textB = isDark ? 0.99 : 0.16;

  // Build each slide page
  deck.slides.forEach((slide, idx) => {
    let stream = '';

    // 1. Background rectangle (960 x 540)
    stream += `q ${bgR.toFixed(2)} ${bgG.toFixed(2)} ${bgB.toFixed(2)} rg 0 0 960 540 re f Q\n`;

    // 2. Top accent line (Indigo)
    stream += `q 0.31 0.27 0.90 RG 3 w 40 510 m 920 510 l S Q\n`;

    // 3. Category Badge Pill
    stream += `q 0.90 0.93 1.00 rg 40 468 180 24 re f Q\n`;
    stream += `BT /F2 10 Tf 0.31 0.27 0.90 rg 50 476 Td (${escapePdfText((slide.badge || 'HACKATHON PITCH').toUpperCase())}) Tj ET\n`;

    // 4. Slide Title
    stream += `BT /F2 26 Tf ${textR.toFixed(2)} ${textG.toFixed(2)} ${textB.toFixed(2)} rg 40 430 Td (${escapePdfText(slide.title || `Slide ${idx + 1}`)}) Tj ET\n`;

    // 5. Subtitle
    if (slide.subtitle) {
      stream += `BT /F1 12 Tf 0.38 0.44 0.53 rg 40 405 Td (${escapePdfText(slide.subtitle)}) Tj ET\n`;
    }

    // 6. Layout Specific Content
    const layout = slide.layout || 'title-hero';

    if (layout === 'old-vs-new') {
      // Left box: Red
      stream += `q 0.99 0.95 0.95 rg 40 100 420 270 re f 0.94 0.27 0.27 RG 1.5 w 40 100 420 270 re S Q\n`;
      stream += `BT /F2 14 Tf 0.86 0.15 0.15 rg 60 340 Td (${escapePdfText(`[X] ${slide.leftCol?.title || 'The Broken Way'}`)}) Tj ET\n`;

      let yPos = 300;
      (slide.leftCol?.items || []).forEach(item => {
        stream += `BT /F1 11 Tf 0.50 0.11 0.11 rg 60 ${yPos} Td (- ${escapePdfText(item)}) Tj ET\n`;
        yPos -= 22;
      });

      // Right box: Green
      stream += `q 0.93 0.99 0.96 rg 500 100 420 270 re f 0.06 0.73 0.51 RG 1.5 w 500 100 420 270 re S Q\n`;
      stream += `BT /F2 14 Tf 0.02 0.59 0.41 rg 520 340 Td (${escapePdfText(`[OK] ${slide.rightCol?.title || 'Our Hackathon Fix'}`)}) Tj ET\n`;

      yPos = 300;
      (slide.rightCol?.items || []).forEach(item => {
        stream += `BT /F1 11 Tf 0.02 0.31 0.23 rg 520 ${yPos} Td (+ ${escapePdfText(item)}) Tj ET\n`;
        yPos -= 22;
      });

    } else if (layout === 'solution-pillars' || layout === 'bento-grid') {
      const cards = slide.cards || [
        { title: 'Core Feature 1', description: 'Real-time telemetry parser', tag: 'Speed' },
        { title: 'Core Feature 2', description: 'Deterministic agent logic', tag: 'Safe' },
        { title: 'Core Feature 3', description: '1-click deployment output', tag: 'Scale' }
      ];

      const w = 275;
      cards.slice(0, 3).forEach((card, cIdx) => {
        const x = 40 + cIdx * 300;
        stream += `q 0.96 0.97 0.99 rg ${x} 100 ${w} 270 re f 0.80 0.84 0.88 RG 1 w ${x} 100 ${w} 270 re S Q\n`;
        stream += `BT /F2 9 Tf 0.31 0.27 0.90 rg ${x + 20} 340 Td (${escapePdfText((card.tag || 'PILLAR').toUpperCase())}) Tj ET\n`;
        stream += `BT /F2 14 Tf ${textR.toFixed(2)} ${textG.toFixed(2)} ${textB.toFixed(2)} rg ${x + 20} 310 Td (${escapePdfText(card.title || '')}) Tj ET\n`;
        stream += `BT /F1 10 Tf 0.38 0.44 0.53 rg ${x + 20} 275 Td (${escapePdfText(card.description || '')}) Tj ET\n`;
      });

    } else if (layout === 'metrics-traction') {
      const stats = slide.stats || [
        { value: '10x', label: 'Faster Resolution', note: 'Validated vs baseline' },
        { value: '99.4%', label: 'Deterministic Accuracy', note: 'Over 150 test runs' },
        { value: '85%', label: 'Cost Reduction', note: 'Through edge caching' }
      ];

      const w = 275;
      stats.slice(0, 3).forEach((st, stIdx) => {
        const x = 40 + stIdx * 300;
        stream += `q 0.98 0.98 0.99 rg ${x} 100 ${w} 270 re f 0.96 0.62 0.07 RG 2 w ${x} 100 ${w} 270 re S Q\n`;
        stream += `BT /F2 40 Tf 0.96 0.62 0.07 rg ${x + 40} 280 Td (${escapePdfText(st.value || '10x')}) Tj ET\n`;
        stream += `BT /F2 14 Tf ${textR.toFixed(2)} ${textG.toFixed(2)} ${textB.toFixed(2)} rg ${x + 40} 240 Td (${escapePdfText(st.label || '')}) Tj ET\n`;
        stream += `BT /F1 10 Tf 0.38 0.44 0.53 rg ${x + 40} 200 Td (${escapePdfText(st.note || '')}) Tj ET\n`;
      });

    } else {
      // General layout box
      stream += `q 0.96 0.97 0.99 rg 40 100 880 270 re f 0.85 0.88 0.92 RG 1 w 40 100 880 270 re S Q\n`;
      let yPos = 330;
      (slide.bulletList || []).forEach(b => {
        stream += `BT /F1 12 Tf ${textR.toFixed(2)} ${textG.toFixed(2)} ${textB.toFixed(2)} rg 60 ${yPos} Td (o  ${escapePdfText(b)}) Tj ET\n`;
        yPos -= 28;
      });
    }

    // 7. Footer
    stream += `BT /F1 9 Tf 0.58 0.64 0.72 rg 40 40 Td (Slide ${idx + 1} of ${slideCount} - HackForge AI) Tj ET\n`;
    stream += `BT /F1 9 Tf 0.58 0.64 0.72 rg 780 40 Td (CONFIDENTIAL HACKATHON PITCH) Tj ET\n`;

    // Create stream object
    const streamObjId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

    // Create Page object
    const pageObjId = addObject(`<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 960 540]
  /Contents ${streamObjId} 0 R
  /Resources <<
    /Font <<
      /F1 ${fontHelveticaId} 0 R
      /F2 ${fontHelveticaBoldId} 0 R
    >>
  >>
>>`);

    pageIds.push(pageObjId);
  });

  // Fill in Catalog & Pages
  objects[0] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  // Build binary PDF
  let pdfContent = `%PDF-1.4\n`;
  const xrefOffsets = [];

  objects.forEach((obj, idx) => {
    xrefOffsets.push(pdfContent.length);
    pdfContent += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = pdfContent.length;
  pdfContent += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  xrefOffsets.forEach(offset => {
    pdfContent += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });

  pdfContent += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  // Download Blob
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `${(deck.name || 'Hackathon_Pitch').replace(/[^a-z0-9]/gi, '_')}.pdf`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}
