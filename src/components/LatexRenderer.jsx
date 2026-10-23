import React, { useMemo } from 'react';

/**
 * LatexRenderer safely parses text containing:
 * - $$ display math $$
 * - $ inline math $
 * - Markdown-style bold (**text**) and code (`code`)
 * - Line breaks
 * If KaTeX is available globally (from CDN), it renders math.
 * Otherwise, it shows the LaTeX source formatted cleanly.
 */
export default function LatexRenderer({ text = '', className = '', block = false }) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    // Check if katex is loaded on window
    const katex = typeof window !== 'undefined' ? window.katex : null;

    // Split text by $$ (display math) and $ (inline math)
    // Regex splits keeping delimiters
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // Display math $$...$$
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        if (katex) {
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={index}
                className="my-3 py-1 overflow-x-auto text-indigo-300"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return (
              <div key={index} className="my-2 p-2 bg-slate-900 rounded font-mono text-xs text-indigo-300 overflow-x-auto">
                {formula}
              </div>
            );
          }
        }
        return (
          <div key={index} className="my-2 p-2 bg-slate-900 rounded font-mono text-sm text-indigo-300 overflow-x-auto">
            {formula}
          </div>
        );
      }

      // Inline math $...$
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const formula = part.slice(1, -1).trim();
        if (katex) {
          try {
            const html = katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block mx-0.5 text-indigo-200"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <code key={index} className="px-1 py-0.5 bg-slate-800 rounded font-mono text-xs text-indigo-300">{formula}</code>;
          }
        }
        return <code key={index} className="px-1 py-0.5 bg-slate-800 rounded font-mono text-xs text-indigo-300">{formula}</code>;
      }

      // Format markdown bold (**bold**) and newlines in normal text
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {renderFormattedLine(line)}
            </React.Fragment>
          ))}
        </span>
      );
    });
  }, [text]);

  const Tag = block ? 'div' : 'span';
  return <Tag className={`leading-relaxed ${className}`}>{renderedContent}</Tag>;
}

function renderFormattedLine(line) {
  // Handle **bold** within line
  const boldParts = line.split(/(\*\*[^*]+?\*\*)/g);
  return boldParts.map((sub, sIdx) => {
    if (sub.startsWith('**') && sub.endsWith('**')) {
      return (
        <strong key={sIdx} className="font-semibold text-slate-100">
          {sub.slice(2, -2)}
        </strong>
      );
    }
    return sub;
  });
}
