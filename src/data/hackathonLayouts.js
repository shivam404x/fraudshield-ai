export const HACKATHON_LAYOUTS = [
  {
    id: 'title-hero',
    name: 'Title & Vision Hero',
    badge: '🚀 OPENING HOOK',
    description: 'Main stage opening statement with product badges, key tech stack, and live demo alert.',
    defaultData: {
      badge: '🚀 HACKATHON 2026 PITCH',
      title: 'Project Title Here',
      subtitle: 'The 1-line elevator pitch explaining how your project solves a critical problem.',
      stamp: '100% SHIPPED IN 24H',
      bulletList: [
        '⚡ Built with Rust, React 19, and Claude 3.5 Sonnet',
        '🔥 Replaces 4-hour manual workflows with 1-click autonomous resolution',
        '🛠️ Tested live on production-grade workloads with zero downtime'
      ],
      timeSeconds: 20,
      speakerNotes: 'Hook the judges in the first 10 seconds. State the problem urgently and introduce your solution name with confidence.'
    }
  },
  {
    id: 'problem-statement',
    name: 'The Pain Point & Crisis',
    badge: '⚠️ THE CRISIS',
    description: 'Quantify the market pain: money burned, hours wasted, and why status quo solutions fail.',
    defaultData: {
      badge: '⚠️ THE PAIN POINT',
      title: 'The Multi-Billion Dollar Friction',
      subtitle: 'Why existing market solutions alert you to problems, but leave teams stranded.',
      bulletList: [
        '💥 4.8 Hours average mean-time-to-resolution for critical systems',
        '💸 Companies bleed $12,000 per minute during unplanned downtime',
        '😫 Fatigued engineering teams overwhelmed by cryptic log alerts'
      ],
      timeSeconds: 25,
      speakerNotes: 'Emphasize the human and financial agony. Judges want to feel the severity of the crisis before you pitch your solution.'
    }
  },
  {
    id: 'old-vs-new',
    name: 'Old Way vs Our Hack',
    badge: '⚡ DIRECT COMPARISON',
    description: 'High-impact side-by-side contrast proving your 10x superiority over existing methods.',
    defaultData: {
      badge: '⚡ DIRECT CONTRAST',
      title: 'Legacy Chaos vs Our Fix',
      subtitle: 'Why traditional approaches fail and how our architecture changes the paradigm.',
      leftCol: {
        title: 'The Broken Old Way',
        items: [
          'Alert wakes engineer at 3:14 AM',
          'Sifting through 10,000 cryptic logs & metrics',
          'Average resolution time: 4.8 hours',
          'High risk of introducing secondary bugs'
        ]
      },
      rightCol: {
        title: 'Our Hackathon Fix',
        items: [
          'Automated probe flags anomaly in 300ms',
          'Deterministic AST diff generated instantly',
          'Verified inside ephemeral sandbox container',
          'Ready to review & merge in under 90s'
        ]
      },
      timeSeconds: 25,
      speakerNotes: 'Point directly to the red side, then contrast with the green side. Highlight the 10x efficiency gain.'
    }
  },
  {
    id: 'solution-pillars',
    name: '3 Pillars (Bento Grid)',
    badge: '💡 CORE ARCHITECTURE',
    description: 'Three high-contrast cards showcasing your technical innovation and secret sauce.',
    defaultData: {
      badge: '💡 CORE ARCHITECTURE',
      title: 'Three Pillars of Our Innovation',
      subtitle: 'Engineered for sub-millisecond execution and deterministic safety guarantees.',
      cards: [
        { icon: '⚡', title: '1. Intelligent Radar', description: 'Zero-overhead kernel probe detecting anomalies at source.', tag: 'Kernel Level' },
        { icon: '🧠', title: '2. Reasoning Engine', description: 'Deterministic AST synthesis with zero hallucinations.', tag: 'Safe LLM Loop' },
        { icon: '🛡️', title: '3. Ephemeral Sandbox', description: 'Spins up isolated container to run regression tests.', tag: 'Zero Risk' }
      ],
      timeSeconds: 30,
      speakerNotes: 'Walk judges through your three core architectural pillars: telemetry ingestion, deterministic reasoning, and sandboxed safety.'
    }
  },
  {
    id: 'architecture-flow',
    name: '4-Step System Pipeline',
    badge: '🛠️ ARCHITECTURE',
    description: 'End-to-end data pipeline from incoming signals to verified execution.',
    defaultData: {
      badge: '🛠️ SYSTEM ARCHITECTURE',
      title: 'End-to-End System Pipeline',
      subtitle: 'How data and logic flow deterministically through our system.',
      steps: [
        { number: '01', title: 'Telemetry Ingest', detail: 'Event listener capturing raw kernel signals with sub-millisecond overhead.' },
        { number: '02', title: 'Stateless Queue', detail: 'Distributed worker queue routing requests across low-latency edge nodes.' },
        { number: '03', title: 'Inference Loop', detail: 'Proprietary reasoning engine generating syntactically verified fixes.' },
        { number: '04', title: 'Signed Output', detail: '1-click deployment with signed cryptographic verification.' }
      ],
      timeSeconds: 30,
      speakerNotes: 'Explain the technical flow logically from left to right. Mention that every tier is decoupled and horizontally scalable.'
    }
  },
  {
    id: 'tech-stack',
    name: 'Categorized Tech Stack',
    badge: '💻 TECH STACK',
    description: 'Categorized breakdown of frameworks, models, databases, and infrastructure.',
    defaultData: {
      badge: '💻 TECHNOLOGY STACK',
      title: 'Modern, Low-Latency Stack',
      subtitle: 'Selected specifically for speed, reliability, and developer ergonomics.',
      cards: [
        { icon: '⚛️', title: 'Frontend UI', description: 'React 19, Tailwind CSS, Vite 8, Lucide React, HTML5 Canvas', tag: 'Client' },
        { icon: '🦀', title: 'Backend Core', description: 'Rust & Python FastAPI, Tokio asynchronous worker threads', tag: 'Server' },
        { icon: '🧠', title: 'AI & Inference', description: 'Claude 3.5 Sonnet, Semgrep AST parser, LangGraph state loop', tag: 'AI Engine' },
        { icon: '☁️', title: 'Infra & Data', description: 'Docker sandbox, PostgreSQL, Redis queue, Cloudflare edge', tag: 'DevOps' }
      ],
      timeSeconds: 20,
      speakerNotes: 'Showcase that you picked the right tools for the job. Highlight modern technologies like React 19, Rust, and Claude 3.5.'
    }
  },
  {
    id: 'metrics-traction',
    name: 'Traction & Benchmarks',
    badge: '📊 BENCHMARKS',
    description: 'Three large bold numbers highlighting speedups, accuracy, and cost savings.',
    defaultData: {
      badge: '📊 BENCHMARK PROOF',
      title: 'Empirical Hackathon Results',
      subtitle: 'Real benchmarks measured across simulated production workloads.',
      stats: [
        { value: '12x', label: 'Faster Resolution', note: 'Validated vs baseline manual debugging' },
        { value: '99.4%', label: 'Deterministic Accuracy', note: 'Tested across 150 automated scenarios' },
        { value: '85%', label: 'Cost Reduction', note: 'Achieved through edge caching & optimized AST diffs' }
      ],
      timeSeconds: 25,
      speakerNotes: 'Judges love quantitative benchmarks. Walk through the 12x speedup and the 99.4% pass rate with pride.'
    }
  },
  {
    id: 'business-market',
    name: 'Market Opportunity & TAM',
    badge: '💰 MARKET SIZING',
    description: 'TAM/SAM/SOM market sizing, ideal customer profile, and monetization plan.',
    defaultData: {
      badge: '💰 MARKET & MONETIZATION',
      title: 'A $14.2 Billion Global Market',
      subtitle: 'Rapidly growing addressable market driven by cloud complexity.',
      cards: [
        { icon: '🌐', title: 'TAM: $14.2B', description: 'Total global spend on APM and incident management software.', tag: 'Total Market' },
        { icon: '🎯', title: 'SAM: $3.8B', description: 'Mid-to-large tech companies using modern cloud-native architectures.', tag: 'Serviceable' },
        { icon: '🚀', title: 'SOM: $420M', description: 'Early-adopter Kubernetes and high-scale DevOps teams.', tag: 'Initial Target' }
      ],
      timeSeconds: 25,
      speakerNotes: 'Show that this is not just a hackathon toy, but a viable business with a multi-billion dollar addressable market.'
    }
  },
  {
    id: 'roadmap-future',
    name: 'Roadmap & Future Scope',
    badge: '🗺️ ROADMAP',
    description: 'Three-phase execution plan: 24h Hackathon MVP, 30-Day Beta, Q3 Production Scale.',
    defaultData: {
      badge: '🗺️ EXECUTION ROADMAP',
      title: 'From Hackathon to Production',
      subtitle: 'Clear, realistic milestones demonstrating continued execution velocity.',
      steps: [
        { number: 'PHASE 1', title: '24h Hackathon MVP', detail: 'Fully working core engine, CLI, real-time UI, and simulated test suite.' },
        { number: 'PHASE 2', title: '30-Day Alpha Beta', detail: 'Private beta with 5 partner dev teams and full Slack bot integration.' },
        { number: 'PHASE 3', title: 'Q3 Enterprise Scale', detail: 'SOC2 compliance, multi-tenant Kubernetes operator, and public launch.' }
      ],
      timeSeconds: 20,
      speakerNotes: 'Demonstrate to the judges that you have a concrete roadmap and are committed to scaling this post-hackathon.'
    }
  },
  {
    id: 'team-credentials',
    name: 'Hacker Team & Roles',
    badge: '👥 THE BUILDERS',
    description: 'Team member cards highlighting previous engineering accomplishments and roles.',
    defaultData: {
      badge: '👥 TEAM & CREDENTIALS',
      title: 'The Engineers Behind The Project',
      subtitle: 'Cross-functional engineering team with deep systems and AI experience.',
      members: [
        { name: 'Alex Rivera', role: 'Lead Architect', bio: 'Built kernel probes and low-latency streaming telemetry pipeline.' },
        { name: 'Sarah Chen', role: 'AI Systems Engineer', bio: 'Engineered deterministic reasoning engine and AST synthesizer.' },
        { name: 'Marcus Patel', role: 'Full Stack & UX', bio: 'Crafted the Canva-grade reactive UI and presentation workspace.' }
      ],
      timeSeconds: 15,
      speakerNotes: 'Briefly introduce team members and emphasize your complementary engineering superpowers.'
    }
  },
  {
    id: 'judge-defense',
    name: 'Judge Defense & Moat',
    badge: '🛡️ DEFENSE',
    description: 'Pre-empting tough judging questions with rock-solid architectural moats.',
    defaultData: {
      badge: '🛡️ JUDGE PRE-EMPTION',
      title: 'Why Our Solution Wins & Defends',
      subtitle: 'Clear answers to tough questions regarding security, scale, and defensibility.',
      defensePoints: [
        { title: 'Deterministic Safety over Hallucinations', desc: 'No open-ended unvalidated prompts. Every code patch is validated against the syntax tree.' },
        { title: 'Sub-Millisecond Execution Overhead', desc: 'Lightweight kernel sensors with zero performance degradation on production hosts.' },
        { title: 'Deep Extensible Developer API', desc: 'Includes native CLI, REST API endpoints, and webhook dispatchers.' }
      ],
      timeSeconds: 25,
      speakerNotes: 'Pre-empt the hardest questions the judges are thinking about before they even ask them!'
    }
  },
  {
    id: 'demo-cta',
    name: 'Live Demo & Conclusion',
    badge: '🏁 LIVE DEMO',
    description: 'Final call-to-action: live demo link, GitHub repo link, and Q&A invitation.',
    defaultData: {
      badge: '🏁 CONCLUSION & LIVE DEMO',
      title: 'Test Our Project Live Right Now',
      subtitle: 'Deployed and ready for judges to run hands-on tests.',
      stamp: 'OPEN SOURCE ON GITHUB',
      bulletList: [
        '🚀 Live working deployment running on cloud infrastructure',
        '📦 Clean, open-source GitHub repository with full setup docs',
        '⚡ Ready for judge hands-on testing and technical Q&A'
      ],
      timeSeconds: 15,
      speakerNotes: 'Thank the judges, point to the live demo, and invite them to ask their hardest technical questions.'
    }
  }
];
