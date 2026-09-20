import { AIModel, MatchResult, ModelAlternative } from '../types';
import { INITIAL_MODELS, INITIAL_CATEGORIES } from '../data/models';

interface TaskFeatures {
  category: string;
  isCinematicVideo: boolean;
  isVideo: boolean;
  isImage: boolean;
  isThumbnail: boolean;
  isCoding: boolean;
  isResearch: boolean;
  isDataAnalysis: boolean;
  isAudio: boolean;
  isVoice: boolean;
  isPresentation: boolean;
  isWriting: boolean;
  needsRealism: boolean;
  needsTextInImage: boolean;
  needsLargeContext: boolean;
  needsDeepReasoning: boolean;
  needsFastSpeed: boolean;
  needsLiveWeb: boolean;
  isTooVague: boolean;
  complexity: 'simple' | 'medium' | 'high';
}

export function analyzeTaskFeatures(prompt: string): TaskFeatures {
  const p = prompt.toLowerCase().trim();
  const words = p.split(/\s+/).filter(Boolean);

  const isTooVague = words.length <= 2 && !p.includes('cinematic') && !p.includes('python') && !p.includes('flux');

  const isCinematicVideo = /(cinematic|hollywood|camera|drone|film|movie|vfx|pan|panning|slow-motion|4k video)/i.test(p);
  const isVideo = isCinematicVideo || /(video|animation|animate|clip|render video|runway|veo|sora|kling)/i.test(p);
  const isThumbnail = /(thumbnail|youtube thumbnail|yt thumbnail|cover art|badge|logo with text)/i.test(p);
  const isImage = !isVideo && (isThumbnail || /(image|photo|picture|photoreal|portrait|illustration|render|wallpaper|art|flux|midjourney)/i.test(p));
  const isCoding = /(code|python|react|typescript|javascript|backend|frontend|api|sql|bug|refactor|database|algorithm|css|html|app|script|function|github)/i.test(p);
  const isResearch = /(research|literature|paper|citations|benchmark|compare models|factual|verify|investigate|study|market analysis)/i.test(p);
  const isDataAnalysis = /(data|dataset|csv|excel|parquet|statistics|monte carlo|churn|variance|metric|dashboard)/i.test(p);
  const isAudio = /(music|song|track|synthwave|melody|beat|lyrics|audio track|compose|suno|udio)/i.test(p);
  const isVoice = !isAudio && /(voice|voiceover|narration|speech|speak|podcast clone|elevenlabs|accent|audiobook)/i.test(p);
  const isPresentation = /(presentation|pitch deck|slide|slides|keynote|powerpoint|deck outline)/i.test(p);
  const isWriting = !isCoding && !isResearch && (/(write|draft|email|essay|article|copy|script|story|blog|post|linkedin|tweet|outreach|proposal)/i.test(p) || words.length > 10);

  const needsRealism = /(realistic|photoreal|hyperrealistic|studio|authentic|unreal engine|8k)/i.test(p);
  const needsTextInImage = /(text|typography|title|lettering|words|spelled|sign|label|ctr)/i.test(p) && (isImage || isThumbnail);
  const needsLargeContext = /(pdf|document|entire repo|book|100 pages|transcript|hours|large file|huge)/i.test(p);
  const needsDeepReasoning = /(complex|math|theorem|proof|optimize|architect|logic|difficult|strategic)/i.test(p);
  const needsFastSpeed = /(fast|instant|quick|real-time|latency|sub-second|daily)/i.test(p);
  const needsLiveWeb = /(latest|recent|news|current|today|2026|live info)/i.test(p);

  let category = 'AI Writing';
  if (isVideo) category = 'AI Video';
  else if (isThumbnail) category = 'Thumbnails';
  else if (isImage) category = 'AI Image';
  else if (isCoding) category = 'Coding';
  else if (isDataAnalysis) category = 'Data Analysis';
  else if (isResearch) category = 'Research';
  else if (isAudio) category = 'Audio & Music';
  else if (isVoice) category = 'Voice';
  else if (isPresentation) category = 'Presentation';

  let complexity: 'simple' | 'medium' | 'high' = 'medium';
  if (words.length > 25 || needsDeepReasoning || needsLargeContext) complexity = 'high';
  else if (words.length < 6) complexity = 'simple';

  return {
    category,
    isCinematicVideo,
    isVideo,
    isImage,
    isThumbnail,
    isCoding,
    isResearch,
    isDataAnalysis,
    isAudio,
    isVoice,
    isPresentation,
    isWriting,
    needsRealism,
    needsTextInImage,
    needsLargeContext,
    needsDeepReasoning,
    needsFastSpeed,
    needsLiveWeb,
    isTooVague,
    complexity
  };
}

