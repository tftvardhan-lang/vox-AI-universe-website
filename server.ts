import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_MODELS, INITIAL_CATEGORIES } from './src/data/models';
import { matchModelsLocally, generateOptimizedPrompt } from './src/services/recommendationEngine';
import { AIModel } from './src/types';
import { SubscriptionDb } from './server/subscriptionDb';
import { GooglePlayService } from './server/googlePlayService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to authenticate user from request
function getUserId(req: express.Request): string {
  const headerId = req.headers['x-user-id'];
  if (typeof headerId === 'string' && headerId.trim()) return headerId.trim();
  if (req.body?.userId && typeof req.body.userId === 'string') return req.body.userId.trim();
  return 'usr-default';
}

// In-memory scalable model store initialized with verified data
let modelsStore: AIModel[] = [...INITIAL_MODELS];
let categoriesStore = [...INITIAL_CATEGORIES];

// Lazy initialization of Gemini API client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return geminiClient;
}

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    modelsCount: modelsStore.length,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Get all AI models
app.get('/api/models', (req, res) => {
  res.json({
    success: true,
    data: modelsStore,
    total: modelsStore.length
  });
});

// Admin: Add new AI model
app.post('/api/models', (req, res) => {
  try {
    const newModel: AIModel = req.body;
    if (!newModel.id || !newModel.name || !newModel.provider) {
      return res.status(400).json({ success: false, error: 'Missing required model fields (id, name, provider).' });
    }
    const exists = modelsStore.some(m => m.id === newModel.id);
    if (exists) {
      return res.status(409).json({ success: false, error: `Model with ID ${newModel.id} already exists.` });
    }
    modelsStore.unshift(newModel);
    res.status(201).json({ success: true, data: newModel });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// Admin: Update model
app.put('/api/models/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = modelsStore.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    modelsStore[index] = { ...modelsStore[index], ...req.body, id };
    res.json({ success: true, data: modelsStore[index] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// Admin: Delete model
app.delete('/api/models/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = modelsStore.length;
    modelsStore = modelsStore.filter(m => m.id !== id);
    if (modelsStore.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    res.json({ success: true, message: `Model ${id} deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// Admin: Reset to default verified database
app.post('/api/admin/reset', (req, res) => {
  modelsStore = [...INITIAL_MODELS];
  res.json({ success: true, message: 'Models reset to initial database.', data: modelsStore });
});

// Get task categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: categoriesStore });
});

// Main Match Endpoint
app.post('/api/match', async (req, res) => {
  const userId = getUserId(req);
  const entitlements = SubscriptionDb.getEntitlements(userId);

  // Check if free user has exhausted free search limit
  if (!entitlements.canSearch && entitlements.plan === 'free') {
    return res.status(403).json({
      success: false,
      code: 'FREE_LIMIT_REACHED',
      error: "You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.",
      freeSearchesUsed: entitlements.freeSearchesUsed,
      freeSearchLimit: entitlements.freeSearchLimit,
      remainingSearches: 0
    });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ success: false, error: 'A prompt or task description is required.' });
  }

  const cleanPrompt = prompt.trim();
  const localMatch = matchModelsLocally(cleanPrompt, modelsStore);

  // If Gemini API is available, enhance with AI reasoning and model-tailored prompt optimization
  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the backend AI recommendation engine for "MODEL MATCH AI".
The user wants to accomplish the following task:
"${cleanPrompt}"

The top candidate model identified is:
Name: ${localMatch.bestModel.name}
Category: ${localMatch.bestModel.category}
Provider: ${localMatch.bestModel.provider}
Strengths: ${localMatch.bestModel.strengths.join(', ')}

Please provide:
1. A concise, authoritative paragraph explaining WHY this model is the absolute best match for this specific task (mentioning its unique architecture or capability).
2. A high-quality, professional, ready-to-run OPTIMIZED PROMPT engineered specifically for ${localMatch.bestModel.name}. If it's video or image, include precise cinematic parameters (lens, lighting, camera motion, aspect ratio, textures). If coding, include architecture and error handling rules. If research, include grounded citation requirements.
3. A 1-sentence explanation of what was optimized.

Format your response as valid JSON with keys:
"whyRecommended": string,
"optimizedPrompt": string,
"promptOptimizationExplanation": string`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.whyRecommended) localMatch.whyRecommended = parsed.whyRecommended;
        if (parsed.optimizedPrompt) localMatch.optimizedPrompt = parsed.optimizedPrompt;
        if (parsed.promptOptimizationExplanation) localMatch.promptOptimizationExplanation = parsed.promptOptimizationExplanation;
      }
    } catch (geminiError) {
      console.warn('Gemini match enhancement fallback to local rule engine:', geminiError);
    }
  }

  // Deduct/increment search counter for Free tier users on backend
  let usage = {
    freeSearchesUsed: entitlements.freeSearchesUsed,
    freeSearchLimit: entitlements.freeSearchLimit,
    remainingSearches: entitlements.remainingSearches,
    isPaid: entitlements.isPaid,
    plan: entitlements.plan
  };

  if (!entitlements.isPaid) {
    const incResult = SubscriptionDb.incrementFreeSearches(userId);
    usage = {
      freeSearchesUsed: incResult.used,
      freeSearchLimit: incResult.limit,
      remainingSearches: Math.max(0, incResult.limit - incResult.used),
      isPaid: false,
      plan: 'free'
    };
  }

  res.json({
    success: true,
    data: localMatch,
    usage
  });
});

// Improve / Refine Prompt Endpoint
app.post('/api/improve-prompt', async (req, res) => {
  const { prompt, modelId, refinementStyle, customInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Original prompt is required.' });
  }

  const targetModel = modelsStore.find(m => m.id === modelId) || modelsStore[0];
  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemPrompt = `You are a world-class prompt engineering specialist for AI model: ${targetModel.name} (${targetModel.category}).
Refine and improve this prompt according to the user's refinement goal.
Refinement angle: ${refinementStyle || 'Comprehensive polish'}
Custom notes: ${customInstruction || 'Maximize output quality, precision, and adherence'}

Original prompt:
"""
${prompt}
"""

Return JSON:
{
  "improvedPrompt": "the complete rewritten prompt",
  "changesMade": "summary of specific improvements added (e.g. camera framing, edge cases, negative constraints)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: systemPrompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        data: {
          improvedPrompt: parsed.improvedPrompt || prompt,
          changesMade: parsed.changesMade || 'Refined prompt with high-precision directives.'
        }
      });
    } catch (err) {
      console.warn('Gemini prompt improvement error, falling back:', err);
    }
  }

  // Fallback improvement logic
  let improvedPrompt = prompt;
  let changesMade = 'Applied model-specific quality enhancements and structural parameters.';

  if (refinementStyle === 'cinematic') {
    improvedPrompt = `${prompt}\n\n[Cinematic Directives]: 35mm anamorphic, 4K HDR, subtle film grain, dramatic three-point studio lighting, golden hour volumetric atmosphere, smooth 24fps motion, hyper-realistic depth of field.`;
    changesMade = 'Added lens specs, volumetric lighting, and cinematography parameters.';
  } else if (refinementStyle === 'coding') {
    improvedPrompt = `${prompt}\n\n[Engineering Mandates]: Production-ready TypeScript/Python, strict typing, complete error handling, unit test specifications, zero truncation or placeholder comments.`;
    changesMade = 'Added architectural mandates, strict typing, and defensive edge-case handling.';
  } else if (refinementStyle === 'concise') {
    improvedPrompt = `${prompt}\n\n[Execution Constraint]: High density, zero fluff, direct executive answers only.`;
    changesMade = 'Enforced strict conciseness and eliminated conversational filler.';
  } else {
    improvedPrompt = `${prompt}\n\n[Quality Directives]: Maximize fidelity, verify all constraints, ensure professional grade execution with clear structure.`;
    changesMade = 'Elevated prompt precision and quality constraints.';
  }

  res.json({
    success: true,
    data: { improvedPrompt, changesMade }
  });
});

// ----------------- SUBSCRIPTION & GOOGLE PLAY BILLING API ----------------- //

// 1. Get Authoritative Products (Client uses Google Play prices/badges)
app.get('/api/subscriptions/products', (req, res) => {
  const products = GooglePlayService.getProducts();
  res.json({ success: true, data: products });
});

// 2. Get User Subscription Status & Entitlements
app.get('/api/subscriptions/status', (req, res) => {
  const userId = getUserId(req);
  const user = SubscriptionDb.getUserOrCreate(userId);
  const subscription = SubscriptionDb.getActiveSubscription(userId);
  const entitlements = SubscriptionDb.getEntitlements(userId);
  const products = GooglePlayService.getProducts();

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      freeSearchesUsed: user.freeSearchesUsed,
      freeSearchLimit: user.freeSearchLimit
    },
    subscription,
    entitlements,
    products
  });
});

// 3. Verify Google Play Purchase Token (Official server-side verification)
app.post('/api/subscriptions/verify', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, purchaseToken, orderId, packageName } = req.body;

    if (!productId || !purchaseToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required purchase verification fields (productId, purchaseToken).'
      });
    }

    const verificationResult = await GooglePlayService.verifyPurchase({
      userId,
      productId,
      purchaseToken,
      orderId,
      packageName
    });

    const entitlements = SubscriptionDb.getEntitlements(userId);

    res.json({
      ...verificationResult,
      entitlements
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Purchase verification server error'
    });
  }
});

// 4. Restore Purchases
app.post('/api/subscriptions/restore', async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await GooglePlayService.restorePurchases(userId);
    const entitlements = SubscriptionDb.getEntitlements(userId);

    res.json({
      ...result,
      entitlements
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Restore purchases error' });
  }
});

// 5. Cancel Subscription (User stops auto-renewal via Google Play)
app.post('/api/subscriptions/cancel', (req, res) => {
  const userId = getUserId(req);
  const result = SubscriptionDb.cancelSubscription(userId);
  const entitlements = SubscriptionDb.getEntitlements(userId);
  res.json({
    ...result,
    entitlements
  });
});

// 6. Google Play Real-Time Developer Notifications (RTDN Webhook)
app.post('/api/subscriptions/google-play-rtdn', async (req, res) => {
  const result = await GooglePlayService.processRTDN(req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// 7. Admin: Get Subscription Dashboard Stats & Audit Logs
app.get('/api/admin/subscriptions', (req, res) => {
  const stats = SubscriptionDb.getAdminStats();
  res.json({ success: true, data: stats });
});

// 8. Admin: Execute Google Play Test Scenario
app.post('/api/admin/subscriptions/test-scenario', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { scenario } = req.body;
    if (!scenario) {
      return res.status(400).json({ success: false, error: 'Scenario name is required.' });
    }

    const result = await GooglePlayService.executeTestScenario(userId, scenario);
    const entitlements = SubscriptionDb.getEntitlements(userId);

    res.json({
      success: true,
      data: result,
      entitlements
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Admin: Audited Plan Adjustment
app.post('/api/admin/subscriptions/action', (req, res) => {
  try {
    const adminEmail = (req.headers['x-admin-email'] as string) || 'admin@modelmatch.ai';
    const { userId, action, reason, plan } = req.body;

    if (!userId || !action || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required audit fields (userId, action, reason).'
      });
    }

    const result = SubscriptionDb.adminAuditedAction(adminEmail, userId, action, reason, plan);
    const entitlements = SubscriptionDb.getEntitlements(userId);

    res.json({
      success: true,
      data: result,
      entitlements
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ----------------- VITE MIDDLEWARE / STATIC SERVING ----------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MODEL MATCH AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
