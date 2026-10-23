export const HACKATHON_TOOLS = [
  {
    id: 'presentation',
    name: 'Presentation & PPT Maker',
    description: 'Canva-style slide studio with AI generation, drag-and-drop elements, and working PPTX export.',
    category: 'Presentations',
    icon: 'Presentation',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Core Studio',
    popular: true
  },
  {
    id: 'pitch',
    name: 'Pitch Deck Builder',
    description: 'Structured 8 & 10 slide investor & hackathon pitch decks optimized for 3-minute stage pitches.',
    category: 'Presentations',
    icon: 'Rocket',
    color: 'from-indigo-600 to-purple-600',
    badge: 'Winning Format',
    popular: true
  },
  {
    id: 'report',
    name: 'Project Report Generator',
    description: 'Academic & hackathon documentation with Abstract, Methodology, Results, and PDF/DOCX export.',
    category: 'Documentation',
    icon: 'FileText',
    color: 'from-emerald-600 to-teal-600',
    badge: 'SIH / College',
    popular: true
  },
  {
    id: 'architecture',
    name: 'Architecture Diagram Builder',
    description: 'Drag-and-drop cloud, microservices, and system nodes with connection links and export.',
    category: 'Diagrams',
    icon: 'Cpu',
    color: 'from-purple-600 to-pink-600',
    badge: 'Interactive',
    popular: true
  },
  {
    id: 'flowchart',
    name: 'Flowchart & Workflow Maker',
    description: 'Build decision trees, user workflows, and state machines with live Mermaid rendering.',
    category: 'Diagrams',
    icon: 'GitFork',
    color: 'from-amber-600 to-orange-600',
    badge: 'Mermaid Ready'
  },
  {
    id: 'wireframe',
    name: 'UI/UX Prototype Builder',
    description: 'Quick mobile & desktop wireframes with interactive drag-and-drop buttons, cards, and navbars.',
    category: 'Design',
    icon: 'Layout',
    color: 'from-sky-600 to-blue-600',
    badge: 'Mobile + Web',
    popular: true
  },
  {
    id: 'branding',
    name: 'Logo & Branding Studio',
    description: 'Generate team logos, harmonious color palettes, font pairings, and brand guideline sheets.',
    category: 'Design',
    icon: 'Palette',
    color: 'from-rose-600 to-pink-600',
    badge: 'Asset Kit'
  },
  {
    id: 'readme',
    name: 'GitHub README Generator',
    description: 'Create eye-catching README.md files with shields.io badges, installation snippets, and tech stack.',
    category: 'Developer',
    icon: 'FileCode',
    color: 'from-stone-700 to-stone-900',
    badge: 'GitHub Star',
    popular: true
  },
  {
    id: 'planner',
    name: 'Project Planner & Sprint Kanban',
    description: 'Organize 24-48 hour hackathon sprints, assign member tasks, and track milestone deadlines.',
    category: 'Management',
    icon: 'Kanban',
    color: 'from-violet-600 to-indigo-600',
    badge: 'Sprint Board'
  },
  {
    id: 'database',
    name: 'Database & ER Schema Designer',
    description: 'Visual table relationship builder with foreign keys, column types, and SQL DDL export.',
    category: 'Developer',
    icon: 'Database',
    color: 'from-cyan-600 to-blue-600',
    badge: 'SQL Generator'
  },
  {
    id: 'api-docs',
    name: 'API Documentation Generator',
    description: 'Document endpoints with methods, request payloads, sample JSON responses, and cURL snippets.',
    category: 'Developer',
    icon: 'Terminal',
    color: 'from-emerald-700 to-teal-800',
    badge: 'REST Ready'
  },
  {
    id: 'video-planner',
    name: 'Demo Video Planner & Storyboard',
    description: 'Scene-by-scene demo video scripts, shot lists, on-screen actions, and voiceover timing.',
    category: 'Media',
    icon: 'Video',
    color: 'from-fuchsia-600 to-pink-600',
    badge: '2-Min Video'
  },
  {
    id: 'research',
    name: 'Problem Research & Competitor Matrix',
    description: 'Document market sizing (TAM/SAM), target user personas, and competitor feature matrices.',
    category: 'Strategy',
    icon: 'Compass',
    color: 'from-amber-700 to-yellow-600',
    badge: 'Validation'
  },
  {
    id: 'poster',
    name: 'Expo Poster & Showcase Banner',
    description: 'Design 16:9 exhibition banners and A4 printable posters for hackathon demo tables.',
    category: 'Design',
    icon: 'Image',
    color: 'from-blue-700 to-cyan-600',
    badge: 'Print Ready'
  },
  {
    id: 'portfolio',
    name: 'Team Portfolio & Bio Cards',
    description: 'Create cohesive team member profiles highlighting GitHubs, linkedIns, and hackathon roles.',
    category: 'Strategy',
    icon: 'Users',
    color: 'from-indigo-700 to-slate-800',
    badge: 'Team Profile'
  },
  {
    id: 'checklist',
    name: 'Final Submission Checklist',
    description: 'Interactive checklist for Devpost, Unstop, and SIH portal deliverables with progress tracking.',
    category: 'Management',
    icon: 'CheckSquare',
    color: 'from-green-600 to-emerald-700',
    badge: 'Devpost / SIH',
    popular: true
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'NexusOps — Autonomous Incident Healer',
    type: 'presentation',
    track: 'AI Agents & DevTools',
    updatedAt: '10 mins ago',
    slidesCount: 8,
    starred: true,
    folder: 'AI Innovations',
    theme: 'kraft',
    fontStyle: 'hand',
    highlighterColor: 'yellow',
    slides: [
      {
        id: 's1',
        layout: 'title-hero',
        badge: '🚀 HACKATHON 2026',
        title: 'NexusOps AI',
        subtitle: 'The self-healing DevOps agent that triages, reproduces, and hotfixes production outages in 90 seconds.',
        stamp: '100% SHIPPED IN 24H',
        bulletList: [
          '⚡ Built with Claude 3.5 Sonnet + eBPF kernel tracing',
          '🔥 Replaces 4-hour on-call fire drills with 1-click verified PRs',
          '🛠️ Tested live on simulated Kubernetes cluster outages'
        ],
        stickyNotes: [
          { id: 'n1', title: 'LIVE DEMO ALERT', text: 'Live outage trigger will be fired in Slide 4. No video recordings here!', color: 'yellow', angle: '-3deg' }
        ],
        stickers: [
          { type: 'rocket', label: '10x Speed', x: '82%', y: '16%' }
        ],
        elements: [
          { id: 'el-1', type: 'text', text: '⚡ Sub-90s MTTR Guaranteed', x: 80, y: 390, fontSize: 20, fontStyle: 'mono', bold: true, color: '#10B981' }
        ],
        speakerNotes: 'Hi judges! Meet NexusOps. Every engineer knows the 3 AM dread of a pager buzz. Today, we are killing production downtime forever with autonomous root-cause patching.',
        judgeQA: {
          q: 'Will companies let an AI push code directly to production?',
          a: 'NexusOps never pushes blind code. It creates an isolated sandbox, reproduces the bug, generates the hotfix, runs the test suite, and requests 1 human Slack approval.'
        },
        timeSeconds: 20
      },
      {
        id: 's2',
        layout: 'old-vs-new',
        badge: '⚠️ THE PAIN POINT',
        title: 'The $4.2B Broken On-Call Reality',
        subtitle: 'Why existing tools like Datadog and PagerDuty alert you, but leave you stranded.',
        leftCol: {
          title: 'The Old Boring Way',
          items: [
            'PagerDuty wakes up tired engineer at 3:14 AM',
            'Sifting through 10,000 cryptic logs & Grafana graphs',
            'Average Mean-Time-To-Resolution: 4.8 Hours',
            'Company loses $9,000/minute in downtime'
          ]
        },
        rightCol: {
          title: 'The NexusOps Way',
          items: [
            'eBPF sensor detects anomaly in under 400ms',
            'AI analyzes memory dump & generates AST patch',
            'Verified in ephemeral Docker staging environment',
            'Ready to merge in Slack in under 90 seconds'
          ]
        },
        stickyNotes: [
          { id: 'n2', title: 'JUDGE HOOK', text: 'Ask any engineer in the room how much they hate PagerDuty at 3 AM!', color: 'pink', angle: '2deg' }
        ],
        stickers: [
          { type: 'cross', label: 'Broken', x: '24%', y: '18%' },
          { type: 'check', label: 'Solved', x: '72%', y: '18%' }
        ],
        speakerNotes: 'Notice the huge disparity. Traditional APM tools are just dumb sirens. They scream when the house is on fire, but hand you an empty bucket. We bring the automated firefighter.',
        judgeQA: {
          q: 'Why didn’t Datadog build this already?',
          a: 'Datadog makes \$2B/year charging per gigabyte of ingested telemetry. Their incentive is logging MORE data, not solving it autonomously.'
        },
        timeSeconds: 25
      },
      {
        id: 's3',
        layout: 'bento-grid',
        badge: '💡 THE SOLUTION',
        title: 'Three Pillars of Autonomous Healing',
        subtitle: 'Engineered for zero hallucinations and deterministic safety.',
        cards: [
          { icon: '⚡', title: '1. eBPF Anomaly Radar', description: 'Zero-overhead kernel probe flagging memory leaks and deadlock threads.', tag: 'Kernel Level' },
          { icon: '🧠', title: '2. Deterministic AST Patch', description: 'Targeted git diff fix directly on the syntax tree rather than raw text.', tag: 'Safe LLM Loop' },
          { icon: '🛡️', title: '3. Ephemeral Sandbox Run', description: 'Spins up a throwaway container to execute integration tests before approval.', tag: 'Zero Risk' }
        ],
        stickyNotes: [
          { id: 'n3', title: 'SECRET SAUCE', text: 'AST tree patching ensures syntactically valid code 100% of the time!', color: 'yellow', angle: '-2deg' }
        ],
        stickers: [
          { type: 'stamp', label: 'ZERO HALLUCINATIONS', x: '82%', y: '12%' }
        ],
        speakerNotes: 'Under the hood, we hook into the Linux kernel with eBPF, generate deterministic AST patches, and stress-test them in ephemeral sandboxes.',
        judgeQA: {
          q: 'What if the AI introduces a new security flaw?',
          a: 'All generated diffs pass through Semgrep security scanning and existing test suites inside the container before alerting the team.'
        },
        timeSeconds: 25
      },
      {
        id: 's4',
        layout: 'architecture-flow',
        badge: '🛠️ SYSTEM ARCHITECTURE',
        title: 'Built Under The Hood In 24 Hours',
        subtitle: 'Our end-to-end architecture deployed live at this hackathon.',
        steps: [
          { number: '01', title: 'Telemetry Listener', detail: 'Vector daemon streaming Kubernetes pod metrics & stderr to Kafka' },
          { number: '02', title: 'Context Assembler', detail: 'RAG over code repo + git blame to pinpoint exact faulty commits' },
          { number: '03', title: 'Agentic Healer', detail: 'Claude 3.5 Sonnet executing iterative bash commands in sandbox' },
          { number: '04', title: 'Interactive Webhook', detail: 'Slack interactive card with 1-click "Approve & Deploy to Prod"' }
        ],
        stickyNotes: [
          { id: 'n4', title: 'HACKATHON BUILD', text: 'Full microservices stack running on AWS Graviton + Docker Compose right now.', color: 'mint', angle: '3deg' }
        ],
        stickers: [
          { type: 'star', label: '100% Deployed', x: '88%', y: '18%' }
        ],
        speakerNotes: 'Let us peek under the hood. We built a real four-stage agent pipeline: from Kafka telemetry ingestion to repo AST context analysis, iterative Claude repair loop, and a Slack interactive approval webhook.',
        judgeQA: {
          q: 'What was the hardest technical challenge during the 24 hours?',
          a: 'Minimizing context window bloat. Passing 50MB log files fails with LLMs; we built a token-bucket log summarizer that strips 98% of noise.'
        },
        timeSeconds: 30
      },
      {
        id: 's5',
        layout: 'metrics-traction',
        badge: '📊 TRACTION & BENCHMARKS',
        title: 'Real Hackathon Benchmark Results',
        subtitle: 'Tested against 25 real-world open-source outages from GitHub incidents.',
        stats: [
          { label: 'Avg MTTR Drop', value: '94%', note: 'From 4.8 hrs down to 92 seconds' },
          { label: 'Autonomous Fix Rate', value: '88%', note: '22 out of 25 test outages resolved' },
          { label: 'Cost Per Incident', value: '$0.14', note: 'Compared to $600 human on-call cost' }
        ],
        stickyNotes: [
          { id: 'n5', title: 'JUDGE PROOF', text: 'All benchmark data and reproduction scripts are open-sourced in our repo.', color: 'yellow', angle: '-2deg' }
        ],
        stickers: [
          { type: 'fire', label: 'Crazy ROI', x: '75%', y: '16%' }
        ],
        speakerNotes: 'Numbers do not lie. We ran 25 historic GitHub outages through NexusOps. It resolved 22 of them with zero human intervention at an average cost of fourteen cents per incident.',
        judgeQA: {
          q: 'How did you benchmark this during a hackathon?',
          a: 'We pulled 25 reproducible bug scenarios from the open BugSwarm dataset and scripted container failures to test autonomous remediation.'
        },
        timeSeconds: 25
      },
      {
        id: 's6',
        layout: 'team-hackers',
        badge: '👥 THE BUILDERS',
        title: 'Built By Systems & AI Hackers',
        subtitle: 'We have lived through terrible on-call shifts and built the solution we needed.',
        members: [
          { name: 'Alex Rivera', role: 'Fullstack & Agent Logic', bio: 'Built the AST synthesis engine & Claude loop.', tag: 'Backend Lead' },
          { name: 'Priya Sharma', role: 'eBPF & Kernel Telemetry', bio: 'Built our real-time kernel probe daemon.', tag: 'Systems Lead' },
          { name: 'David Chen', role: 'DevOps & Ephemeral Infra', bio: 'Architected the Docker sandbox tester.', tag: 'Infra Lead' }
        ],
        stickyNotes: [
          { id: 'n6', title: 'PASSION PROJECT', text: 'We have all been woken up at 3 AM by broken deployments. Never again!', color: 'yellow', angle: '3deg' }
        ],
        stickers: [
          { type: 'coffee', label: 'Coffee Powered', x: '8%', y: '80%' }
        ],
        speakerNotes: 'We are a balanced team of systems, AI, and infrastructure developers who have lived through the pain of on-call duty firsthand.',
        judgeQA: {
          q: 'Will you continue working on this after the hackathon?',
          a: '100%. We already have 3 engineering teams from local startups signed up for our closed beta testing next Monday.'
        },
        timeSeconds: 15
      },
      {
        id: 's7',
        layout: 'judge-defense',
        badge: '🏆 THE FINAL ASK',
        title: 'Why NexusOps Wins Hackathon 2026',
        subtitle: 'High technical execution, proven live demo, and immediate enterprise utility.',
        defensePoints: [
          { title: 'Working Live Demo Right Now', desc: 'No vaporware or mockups. Scan the QR code to trigger a crash live.' },
          { title: 'Sub-90s Real-World Resolution', desc: 'Faster than any human engineer can even open their laptop.' },
          { title: 'Real Commercial Roadmap', desc: '3 beta design partners signed up before this pitch ended.' }
        ],
        stickyNotes: [
          { id: 'n7', title: 'JUDGE SCORECARD', text: 'Innovation: 10/10 • Execution: 10/10 • Impact: 10/10', color: 'mint', angle: '-3deg' }
        ],
        stickers: [
          { type: 'stamp', label: 'JUDGE FAVORITE', x: '82%', y: '20%' }
        ],
        speakerNotes: 'Judges, thank you. NexusOps is not a future idea—it is running live right now. Come by our booth to see it hotfix a live Kubernetes crash. Thank you!',
        judgeQA: {
          q: 'What is the 6-month roadmap?',
          a: 'Multi-cloud support (AWS, GCP, Azure), automated post-mortem PDF generation, and enterprise SAML/SOC2 compliance.'
        },
        timeSeconds: 20
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'PayPulse — Zero-Gas Protocol Pitch',
    type: 'pitch',
    track: 'FinTech & Web3',
    updatedAt: '2 hours ago',
    slidesCount: 6,
    starred: true,
    folder: 'Web3 & Crypto',
    theme: 'blueprint',
    fontStyle: 'marker',
    highlighterColor: 'cyan',
    slides: [
      {
        id: 'pw1',
        layout: 'title-hero',
        badge: '⚡ FINTECH / WEB3',
        title: 'PayPulse',
        subtitle: '1-click streaming micropayments for API calls and content creators. Zero gas, zero wallet popups, zero seed phrases.',
        stamp: 'LIVE ON TESTNET',
        bulletList: [
          '🔐 Account Abstraction (ERC-4337) with WebAuthn Passkeys',
          '⚡ State-channel batching achieving 12,000 TPS at $0.00001 cost',
          '💳 Credit card onramp integrated via Stripe in 20 seconds'
        ],
        stickyNotes: [
          { id: 'pwn1', title: 'PASSKEY LOGIN', text: 'Log in with FaceID, pay 1 cent per article. No MetaMask!', color: 'blue', angle: '-3deg' }
        ],
        stickers: [
          { type: 'rocket', label: 'Sub-Second', x: '82%', y: '16%' }
        ],
        speakerNotes: 'Welcome judges. Crypto promised instant global micropayments, but delivered $12 gas fees and clunky seed phrases. PayPulse brings 1-click micro-streaming to the entire internet.',
        judgeQA: {
          q: 'Who pays for the gas if the user has zero crypto?',
          a: 'PayPulse sponsors initial gas via an ERC-4337 Paymaster contract funded by merchants or application fees.'
        },
        timeSeconds: 20
      }
    ]
  },
  {
    id: 'proj-3',
    name: 'ForestSense SIH Project Report',
    type: 'report',
    track: 'Hardware & IoT',
    updatedAt: '1 day ago',
    slidesCount: 1,
    starred: false,
    folder: 'Smart India Hackathon',
    reportData: {
      title: 'ForestSense: Decentralized LoRa Mesh Wildfire Sentinel System',
      abstract: 'Wildfires cause catastrophic ecological and economic devastation globally. Existing satellite-based detection exhibits a 3 to 6-hour orbital latency, by which point fires have breached critical containment thresholds. This project presents ForestSense, a self-organizing $15 LoRa mesh node telemetry network deploying low-power MEMS gas sensors and thermal imaging to detect canopy combustions within 180 seconds of inception.',
      team: 'Team CyberSentinels (Alex Rivera, Priya Sharma, David Chen)',
      college: 'K.R. Mangalam University — School of Engineering & Technology',
      problemStatement: 'Early detection of forest fires in remote terrains lacking cellular coverage.',
      objectives: [
        'Design a sub-$15 weatherproof sensor node with 10-year battery life via solar harvesting.',
        'Implement decentralized ad-hoc mesh networking reaching 15km line-of-sight without GSM/LTE.',
        'Develop edge anomaly detection algorithms for rapid CO and VOC gas spike classification.',
        'Deploy real-time cloud geospatial dashboard with automated SMS/radio alerts to ranger bases.'
      ],
      methodology: 'Hardware prototyping with ESP32-S3 and SX1262 LoRa transceivers. Edge machine learning regression models for threshold filtering. AWS IoT Core ingestion pipeline streaming geoJSON pins to an interactive Leaflet frontend.',
      results: 'Validated in controlled test burns: average notification latency was 142 seconds across a 4-node 8km mesh relay. False positive rate suppressed below 1.2% through dual-sensor correlation.',
      limitations: 'Line-of-sight obstructions in deep canyons require high-canopy tethering. Sensor coating degrades after direct 500°C flame exposure.',
      futureScope: 'Autonomous drone swarm relay dispatch for rapid node replacement in fire perimeters.'
    }
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'AI / ML & Agents',
  'Web3 & FinTech',
  'Hardware & IoT',
  'HealthTech & Bio',
  'Smart City (SIH)',
  'EdTech & Social',
  'Cybersecurity'
];

export const HACKATHON_TEMPLATES = [
  {
    id: 'tpl-ai-agent',
    title: 'Autonomous AI Agent SaaS Pitch',
    category: 'AI / ML & Agents',
    slidesCount: 8,
    duration: '3-min pitch',
    thumbnailColor: 'from-purple-900 to-indigo-900',
    description: 'Perfect for LLM pipelines, autonomous agents, RAG architectures, and agentic workflows.',
    tag: 'Popular'
  },
  {
    id: 'tpl-sih-hardware',
    title: 'Smart India Hackathon (SIH) Grand Finale Deck',
    category: 'Smart City (SIH)',
    slidesCount: 10,
    duration: '5-min jury',
    thumbnailColor: 'from-amber-900 to-orange-950',
    description: 'Follows official SIH presentation format: Problem, Proposed Solution, Architecture, Feasibility, Cost Analysis.',
    tag: 'Govt & College'
  },
  {
    id: 'tpl-web3-fintech',
    title: 'DeFi & Account Abstraction Protocol',
    category: 'Web3 & FinTech',
    slidesCount: 8,
    duration: '3-min pitch',
    thumbnailColor: 'from-blue-900 to-cyan-950',
    description: 'Showcases smart contract architecture, gasless UX, tokenomics loop, and live testnet proof.',
    tag: 'Web3 Track'
  },
  {
    id: 'tpl-healthtech',
    title: 'Clinical AI & Diagnostic Sentinel',
    category: 'HealthTech & Bio',
    slidesCount: 8,
    duration: '4-min pitch',
    thumbnailColor: 'from-emerald-950 to-teal-900',
    description: 'Medical workflow diagram, doctor persona, HIPAA compliance breakdown, and pilot accuracy stats.',
    tag: 'BioHack'
  },
  {
    id: 'tpl-iot-climate',
    title: 'IoT Telemetry & Climate Resilience',
    category: 'Hardware & IoT',
    slidesCount: 8,
    duration: '5-min demo',
    thumbnailColor: 'from-green-950 to-emerald-900',
    description: 'Sensor circuit schematic, LoRa mesh topology, battery telemetry benchmarks, and environmental impact.',
    tag: 'Hardware'
  },
  {
    id: 'tpl-cybersecurity',
    title: 'Zero-Trust Cloud Security & Auditing',
    category: 'Cybersecurity',
    slidesCount: 7,
    duration: '3-min lightning',
    thumbnailColor: 'from-red-950 to-stone-900',
    description: 'Threat model vector, CVE vulnerability reproduction, automated remediation diff, and enterprise ROI.',
    tag: 'Security Track'
  }
];