export function scoreModelForTask(model: AIModel, features: TaskFeatures, rawPrompt: string): number {
  let score = 50;

  // Domain match
  if (features.isVideo) {
    score = model.scores.video * 0.75 + model.scores.easeOfUse * 0.15 + (model.qualityRating * 2);
    if (features.isCinematicVideo && model.id === 'google-veo-3-1') score += 12;
    if (features.isCinematicVideo && model.id === 'runway-gen-3') score += 8;
    if (model.scores.video < 30) score -= 60; // Penalize non-video
  } else if (features.isThumbnail) {
    if (model.id === 'ideogram-2-0') score = 96;
    else if (model.id === 'flux-1-pro') score = 93;
    else if (model.id === 'midjourney-v6-1') score = 89;
    else score = (model.scores.image * 0.6) - 20;
  } else if (features.isImage) {
    score = model.scores.image * 0.75 + model.scores.easeOfUse * 0.15 + (model.qualityRating * 2);
    if (features.needsTextInImage && model.id === 'ideogram-2-0') score += 10;
    if (features.needsRealism && model.id === 'flux-1-pro') score += 10;
    if (!features.needsRealism && model.id === 'midjourney-v6-1') score += 8;
    if (model.scores.image < 30) score -= 60;
  } else if (features.isCoding) {
    score = model.scores.coding * 0.7 + model.scores.reasoning * 0.2 + model.scores.speed * 0.1;
    if (model.id === 'claude-3-7-sonnet') score += 6;
    if (features.needsFastSpeed && model.id === 'gemini-3-8-flash') score += 8;
    if (features.complexity === 'high' && (model.id === 'claude-3-7-sonnet' || model.id === 'o3-mini')) score += 5;
    if (model.scores.coding < 30) score -= 60;
  } else if (features.isResearch) {
    score = model.scores.reasoning * 0.45 + model.scores.context * 0.35 + model.scores.writing * 0.2;
    if (features.needsLiveWeb && model.id === 'perplexity-sonar') score += 15;
    if (features.needsLargeContext && model.id === 'gemini-3-1-pro') score += 14;
    if (features.needsDeepReasoning && (model.id === 'deepseek-r1' || model.id === 'gemini-3-1-pro')) score += 8;
  } else if (features.isAudio) {
    if (model.id === 'suno-v3-5') score = 96;
    else score = 20;
  } else if (features.isVoice) {
    if (model.id === 'elevenlabs-v2') score = 97;
    else score = 25;
  } else if (features.isDataAnalysis) {
    score = model.scores.reasoning * 0.4 + model.scores.coding * 0.3 + model.scores.context * 0.3;
    if (model.id === 'claude-3-7-sonnet' || model.id === 'gemini-3-1-pro') score += 6;
  } else {
    // General writing / Productivity
    score = model.scores.writing * 0.5 + model.scores.reasoning * 0.3 + model.scores.speed * 0.2;
    if (features.needsFastSpeed && model.id === 'gemini-3-8-flash') score += 8;
    if (model.id === 'claude-3-7-sonnet' || model.id === 'gpt-4o') score += 5;
  }

  // Bonus for context if large doc mentioned
  if (features.needsLargeContext && model.contextCapability.includes('2,000,000')) {
    score += 8;
  }

  // Cap between 20 and 97 to keep scores realistic and grounded
  return Math.min(97, Math.max(25, Math.round(score)));
}

