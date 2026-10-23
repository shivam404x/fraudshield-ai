// K.R. Mangalam University (KRMU) Specific Academic Structure & Exams

export const KRMU_SCHOOLS = [
  { id: 'SOET', name: 'SOET — School of Engineering & Technology', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'SOMC', name: 'SOMC — School of Management & Commerce', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'SOLS', name: 'SOLS — School of Legal Studies', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'SBAS', name: 'SBAS — School of Basic & Applied Sciences', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'SMAS', name: 'SMAS — School of Medical & Allied Sciences', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  { id: 'SJMC', name: 'SJMC — Journalism & Mass Communication', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { id: 'SOED', name: 'SOED — School of Education', badge: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
];

export const EXAM_TYPES = [
  'End-Term Examination (ETE)',
  'Mid-Term Examination (MTE)',
  'Internal Class Assessment (CAT)',
  'Lab Viva & Practical Exam',
  'Supplementary / Back Paper',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

export const KRMU_PROGRAMS = [
  'B.Tech CSE (AI/ML & Cloud)',
  'B.Tech Mechanical / Civil',
  'BCA / MCA',
  'BBA / MBA',
  'B.Com (Hons)',
  'BA LLB / BBA LLB',
  'B.Pharm / D.Pharm',
  'B.Sc (Hons) Physics / Chemistry / Maths',
  'BA Journalism & Mass Comm',
];

export const KRMU_SUBJECTS = [
  'Operating Systems',
  'Data Structures & Algorithms',
  'Database Management Systems (DBMS)',
  'Computer Networks',
  'Object Oriented Programming (Java/C++)',
  'Engineering Mathematics - I / II',
  'Discrete Mathematical Structures',
  'Artificial Intelligence & ML',
  'Software Engineering & Agile',
  'Business Economics & Financial Accounting',
  'Principles of Management',
  'Constitutional Law of India',
  'Law of Crimes (IPC)',
  'Pharmaceutics & Pharmacology',
  'Organic & Medicinal Chemistry',
  'Environmental Studies & Disaster Mgmt',
  'General Aptitude & Soft Skills',
];

export const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export const QUESTION_TYPES = [
  { id: 'single_choice', label: 'Single Choice (MCQ)', description: 'One correct option among choices' },
  { id: 'multiple_choice', label: 'Multiple Correct (Multi-MCQ)', description: 'One or more correct options' },
  { id: 'numerical', label: 'Numerical / Short Answer', description: 'Exact number or short formula' },
  { id: 'descriptive', label: 'Descriptive / Long Answer (5/10/15 Marks)', description: 'University subjective question with model answer' },
];

export const DIFFICULTIES = [
  { id: 'Easy', label: 'Easy (Basic Concept)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'Medium', label: 'Medium (Standard KRMU Level)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'Hard', label: 'Hard (Repeated / High Weightage)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
];

export const SAMPLE_TAGS = [
  'kr-mangalam',
  'end-term-exam',
  'mid-term',
  'repeated-question',
  'high-weightage-15marks',
  'formula-sheet',
  'unit-1',
  'unit-2',
  'unit-3',
  'unit-4',
  'memory-based',
  'anonymous-drop',
];

// Aliases for compatibility
export const EXAMS = KRMU_SCHOOLS.map((s) => ({
  id: s.id,
  name: s.name,
  color: 'from-indigo-600 to-purple-600',
  badge: s.badge,
}));

export const SUBJECTS = KRMU_SUBJECTS;
