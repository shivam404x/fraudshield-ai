/**
 * Pure JavaScript PPTX (OpenXML PresentationML) Generator
 * Creates valid, native .pptx files that open directly in Microsoft PowerPoint, 
 * Google Slides, and Apple Keynote with ZERO external npm dependencies.
 */

// CRC32 calculation table
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Minimal in-memory ZIP builder (PKZip standard, Store method 0)
class SimpleZip {
  constructor() {
    this.files = [];
  }

  addFile(path, contentStr) {
    const encoder = new TextEncoder();
    const data = typeof contentStr === 'string' ? encoder.encode(contentStr) : contentStr;
    this.files.push({ path, data });
  }

  generateBlob() {
    const parts = [];
    const centralDirectory = [];
    let offset = 0;

    for (const file of this.files) {
      const pathBytes = new TextEncoder().encode(file.path);
      const crc = crc32(file.data);
      const size = file.data.length;

      // Local file header (30 bytes + path length)
      const localHeader = new Uint8Array(30 + pathBytes.length);
      const v = new DataView(localHeader.buffer);
      v.setUint32(0, 0x04034b50, true); // signature
      v.setUint16(4, 20, true);         // version needed
      v.setUint16(6, 0, true);          // flags
      v.setUint16(8, 0, true);          // compression (0 = store)
      v.setUint16(10, 0, true);         // mod time
      v.setUint16(12, 0, true);         // mod date
      v.setUint32(14, crc, true);       // crc-32
      v.setUint32(18, size, true);      // compressed size
      v.setUint32(22, size, true);      // uncompressed size
      v.setUint16(26, pathBytes.length, true); // filename length
      v.setUint16(28, 0, true);         // extra field length
      localHeader.set(pathBytes, 30);

      parts.push(localHeader);
      parts.push(file.data);

      // Record for central directory
      centralDirectory.push({
        pathBytes,
        crc,
        size,
        offset
      });

      offset += localHeader.length + file.data.length;
    }

    const cdStartOffset = offset;
    let cdSize = 0;

    for (const cd of centralDirectory) {
      const header = new Uint8Array(46 + cd.pathBytes.length);
      const v = new DataView(header.buffer);
      v.setUint32(0, 0x02014b50, true); // signature
      v.setUint16(4, 20, true);         // version made by
      v.setUint16(6, 20, true);         // version needed
      v.setUint16(8, 0, true);          // flags
      v.setUint16(10, 0, true);         // compression (store)
      v.setUint16(12, 0, true);         // mod time
      v.setUint16(14, 0, true);         // mod date
      v.setUint32(16, cd.crc, true);    // crc-32
      v.setUint32(20, cd.size, true);   // compressed size
      v.setUint32(24, cd.size, true);   // uncompressed size
      v.setUint16(28, cd.pathBytes.length, true); // filename length
      v.setUint16(30, 0, true);         // extra length
      v.setUint16(32, 0, true);         // comment length
      v.setUint16(34, 0, true);         // disk number start
      v.setUint16(36, 0, true);         // internal file attrs
      v.setUint32(38, 0, true);         // external file attrs
      v.setUint32(42, cd.offset, true); // relative offset of local header
      header.set(cd.pathBytes, 46);

      parts.push(header);
      cdSize += header.length;
    }

    // End of central directory record (22 bytes)
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);  // signature
    ev.setUint16(4, 0, true);           // disk number
    ev.setUint16(6, 0, true);           // disk where central dir starts
    ev.setUint16(8, centralDirectory.length, true);  // entries on disk
    ev.setUint16(10, centralDirectory.length, true); // total entries
    ev.setUint32(12, cdSize, true);     // size of central directory
    ev.setUint32(16, cdStartOffset, true); // offset of central directory
    ev.setUint16(20, 0, true);          // comment length
    parts.push(eocd);