export function generateOptimizedPrompt(model: AIModel, originalPrompt: string, category: string): { prompt: string; explanation: string } {
  const p = originalPrompt.trim();

  if (model.category === 'AI Video' || model.id.includes('veo') || model.id.includes('runway')) {
    return {
      prompt: `Cinematic 1080p 24fps shot: ${p}. 
Shot on 35mm anamorphic lens, shallow depth of field (f/2.8), subtle volumetric haze. 
Camera movement: smooth forward dolly with controlled low-angle tilt, steady gimbal stabilization. 
Lighting: high-contrast chiaroscuro key lighting, golden hour ambient rim light, natural specular highlights. 
Atmosphere: ultra-detailed visual textures, realistic physical momentum, no temporal warping, film grain preserved.`,
      explanation: `Optimized specifically for ${model.name}'s temporal video engine by defining camera motion trajectory (dolly + tilt), lens physics (35mm f/2.8), framerate, and lighting parameters.`
    };
  }

  if (model.category === 'Thumbnails' || model.id === 'ideogram-2-0') {
    return {
      prompt: `High-CTR YouTube thumbnail, vibrant graphic design composition: ${p}. 
Foreground: prominent high-contrast focal subject with expressive lighting and crisp silhouette. 
Typography: bold 3D extruded metallic text reading "${p.length > 25 ? 'EXPLAINED' : p.toUpperCase()}", clean sans-serif typography, vibrant electric glow outline. 
Color palette: obsidian dark background with hyper-saturated electric cyan and warm amber contrast. 
16:9 aspect ratio, clean studio depth, click-optimized readability at mobile scale.`,
      explanation: `Configured for ${model.name}'s industry-leading typography and graphic layout engine with high-contrast text layering and mobile-legible hierarchy.`
    };
  }

  if (model.category === 'AI Image' || model.id === 'flux-1-pro' || model.id === 'midjourney-v6-1') {
    return {
      prompt: `Editorial hyper-realistic photograph: ${p}. 
Captured on Hasselblad H6D-100c, 85mm prime lens, f/1.8 aperture. 
Natural softbox three-point studio lighting, authentic subsurface scattering, rich tactile micro-textures, true-to-life reflections and fine detail. 
Color graded in cinematic Arri color profile, deep balanced shadows, clean highlight roll-off. Masterpiece composition, 8k resolution.`,
      explanation: `Crafted for ${model.name}'s photorealistic diffusion transformer using camera sensor specs, optical focal lengths, and nuanced material texture descriptors.`
    };
  }

  if (model.category === 'Coding' || model.id.includes('claude') || model.id.includes('deepseek') || model.id.includes('o3')) {
    return {
      prompt: `You are an elite principal software engineer and systems architect.
Task: ${p}

Requirements & Constraints:
1. Architecture: Provide a production-ready, clean, modular solution with strict type safety (TypeScript / modern Python 3.12+).
2. Robustness: Include thorough error handling, input validation, and defensive edge-case recovery.
3. Performance: Optimize time and space complexity; avoid redundant computations or memory leaks.
4. Testing: Include unit test fixtures demonstrating core logic coverage.
5. Structure: Briefly explain architectural trade-offs, then present the complete, self-contained, and runnable implementation without pseudo-code placeholders.`,
      explanation: `Tailored for ${model.name}'s hybrid reasoning strengths by setting rigorous engineering constraints, edge-case validation, and zero-placeholder output mandates.`
    };
  }

  if (model.category === 'Research' || model.id === 'perplexity-sonar' || model.id === 'gemini-3-1-pro') {
    return {
      prompt: `Perform an exhaustive, multi-perspective investigative research synthesis on:
"${p}"

Structure your response into:
1. Executive Summary: Core thesis and pivotal 2026 developments.
2. Verified Evidence Matrix: Direct citations, methodology comparisons, and quantitative benchmarks.
3. Counter-Theses & Technical Caveats: Critical limitations or competing viewpoints.
4. Forward Outlook: Concrete strategic implications and unanswered industry questions.
Ground every factual claim in verifiable primary sources. Avoid promotional generalities.`,
      explanation: `Structured for ${model.name}'s deep contextual synthesis and citation-grounded verification engine with explicit counter-factual analysis.`
    };
  }

  if (model.category === 'Audio & Music' || model.id === 'suno-v3-5') {
    return {
      prompt: `[Genre: Modern Cyberpunk Synthwave / Indie Electro-Pop]
[Tempo: 124 BPM, Driving 4/4 meter]
[Instrumentation: Heavy analog Moog bassline, shimmer chorus guitar, Roland Juno pads, punchy side-chained kick]
[Mood: Nocturnal, melancholic yet energetic, soaring melodic hook]

[Verse 1]
${p}

[Chorus]
Dynamic crescendo, full vocal harmony, anthemic lead melody with stereo width`,
      explanation: `Arranged with ${model.name}'s native structural arrangement brackets ([Genre], [Tempo], [Instruments], [Verse], [Chorus]) for optimal melody composition.`
    };
  }

  if (model.category === 'Voice' || model.id === 'elevenlabs-v2') {
    return {
      prompt: `[Tone: Confident, articulate, warm narrative timbre]
[Pacing: Deliberate, 130 words per minute, expressive pauses for suspense]
[Accent: British RP / Neutral Mid-Atlantic]

"${p}"

[Pause: 1.2s] Ensure clear enunciation on key terminology, soft natural breaths between sentences, and genuine vocal authority.`,
      explanation: `Formatted with emotional inflection brackets and cadence pacing markers designed for ${model.name}'s neural speech synthesizer.`
    };
  }

  // Default general prompt
  return {
    prompt: `Act as a top-tier domain specialist.
Request: ${p}

Please deliver a high-impact, polished response adhering to:
- Direct, high-signal clarity without introductory filler
- Deep technical or creative substance tailored to professional standards
- Actionable, structured breakdown with clear hierarchy and concrete examples`,
    explanation: `Enhanced with direct high-signal formatting and conversational fluff reduction optimized for ${model.name}.`
  };
}

