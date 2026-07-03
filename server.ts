import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation, Modality } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with User-Agent for telemetry lazy-loaded to prevent startup crashes when GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('La variable de entorno GEMINI_API_KEY no está configurada. Por favor, configúrala en la sección de Settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Mock/cached storage for generated videos to persist state during the session
// We can use a JSON file or in-memory map. Let's use an in-memory store.
interface VideoOperation {
  id: string;
  dramaId: string;
  operationName: string;
  status: 'pending' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  createdAt: number;
}
const activeOperations: Record<string, VideoOperation> = {};

// Ensure we have API key
if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
}

// Helper to map fruit keywords/emojis to elegant cinematic slow-motion video loops
function getSimulatedVideoUrl(prompt: string = "", dramaId: string = ""): string {
  const combined = `${prompt} ${dramaId}`.toLowerCase();
  
  // Strawberry / Red Fruits
  if (combined.includes('strawberry') || combined.includes('fragaria') || combined.includes('🍓') || combined.includes('fresa') || combined.includes('cereza') || combined.includes('cherry')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-red-strawberries-splashing-into-water-43093-large.mp4';
  }
  // Lemons / Oranges / Citrus / Yellow Fruits
  if (combined.includes('lemon') || combined.includes('limón') || combined.includes('limon') || combined.includes('🍊') || combined.includes('orange') || combined.includes('mandarina') || combined.includes('cítrico') || combined.includes('citrico') || combined.includes('piña') || combined.includes('pina')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-slicing-a-fresh-lemon-on-a-cutting-board-42247-large.mp4';
  }
  // Grapes / Blueberries / Wine / Deep Tragedy
  if (combined.includes('grape') || combined.includes('uva') || combined.includes('🍇') || combined.includes('vino') || combined.includes('viñedo') || combined.includes('vitis') || combined.includes('blueberry') || combined.includes('arándano') || combined.includes('arandano')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-dropping-fresh-blueberries-into-water-43094-large.mp4';
  }
  // Generic Fallback (Elegant slow-motion water droplets on leaf, highly dramatic atmosphere)
  return 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-water-droplets-on-a-leaf-41656-large.mp4';
}

// 1. Start Video Generation (Veo 3.1)
app.post('/api/generate-video', async (req, res) => {
  const { dramaId, prompt, aspectRatio } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log(`Starting video generation for drama: ${dramaId} with prompt: "${prompt}"`);
    
    // We call the model specified by the platform: veo-3.1-fast-generate-preview
    const operation = await getAI().models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio || '16:9'
      }
    });

    const opId = `op-${Date.now()}`;
    activeOperations[opId] = {
      id: opId,
      dramaId,
      operationName: operation.name,
      status: 'pending',
      createdAt: Date.now()
    };

    console.log(`Started Veo 3.1 operation: ${operation.name}. Internal reference ID: ${opId}`);
    return res.json({ 
      id: opId, 
      operationName: operation.name, 
      status: 'pending',
      isSimulation: false
    });
  } catch (error: any) {
    console.error("Error during real Veo 3.1 generation:", error);
    return res.status(500).json({ 
      error: error.message || 'Failed to start video generation',
      details: error.details || null
    });
  }
});

// 2. Poll Video Generation Status
app.post('/api/video-status', async (req, res) => {
  const { id, operationName } = req.body;

  if (!operationName) {
    return res.status(400).json({ error: 'operationName is required' });
  }

  try {
    const op = new GenerateVideosOperation();
    op.name = operationName;
    
    console.log(`Polling status for operation: ${operationName}`);
    const updated = await getAI().operations.getVideosOperation({ operation: op });
    
    if (id && activeOperations[id]) {
      if (updated.done) {
        if (updated.error) {
          activeOperations[id].status = 'failed';
          activeOperations[id].error = (updated.error as any)?.message || String(updated.error);
        } else {
          activeOperations[id].status = 'completed';
          // Extract the direct stream URI
          const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;
          if (videoUri) {
            activeOperations[id].videoUrl = `/api/video-download?operationName=${encodeURIComponent(operationName)}`;
          }
        }
      }
    }

    return res.json({ 
      done: !!updated.done,
      error: updated.error ? ((updated.error as any).message || String(updated.error)) : null,
      status: updated.done ? (updated.error ? 'failed' : 'completed') : 'pending',
      videoUrl: updated.done && !updated.error ? `/api/video-download?operationName=${encodeURIComponent(operationName)}` : null,
      isSimulation: false
    });
  } catch (error: any) {
    console.error("Error polling video status:", error);
    return res.status(500).json({ error: error.message || 'Failed to get video status' });
  }
});

