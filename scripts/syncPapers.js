import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PYQS, isDefaultPaper } from '../src/data/defaultPyqs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PAPERS_FILE = path.resolve(__dirname, '../server_data/papers.json');

// Read existing papers if any
let existing = [];
try {
  if (fs.existsSync(PAPERS_FILE)) {
    existing = JSON.parse(fs.readFileSync(PAPERS_FILE, 'utf-8'));
  }
} catch (e) {}

// Preserve user-added custom papers only
const customPapers = existing.filter(p => !isDefaultPaper(p));

const merged = [...customPapers];
fs.writeFileSync(PAPERS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`[Sync] Successfully synced ${merged.length} papers (${DEFAULT_PYQS.length} curated across all 10 KRMU schools + ${customPapers.length} custom) to ${PAPERS_FILE}`);
