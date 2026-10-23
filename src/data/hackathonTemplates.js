export const HACKATHON_DECKS = [
  {
    id: 'deck-ai-devtools',
    name: 'NexusOps — Autonomous Incident Healer',
    track: 'AI Agents & Developer Tools',
    theme: 'kraft',
    fontStyle: 'hand',
    highlighterColor: 'yellow',
    slides: [
      {
        id: 's1',
        layout: 'title-hero',
        badge: '🚀 HACKATHON 2026 PITCH',
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
          { type: 'rocket', label: '10x Speed', x: '82%', y: '18%' }
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
  }
];

export const SLIDE_LAYOUT_OPTIONS = [
  { id: 'title-hero', label: 'Title & Hook Hero', desc: 'Bold title, hackathon badge, elevator pitch & proof bullets' },
  { id: 'old-vs-new', label: 'The Pain (Old vs New)', desc: 'Side-by-side comparison of the painful old way vs your fix' },
  { id: 'bento-grid', label: 'Bento Solution Grid', desc: '3 sketchy cards highlighting your core features or pillars' },
  { id: 'architecture-flow', label: 'System Architecture', desc: '4-step technical pipeline showing what you actually coded' },
  { id: 'metrics-traction', label: 'Traction & Benchmarks', desc: '3 huge stat highlights, ROI proof, and benchmark charts' },
  { id: 'team-hackers', label: 'Team of Builders', desc: 'Hacker avatars, specialized roles, and founder credentials' },
  { id: 'judge-defense', label: 'Judge Winning Defense', desc: 'Knockout closing slide with key arguments & live demo QR' }
];

export const THEMES = [
  { id: 'kraft', name: 'Vintage Kraft Paper' },
  { id: 'grid', name: 'Engineer Graph Grid' },
  { id: 'dotgrid', name: 'Dot Matrix Journal' },
  { id: 'blueprint', name: 'Dark Blueprint' },
  { id: 'chalkboard', name: 'Hacker Chalkboard' },
  { id: 'vanilla', name: 'Cozy Vanilla Cream' }
];
