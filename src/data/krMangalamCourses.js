// Comprehensive Directory of ALL Schools, Degrees & Courses at K.R. Mangalam University (KRMU)

export const ALL_KRMU_SCHOOLS = [
  {
    id: 'SOET',
    name: 'School of Engineering & Technology (SOET)',
    color: 'from-blue-600 to-cyan-500',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    programs: [
      { id: 'btech-cse-core', name: 'B.Tech CSE (Core)', totalSemesters: 8 },
      { id: 'btech-cse-aiml', name: 'B.Tech CSE with AI & ML', totalSemesters: 8 },
      { id: 'btech-cse-cloud', name: 'B.Tech CSE (Cloud Computing)', totalSemesters: 8 },
      { id: 'btech-cse-cyber', name: 'B.Tech CSE (Cyber Security)', totalSemesters: 8 },
      { id: 'btech-cse-ds', name: 'B.Tech CSE (Data Science)', totalSemesters: 8 },
      { id: 'btech-cse-fullstack', name: 'B.Tech CSE (Full Stack Web Dev)', totalSemesters: 8 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication (ECE)', totalSemesters: 8 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', totalSemesters: 8 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', totalSemesters: 8 },
      { id: 'bca', name: 'Bachelor of Computer Applications (BCA)', totalSemesters: 6 },
      { id: 'mca', name: 'Master of Computer Applications (MCA)', totalSemesters: 4 },
      { id: 'mtech-cse', name: 'M.Tech Computer Science & Engineering', totalSemesters: 4 },
    ],
    commonSubjects: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Database Management Systems (DBMS)',
      'Computer Networks',
      'Object Oriented Programming in Java',
      'Discrete Mathematical Structures',
      'Artificial Intelligence & Deep Learning',
      'Theory of Computation & Automata',
      'Compiler Design',
      'Computer Organization & Architecture',
      'Software Engineering & Agile',
      'Engineering Mathematics I & II',
      'Engineering Physics',
      'Basic Electrical & Electronics',
    ]
  },
  {
    id: 'SOMC',
    name: 'School of Management & Commerce (SOMC)',
    color: 'from-emerald-600 to-teal-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    programs: [
      { id: 'bba-gen', name: 'BBA (General)', totalSemesters: 6 },
      { id: 'bba-analytics', name: 'BBA (Business Analytics)', totalSemesters: 6 },
      { id: 'bba-digital', name: 'BBA (Digital Marketing)', totalSemesters: 6 },
      { id: 'bba-ib', name: 'BBA (International Business)', totalSemesters: 6 },
      { id: 'bcom-hons', name: 'B.Com (Hons)', totalSemesters: 6 },
      { id: 'mba-marketing', name: 'MBA (Marketing & Sales)', totalSemesters: 4 },
      { id: 'mba-finance', name: 'MBA (Financial Management)', totalSemesters: 4 },
      { id: 'mba-hr', name: 'MBA (Human Resource Management)', totalSemesters: 4 },
      { id: 'mba-analytics', name: 'MBA (Business Analytics)', totalSemesters: 4 },
    ],
    commonSubjects: [
      'Principles of Management',
      'Managerial Economics',
      'Financial Accounting & Analysis',
      'Cost & Management Accounting',
      'Business Statistics & Analytics',
      'Marketing Management',
      'Organizational Behaviour',
      'Corporate Finance',
      'Human Resource Management',
      'Business Law & Ethics',
      'Supply Chain & Operations Management',
      'Strategic Management',
    ]
  },
  {
    id: 'SOLS',
    name: 'School of Legal Studies (SOLS)',
    color: 'from-amber-600 to-orange-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    programs: [
      { id: 'ba-llb', name: 'B.A. LL.B. (Hons) - 5 Years Integrated', totalSemesters: 10 },
      { id: 'bba-llb', name: 'B.B.A. LL.B. (Hons) - 5 Years Integrated', totalSemesters: 10 },
      { id: 'llb-3yr', name: 'LL.B. (3 Years)', totalSemesters: 6 },
      { id: 'llm', name: 'Master of Laws (LL.M.)', totalSemesters: 2 },
    ],
    commonSubjects: [
      'Constitutional Law of India - I & II',
      'Law of Crimes (Indian Penal Code)',
      'Law of Torts & Consumer Protection',
      'Law of Contract - I & II',
      'Family Law (Hindu & Muslim Law)',
      'Jurisprudence & Legal Theory',
      'Code of Civil Procedure (CPC)',
      'Code of Criminal Procedure (CrPC)',
      'Law of Evidence',
      'Company Law & Corporate Governance',
      'Public International Law & Human Rights',
      'Property Law & Easements',
      'Labour & Industrial Laws',
    ]
  },
  {
    id: 'SMAS',
    name: 'School of Medical & Allied Sciences (SMAS)',
    color: 'from-rose-600 to-pink-500',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    programs: [
      { id: 'bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', totalSemesters: 8 },
      { id: 'dpharm', name: 'Diploma in Pharmacy (D.Pharm)', totalSemesters: 4 },
      { id: 'mpharm', name: 'Master of Pharmacy (M.Pharm)', totalSemesters: 4 },
      { id: 'bpt', name: 'Bachelor of Physiotherapy (BPT)', totalSemesters: 8 },
    ],
    commonSubjects: [
      'Human Anatomy and Physiology',
      'Pharmaceutics - I & II',
      'Pharmaceutical Inorganic & Organic Chemistry',
      'Pharmacology & Toxicology',
      'Medicinal Chemistry',
      'Pharmacognosy & Phytochemistry',
      'Biopharmaceutics & Pharmacokinetics',
      'Pharmaceutical Microbiology',
      'Biochemistry & Clinical Pathology',
      'Physiotherapy in Orthopedics',
      'Exercise Therapy & Electrotherapy',
    ]
  },
  {
    id: 'SBAS',
    name: 'School of Basic & Applied Sciences (SBAS)',
    color: 'from-purple-600 to-violet-500',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    programs: [
      { id: 'bsc-forensic', name: 'B.Sc. (Hons) Forensic Science', totalSemesters: 6 },
      { id: 'bsc-physics', name: 'B.Sc. (Hons) Physics', totalSemesters: 6 },
      { id: 'bsc-chemistry', name: 'B.Sc. (Hons) Chemistry', totalSemesters: 6 },
      { id: 'bsc-maths', name: 'B.Sc. (Hons) Mathematics', totalSemesters: 6 },
      { id: 'msc-data', name: 'M.Sc. Data Analytics', totalSemesters: 4 },
      { id: 'msc-forensic', name: 'M.Sc. Forensic Science', totalSemesters: 4 },
    ],
    commonSubjects: [
      'Forensic Criminology & Law',
      'Forensic Ballistics & Explosives',
      'Fingerprint & Questioned Documents Examination',
      'Classical Mechanics & Quantum Mechanics',
      'Electrodynamics & Wave Optics',
      'Organic Synthesis & Reaction Mechanisms',
      'Thermodynamics & Physical Chemistry',
      'Real Analysis & Abstract Algebra',
      'Linear Algebra & Numerical Methods',
    ]
  },
  {
    id: 'SJMC',
    name: 'School of Journalism & Mass Comm (SJMC)',
    color: 'from-cyan-600 to-sky-500',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    programs: [
      { id: 'ba-jmc', name: 'B.A. Journalism & Mass Communication', totalSemesters: 6 },
      { id: 'ma-jmc', name: 'M.A. Journalism & Mass Communication', totalSemesters: 4 },
    ],
    commonSubjects: [
      'Introduction to Communication & Media',
      'Print Media Reporting & Editing',
      'Broadcast Journalism (Radio & TV Production)',
      'Public Relations & Corporate Communication',
      'Advertising & Brand Management',
      'Digital Media & Web Journalism',
      'Media Law & Indian Constitution',
      'Documentary Filmmaking & Photography',
    ]
  },
  {
    id: 'SOAD',
    name: 'School of Architecture & Design (SOAD)',
    color: 'from-pink-600 to-rose-500',
    badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    programs: [
      { id: 'barch', name: 'Bachelor of Architecture (B.Arch)', totalSemesters: 10 },
      { id: 'bdes-interior', name: 'B.Des (Interior Design)', totalSemesters: 8 },
      { id: 'bdes-fashion', name: 'B.Des (Fashion Design)', totalSemesters: 8 },
    ],
    commonSubjects: [
      'Architectural Design Studio',
      'Building Construction & Materials',
      'History of Architecture',
      'Structural Analysis & Mechanics',
      'Environmental Studies & Climate Responsive Design',
      'Interior Space Planning & Ergonomics',
      'Fashion Illustration & CAD',
    ]
  },
  {
    id: 'SOHSS',
    name: 'School of Humanities & Social Sciences (SOHSS)',
    color: 'from-yellow-600 to-amber-500',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    programs: [
      { id: 'ba-psychology', name: 'B.A. (Hons) Psychology', totalSemesters: 6 },
      { id: 'ba-economics', name: 'B.A. (Hons) Economics', totalSemesters: 6 },
      { id: 'ba-english', name: 'B.A. (Hons) English', totalSemesters: 6 },
      { id: 'ba-political', name: 'B.A. (Hons) Political Science', totalSemesters: 6 },
    ],
    commonSubjects: [
      'Introduction to Psychology',
      'Cognitive Psychology',
      'Microeconomics & Macroeconomics',
      'Indian Economy & Development',
      'British Poetry & Drama',
      'Literary Theory & Criticism',
      'Indian Political Thought',
      'International Relations & Global Politics',
    ]
  },
  {
    id: 'SOAS',
    name: 'School of Agricultural Sciences (SOAS)',
    color: 'from-lime-600 to-green-500',
    badge: 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    programs: [
      { id: 'bsc-agri', name: 'B.Sc. (Hons) Agriculture', totalSemesters: 8 },
    ],
    commonSubjects: [
      'Fundamentals of Agronomy',
      'Agricultural Microbiology',
      'Soil Science & Agricultural Chemistry',
      'Crop Physiology & Genetics',
      'Plant Pathology & Pest Management',
      'Horticulture & Greenhouse Technology',
    ]
  },
  {
    id: 'SOHM',
    name: 'School of Hotel Management (SOHM)',
    color: 'from-teal-600 to-emerald-500',
    badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    programs: [
      { id: 'bhmct', name: 'Bachelor of Hotel Management (BHM)', totalSemesters: 8 },
    ],
    commonSubjects: [
      'Food Production & Culinary Arts',
      'Food & Beverage Service',
      'Front Office Operations',
      'Accommodation Management & Housekeeping',
      'Hospitality Marketing & Tourism Laws',
    ]
  },
  {
    id: 'SOED',
    name: 'School of Education (SOED)',
    color: 'from-orange-600 to-amber-500',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    programs: [
      { id: 'bed', name: 'Bachelor of Education (B.Ed.)', totalSemesters: 4 },
      { id: 'beled', name: 'Bachelor of Elementary Education (B.El.Ed.)', totalSemesters: 8 },
    ],
    commonSubjects: [
      'Childhood & Growing Up',
      'Contemporary India & Education',
      'Learning & Teaching Pedagogy',
      'Gender, School and Society',
      'Educational Technology & Assessment',
    ]
  }
];

export const ALL_SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8',
  'Semester 9 (Law/Arch)', 'Semester 10 (Law/Arch)',
];

export const KRMU_EXAM_WEIGHTAGES = [
  { id: 'mid_term', name: 'Mid-Term Examination (MTE)', label: 'Mid-Term (20 Marks)', marks: 20, timeMinutes: 90, presetBreakdowns: [2, 4, 5, 10, 20] },
  { id: 'end_term', name: 'End-Term Examination (ETE)', label: 'End-Term (40 Marks)', marks: 40, timeMinutes: 180, presetBreakdowns: [2, 5, 8, 10, 40] },
];
