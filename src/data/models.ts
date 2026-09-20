import { AIModel, TaskCategory } from '../types';

export const INITIAL_CATEGORIES: TaskCategory[] = [
  {
    id: 'video',
    name: 'AI Video',
    icon: 'Film',
    description: 'Cinematic video generation, motion control, VFX, camera panning',
    samplePrompts: [
      'Create a cinematic Hollywood sci-fi action scene with anamorphic lens flare',
      'Turn this static product photo into a luxury 3D rotating camera commercial',
      'Generate a 10-second hyper-realistic slow-motion drone flyover of Iceland'
    ]
  },
  {
    id: 'image',
    name: 'AI Image',
    icon: 'Image',
    description: 'Photorealism, stylized art, concept design, texture rendering',
    samplePrompts: [
      'Generate a realistic studio product image of a matte obsidian perfume bottle',
      'Hyper-detailed cyberpunk street noodle stand at dusk in rainy Tokyo',
      'Editorial fashion portrait with dramatic chiaroscuro high-fashion lighting'
    ]
  },
  {
    id: 'coding',
    name: 'Coding',
    icon: 'Code',
    description: 'Full-stack software, architecture, algorithms, debugging, refactoring',
    samplePrompts: [
      'Write Python code for a high-frequency trading dashboard with WebSocket streams',
      'Build a full React TypeScript Kanban board with drag-and-drop and undo/redo',
      'Refactor this Express PostgreSQL backend to optimize slow N+1 database queries'
    ]
  },
  {
    id: 'writing',
    name: 'AI Writing',
    icon: 'PenTool',
    description: 'Long-form essays, executive emails, ad copy, persuasive storytelling',
    samplePrompts: [
      'Write a high-stakes executive email negotiating a $500k SaaS renewal',
      'Draft a captivating 2,500-word investigative article on quantum computing',
      'Write persuasive direct-response landing page copy for a productivity app'
    ]
  },
  {
    id: 'research',
    name: 'Research',
    icon: 'Search',
    description: 'Deep literature review, factual verification, cross-paper synthesis',
    samplePrompts: [
      'Research the latest multi-modal AI reasoning benchmarks and summarize trends',
      'Analyze 5 recent medical research papers on mRNA therapeutics and compare efficacy',
      'Perform competitive intelligence analysis on top 4 vector database architectures'
    ]
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    icon: 'BarChart2',
    description: 'Large datasets, CSV/Parquet crunching, statistical modeling, visualizations',
    samplePrompts: [
      'Analyze this 150k-row e-commerce transaction dataset for cohort churn signals',
      'Run a Monte Carlo risk simulation on portfolio return distributions in Python',
      'Summarize key revenue variances across regional Q4 financial tables'
    ]
  },
  {
    id: 'presentation',
    name: 'Presentation',
    icon: 'Presentation',
    description: 'Pitch decks, keynotes, structured slide outlines, executive briefings',
    samplePrompts: [
      'Create a 10-slide Seed-stage startup pitch deck outline for an enterprise AI tool',
      'Outline an all-hands slide deck explaining our pivot to edge computing',
      'Generate speaking notes and slide structure for a keynote on renewable energy'
    ]
  },
  {
    id: 'audio-music',
    name: 'Audio & Music',
    icon: 'Music',
    description: 'Full song composition, instrumental stems, ambient soundtracks, sound design',
    samplePrompts: [
      'Compose a cinematic cyberpunk synthwave track with heavy sub-bass and retro arps',
      'Generate an uplifting indie folk-pop track with acoustic guitar and warm harmonies',
      'Create ambient deep-focus lo-fi beats with vinyl crackle and Rhodes piano'
    ]
  },
  {
    id: 'voice',
    name: 'Voice',
    icon: 'Mic',
    description: 'Natural voiceovers, accent replication, emotional range, podcast cloning',
    samplePrompts: [
      'Generate a calm, articulate British documentary narration for a nature video',
      'Create an enthusiastic, high-energy American voiceover for a YouTube tech ad',
      'Clone my voice sample to produce a bilingual Spanish/English audiobook chapter'
    ]
  },
  {
    id: 'animation',
    name: 'Animation',
    icon: 'Sparkles',
    description: '2D/3D character animation, motion graphics, anime sequences, loop gifs',
    samplePrompts: [
      'Animate a 2D Studio Ghibli inspired meadow scene with gentle grass blowing',
      'Create a 3D isometric looping animation of a miniature cloud computing server farm',
      'Generate keyframe transitions for a futuristic holographic HUD interface'
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'Megaphone',
    description: 'Go-to-market campaigns, email funnels, value props, conversion optimization',
    samplePrompts: [
      'Write a 5-part cold outreach email sequence targeting enterprise CTOs',
      'Develop a multi-channel launch campaign for a B2B cybersecurity platform',
      'Create 10 high-converting Facebook and Instagram ad headline variations'
    ]
  },
  {
    id: 'social-media',
    name: 'Social Media',
    icon: 'Share2',
    description: 'Viral threads, LinkedIn authority posts, TikTok scripts, engagement hooks',
    samplePrompts: [
      'Write a 10-tweet viral thread breaking down how modern LLMs handle reasoning',
      'Create 5 punchy LinkedIn thought-leadership posts on engineering leadership',
      'Script a 60-second viral TikTok hook explaining a surprising psychology fact'
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'Youtube',
    description: 'Video scripts, retention hooks, pacing formulas, description SEO',
    samplePrompts: [
      'Write an irresistible 8-minute YouTube video script with high-retention hooks',
      'Create 10 click-worthy YouTube video titles with SEO keywords for coding tutorials',
      'Generate an outline and B-roll shot list for a productivity gear review video'
    ]
  },
  {
    id: 'thumbnails',
    name: 'Thumbnails',
    icon: 'Layout',
    description: 'High-CTR YouTube thumbnails, bold typography, expressive faces, high contrast',
    samplePrompts: [
      'Create an ultra-high CTR YouTube thumbnail with shocked expression and neon contrast',
      'Design a minimalist MrBeast-style YouTube thumbnail comparing $1 vs $1,000,000 AI tools',
      'Generate a clean tech thumbnail with bold 3D floating text and glowing gradient'
    ]
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: 'BookOpen',
    description: 'Worldbuilding, screenplays, character dialogues, narrative arcs, fiction',
    samplePrompts: [
      'Write a tense 3-scene screenplay dialogue between an astronaut and an rogue ship AI',
      'Build a complex fantasy magic system based on thermodynamic entropy and memory loss',
      'Draft chapter 1 of a neo-noir detective novel set in an underwater metropolis'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    description: 'Socratic tutoring, complex concept simplifications, curriculum development',
    samplePrompts: [
      'Explain quantum entanglement to a high schooler using intuitive physical metaphors',
      'Design a 4-week structured curriculum for mastering React performance optimization',
      'Create 10 conceptual practice problems with step-by-step solutions for calculus'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'Briefcase',
    description: 'Market sizing, SWOT analysis, executive summaries, strategic roadmaps',
    samplePrompts: [
      'Perform a comprehensive TAM/SAM/SOM market sizing analysis for AI customer service',
      'Draft a structured business requirements document (BRD) for an ERP migration',
      'Create a 12-month strategic roadmap for expanding an API SaaS into European markets'
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'CheckSquare',
    description: 'Meeting summaries, action item extraction, workflow automation, triage',
    samplePrompts: [
      'Extract all action items, owners, and deadlines from this 45-minute meeting transcript',
      'Design a weekly time-blocking schedule optimizing for 4 hours of daily deep work',
      'Draft automated triage rules for organizing 500+ customer support tickets'
    ]
  }
];

export const INITIAL_MODELS: AIModel[] = [
  // 1. Google Veo 3.1
  {
    id: 'google-veo-3-1',
    name: 'Google Veo 3.1',
    provider: 'Google DeepMind',
    category: 'AI Video',
    supportedTasks: ['AI Video', 'Animation', 'YouTube', 'Marketing'],
    description: 'DeepMind’s premier high-definition video generation model offering superior temporal coherence, cinematic camera motions, and high-fidelity physics.',
    strengths: [
      'Exceptional camera control (pans, tilts, dollies, aerials)',
      'High visual photorealism and cinematic consistency',
      'Native understanding of visual prompts and cinematography terminology',
      'Crisp 1080p output with stable character motion'
    ],
    weaknesses: [
      'Processing time can take 2-4 minutes for complex renders',
      'Strict content safety filters for public figures',
      'Limited audio generation synchronization'
    ],
    inputTypes: ['Text', 'Image (Image-to-Video)', 'Reference Frames'],
    outputTypes: ['Video (MP4)', '1080p / 720p', '16:9 / 9:16'],
    speedRating: 3,
    qualityRating: 5,
    costCategory: 'High ($$$)',
    contextCapability: 'Cinematic temporal sequence (up to 10s base, extendable)',
    scores: {
      video: 97,
      image: 88,
      writing: 20,
      coding: 10,
      reasoning: 75,
      context: 70,
      easeOfUse: 88,
      speed: 68,
      costEfficiency: 74
    },
    benchmarkScore: {
      name: 'Artificial Analysis Video Quality Elo',
      value: 1284,
      verifiedDate: '2026-03-01',
      description: 'Ranked #1 for camera movement stability and temporal consistency.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-10',
    isTrending: true,
    isNew: true,
    badge: 'Cinematic Video Leader',
    iconName: 'Film',
    color: '#3B82F6'
  },

  // 2. Runway Gen-3 Alpha
  {
    id: 'runway-gen-3',
    name: 'Runway Gen-3 Alpha',
    provider: 'RunwayML',
    category: 'AI Video',
    supportedTasks: ['AI Video', 'Animation', 'Marketing', 'Thumbnails'],
    description: 'Industry-standard AI video generator designed for creative directors and VFX artists, with advanced motion brush and camera control.',
    strengths: [
      'Fine-grained motion brush for targeted object movement',
      'Fast iterative rendering options',
      'Extensive visual styling from hyperrealism to animation',
      'Robust Image-to-Video keyframing'
    ],
    weaknesses: [
      'Slight morphing on very fast limb motions',
      'Usage credits can deplete quickly on multiple 4K upscale passes',
      'Occasional text rendering errors within video frames'
    ],
    inputTypes: ['Text', 'Image', 'Keyframes'],
    outputTypes: ['Video (MP4)', '4K Upscaled', '16:9, 9:16, 1:1'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'High ($$$)',
    contextCapability: 'Keyframed video timeline',
    scores: {
      video: 94,
      image: 85,
      writing: 15,
      coding: 10,
      reasoning: 70,
      context: 65,
      easeOfUse: 89,
      speed: 78,
      costEfficiency: 70
    },
    benchmarkScore: {
      name: 'VBench Motion Score',
      value: '91.8%',
      verifiedDate: '2026-02-15',
      description: 'Top marks for user-guided camera trajectory adherence.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-02-28',
    isTrending: false,
    isNew: false,
    badge: 'VFX Motion Master',
    iconName: 'Video',
    color: '#8B5CF6'
  },

  // 3. Claude 3.7 Sonnet
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    category: 'Coding',
    supportedTasks: ['Coding', 'Data Analysis', 'AI Writing', 'Research', 'Business'],
    description: 'Anthropic’s breakthrough hybrid reasoning and coding flagship model, delivering unmatched precision in software engineering and nuanced architectural decisions.',
    strengths: [
      'World-class coding benchmark performance across full stack architectures',
      'Configurable hybrid reasoning (instant answers vs. deep step-by-step thinking)',
      'Clean, maintainable, idiomatically correct production code on first attempt',
      'Natural, non-robotic tone with outstanding nuanced long-form writing'
    ],
    weaknesses: [
      'Cannot generate images or video natively',
      'Extended thinking mode incurs higher token consumption',
      'Rate limits on high-concurrency requests'
    ],
    inputTypes: ['Text', 'Code', 'Images / Screenshots', 'PDFs / Documents'],
    outputTypes: ['Code', 'Text', 'JSON', 'Markdown'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: '200,000 tokens (large codebase context)',
    scores: {
      video: 0,
      image: 0,
      writing: 96,
      coding: 99,
      reasoning: 98,
      context: 95,
      easeOfUse: 94,
      speed: 86,
      costEfficiency: 88
    },
    benchmarkScore: {
      name: 'SWE-bench Verified',
      value: '70.3%',
      verifiedDate: '2026-03-05',
      description: 'Highest verified score resolving real GitHub enterprise issues.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-12',
    isTrending: true,
    isNew: true,
    badge: 'Coding Champion',
    iconName: 'Terminal',
    color: '#F97316'
  },

  // 4. Gemini 3.1 Pro
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    category: 'Research',
    supportedTasks: ['Research', 'Data Analysis', 'Coding', 'Education', 'Business', 'Productivity'],
    description: 'Frontier multimodal reasoning model featuring an enormous 2-million-token context window for analyzing full codebases, hours of video, or book-length documents.',
    strengths: [
      'Industry-leading 2,000,000-token context window with near-perfect needle recall',
      'Native multimodal comprehension (video, audio, high-res docs, and code)',
      'Built-in Google Search grounding for real-time live information retrieval',
      'Exceptional STEM, mathematical, and data science reasoning'
    ],
    weaknesses: [
      'Can be overly verbose on simple conversational prompts',
      'Requires explicit system instructions for strict conciseness'
    ],
    inputTypes: ['Text', 'Images', 'Audio', 'Video', 'PDFs', 'Code'],
    outputTypes: ['Text', 'Code', 'Structured JSON', 'Function Calls'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: '2,000,000 tokens (unrivaled multimodal capacity)',
    scores: {
      video: 40,
      image: 40,
      writing: 94,
      coding: 95,
      reasoning: 97,
      context: 100,
      easeOfUse: 93,
      speed: 84,
      costEfficiency: 91
    },
    benchmarkScore: {
      name: 'MMLU-Pro Multimodal Reasoning',
      value: '91.4%',
      verifiedDate: '2026-03-08',
      description: 'Dominates in complex multi-document synthesis and long-video analysis.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-14',
    isTrending: true,
    isNew: true,
    badge: '2M Context King',
    iconName: 'Cpu',
    color: '#3B82F6'
  },

  // 5. Flux.1 Pro
  {
    id: 'flux-1-pro',
    name: 'Flux.1 Pro',
    provider: 'Black Forest Labs',
    category: 'AI Image',
    supportedTasks: ['AI Image', 'Thumbnails', 'Marketing', 'Social Media'],
    description: 'State-of-the-art text-to-image diffusion transformer with unmatched prompt adherence, hyperrealistic skin textures, and flawless typography in images.',
    strengths: [
      'Exceptional text rendering on signs, posters, labels, and apparel',
      'Uncanny anatomy accuracy (hands, fingers, eyes, reflections)',
      'Extremely high photographic realism without artificial plastic shine',
      'Complex multi-subject spatial scene composition'
    ],
    weaknesses: [
      'No native video generation',
      'Strict commercial licensing tier for API volume',
      'Larger model footprint means slower generation than lightweight models'
    ],
    inputTypes: ['Text', 'Image Guide'],
    outputTypes: ['Image (PNG/WebP)', 'Up to 2K native resolution'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: 'High-density text prompt embedding',
    scores: {
      video: 0,
      image: 99,
      writing: 0,
      coding: 0,
      reasoning: 60,
      context: 50,
      easeOfUse: 95,
      speed: 82,
      costEfficiency: 86
    },
    benchmarkScore: {
      name: 'Artificial Analysis Text-to-Image Elo',
      value: 1248,
      verifiedDate: '2026-02-20',
      description: '#1 in prompt typography adherence and photorealism.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-02',
    isTrending: true,
    isNew: false,
    badge: 'Image Realism #1',
    iconName: 'Image',
    color: '#EC4899'
  },

  // 6. Midjourney v6.1
  {
    id: 'midjourney-v6-1',
    name: 'Midjourney v6.1',
    provider: 'Midjourney',
    category: 'AI Image',
    supportedTasks: ['AI Image', 'Thumbnails', 'Marketing', 'Animation', 'Social Media'],
    description: 'Legendary aesthetic image generation engine renowned for painterly compositions, cinematic lighting, and editorial concept art.',
    strengths: [
      'Unsurpassed artistic aesthetic and mood direction',
      'Gorgeous natural lighting, bokeh, volumetric fog, and color grading',
      'Strong inpainting (Vary Region) and character pan reference',
      'Intuitive web and Discord interfaces'
    ],
    weaknesses: [
      'Typography inside images is still slightly behind Flux.1',
      'No official open REST API for direct developer integration',
      'Tends to beautify/stylize prompts rather than strict literal obedience'
    ],
    inputTypes: ['Text', 'Image URLs (Image Weighting)', 'Style References'],
    outputTypes: ['Image (PNG)', '1024x1024 base with upscalers'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: 'Prompt + Image weight parameters',
    scores: {
      video: 0,
      image: 97,
      writing: 0,
      coding: 0,
      reasoning: 55,
      context: 45,
      easeOfUse: 90,
      speed: 84,
      costEfficiency: 82
    },
    benchmarkScore: {
      name: 'Aesthetic Benchmark Score',
      value: '9.4/10',
      verifiedDate: '2026-02-10',
      description: 'Gold standard for creative concept art and cinematic thumbnails.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-02-18',
    isTrending: false,
    isNew: false,
    badge: 'Aesthetic Concept Art',
    iconName: 'Palette',
    color: '#06B6D4'
  },

  // 7. Ideogram 2.0
  {
    id: 'ideogram-2-0',
    name: 'Ideogram 2.0',
    provider: 'Ideogram',
    category: 'Thumbnails',
    supportedTasks: ['Thumbnails', 'AI Image', 'Marketing', 'Social Media', 'Presentation'],
    description: 'Specialized graphic design and text-in-image generator tailored for YouTube thumbnails, logos, apparel typography, and branded banners.',
    strengths: [
      'Unrivaled accuracy for complex phrases, curved text, and multi-word slogans',
      'Dedicated Graphic Design and Typography rendering modes',
      'High click-through-rate layout composition for digital creators',
      'Color palette locking and brand aesthetic consistency'
    ],
    weaknesses: [
      'Less painterly than Midjourney for abstract fine art',
      'Occasional texture over-sharpening in realism mode'
    ],
    inputTypes: ['Text', 'Style Mode', 'Color Palette'],
    outputTypes: ['Image (PNG)', 'Various aspect ratios (16:9, 1:1, 9:16)'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Very Low ($)',
    contextCapability: 'Structured text layout prompt',
    scores: {
      video: 0,
      image: 95,
      writing: 10,
      coding: 0,
      reasoning: 50,
      context: 40,
      easeOfUse: 96,
      speed: 86,
      costEfficiency: 92
    },
    benchmarkScore: {
      name: 'Text-in-Image Precision Index',
      value: '96.2%',
      verifiedDate: '2026-02-25',
      description: 'Highest verified score for spelled text accuracy inside images.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-01',
    isTrending: true,
    isNew: false,
    badge: 'Best for Thumbnails & Text',
    iconName: 'Layout',
    color: '#F43F5E'
  },

  // 8. DeepSeek R1
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    category: 'Research',
    supportedTasks: ['Research', 'Coding', 'Data Analysis', 'Education'],
    description: 'Open-weights frontier reasoning model trained via large-scale reinforcement learning, excelling in math, competitive coding, and complex logic puzzles.',
    strengths: [
      'Open reasoning chain lets users verify each logical deduction step',
      'Matches proprietary reasoning models at a fraction of API inference cost',
      'Superb mathematical theorem proofs and algorithmic optimizations',
      'High transparency and zero corporate PR fluff in technical answers'
    ],
    weaknesses: [
      'Thinking chain can be lengthy for simple factual lookups',
      'No native multimodal input (text-only reasoning)',
      'Occasional language mixing in raw unformatted outputs'
    ],
    inputTypes: ['Text', 'Code', 'Mathematical formulas (LaTeX)'],
    outputTypes: ['Chain of Thought', 'Text', 'Code', 'LaTeX'],
    speedRating: 3,
    qualityRating: 5,
    costCategory: 'Very Low ($)',
    contextCapability: '128,000 tokens',
    scores: {
      video: 0,
      image: 0,
      writing: 88,
      coding: 96,
      reasoning: 98,
      context: 88,
      easeOfUse: 88,
      speed: 72,
      costEfficiency: 99
    },
    benchmarkScore: {
      name: 'AIME 2024 Math Score',
      value: '79.8%',
      verifiedDate: '2026-02-12',
      description: 'Tied with OpenAI o1 at 1/20th the token pricing.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-02-28',
    isTrending: true,
    isNew: false,
    badge: 'Cost/Reasoning King',
    iconName: 'Brain',
    color: '#0284C7'
  },

  // 9. Gemini 3.8 Flash
  {
    id: 'gemini-3-8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google DeepMind',
    category: 'Productivity',
    supportedTasks: ['Productivity', 'AI Writing', 'Business', 'Social Media', 'Marketing', 'Education'],
    description: 'Ultra-fast, high-efficiency multimodal workhorse designed for instantaneous response times, high-volume agent workflows, and seamless task automation.',
    strengths: [
      'Blazing fast sub-second time-to-first-token generation',
      'Incredible cost efficiency for high-frequency daily tasks',
      'Native multimodal support (image, audio, doc analysis)',
      'Sharp, crisp writing tone with high adherence to structured schema'
    ],
    weaknesses: [
      'Not designed for deeply nested mathematical theorem proofs (use Gemini Pro or R1)',
      'May produce summarized code for extremely large multi-module repositories'
    ],
    inputTypes: ['Text', 'Images', 'Audio', 'PDFs', 'Video'],
    outputTypes: ['Text', 'JSON', 'Markdown', 'Code'],
    speedRating: 5,
    qualityRating: 4,
    costCategory: 'Very Low ($)',
    contextCapability: '1,000,000 tokens',
    scores: {
      video: 30,
      image: 35,
      writing: 94,
      coding: 89,
      reasoning: 90,
      context: 98,
      easeOfUse: 98,
      speed: 98,
      costEfficiency: 98
    },
    benchmarkScore: {
      name: 'LMSYS Speed/Latency Ranking',
      value: 'Sub-250ms',
      verifiedDate: '2026-03-12',
      description: '#1 fastest response time among frontier models.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-15',
    isTrending: true,
    isNew: true,
    badge: 'Blazing Fast & Efficient',
    iconName: 'Zap',
    color: '#EAB308'
  },

  // 10. OpenAI GPT-4o
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'AI Writing',
    supportedTasks: ['AI Writing', 'Business', 'Marketing', 'Presentation', 'Education', 'Social Media'],
    description: 'OpenAI’s flagship omni model combining native text, audio, and visual intelligence with broad general knowledge and versatile creative styling.',
    strengths: [
      'High conversational empathy, nuanced humor, and tone modulation',
      'Broad general knowledge spanning virtually every industry domain',
      'Native voice conversation and document parsing capabilities',
      'Excellent structured JSON formatting and function calling'
    ],
    weaknesses: [
      'Context window limited to 128k (compared to Gemini’s 2M)',
      'More expensive per token than Flash or DeepSeek alternatives'
    ],
    inputTypes: ['Text', 'Images', 'Audio', 'PDFs'],
    outputTypes: ['Text', 'JSON', 'Code', 'Voice Output'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: '128,000 tokens',
    scores: {
      video: 25,
      image: 35,
      writing: 96,
      coding: 92,
      reasoning: 92,
      context: 86,
      easeOfUse: 97,
      speed: 88,
      costEfficiency: 82
    },
    benchmarkScore: {
      name: 'LMSYS Chatbot Arena Elo',
      value: 1335,
      verifiedDate: '2026-02-28',
      description: 'Consistent top-tier performer in creative and conversational tasks.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-01',
    isTrending: false,
    isNew: false,
    badge: 'Versatile Flagship',
    iconName: 'MessageSquare',
    color: '#10B981'
  },

  // 11. Suno v3.5 / v4
  {
    id: 'suno-v3-5',
    name: 'Suno v3.5',
    provider: 'Suno',
    category: 'Audio & Music',
    supportedTasks: ['Audio & Music', 'Marketing', 'YouTube', 'Social Media'],
    description: 'Leading generative music engine capable of producing full 4-minute songs with radio-ready vocals, instrumentals, verse-chorus structure, and genre blending.',
    strengths: [
      'Creates complete radio-quality songs with convincing vocal singing',
      'Deep understanding of musical genres, tempos, and emotional vibes',
      'Supports custom user lyrics, verse/chorus tags, and instrumental solos',
      'High fidelity stem separation and track extensions'
    ],
    weaknesses: [
      'Occasional minor robotic timbre on high vocal registers',
      'Cannot edit a single note or drum beat in a classical DAW manner',
      'Generates fixed stereo audio rather than isolated MIDI tracks'
    ],
    inputTypes: ['Text Prompt', 'Custom Lyrics', 'Style Tags'],
    outputTypes: ['Audio (MP3/WAV)', 'Full 4-minute song with vocals'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: 'Lyric & Arrangement formatting',
    scores: {
      video: 0,
      image: 0,
      writing: 50,
      coding: 0,
      reasoning: 40,
      context: 40,
      easeOfUse: 95,
      speed: 82,
      costEfficiency: 85
    },
    benchmarkScore: {
      name: 'Musicality & Retention Index',
      value: '94.6%',
      verifiedDate: '2026-02-18',
      description: 'Top-ranked for full vocal song generation and melodic stickiness.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-02-26',
    isTrending: true,
    isNew: false,
    badge: 'Full Song Creator',
    iconName: 'Music',
    color: '#F59E0B'
  },

  // 12. ElevenLabs Multilingual v2
  {
    id: 'elevenlabs-v2',
    name: 'ElevenLabs Speech',
    provider: 'ElevenLabs',
    category: 'Voice',
    supportedTasks: ['Voice', 'YouTube', 'Storytelling', 'Marketing', 'Education'],
    description: 'Gold standard AI voice synthesizer delivering hyper-realistic human inflections, emotional cadence, laughter, pauses, and instant voice cloning in 29+ languages.',
    strengths: [
      'Indistinguishable from professional human voice actors',
      'Controls for emotional intensity, stability, and style exaggeration',
      'Instant voice cloning from a 60-second audio clip',
      'Ultra-low-latency streaming API for conversational agents'
    ],
    weaknesses: [
      'Credit consumption can be costly for 10+ hour audiobook batches',
      'Requires clean microphone reference audio for high-fidelity cloning'
    ],
    inputTypes: ['Text', 'Audio Reference (Voice Clone)'],
    outputTypes: ['Audio (MP3/PCM/WAV)', 'Ultra-realistic Speech'],
    speedRating: 5,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: 'SSML and emotional prompt tags',
    scores: {
      video: 0,
      image: 0,
      writing: 20,
      coding: 0,
      reasoning: 45,
      context: 50,
      easeOfUse: 96,
      speed: 94,
      costEfficiency: 84
    },
    benchmarkScore: {
      name: 'Mean Opinion Score (MOS) Naturalness',
      value: '4.85 / 5.0',
      verifiedDate: '2026-02-22',
      description: 'Highest naturalness rating across all speech generation benchmarks.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-05',
    isTrending: true,
    isNew: false,
    badge: 'Voice Realism Gold Standard',
    iconName: 'Mic',
    color: '#8B5CF6'
  },

  // 13. OpenAI o3-mini
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'OpenAI',
    category: 'Coding',
    supportedTasks: ['Coding', 'Research', 'Data Analysis', 'Education'],
    description: 'Cost-efficient STEM reasoning model tailored for math, competitive programming, and complex multi-step logical refactoring.',
    strengths: [
      'Configurable reasoning effort (Low, Medium, High)',
      'Substantial speed improvement over older o1 models',
      'Excellent algorithm design and bug detection in complex logic',
      'High accuracy on competitive coding problems (Codeforces 2000+)'
    ],
    weaknesses: [
      'Does not support image inputs (text/code only)',
      'Less engaging tone for creative storytelling or marketing'
    ],
    inputTypes: ['Text', 'Code'],
    outputTypes: ['Code', 'Text', 'Reasoning Steps'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Very Low ($)',
    contextCapability: '200,000 tokens',
    scores: {
      video: 0,
      image: 0,
      writing: 82,
      coding: 97,
      reasoning: 98,
      context: 92,
      easeOfUse: 92,
      speed: 84,
      costEfficiency: 95
    },
    benchmarkScore: {
      name: 'Codeforces Rating Equivalent',
      value: '2100+',
      verifiedDate: '2026-02-25',
      description: 'Master tier in automated competitive algorithm solving.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-02',
    isTrending: true,
    isNew: true,
    badge: 'Fast Reasoning & STEM',
    iconName: 'Terminal',
    color: '#10B981'
  },

  // 14. Perplexity Sonar
  {
    id: 'perplexity-sonar',
    name: 'Perplexity Sonar Deep',
    provider: 'Perplexity AI',
    category: 'Research',
    supportedTasks: ['Research', 'Business', 'Education', 'Productivity'],
    description: 'Real-time conversational search and synthesized deep research engine with live citations, multi-source verification, and up-to-the-minute web grounding.',
    strengths: [
      'Inline numbered citations linking to primary live sources',
      'Zero hallucination on current news and recent market shifts',
      'Automatic query decomposition and multi-angle web crawling',
      'Structured executive summaries with domain-specific citations'
    ],
    weaknesses: [
      'Not optimized for generating raw code libraries from scratch',
      'Focuses on factual research rather than creative fiction'
    ],
    inputTypes: ['Text Question', 'URLs / Domain Filters'],
    outputTypes: ['Grounded Summary', 'Citations', 'Bullet Points'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Low ($)',
    contextCapability: 'Live Web Scraping + 128k context',
    scores: {
      video: 0,
      image: 0,
      writing: 92,
      coding: 78,
      reasoning: 93,
      context: 95,
      easeOfUse: 98,
      speed: 88,
      costEfficiency: 92
    },
    benchmarkScore: {
      name: 'Factual Accuracy with Live Grounding',
      value: '98.1%',
      verifiedDate: '2026-03-09',
      description: 'Top verified score for zero-hallucination web research.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-03-12',
    isTrending: true,
    isNew: false,
    badge: 'Live Web Research #1',
    iconName: 'Globe',
    color: '#0EA5E9'
  },

  // 15. Kling 1.5
  {
    id: 'kling-1-5',
    name: 'Kling 1.5 HD',
    provider: 'Kuaishou',
    category: 'AI Video',
    supportedTasks: ['AI Video', 'Animation', 'YouTube'],
    description: 'High-dynamics video generation model renowned for fluid human motion, complex physical interactions, and long continuous camera shots.',
    strengths: [
      'Incredible human motion mechanics (dancing, running, facial expressions)',
      'Generates clips up to 10 seconds in full 1080p in high-def mode',
      'Strong physical object interaction (eating, pouring, turning)',
      'Competitive rendering speed'
    ],
    weaknesses: [
      'Interface and support primarily centered around Asian infrastructure',
      'Occasional minor distortion on fast background objects'
    ],
    inputTypes: ['Text', 'Image (Image-to-Video)'],
    outputTypes: ['Video (MP4)', '1080p HD', '16:9 / 9:16'],
    speedRating: 4,
    qualityRating: 5,
    costCategory: 'Moderate ($$)',
    contextCapability: '10-second high-dynamics video generation',
    scores: {
      video: 93,
      image: 82,
      writing: 10,
      coding: 5,
      reasoning: 68,
      context: 60,
      easeOfUse: 86,
      speed: 80,
      costEfficiency: 84
    },
    benchmarkScore: {
      name: 'Human Motion Realism Score',
      value: '93.2%',
      verifiedDate: '2026-02-14',
      description: 'Outstanding performance on complex limb movement and physics.'
    },
    latestVerifiedStatus: 'Verified Active',
    lastUpdatedDate: '2026-02-25',
    isTrending: false,
    isNew: false,
    badge: 'Fluid Human Dynamics',
    iconName: 'Video',
    color: '#E11D48'
  }
];