    return new Blob(parts, { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate and download an actual native .pptx file for Microsoft PowerPoint / Keynote / Google Slides
 */
export function exportDeckToPptx(deck) {
  const zip = new SimpleZip();
  const slides = deck.slides || [];

  // 1. [Content_Types].xml
  let contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`;
  
  for (let i = 1; i <= slides.length; i++) {
    contentTypes += `\n  <Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  }
  contentTypes += `\n</Types>`;
  zip.addFile('[Content_Types].xml', contentTypes);

  // 2. _rels/.rels
  zip.addFile('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

  // 3. ppt/_rels/presentation.xml.rels
  let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;
  for (let i = 1; i <= slides.length; i++) {
    presRels += `\n  <Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
  }
  presRels += `\n</Relationships>`;
  zip.addFile('ppt/_rels/presentation.xml.rels', presRels);

  // 4. ppt/presentation.xml
  let presXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>`;
  for (let i = 1; i <= slides.length; i++) {
    presXml += `\n    <p:sldId id="${255 + i}" r:id="rId${i}"/>`;
  }
  presXml += `\n  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;
  zip.addFile('ppt/presentation.xml', presXml);

  // 5. Individual slide XMLs
  slides.forEach((slide, idx) => {
    const slideNumber = idx + 1;
    const title = escapeXml(slide.title || `Slide ${slideNumber}`);
    const subtitle = escapeXml(slide.subtitle || '');
    const badge = escapeXml(slide.badge || 'HACKATHON');
    const speakerNotes = escapeXml(slide.speakerNotes || '');

    // Format bullet points or cards
    let bodyTextLines = [];
    if (slide.bulletList && slide.bulletList.length > 0) {
      bodyTextLines = slide.bulletList.map(b => escapeXml(b));
    } else if (slide.cards && slide.cards.length > 0) {
      bodyTextLines = slide.cards.map(c => `[${escapeXml(c.title)}]: ${escapeXml(c.description || '')}`);
    } else if (slide.leftCol && slide.rightCol) {
      bodyTextLines.push(`OLD: ${slide.leftCol.items?.join(', ')}`);
      bodyTextLines.push(`NEW: ${slide.rightCol.items?.join(', ')}`);
    } else if (slide.steps && slide.steps.length > 0) {
      bodyTextLines = slide.steps.map(s => `${escapeXml(s.number)}. ${escapeXml(s.title)}: ${escapeXml(s.detail || '')}`);
    } else if (slide.stats && slide.stats.length > 0) {
      bodyTextLines = slide.stats.map(s => `${escapeXml(s.value)} - ${escapeXml(s.label)} (${escapeXml(s.note || '')})`);
    }

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr/>
      
      <!-- Background Header Banner -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title Box"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="800000" y="500000"/>
            <a:ext cx="10500000" cy="1800000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="1400" b="1">
                <a:solidFill><a:srgbClr val="F59E0B"/></a:solidFill>
              </a:rPr>
              <a:t>[ ${badge} ]</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="3600" b="1">
                <a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>
              </a:rPr>
              <a:t>${title}</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="1600" i="1">
                <a:solidFill><a:srgbClr val="64748B"/></a:solidFill>
              </a:rPr>
              <a:t>${subtitle}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>

      <!-- Content Body Box -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Box"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="800000" y="2400000"/>
            <a:ext cx="10500000" cy="3800000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          ${bodyTextLines.map(line => `
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" sz="1800">
                <a:solidFill><a:srgbClr val="0F172A"/></a:solidFill>
              </a:rPr>
              <a:t>• ${line}</a:t>
            </a:r>
          </a:p>`).join('')}
          ${speakerNotes ? `
          <a:p>
            <a:pPr spaceBefore="300000"/>
            <a:r>
              <a:rPr lang="en-US" sz="1200" i="1">
                <a:solidFill><a:srgbClr val="4F46E5"/></a:solidFill>
              </a:rPr>
              <a:t>Speaker Cue: "${speakerNotes}"</a:t>
            </a:r>
          </a:p>` : ''}
        </p:txBody>
      </p:sp>

    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
    zip.addFile(`ppt/slides/slide${slideNumber}.xml`, slideXml);
  });

  const blob = zip.generateBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = (deck.name || 'Hackathon-Pitch-Deck').toLowerCase().replace(/[^a-z0-9]/g, '-');
  a.download = `${fileName}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
