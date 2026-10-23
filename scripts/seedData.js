import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PYQS } from '../src/data/defaultPyqs.js';
import { DEFAULT_GROUPS, DEFAULT_REQUESTS } from '../src/data/studyGroups.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../server_data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

// Seed papers
if (!fs.existsSync(PAPERS_FILE)) {
  fs.writeFileSync(PAPERS_FILE, JSON.stringify(DEFAULT_PYQS, null, 2), 'utf-8');
  console.log(`[Seed] Seeded ${DEFAULT_PYQS.length} question papers into ${PAPERS_FILE}`);
} else {
  console.log(`[Seed] Papers file already exists at ${PAPERS_FILE}`);
}

// Seed groups
if (!fs.existsSync(GROUPS_FILE)) {
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(DEFAULT_GROUPS, null, 2), 'utf-8');
  console.log(`[Seed] Seeded ${DEFAULT_GROUPS.length} secret squads into ${GROUPS_FILE}`);
} else {
  console.log(`[Seed] Groups file already exists at ${GROUPS_FILE}`);
}

// Seed requests
if (!fs.existsSync(REQUESTS_FILE)) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(DEFAULT_REQUESTS, null, 2), 'utf-8');
  console.log(`[Seed] Seeded ${DEFAULT_REQUESTS.length} requests into ${REQUESTS_FILE}`);
} else {
  console.log(`[Seed] Requests file already exists at ${REQUESTS_FILE}`);
}

console.log('[Seed] Data initialization complete.');
