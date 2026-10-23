/**
 * Privacy & Security utilities for K.R. Mangalam University Anonymous Hub
 * Features:
 * 1. Strips EXIF / GPS / Device metadata from images via clean canvas redraw
 * 2. Biometric & canvas-based Explicit / NSFW / Nudity blocker
 * 3. Redacts phone numbers and emails to protect student identities
 * 4. 100% Untraceable Anonymous Identity (Zero Trace)
 */
import { inspectImageForExplicitContent, isFileNameSuspicious } from './moderation.js';

export async function sanitizeImageAndStripExif(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file.'));
      return;
    }

    // 1. Fast filename heuristic check
    if (file.name && isFileNameSuspicious(file.name)) {
      reject(new Error('NSFW_BLOCKED: Inappropriate or explicit file name detected. Only authentic academic question paper slips are permitted.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redraw on canvas to discard all EXIF, GPS location, device serial tags
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down to max 1200 to keep papers ultra-lightweight (~100KB) and razor-sharp
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Pure pixel copy (drops all camera/phone headers)
        ctx.drawImage(img, 0, 0, width, height);

        // 2. High-speed Biometric & Edge Density Explicit Content / Nudity Inspection
        const inspection = inspectImageForExplicitContent(canvas, ctx, width, height);
        if (!inspection.isSafe) {
          reject(new Error(`NSFW_BLOCKED: ${inspection.reason}`));
          return;
        }

        // Export pure sanitized JPEG without EXIF (~100KB)
        const sanitizedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve(sanitizedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for sanitization.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

// Automatically detect and mask phone numbers or university roll numbers
export function autoRedactPersonalData(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Mask 10-digit phone numbers
  let sanitized = text.replace(/(\+91[\-\s]?)?[6-9]\d{9}/g, '[PHONE REDACTED]');

  // Mask email addresses
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');

  // Mask student roll numbers (e.g. 2101201010 or 22KRMU1234)
  sanitized = sanitized.replace(/\b(2[0-4][A-Z0-9]{8,12})\b/gi, '[ROLL NO REDACTED]');

  return sanitized;
}

// -------------------------------------------------------------
// 100% UNTRACEABLE ANONYMOUS IDENTITY SYSTEM (ZERO TRACE)
// -------------------------------------------------------------
const IDENTITY_STORAGE_KEY = 'krmu_user_anonymous_identity_v3';

export function getAnonymousUser() {
  try {
    const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.alias && parsed.id) {
        return parsed;
      }
    }
  } catch (e) {}

  // Auto-initialize with a default untraceable identity if none exists
  return setAnonymousUser();
}

export function setAnonymousUser() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const user = {
    id: `anon_${randomSuffix}`,
    alias: `Scholar #${randomSuffix}`,
    icon: '🕶️',
    badgeColor: 'bg-slate-800 text-slate-200 border-slate-700',
    createdAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {}

  return user;
}

export function generateGhostAlias() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `Scholar #${randomSuffix}`;
}

// -------------------------------------------------------------
// STRICT PII DETECTION & AUTOMATIC SUSPENSION FOR SQUADS
// -------------------------------------------------------------
const SUSPENSION_STORAGE_KEY = 'krmu_squad_suspended_users_v1';

export function detectSuspiciousPII(text) {
  if (!text || typeof text !== 'string') {
    return { isSuspicious: false };
  }

  const raw = text.trim();

  // 1. Phone Numbers (10 digits, formatted with spaces, dashes, or +91 / 0)
  const phoneRegex = /(?:(?:\+91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\b\d{10}\b|\b\d{5}[\s-]\d{5}\b|\b\d{3}[\s-]\d{3}[\s-]\d{4}\b/;
  const phoneMatch = raw.match(phoneRegex);
  if (phoneMatch) {
    return {
      isSuspicious: true,
      violationType: 'phone_number',
      reason: 'Sharing personal phone numbers or contact digits is strictly prohibited.',
      snippet: phoneMatch[0],
    };
  }

  // 2. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const emailMatch = raw.match(emailRegex);
  if (emailMatch) {
    return {
      isSuspicious: true,
      violationType: 'email_address',
      reason: 'Sharing personal or institutional email IDs is prohibited.',
      snippet: emailMatch[0],
    };
  }

  // 3. University Roll Numbers / Registration IDs
  const rollRegex = /\b(?:2[0-4][0-9]{8,10}|krmu[0-9a-zA-Z]{5,10}|roll\s*(?:no|number)?\s*[:=]?\s*[0-9a-zA-Z]+)\b/i;
  const rollMatch = raw.match(rollRegex);
  if (rollMatch) {
    return {
      isSuspicious: true,
      violationType: 'roll_number',
      reason: 'Sharing university roll numbers or registration codes is strictly prohibited.',
      snippet: rollMatch[0],
    };
  }

  // 4. Social Media Links & Explicit Handles (@username or ID:)
  const socialRegex = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|snapchat\.com|t\.me|wa\.me|facebook\.com|linkedin\.com)\/[a-zA-Z0-9_.]+|\b(?:ig|insta(?:gram)?|snapchat|telegram|whatsapp|wa\.me)\s*(?:id|handle|username|no|number|link)?\s*[:=-]\s*@?[a-zA-Z0-9_.]+|\b@[a-zA-Z0-9_]{4,25}\b/i;
  const socialMatch = raw.match(socialRegex);
  if (socialMatch) {
    return {
      isSuspicious: true,
      violationType: 'social_handle',
      reason: 'Sharing social media handles or profile links is prohibited in Secret Squads.',
      snippet: socialMatch[0],
    };
  }

  // 5. Explicit Name & Direct Contact Disclosures
  const identityLeakRegex = /\b(?:mera\s+naam\s+hai|my\s+name\s+is\s+[A-Za-z]+|call\s+me\s+at\s+\d+|contact\s+me\s+at\s+\d+|dm\s+me\s+on\s+@?[a-zA-Z0-9_]+)\b/i;
  const identityMatch = raw.match(identityLeakRegex);
  if (identityMatch) {
    return {
      isSuspicious: true,
      violationType: 'identity_disclosure',
      reason: 'Attempting to reveal your real identity or requesting external contact is strictly prohibited.',
      snippet: identityMatch[0],
    };
  }

  return { isSuspicious: false };
}

export function isUserSuspended(alias) {
  if (!alias) return false;
  try {
    const raw = localStorage.getItem(SUSPENSION_STORAGE_KEY);
    if (!raw) return false;
    const records = JSON.parse(raw);
    const userRecord = records[alias.toLowerCase()];
    if (!userRecord) return false;
    return Boolean(userRecord.isSuspended);
  } catch (e) {
    return false;
  }
}

export function getSuspensionDetails(alias) {
  if (!alias) return null;
  try {
    const raw = localStorage.getItem(SUSPENSION_STORAGE_KEY);
    if (!raw) return null;
    const records = JSON.parse(raw);
    return records[alias.toLowerCase()] || null;
  } catch (e) {
    return null;
  }
}

export function suspendUser(alias, reason, violationSnippet = '') {
  if (!alias) return;
  try {
    const raw = localStorage.getItem(SUSPENSION_STORAGE_KEY);
    const records = raw ? JSON.parse(raw) : {};
    records[alias.toLowerCase()] = {
      alias,
      isSuspended: true,
      reason: reason || 'Violation of KRMU Secret Squad anonymity and anti-identity leakage policy.',
      snippet: violationSnippet,
      suspendedAt: new Date().toISOString(),
    };
    localStorage.setItem(SUSPENSION_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {}
}

export function clearSuspension(alias) {
  if (!alias) return;
  try {
    const raw = localStorage.getItem(SUSPENSION_STORAGE_KEY);
    if (!raw) return;
    const records = JSON.parse(raw);
    delete records[alias.toLowerCase()];
    localStorage.setItem(SUSPENSION_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {}
}