export function matchModelsLocally(prompt: string, modelsList: AIModel[] = INITIAL_MODELS): MatchResult {
  const features = analyzeTaskFeatures(prompt);

  // If too vague, provide clarification
  const clarificationNeeded = features.isTooVague;
  const clarificationQuestions = clarificationNeeded ? [
    'What format do you need (e.g. Video, Image, Working Code, Audio, or Written Doc)?',
    'What is your target audience or primary use case?'
  ] : undefined;

  // Score all models
  const scoredModels = modelsList.map(model => ({
    model,
    score: scoreModelForTask(model, features, prompt)
  })).sort((a, b) => b.score - a.score);

  const best = scoredModels[0] || { model: modelsList[0], score: 90 };
  const bestModel = best.model;
  const bestScore = best.score;

  // Alternatives: next 3 models with distinct providers/angles
  const remaining = scoredModels.slice(1, 5);
  const alternatives: ModelAlternative[] = remaining.map((item, index) => {
    let diff = 'Alternative specialized workflow';
    if (item.model.speedRating > bestModel.speedRating) diff = 'Faster generation latency';
    else if (item.model.costCategory === 'Free' || item.model.costCategory.includes('Low')) diff = 'Lower inference / token cost';
    else if (item.model.contextCapability.includes('2,000,000')) diff = 'Significantly larger context memory';
    else if (item.model.strengths[0]) diff = item.model.strengths[0];

    return {
      model: item.model,
      matchScore: Math.min(bestScore - (3 + index * 4), Math.max(68, item.score)),
      whyAlternative: `Strong secondary contender offering ${item.model.strengths.slice(0, 2).join(' and ')}.`,
      differentiator: diff
    };
  });

  const { prompt: optimizedPrompt, explanation } = generateOptimizedPrompt(bestModel, prompt, features.category);

  // Rationale
  let whyRecommended = `Selected for this task because ${bestModel.name} exhibits top-tier performance in ${features.category}. It delivers ${bestModel.strengths[0].toLowerCase()} and ${bestModel.strengths[1]?.toLowerCase() || 'exceptional reliability'}.`;
  if (features.isVideo) {
    whyRecommended = `Unmatched visual fidelity and camera trajectory control for video tasks. ${bestModel.name} excels at maintaining temporal consistency and physical realism without jarring frame warping.`;
  } else if (features.isCoding) {
    whyRecommended = `Ranked #1 for software engineering precision. ${bestModel.name} generates clean, idiomatic, fully typed code with zero hallucinations and state-of-the-art reasoning on complex logic.`;
  } else if (features.isImage) {
    whyRecommended = `Produces industry-leading image texture, natural lighting, and accurate prompt interpretation. It completely avoids synthetic plastic artifacts.`;
  } else if (features.isResearch) {
    whyRecommended = `Superior multi-document synthesis and grounded reasoning. Its massive context window and factual accuracy make it ideal for rigorous analytical research.`;
  }

  const isWeakMatch = bestScore < 70;
  const weakMatchReason = isWeakMatch
    ? `Your request is very broad or spans conflicting modalities. While ${bestModel.name} is the closest match, providing more details on output format will yield a more tailored model.`
    : undefined;

  return {
    id: 'match-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    originalPrompt: prompt,
    detectedCategory: features.category,
    bestModel,
    bestMatchScore: bestScore,
    whyRecommended,
    bestAt: bestModel.strengths.slice(0, 4),
    tradeOffs: bestModel.weaknesses.slice(0, 3),
    alternatives,
    optimizedPrompt,
    promptOptimizationExplanation: explanation,
    clarificationNeeded,
    clarificationQuestions,
    isWeakMatch,
    weakMatchReason,
    createdAt: new Date().toISOString()
  };
}