// 3. Download/Stream Video Content
app.get('/api/video-download', async (req, res) => {
  const operationName = req.query.operationName as string;
  if (!operationName) {
    return res.status(400).send('operationName parameter is required');
  }

  try {
    console.log(`Retrieving and streaming video from operation: ${operationName}`);
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await getAI().operations.getVideosOperation({ operation: op });
    
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).send('Video not found or not ready yet');
    }

    console.log(`Downloading original video stream from: ${uri}`);
    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to download video from Google: ${videoRes.statusText}`);
    }

    // Stream the binary data chunks to the Express client
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    if (videoRes.body) {
      const reader = videoRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    } else {
      const arrayBuffer = await videoRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    }
  } catch (error: any) {
    console.error("Error downloading/streaming video:", error);
    return res.status(500).send(`Failed to stream video: ${error.message}`);
  }
});

// 4. Generate custom dramatic scripts using Gemini Flash
app.post('/api/generate-script', async (req, res) => {
  const { fruits, conflict } = req.body;
  if (!fruits || !conflict) {
    return res.status(400).json({ error: 'Fruits and conflict parameters are required' });
  }

  try {
    console.log(`Generating dramatic script for: ${fruits} with conflict: ${conflict}`);
    
    const systemPrompt = `Eres un dramaturgo de élite galardonado, especializado en "Frutinovelas" (telenovelas trágicas cortas donde los personajes son frutas). 
Tu misión es escribir un guión teatral extremadamente dramático, apasionado y melancólico en base a las frutas y el conflicto proporcionado por el usuario.

Debes responder estrictamente en formato JSON válido que cumpla exactamente con el siguiente esquema:
{
  "title": "Un título dramático e impactante",
  "synopsis": "Una sinopsis muy dramática y poética (1-2 oraciones).",
  "genre": "El subgénero dramático (ej. Tragedia Pasional, Drama de época, Cine Negro)",
  "intensity": 95, // número del 0 al 100 representing el nivel de drama
  "icon": "Emoi de la fruta principal",
  "prompt": "Un prompt cinematográfico hiper-detallado en INGLÉS para Veo AI (un generador de video). Debe describir la escena de confrontación dramática entre las frutas con iluminación estilo claroscuro, lentes anamórficos, vapor o gotas de agua, y texturas hiperrealistas.",
  "characters": [
    { "name": "Nombre de Fruta 1", "role": "Protagonista", "description": "Breve descripción trágica" },
    { "name": "Nombre de Fruta 2", "role": "Antagonista/Amante", "description": "Breve descripción trágica" }
  ],
  "script": [
    { "character": "Nombre de Fruta 1", "emotion": "con el corazón roto, goteando jugo", "line": "¡Línea de diálogo intensa!" },
    { "character": "Nombre de Fruta 2", "emotion": "con amargura ácida", "line": "¡Línea de diálogo de respuesta!" }
  ]
}

Asegúrate de que los diálogos en español contengan gran teatralidad ("¡Oh!", "¡No me hables de dulzura!", "¡Nuestra pulpa se pudre!", etc.).
Devuelve SOLO el JSON, sin bloques de código Markdown ni explicaciones adicionales.`;

    const promptText = `Crea una frutinovela para:
Frutas: ${fruits}
Conflicto: ${conflict}`;

    const response = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const scriptData = JSON.parse(text.trim());
    return res.json(scriptData);
  } catch (error: any) {
    console.error("Error generating script:", error);
    return res.status(500).json({ error: error.message || 'Failed to generate custom script' });
  }
});

// 5. Generate Text-to-Speech audio for dramatic dialogue lines
app.post('/api/generate-tts', async (req, res) => {
  const { text, voice } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
  const selectedVoice = voice || 'Zephyr';

  try {
    console.log(`Generating dramatic voice for: "${text}" using voice: ${selectedVoice}`);
    
    const response = await getAI().models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with deep theatrical passion, intense dramatic emotion, and theatrical pause: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio data returned from Gemini TTS');
    }

    return res.json({ audio: base64Audio });
  } catch (error: any) {
    console.error("Error generating TTS:", error);
    return res.status(500).json({ error: error.message || 'Failed to generate voiceover' });
  }
});

// Integration of Vite in development or static serving in production
const PORT = 3000;

async function start() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve the built static assets from /dist
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In development, initialize and use Vite as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dramas de Frutas] Running full-stack server on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start server:", err);
});
