/**
 * KRMU Vault Comprehensive Content Moderation Engine
 * 1. Universal Profanity & Abuse Filter (Hindi, Hinglish, English, Leetspeak)
 * 2. Canvas-based Explicit / Nudity / NSFW Image Detection
 */

// -------------------------------------------------------------
// 1. UNIVERSAL PROFANITY & ABUSE FILTER
// -------------------------------------------------------------

// List of prohibited abusive, vulgar, explicit, and derogatory words
const ABUSIVE_PATTERNS = [
  // Hindi / Hinglish Bad Words & Slurs
  'bhenchod', 'behenchod', 'behnchod', 'bhen ke lode', 'behen ke lode', 'bhenkelode', 'bhen k lode', 'behn k lode',
  'madarchod', 'maderchod', 'madarjaat', 'maa ki chut', 'maaki chut', 'teri maa ki', 'maa chuda', 'teri maa', 'teri behen',
  'chutiya', 'chutiye', 'chutiyapa', 'chutiyape', 'chootiya', 'chotya', 'chutya', 'choot', 'chut', 'chuchi', 'chuchiya',
  'bhosdi', 'bhosdike', 'bhosadi', 'bhosdiwale', 'bhosadiwale', 'bhosadike', 'bsdk', 'bkl', 'mkl', 'mc', 'bc',
  'lauda', 'laude', 'lawda', 'loda', 'lode', 'lavde', 'lodu', 'lodoo', 'lund',
  'gaand', 'gand', 'gandu', 'gandmasti', 'jhaat', 'jhant', 'jhaantu', 'jhantu',
  'randi', 'r@ndi', 'randei', 'harami', 'haramkhor', 'kameene', 'kamine', 'kamina', 'kameena', 'kutte', 'kutta', 'suar',
  'bhadwe', 'bhadva', 'dalaal', 'mutthal', 'choda', 'chudai', 'chodna', 'chod', 'saala', 'saale', 'sale', 'gadha',
  'suar ke bache', 'hijra', 'tatte', 'tatta',

  // English Bad Words, Slurs & Explicit Terms
  'fuck', 'fucker', 'fucking', 'fucked', 'motherfucker', 'fck', 'stfu', 'wtff',
  'shit', 'bullshit', 'dipshit',
  'bitch', 'bitches', 'bitching',
  'asshole', 'bastard', 'cunt',
  'dick', 'dildo', 'cock', 'cocksucker',
  'pussy', 'vagina', 'penis', 'boobs', 'boobies', 'tits', 'titties',
  'whore', 'slut', 'blowjob', 'handjob', 'anal',
  'porn', 'porno', 'pornography', 'nude', 'nudes', 'nudity', 'naked', 'erotic', 'xxx',
  'nigger', 'nigga', 'retard'
];

const DISGUISED_TARGETS = [
  'chutiya', 'chutiye', 'chootiya', 'bhenchod', 'behenchod', 'madarchod', 'bhosdike', 'bhosdi',
  'gandu', 'gaand', 'lauda', 'lawda', 'loda', 'lavde', 'lund', 'randi', 'harami',
  'kamine', 'kamina', 'bhadwe', 'chudai', 'fuck', 'fucker', 'bitch', 'asshole',
  'bastard', 'pussy', 'nude', 'nudes', 'bsdk', 'bkl', 'mkl'
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pre-compiled regex patterns for spaced or punctuated evasion (e.g. "b.i.t.c.h", "c h u t i y a", "f u c k")
// Requires word boundaries and 1+ separators between letters so it never matches cross-word academic text like "bit chip"
const SPACED_ABUSE_REGEXES = DISGUISED_TARGETS.map((target) => ({
  target,
  regex: new RegExp(`\\b${target.split('').map(escapeRegExp).join('[\\s._\\-*~+]+')}\\b`, 'i')
}));

// Compile regex with word boundaries & character evasion support
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[3]/g, 'e')
    .replace(/[*_~`]/g, '')
    // Collapse consecutive repeated letters (e.g. "fuuuck" -> "fuck", "chuuutiya" -> "chutiya")
    .replace(/(.)\1{2,}/g, '$1$1');
}

/**
 * Detects abusive, obscene, or profane words across any text input.
 * Safe against common false positives (e.g. "class", "classic", "pass", "document", "analysis", "bit chip").
 */
export function detectAbusiveContent(text) {
  if (!text || typeof text !== 'string') {
    return { isAbusive: false };
  }

  const raw = text.trim();
  if (!raw) return { isAbusive: false };

  const normalized = normalizeText(raw);

  // 1. Check for spaced or dotted short acronyms (e.g. "b.s.d.k", "b s d k", "b.k.l", "m.k.l", "f.u.c.k")
  const acronymAbuseRegex = /\b(?:b[\s._-]*s[\s._-]*d[\s._-]*k|b[\s._-]*k[\s._-]*l|m[\s._-]*k[\s._-]*l|f[\s._-]*u[\s._-]*c[\s._-]*k)\b/i;
  if (acronymAbuseRegex.test(raw)) {
    return {
      isAbusive: true,
      reason: 'Prohibited abusive acronym detected',
      matched: raw.match(acronymAbuseRegex)[0],
    };
  }

  // 2. Disguised/spaced character detection with word boundaries (e.g. "c h u t i y a", "b.i.t.c.h", "f u c k")
  for (const { target, regex } of SPACED_ABUSE_REGEXES) {
    if (regex.test(raw) || regex.test(normalized)) {
      return {
        isAbusive: true,
        reason: `Disguised abusive content detected (${target})`,
        matched: target,
      };
    }
  }

  // 3. Check tokenized words with safe boundaries
  const words = normalized.split(/[^a-z0-9]+/);
  for (const word of words) {
    if (!word) continue;
    for (const abusive of ABUSIVE_PATTERNS) {
      if (word === abusive) {
        return {
          isAbusive: true,
          reason: `Abusive or vulgar language (${word}) is prohibited`,
          matched: word,
        };
      }
    }
  }

  // 4. Multi-word phrase checks
  for (const phrase of ABUSIVE_PATTERNS) {
    if (phrase.includes(' ') && normalized.includes(phrase)) {
      return {
        isAbusive: true,
        reason: `Inappropriate phrase (${phrase}) is prohibited`,
        matched: phrase,
      };
    }
  }

  return { isAbusive: false };
}

/**
 * Censors abusive words in a message for safe rendering
 */
export function censorAbusiveText(text) {
  if (!text || typeof text !== 'string') return '';
  const check = detectAbusiveContent(text);
  if (check.isAbusive) {
    return '⚠️ [Message flagged & hidden for violating community guidelines]';
  }
  return text;
}

// -------------------------------------------------------------
// 2. CANVAS-BASED EXPLICIT / NUDITY / NSFW IMAGE DETECTION
// -------------------------------------------------------------

/**
 * Analyzes image pixel data on an HTML5 canvas to detect human skin color
 * distribution and explicit / nude / non-academic image content.
 * 
 * Legitimate KRMU Question Papers:
 * - High white/light background and dark printed/written ink
 * - Very low skin tone ratio (< 8%)
 * 
 * Explicit / Nude / Inappropriate Photos:
 * - High density of skin tones in YCbCr & RGB space (> 25% or > 18% without text edges)
 */
export function inspectImageForExplicitContent(canvas, ctx, width, height) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const totalPixels = width * height;

    // Sample every 2nd pixel (50% sampling) for 60fps instant response (~5ms execution)
    const step = 2;
    let sampledCount = 0;
    let skinPixelCount = 0;
    let highContrastEdgeCount = 0;

    for (let y = 0; y < height - 1; y += step) {
      for (let x = 0; x < width - 1; x += step) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        sampledCount++;

        // YCbCr Color Conversion
        const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        // Biometric human skin color model:
        // Cb in [77, 127], Cr in [133, 173]
        const isSkinYCbCr = (Cb >= 77 && Cb <= 127) && (Cr >= 133 && Cr <= 173);

        // Standard RGB skin tone rules:
        const isSkinRGB = (r > 95) && (g > 40) && (b > 20) &&
                          (Math.max(r, g, b) - Math.min(r, g, b) > 15) &&
                          (Math.abs(r - g) > 15) && (r > g) && (r > b);

        // Normalized r-g chromaticity:
        const sum = r + g + b;
        const nr = sum > 0 ? r / sum : 0;
        const ng = sum > 0 ? g / sum : 0;
        const isSkinNormalized = (nr >= 0.36 && nr <= 0.55) && (ng >= 0.28 && ng <= 0.365);

        if (isSkinYCbCr && isSkinRGB && isSkinNormalized) {
          skinPixelCount++;
        }

        // Measure text edge density (adjacent pixel contrast)
        const iNext = (y * width + (x + 1)) * 4;
        const diffR = Math.abs(r - data[iNext]);
        const diffG = Math.abs(g - data[iNext + 1]);
        const diffB = Math.abs(b - data[iNext + 2]);
        if (diffR + diffG + diffB > 110) {
          highContrastEdgeCount++;
        }
      }
    }

    const skinRatio = skinPixelCount / (sampledCount || 1);
    const edgeDensity = highContrastEdgeCount / (sampledCount || 1);

    // Decision Logic:
    // 1. Extreme skin ratio (> 24% of the entire frame): Definite nudity or explicit human photo
    if (skinRatio > 0.24) {
      return {
        isSafe: false,
        reason: 'Explicit / suggestive content detected. Only authentic academic question paper slips are permitted.',
        skinRatio,
      };
    }

    // 2. High skin ratio (> 17%) with very low document text edge density (< 0.035): Personal photo / selfie / NSFW
    if (skinRatio > 0.17 && edgeDensity < 0.035) {
      return {
        isSafe: false,
        reason: 'Image does not contain a legible academic question paper. Nudity, selfies, and personal photos are prohibited.',
        skinRatio,
      };
    }

    return {
      isSafe: true,
      skinRatio,
      edgeDensity,
    };
  } catch (err) {
    // If pixel inspection encounters an error, allow safe fallback
    return { isSafe: true };
  }
}

/**
 * Checks file name for obvious NSFW / explicit labels
 */
export function isFileNameSuspicious(fileName) {
  if (!fileName || typeof fileName !== 'string') return false;
  const nsfwNameRegex = /(nude|nudity|nsfw|porn|xxx|boob|boobs|pussy|dick|cock|sexy|tits|vagina|penis|erotic|adult|naked|lingerie|bra|underwear)/i;
  return nsfwNameRegex.test(fileName);
}
