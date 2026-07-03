import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Film, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  Volume2, 
  Tv, 
  Activity, 
  Info, 
  X, 
  VolumeX,
  Flame,
  Award,
  ChevronRight,
  HelpCircle,
  Clock,
  Heart,
  MessageSquare,
  Trophy,
  Coins,
  Zap,
  Megaphone,
  Lock,
  Unlock,
  Copy,
  Check,
  Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ACTIVATION_CODES_LIST from './codes.json';

// Types matching server interface
interface Character {
  name: string;
  role: string;
  description: string;
}

interface ScriptLine {
  character: string;
  emotion?: string;
  line: string;
}

interface PlayScript {
  title: string;
  synopsis: string;
  genre: string;
  intensity: number;
  icon: string;
  prompt: string;
  characters: Character[];
  script: ScriptLine[];
}

// 4 incredible preloaded classic dramatic scenarios
const PRELOADED_DRAMAS: Record<string, PlayScript> = {
  strawberry: {
    title: "El Destino Amargo de Fragaria",
    synopsis: "Nacida bajo el sol de junio, pero destinada a un destino gélido. Una tragedia dulce con un final de crema batida y el inevitable avance del moho.",
    genre: "Tragedia Pasional",
    intensity: 88,
    icon: "🍓",
    prompt: "A highly-detailed cinematic shot of a single tragic strawberry sitting under a cold theater spotlight in a pitch black room, water droplets on its deep red skin, dark moody dramatic atmosphere, 16:9, film noir style, masterpiece",
    characters: [
      { name: "Fragaria x ananassa", role: "Protagonista", description: "Fresa madura y melancólica, orgullosa de su néctar." },
      { name: "El Moho Gris", role: "Antagonista", description: "Una sombra aterciopelada que lo consume todo lentamente." }
    ],
    script: [
      { character: "Fragaria x ananassa", emotion: "sollosando amargamente, perdiendo su brillo rojo", line: "¿Por qué me miras así? ¿Es mi madurez un crimen, o es que ansías ver cómo mi pulpa se rinde ante el frío?" },
      { character: "El Moho Gris", emotion: "con amargura fría y sedosa", line: "No llores, dulce Fragaria. Tu dulzura es efímera bajo las luces del mercado... pero mi abrazo gris es eterno." },
      { character: "Fragaria x ananassa", emotion: "desesperada, goteando jugo carmesí", line: "¡No me toques! Prefiero la acidez del olvido en la basura que la compasión de tu terciopelo fúnebre." },
      { character: "El Moho Gris", emotion: "susurrando sombríamente", line: "Pronto seremos uno solo en la nevera del olvido. Tu dulzura será mi corona, y tu corona de hojas será mi trono." }
    ]
  },
  orange: {
    title: "Cítrico de Medianoche",
    synopsis: "En las profundidades del frutero de caoba, una Naranja y un Limón se enfrentan por el dominio de la acidez y la codiciada dulzura de la mesa.",
    genre: "Cine Negro / Musical",
    intensity: 92,
    icon: "🍊",
    prompt: "An elegant, high-contrast close-up of a dramatic orange with sharp studio lighting, neon amber highlights, smoky backdrop, dramatic theatrical trailer, highly detailed, 16:9",
    characters: [
      { name: "Mandarina de Oro", role: "Protagonista", description: "Cítrico maduro cansado de ser exprimido por la rutina." },
      { name: "Don Limón de la Sombra", role: "Antagonista", description: "Ácido gánster que amarga la existencia de los demás." }
    ],
    script: [
      { character: "Mandarina de Oro", emotion: "con tono cínico, goteando gajos dorados", line: "Don Limón... siempre rondando el borde del vaso. ¿Viniste a agriar mi noche más de lo habitual?" },
      { character: "Don Limón de la Sombra", emotion: "sonriendo con acidez punzante", line: "Te robas toda la luz del frutero, Mandarina. Pero recuerda: la gente se cansa de la dulzura fácil. Tarde o temprano, buscan mi filo." },
      { character: "Mandarina de Oro", emotion: "alzando su cáscara con orgullo", line: "¡Tú solo sirves para disimular pescados baratos! Yo soy el postre del rey..." },
      { character: "Don Limón de la Sombra", emotion: "exclama con rabia ácida", line: "¡Silencio! Una gota de mi jugo en tus ojos y este musical dorado se convertirá en un monólogo de pura ceguera." }
    ]
  },
  banana: {
    title: "El Resbalón Fatal",
    synopsis: "Un Plátano madura a un ritmo alarmante mientras se cierne la sombra apocalíptica de la Licuadora matutina. Una comedia existencialista muy oscura.",
    genre: "Comedia Noire",
    intensity: 75,
    icon: "🍌",
    prompt: "A moody cinematic shot of a bruised yellow banana hanging over a sharp, glowing stainless steel blender, dark ambient lighting, heavy fog, dramatic, 16:9",
    characters: [
      { name: "Plátano Cavendish", role: "Protagonista", description: "Filósofo curvado cubierto de manchas marrones existenciales." },
      { name: "La Licuadora Eléctrica", role: "Antagonista", description: "Monstruo de acero inoxidable y aspas sedientas de potasio." }
    ],
    script: [
      { character: "Plátano Cavendish", emotion: "mirando sus manchas con angustia poética", line: "Mírate, Cavendish... Cada mancha negra es un segundo que se escapa. El tiempo avanza y mi pulpa se vuelve blanda..." },
      { character: "La Licuadora Eléctrica", emotion: "emitiendo un zumbido metálico aterrador", line: "[Bzzzzz] Ven a mí, dulce filósofo... Tus dudas existenciales se resolverán a doce mil revoluciones por minuto." },
      { character: "Plátano Cavendish", emotion: "arrodillándose en el borde del mostrador", line: "¡No seré un simple batido con leche! ¡Nací para ser pelado con elegancia, no triturado en un torbellino de metal!" },
      { character: "La Licuadora Eléctrica", emotion: "con voz ronca y vibrante", line: "[Bzzzz] La leche está fría, la miel está lista. Tu sacrificio será delicioso, Cavendish." }
    ]
  },
  grapes: {
    title: "La Rebelión de los Viñedos",
    synopsis: "Un racimo de Uvas lucha desesperadamente contra la sequía bajo un implacable sol de verano, debatiéndose entre madurar con dignidad o convertirse en pasas de descuento.",
    genre: "Epopeya Trágica",
    intensity: 95,
    icon: "🍇",
    prompt: "A epic cinematic shot of a grape vineyard under a scorching red desert sun, dry cracked soil, cinematic lighting, dramatic masterpiece, 16:9",
    characters: [
      { name: "Vitis vinifera", role: "Protagonista", description: "Líder indiscutible del racimo, turgente y rebelde." },
      { name: "El Sol de Verano", role: "Antagonista", description: "Deidad ardiente que reclama hasta la última gota de humedad." }
    ],
    script: [
      { character: "Vitis vinifera", emotion: "mirando al cielo ardiente con rabia turgente", line: "¡Quémame si quieres, Gigante de Fuego! ¡Pero no verás a mi racimo arrugarse sin dar batalla!" },
      { character: "El Sol de Verano", emotion: "con una risa radiante y sofocante", line: "Pequeño glóbulo de agua... Tu piel se agrietará y tu néctar se evaporará. Mi calor es ley y tu destino es ser pasa." },
      { character: "Vitis vinifera", emotion: "abrazando a las uvas más pequeñas", line: "¡Manteneos unidas, hermanas! ¡Si hemos de deshidratarnos, que sea para convertirnos en el vino más embriagador de la historia!" },
      { character: "El Sol de Verano", emotion: "intensificando su brillo abrasador", line: "La fermentación es solo otra forma de rendirse a mi poder. Bebe de mi fuego y sécate." }
    ]
  }
};

const THEATER_LOGS = [
  "🎭 Abriendo los pesados telones de terciopelo...",
  "💡 Colocando el reflector principal sobre la escena...",
  "🎻 La orquesta de cítricos afina sus violines trágicos...",
  "🎬 El director grita: '¡Silencio en el plató! ¡Acción!'...",
  "🎥 Veo 3.1 capturando las lágrimas del drama (procesando fotogramas)...",
  "💧 Añadiendo efectos especiales hiperrealistas de jugo...",
  "🎨 Ajustando el contraste dramático estilo claroscuro...",
  "🍿 El público de uvas contiene la respiración en los palcos...",
  "🎞️ Compilando los rollos de celuloide de Veo 3.1..."
];

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'temporada' | 'elenco' | 'backstage' | 'criticas'>('temporada');

  // Achievements State
  const [dramasGeneratedCount, setDramasGeneratedCount] = useState<number>(() => {
    const saved = localStorage.getItem('dramasGeneratedCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [trailersWatchedCount, setTrailersWatchedCount] = useState<number>(() => {
    const saved = localStorage.getItem('trailersWatchedCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAchievementToast, setShowAchievementToast] = useState<{show: boolean; title: string; description: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('dramasGeneratedCount', dramasGeneratedCount.toString());
  }, [dramasGeneratedCount]);

  useEffect(() => {
    localStorage.setItem('trailersWatchedCount', trailersWatchedCount.toString());
  }, [trailersWatchedCount]);

  useEffect(() => {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const unlockAchievement = (key: string, title: string, desc: string) => {
    setUnlockedAchievements((prev) => {
      if (prev.includes(key)) return prev;
      const updated = [...prev, key];
      setShowAchievementToast({ show: true, title, description: desc });
      return updated;
    });
  };

  // Premium Access & Points State
  const [premiumPoints, setPremiumPoints] = useState<number>(() => {
    const saved = localStorage.getItem('premiumPoints');
    return saved ? parseInt(saved, 10) : 15; // Give 15 free points initially (enough for 5 video trailers)
  });
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('redeemedCodes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [activationError, setActivationError] = useState<string | null>(null);
  const [activationSuccess, setActivationSuccess] = useState<string | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('premiumPoints', premiumPoints.toString());
  }, [premiumPoints]);

  useEffect(() => {
    localStorage.setItem('redeemedCodes', JSON.stringify(redeemedCodes));
  }, [redeemedCodes]);

  const handleRedeemCode = (codeToRedeem: string) => {
    setActivationError(null);
    setActivationSuccess(null);
    
    const formatted = codeToRedeem.trim().toUpperCase();
    if (!formatted) {
      setActivationError('Por favor ingresa un código.');
      return;
    }

    // Check if already redeemed
    if (redeemedCodes.includes(formatted)) {
      setActivationError('Este código ya ha sido canjeado en este navegador.');
      return;
    }

    // Check if code is valid in the 1000 codes list
    const isValid = ACTIVATION_CODES_LIST.includes(formatted);
    if (!isValid) {
      setActivationError('Código inválido. Asegúrate de ingresarlo o copiarlo correctamente.');
      return;
    }

    // Redeem code successfully
    setRedeemedCodes(prev => [...prev, formatted]);
    setPremiumPoints(prev => prev + 15); // Each code awards +15 points (+5 trailer generation credits!)
    setActivationSuccess('¡Código canjeado con éxito! Has recibido +15 Puntos Premium.');
    setActivationCodeInput('');

    unlockAchievement(
      'premium_supporter',
      'Patrocinador de Cine 👑',
      '¡Has activado tu acceso premium con un código! Gracias por apoyar los costes de la API.'
    );
  };
  
  // Script and movie states
  const [selectedDrama, setSelectedDrama] = useState<PlayScript>(PRELOADED_DRAMAS.strawberry);
  const [fruitsInput, setFruitsInput] = useState('Coco y Piña');
  const [conflictInput, setConflictInput] = useState('Piña descubre que Coco es de corazón duro y no quiere mezclarse en la piña colada.');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  
  // Video parameters & generation state
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoPrompt, setVideoPrompt] = useState(PRELOADED_DRAMAS.strawberry.prompt);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentOperationId, setCurrentOperationId] = useState<string | null>(null);
  const [currentOperationName, setCurrentOperationName] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isSimulation, setIsSimulation] = useState(false);
  
  // Loading screen log rotation
  const [logIndex, setLogIndex] = useState(0);
  
  // TTS State
  const [playingTtsIndex, setPlayingTtsIndex] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir'>('Zephyr');
  const [autoPlayTts, setAutoPlayTts] = useState(false);
  const autoPlayTtsRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollingRef = useRef<number | null>(null);

  // Stop sequence helper
  const stopSequentialPlayback = () => {
    setAutoPlayTts(false);
    autoPlayTtsRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingTtsIndex(null);
  };

  // Tickets Modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSeat, setTicketSeat] = useState('Palco de Honor - Fila 1');

  // Sync video prompt with script prompt on change
  useEffect(() => {
    setVideoPrompt(selectedDrama.prompt || `A highly detailed cinematic theatrical trailer of ${selectedDrama.title} starring ${selectedDrama.icon}, moody dark room with a spotlight, high contrast, 16:9`);
    // Reset video state when switching dramas
    setVideoStatus('idle');
    setVideoUrl(null);
    setCurrentOperationId(null);
    setCurrentOperationName(null);
    setVideoError(null);
    setIsSimulation(false);
    stopSequentialPlayback();
  }, [selectedDrama]);

  // Auto-dismiss achievement toast after 6 seconds
  useEffect(() => {
    if (showAchievementToast) {
      const timer = setTimeout(() => {
        setShowAchievementToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showAchievementToast]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSequentialPlayback();
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Dynamic log rotation during video generation
  useEffect(() => {
    let interval: number;
    if (isGeneratingVideo) {
      interval = window.setInterval(() => {
        setLogIndex((prev) => (prev + 1) % THEATER_LOGS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGeneratingVideo]);

  // Call API to generate a new custom script
  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fruitsInput.trim() || !conflictInput.trim()) return;

    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fruits: fruitsInput, conflict: conflictInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate script');
      }

      const scriptData = await response.json();
      
      // Ensure the generated script is complete
      const validatedDrama: PlayScript = {
        title: scriptData.title || "Una Frutinovela Sin Título",
        synopsis: scriptData.synopsis || "Un drama vegetal sin precedentes.",
        genre: scriptData.genre || "Drama Pasional",
        intensity: scriptData.intensity || 90,
        icon: scriptData.icon || "🍍",
        prompt: scriptData.prompt || `A theatrical scene starring fruits under a glowing spotlight, moody cinema, 16:9`,
        characters: scriptData.characters || [
          { name: "Fruta Protagonista", role: "Protagonista", description: "Luchando por su dulzura." },
          { name: "Fruta Antagonista", role: "Antagonista", description: "Oponiéndose al destino de ensalada." }
        ],
        script: scriptData.script || [
          { character: "Fruta Protagonista", line: "¡No dejes que nuestra pulpa se separe!" }
        ]
      };

      setSelectedDrama(validatedDrama);
      setActiveTab('temporada'); // switch back to stage

      // Increment dramas generated counter for Achievements
      setDramasGeneratedCount((prev) => {
        const updated = prev + 1;
        if (updated >= 5) {
          unlockAchievement(
            'critico_frutinovelas',
            'Crítico de Frutinovelas 🏆',
            '¡Logro Desbloqueado! Has creado 5 dramas frutales y demostrado un criterio dramático vegetal insuperable.'
          );
        } else if (updated === 1) {
          unlockAchievement(
            'primer_drama',
            'Dramaturgo Novel ✍️',
            '¡Tu primera obra maestra! Has escrito tu primer libreto utilizando la inteligencia artificial de Gemini.'
          );
        }
        return updated;
      });
    } catch (error: any) {
      console.error(error);
      alert(`Error al generar el guión: ${error.message}. Por favor, asegúrate de que el servidor esté encendido y que GEMINI_API_KEY esté configurada en Secrets.`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // TTS Voiceover implementation
  const handlePlayTts = async (lineText: string, index: number) => {
    if (autoPlayTts) {
      stopSequentialPlayback();
    }

    if (playingTtsIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTtsIndex(null);
      return;
    }

    try {
      setPlayingTtsIndex(index);
      const response = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lineText, voice: selectedVoice }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Fallo en el servicio de voz de Gemini.');
      }

      const data = await response.json();
      if (data.audio) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audioUrl = `data:audio/mp3;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => {
          setPlayingTtsIndex(null);
        };
      }
    } catch (error: any) {
      console.error('Error generating TTS:', error);
      alert(`Error en el servicio de voz de Gemini: ${error.message || error}`);
      setPlayingTtsIndex(null);
    }
  };

  // Play the entire script sequence automatically (synchronized narrator)
  const playSequenceFromIndex = async (index: number) => {
    if (!autoPlayTtsRef.current) return;
    if (index >= selectedDrama.script.length) {
      stopSequentialPlayback();
      return;
    }

    try {
      setPlayingTtsIndex(index);
      const line = selectedDrama.script[index];
      // Speak with deep dramatic passion
      const fullText = `${line.character} ${line.emotion ? `(${line.emotion})` : ''}: ${line.line}`;
      
      const response = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText, voice: selectedVoice }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Fallo en el servicio de voz de Gemini.');
      }

      const data = await response.json();
      if (!autoPlayTtsRef.current) return; // double check if stopped during fetch

      if (data.audio) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audioUrl = `data:audio/mp3;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        
        audio.onended = () => {
          if (autoPlayTtsRef.current) {
            setTimeout(() => {
              playSequenceFromIndex(index + 1);
            }, 800); // Dramatic pause
          }
        };

        audio.onerror = () => {
          stopSequentialPlayback();
        };
      } else {
        stopSequentialPlayback();
      }
    } catch (error: any) {
      console.error('Error playing sequence:', error);
      alert(`Error en la secuencia: ${error.message || error}`);
      stopSequentialPlayback();
    }
  };

  const toggleSceneNarration = () => {
    if (autoPlayTts) {
      stopSequentialPlayback();
    } else {
      setAutoPlayTts(true);
      autoPlayTtsRef.current = true;
      playSequenceFromIndex(0);
    }
  };

  // Veo 3 Video generation implementation
  const handleGenerateVideo = async () => {
    if (isGeneratingVideo) return;

    if (premiumPoints < 3) {
      setVideoError("Puntos Premium Insuficientes. La generación de video de alta gama cuesta 3 puntos premium. Canjea un código de activación premium abajo para obtener más puntos.");
      setVideoStatus('failed');
      setShowPremiumModal(true);
      return;
    }

    setIsGeneratingVideo(true);
    setVideoStatus('generating');
    setVideoError(null);
    setIsSimulation(false);
    setLogIndex(0);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dramaId: selectedDrama.title,
          prompt: videoPrompt,
          aspectRatio: aspectRatio,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to start video generation.');
      }

      // Successful launch - deduct 3 premium points!
      setPremiumPoints(prev => Math.max(0, prev - 3));

      const data = await response.json();
      setCurrentOperationId(data.id);
      setCurrentOperationName(data.operationName);
      setIsSimulation(!!data.isSimulation);

      // Start polling status
      startPollingVideo(data.id, data.operationName);
    } catch (error: any) {
      console.error(error);
      setVideoError(error.message || 'Error al iniciar la filmación con Veo.');
      setVideoStatus('failed');
      setIsGeneratingVideo(false);
    }
  };

  // Poll video status from Express
  const startPollingVideo = (id: string, operationName: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = window.setInterval(async () => {
      try {
        const response = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, operationName }),
        });

        if (!response.ok) return;

        const data = await response.json();
        
        if (data.status === 'completed' && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setVideoStatus('completed');
          setIsSimulation(!!data.isSimulation);
          setIsGeneratingVideo(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        } else if (data.status === 'failed') {
          setVideoError(data.error || 'La filmación falló por un error de renderizado.');
          setVideoStatus('failed');
          setIsGeneratingVideo(false);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#08070b] text-slate-200 font-sans flex flex-col relative overflow-x-hidden selection:bg-red-600 selection:text-white" id="app_root">
      
      {/* Decorative Atmospheric Light Flares */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-950/25 blur-[120px] pointer-events-none" id="light_glow_top"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-950/20 blur-[120px] pointer-events-none" id="light_glow_bottom"></div>
      
      {/* Theater Marquee Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 bg-black/30 backdrop-blur-md" id="app_header">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 transform hover:scale-105 transition-all duration-300">
            <span className="text-3xl">🎭</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase italic flex items-center gap-1">
              DRAMAS <span className="text-red-500">DE</span> FRUTAS
            </h1>
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-mono">Teatro Cinemático Generativo</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-4 md:gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 mb-4 md:mb-0" id="main_navigation">
          <button 
            onClick={() => setActiveTab('temporada')} 
            className={`pb-1 transition-all ${activeTab === 'temporada' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-white'}`}
            id="nav_stage"
          >
            Escenario
          </button>
          <button 
            onClick={() => setActiveTab('elenco')} 
            className={`pb-1 transition-all ${activeTab === 'elenco' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-white'}`}
            id="nav_cast"
          >
            Libreto IA
          </button>
          <button 
            onClick={() => setActiveTab('backstage')} 
            className={`pb-1 transition-all ${activeTab === 'backstage' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-white'}`}
            id="nav_backstage"
          >
            Camerino
          </button>
          <button 
            onClick={() => setActiveTab('criticas')} 
            className={`pb-1 transition-all ${activeTab === 'criticas' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-white'}`}
            id="nav_reviews"
          >
            Críticas
          </button>
        </nav>

        {/* Call to Action Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-extrabold uppercase rounded-full flex items-center gap-1.5 transition-all duration-300 transform active:scale-95"
            id="btn_premium_status"
          >
            <Coins className="w-3.5 h-3.5 animate-pulse" />
            <span>Premium: <strong className="text-white">{premiumPoints} pts</strong></span>
          </button>

          <button 
            onClick={() => setShowTicketModal(true)}
            className="px-6 py-2 bg-white text-black text-xs font-extrabold uppercase rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 transform active:scale-95 shadow-md shadow-white/5"
            id="btn_tickets"
          >
            🎟️ Boletos Directos
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden" id="app_main">
        
        {/* Left Column: Play Info / Lore (3 Columns Wide) */}
        <section className="lg:col-span-3 border-r border-white/5 p-6 md:p-10 flex flex-col justify-between bg-black/10" id="panel_left_lore">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-600/20 text-red-400 py-1 px-2.5 rounded-full font-mono uppercase tracking-widest font-bold">
                  {selectedDrama.genre}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 py-1 px-2.5 rounded-full font-mono uppercase tracking-widest font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Drama: {selectedDrama.intensity}%
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic mt-4 leading-tight text-white/95 border-l-2 border-red-500 pl-4 font-bold">
                {selectedDrama.title}
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
                "{selectedDrama.synopsis}"
              </p>
            </div>

            {/* Cast & Biological Monikers */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-red-500" /> Elenco de Estrellas
              </h3>
              
              {selectedDrama.characters && selectedDrama.characters.map((char, index) => (
                <div key={index} className="flex items-start gap-4 group bg-white/[0.01] hover:bg-white/[0.03] p-3 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300">
                  <div className={`w-1 h-12 transition-all duration-300 rounded ${index === 0 ? 'bg-red-600 group-hover:h-14' : 'bg-amber-600 group-hover:h-14'}`}></div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase text-white/30 tracking-wider font-mono">
                      {char.role}
                    </p>
                    <p className="text-sm font-semibold text-white/90 group-hover:text-red-400 transition-colors">
                      {char.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {char.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt info block */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <Info className="w-3 h-3 text-red-500" /> Dirección Escénica Veo
            </h4>
            <div className="text-xs bg-white/5 p-3 rounded-lg text-slate-400 max-h-32 overflow-y-auto leading-relaxed border border-white/5">
              {selectedDrama.prompt}
            </div>
          </div>
        </section>

        {/* Center Column: The Stage / Cinematic Video Preview (6 Columns Wide) */}
        <section className="lg:col-span-6 relative flex flex-col justify-between bg-gradient-to-b from-transparent to-black/35 p-6 md:p-8" id="panel_center_stage">
          
          {/* Main Stage Panel depending on chosen Tab */}
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            
            {activeTab === 'temporada' && (
              <div className="w-full max-w-2xl flex flex-col items-center">
                
                {/* Cinematic Spotlight and Fruit Visualizer */}
                <div className="relative w-full aspect-video md:h-72 flex items-center justify-center mb-8 rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-2xl">
                  
                  {/* Glowing Spotlight effect overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform origin-top rotate-12 blur-sm"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none transform origin-top -rotate-12 blur-sm"></div>
                  
                  {videoStatus === 'generating' ? (
                    /* Dynamic Video Generation Theater screen */
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-20">
                      <div className="w-16 h-16 rounded-full border-4 border-red-500/20 border-t-red-600 animate-spin flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                        <Film className="w-6 h-6 text-red-500 animate-pulse" />
                      </div>
                      <span className="text-xs tracking-[0.2em] font-bold uppercase text-red-500 animate-pulse mb-3">
                        Grabando Tráiler con Veo 3.1
                      </span>
                      <p className="text-sm font-mono text-slate-300 italic max-w-md h-12 transition-all">
                        {THEATER_LOGS[logIndex]}
                      </p>
                      <span className="text-[10px] text-white/30 font-mono mt-4">
                        Modelo: veo-3.1-fast-generate-preview • Polling c/5s
                      </span>
                    </div>
                  ) : videoStatus === 'completed' && videoUrl ? (
                    /* Theater Video Screen Player */
                    <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
                      <video 
                        src={videoUrl} 
                        className="w-full h-full object-cover rounded-2xl"
                        controls 
                        autoPlay 
                        onEnded={() => {
                          setTrailersWatchedCount((prev) => {
                            const updated = prev + 1;
                            if (updated >= 3) {
                              unlockAchievement(
                                'critico_frutinovelas',
                                'Crítico de Frutinovelas 🏆',
                                '¡Logro Desbloqueado! Has visto 3 tráileres dramáticos completos y demostrado un criterio dramático vegetal insuperable.'
                              );
                            } else if (updated === 1) {
                              unlockAchievement(
                                'primer_trailer',
                                'Primer Espectador 🍿',
                                '¡Primer tráiler completo! Has presenciado una tragedia frutal desde el primer hasta el último fotograma.'
                              );
                            }
                            return updated;
                          });
                        }}
                        playsInline
                        poster={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000"/><text x="50" y="55" font-size="20" fill="%23333" text-anchor="middle">🎬 Play</text></svg>`}
                      />
                      
                      {/* Dynamic Subtitles Overlay */}
                      {playingTtsIndex !== null && selectedDrama.script[playingTtsIndex] && (
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-lg bg-black/90 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.8)] text-center pointer-events-none transition-all duration-300 z-30">
                          <span className="block text-[10px] font-extrabold text-red-400 uppercase tracking-[0.2em] mb-1">
                            {selectedDrama.script[playingTtsIndex].character} {selectedDrama.script[playingTtsIndex].emotion ? `(${selectedDrama.script[playingTtsIndex].emotion})` : ''}
                          </span>
                          <p className="text-xs md:text-sm text-white font-medium leading-relaxed font-sans">
                            "{selectedDrama.script[playingTtsIndex].line}"
                          </p>
                        </div>
                      )}

                      {/* Video-overlay Narration Controls */}
                      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                        <button
                          onClick={toggleSceneNarration}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg ${
                            autoPlayTts
                              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse border border-red-500/30'
                              : 'bg-black/80 hover:bg-white/10 text-white/90 border border-white/10'
                          }`}
                          title={autoPlayTts ? "Detener voz en off" : "Narrar escena completa con voz de IA"}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${autoPlayTts ? 'animate-bounce' : ''}`} />
                          <span>{autoPlayTts ? 'Parar Narrador' : 'Narrar Escena'}</span>
                        </button>

                        {isSimulation && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/95 text-black text-[10px] font-extrabold uppercase rounded-full shadow-lg backdrop-blur-md border border-amber-400/40">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            <span>Simulador</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => { 
                          stopSequentialPlayback();
                          setVideoUrl(null); 
                          setVideoStatus('idle'); 
                        }}
                        className="absolute top-4 right-4 p-2 bg-black/80 rounded-full hover:bg-red-600 text-white transition-colors border border-white/10 z-30"
                        title="Cerrar Trailer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Default Floating Emoji Spotlight Stage */
                    <div className="relative text-center">
                      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-red-600/15 to-transparent absolute blur-3xl -top-12 -left-12 animate-pulse"></div>
                      <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-orange-500/10 to-transparent absolute blur-3xl -bottom-12 -right-12 animate-pulse"></div>
                      
                      {/* Interactive Floating Stage Fruit */}
                      <div className="relative z-10 text-[100px] md:text-[130px] drop-shadow-[0_0_35px_rgba(239,68,68,0.45)] select-none cursor-pointer transform hover:scale-110 active:rotate-12 transition-transform duration-500">
                        {selectedDrama.icon}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/65 blur-lg rounded-full"></div>
                    </div>
                  )}

                  {/* Errors display */}
                  {videoStatus === 'failed' && videoError && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-20 border-2 border-red-900/50 rounded-2xl">
                      <X className="w-10 h-10 text-red-500 mb-3" />
                      <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest">Tragedia en el Set de Veo 3</h4>
                      <p className="text-xs text-slate-300 mt-2 max-w-md">{videoError}</p>
                      <button 
                        onClick={handleGenerateVideo}
                        className="mt-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase rounded-full transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" /> Volver a intentar
                      </button>
                    </div>
                  )}
                </div>

                {/* Video Generation Tool rail / Controls */}
                <div className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-1.5">Tráiler Cinemático Veo AI</p>
                    <input 
                      type="text" 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Prompt para generar trailer de video de Veo..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50 font-mono"
                    />
                  </div>
                  
                  {/* Select Aspect Ratio and Submit */}
                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
                      <button 
                        onClick={() => setAspectRatio('16:9')} 
                        className={`px-2.5 py-1 rounded ${aspectRatio === '16:9' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Horizontal (Landscape)"
                      >
                        16:9
                      </button>
                      <button 
                        onClick={() => setAspectRatio('9:16')} 
                        className={`px-2.5 py-1 rounded ${aspectRatio === '9:16' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Vertical (Portrait)"
                      >
                        9:16
                      </button>
                    </div>

                    <button 
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold uppercase rounded-lg hover:from-red-500 hover:to-amber-400 transition-all shadow-md shadow-red-950/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Film className="w-3.5 h-3.5" />
                      {isGeneratingVideo ? 'Filmando...' : 'Grabar Tráiler'}
                    </button>
                  </div>
                </div>

                {/* Subtitle / Script play scroll */}
                <div className="w-full bg-black/25 border border-white/5 rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col h-[280px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-red-500" /> Diálogos en Escena
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleSceneNarration}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                          autoPlayTts
                            ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-950/45'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                        title={autoPlayTts ? "Detener la narración secuencial" : "Iniciar la narración por voz de toda la escena"}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{autoPlayTts ? 'Parar' : 'Narrar Todo'}</span>
                      </button>

                      <span className="text-[10px] text-white/30 font-mono">Voz:</span>
                      <select 
                        value={selectedVoice} 
                        onChange={(e) => setSelectedVoice(e.target.value as any)}
                        className="bg-black/50 border border-white/10 text-[10px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-red-500"
                      >
                        <option value="Zephyr">Zephyr (Melancólico)</option>
                        <option value="Kore">Kore (Expresivo)</option>
                        <option value="Puck">Puck (Agudo)</option>
                        <option value="Charon">Charon (Solemne)</option>
                        <option value="Fenrir">Fenrir (Monstruoso)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Dialog List with individual play triggers */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                    {selectedDrama.script && selectedDrama.script.map((line, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                          playingTtsIndex === index 
                            ? 'bg-red-950/20 border-red-500/30' 
                            : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-extrabold tracking-wide uppercase text-red-400">
                              {line.character}
                            </span>
                            {line.emotion && (
                              <span className="text-[10px] italic text-slate-500 font-serif">
                                {line.emotion}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed font-sans">
                            {line.line}
                          </p>
                        </div>
                        <button 
                          onClick={() => handlePlayTts(`${line.character} ${line.emotion ? line.emotion : ''}: ${line.line}`, index)}
                          className={`p-2 rounded-lg transition-colors shrink-0 ${
                            playingTtsIndex === index 
                              ? 'bg-red-600 text-white' 
                              : 'bg-black/40 text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                          title="Reproducir Diálogo con IA"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'elenco' && (
              <div className="w-full max-w-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold uppercase">Crea Tu Propio Drama de Frutas</h3>
                  <p className="text-xs text-slate-400 mt-1">Escribe los personajes frutales y el conflicto principal, Gemini redactará el libreto.</p>
                </div>

                <form onSubmit={handleGenerateScript} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Frutas Participantes</label>
                    <input 
                      type="text" 
                      value={fruitsInput}
                      onChange={(e) => setFruitsInput(e.target.value)}
                      placeholder="Ej. Coco y Piña, Manzana y Plátano, Aguacate Solitario"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Conflicto Principal</label>
                    <textarea 
                      value={conflictInput}
                      onChange={(e) => setConflictInput(e.target.value)}
                      placeholder="Describe qué desata la confrontación o tragedia dramática entre las frutas..."
                      rows={4}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isGeneratingScript}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:from-red-500 hover:to-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingScript ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Escribiendo Libreto...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" /> Iniciar Frutinovela
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'backstage' && (
              <div className="w-full max-w-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold uppercase">Camerino / Backstage</h3>
                  <p className="text-xs text-slate-400 mt-1">Descubre los entresijos técnicos detrás de la magia cítrica.</p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <p className="font-mono text-amber-400 font-bold mb-1">🎭 Directrices Artísticas</p>
                    <p>Las frutas en este teatro son interpretadas como seres sumamente conscientes de su trágico final. Para aumentar el realismo, las voces emplean modelados avanzados de entonación en Gemini para plasmar amargura, deshidratación o dulzura marchita.</p>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <p className="font-mono text-red-500 font-bold mb-1">📹 Cámara y Enfoque Veo</p>
                    <p>Para filmar los tráileres con el modelo <code className="text-red-300 bg-red-950/20 px-1 py-0.5 rounded">veo-3.1-fast-generate-preview</code>, recomendamos descripciones espaciales precisas en inglés. Use palabras clave como: <em>"theater spotlight", "chiaroscuro lighting", "water droplets", "8k textures"</em>.</p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                    <Activity className="w-12 h-12 text-red-600 shrink-0" />
                    <div>
                      <p className="font-mono text-white font-bold">Estado de los Actores</p>
                      <p className="text-[11px] text-slate-400">Naranjas estresadas por la madurez, uvas luchando contra el pasismo crónico y plátanos ansiosos ante el rugido de la licuadora.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'criticas' && (
              <div className="w-full max-w-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                <h3 className="text-xl font-bold uppercase text-center flex items-center justify-center gap-2">
                  ⭐ Opiniones de la Prensa Frutal
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-red-400">El Vocero del Huerto</span>
                      <span className="text-[10px] text-slate-500">★★★★★</span>
                    </div>
                    <p className="text-xs italic text-slate-300">"La interpretación de Fragaria en 'La Fresa Solitaria' es digna de un Oscar. Una actuación turgente que se marchita con una gracia desgarradora."</p>
                  </div>

                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-amber-500">Críticas del Frutero</span>
                      <span className="text-[10px] text-slate-500">★★★★☆</span>
                    </div>
                    <p className="text-xs italic text-slate-300">"Un musical cítrico con un ritmo ácido que sacude los cimientos del refrigerador. Una revelación refrescante."</p>
                  </div>

                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-yellow-400">La Gaceta Culinaria</span>
                      <span className="text-[10px] text-slate-500">★★★★★</span>
                    </div>
                    <p className="text-xs italic text-slate-300">"Existencialismo puro en 'El Resbalón Fatal'. El suspenso de la licuadora te mantiene clavado en tu asiento. Magistral."</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Interactive Under-Stage Overlay Intensity bar */}
          <div className="relative flex items-center justify-between gap-4 px-6 py-3 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-full" id="stage_intensity_bar">
            <span className="text-[10px] tracking-widest font-extrabold uppercase text-white/50">INTENSIDAD DEL DRAMA</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000 shadow-[0_0_10px_#ef4444]" 
                style={{ width: `${selectedDrama.intensity}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">{selectedDrama.intensity}%</span>
          </div>
        </section>

        {/* Right Column: Predefined Gallery Catalog & Controls (3 Columns Wide) */}
        <section className="lg:col-span-3 border-l border-white/5 bg-black/15 p-6 flex flex-col justify-between" id="panel_right_catalog">
          
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 flex items-center gap-1.5 mb-2">
              📅 Próximas Funciones
            </h3>

            {/* List of 4 classic plays */}
            <div className="space-y-4 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
              
              <div 
                onClick={() => setSelectedDrama(PRELOADED_DRAMAS.strawberry)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedDrama.title === PRELOADED_DRAMAS.strawberry.title
                    ? 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/10' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-md">🍓</span>
                  <span className="text-[9px] py-0.5 px-2 bg-red-500/20 text-red-400 rounded-full font-bold uppercase tracking-wider font-mono">
                    Tragedia
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white/95">El Destino de Fragaria</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">Mañana 20:00 • Acto I</p>
              </div>

              <div 
                onClick={() => setSelectedDrama(PRELOADED_DRAMAS.orange)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedDrama.title === PRELOADED_DRAMAS.orange.title
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/10' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-md">🍊</span>
                  <span className="text-[9px] py-0.5 px-2 bg-amber-500/20 text-amber-400 rounded-full font-bold uppercase tracking-wider font-mono">
                    Musical
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white/95">Cítrico de Medianoche</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">Hoy 22:00 • Estreno</p>
              </div>

              <div 
                onClick={() => setSelectedDrama(PRELOADED_DRAMAS.banana)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedDrama.title === PRELOADED_DRAMAS.banana.title
                    ? 'bg-yellow-950/20 border-yellow-500/40 shadow-lg shadow-yellow-950/10' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-md">🍌</span>
                  <span className="text-[9px] py-0.5 px-2 bg-yellow-500/20 text-yellow-400 rounded-full font-bold uppercase tracking-wider font-mono">
                    Cine Negro
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white/95">El Resbalón Fatal</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">Agotado • Temporada</p>
              </div>

              <div 
                onClick={() => setSelectedDrama(PRELOADED_DRAMAS.grapes)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedDrama.title === PRELOADED_DRAMAS.grapes.title
                    ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/10' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl filter drop-shadow-md">🍇</span>
                  <span className="text-[9px] py-0.5 px-2 bg-purple-500/20 text-purple-400 rounded-full font-bold uppercase tracking-wider font-mono">
                    Epopeya
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-white/95">Rebelión de Viñedos</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">En cartelera • Clásico</p>
              </div>

            </div>

            {/* System Achievements Panel */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Logros de Crítica
              </h3>
              
              <div className="space-y-3">
                {/* Achievement 1: Crítico de Frutinovelas */}
                <div className={`p-3 rounded-xl border transition-all duration-300 ${
                  unlockedAchievements.includes('critico_frutinovelas')
                    ? 'bg-gradient-to-br from-amber-950/20 to-yellow-950/10 border-amber-500/30 shadow-[0_4px_12px_rgba(245,158,11,0.05)]'
                    : 'bg-white/[0.01] border-white/5 opacity-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shrink-0 ${
                      unlockedAchievements.includes('critico_frutinovelas')
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-400/20'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      🏆
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-white/90">
                          Crítico de Frutinovelas
                        </p>
                        {unlockedAchievements.includes('critico_frutinovelas') && (
                          <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">Listo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        Genera 5 dramas ({dramasGeneratedCount}/5) o mira 3 tráileres completos ({trailersWatchedCount}/3).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievement 2: Dramaturgo Novel */}
                <div className={`p-3 rounded-xl border transition-all duration-300 ${
                  unlockedAchievements.includes('primer_drama')
                    ? 'bg-gradient-to-br from-red-950/20 to-rose-950/10 border-red-500/30 shadow-[0_4px_12px_rgba(239,68,68,0.05)]'
                    : 'bg-white/[0.01] border-white/5 opacity-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shrink-0 ${
                      unlockedAchievements.includes('primer_drama')
                        ? 'bg-red-500/10 text-red-400 border border-red-400/20'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      ✍️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-white/90">
                          Dramaturgo Novel
                        </p>
                        {unlockedAchievements.includes('primer_drama') && (
                          <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded">Listo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        Escribe y genera tu primera obra frutal personalizada con Libreto IA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievement 3: Primer Espectador */}
                <div className={`p-3 rounded-xl border transition-all duration-300 ${
                  unlockedAchievements.includes('primer_trailer')
                    ? 'bg-gradient-to-br from-purple-950/20 to-indigo-950/10 border-purple-500/30 shadow-[0_4px_12px_rgba(168,85,247,0.05)]'
                    : 'bg-white/[0.01] border-white/5 opacity-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shrink-0 ${
                      unlockedAchievements.includes('primer_trailer')
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-400/20'
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      🍿
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-extrabold uppercase tracking-wide text-white/90">
                          Primer Espectador
                        </p>
                        {unlockedAchievements.includes('primer_trailer') && (
                          <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded">Listo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        Mira por completo al menos 1 tráiler cinemático vegetal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick instructions / Help Footer Card */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 text-xs text-slate-400 flex gap-3">
              <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white/90">¿Cómo funciona?</p>
                <p className="mt-1 leading-relaxed text-[11px]">
                  1. Escoge una obra arriba o crea una en <strong>Libreto IA</strong>.<br />
                  2. Oye la voz dramática de los actores en <strong>Voz</strong>.<br />
                  3. Haz clic en <strong>Grabar Tráiler</strong> para rodar con Veo 3.
                </p>
              </div>
            </div>

            {/* Premium Points Credit Widget & Quick Claim */}
            <div className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 p-4 rounded-xl border border-amber-500/30 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Puntos de Película</span>
                </div>
                <span className="bg-amber-500/15 border border-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  {premiumPoints} PTS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Cada tráiler generado consume 3 puntos. Tienes créditos para <strong className="text-white">{Math.floor(premiumPoints / 3)} tráileres</strong>.
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-black" />
                <span>Canjear Código Premium</span>
              </button>
            </div>

            {/* Mock Advertisement Box: Huerto de Patrocinadores */}
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-red-600/10 border-l border-b border-red-500/25 text-[8px] font-extrabold text-red-400 uppercase tracking-widest rounded-bl">
                ANUNCIO
              </div>
              
              <div className="flex items-center gap-2">
                <Megaphone className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-wider">Patrocinador del Drama</span>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[11px] text-slate-300">🍌 Plátano Express</span>
                    <span className="text-[9px] text-red-400 font-bold font-mono">10% OFF</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Envíos directos a tu camerino de frutas con jugosa discreción.</p>
                </div>
                
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[11px] text-slate-300">🍷 Abonos "Rey Uva"</span>
                    <span className="text-[9px] text-emerald-400 font-bold font-mono">100% Orgánico</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Nutre tus raíces dramáticas con potasio puro y lágrimas de cítricos.</p>
                </div>
              </div>
              <p className="text-[9px] text-center text-slate-600 mt-1 italic">
                La publicidad mantiene gratis el modelo Veo 3.1 de Google AI.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer / Bottom Status Bar */}
      <footer className="relative z-10 px-6 md:px-12 py-4 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left" id="app_footer">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              En Escena: {selectedDrama.icon} {selectedDrama.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-mono">
            <span>Temporada 2026</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-white/20">
          DRAMA_FRAMEWORK_V2.0.4 • VEO_3.1_FAST_SUPPORTED
        </div>
      </footer>

      {/* Interactive Tickets Purchase Popup Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" id="modal_tickets">
          <div className="w-full max-w-md bg-[#0e0c14] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[60px] pointer-events-none"></div>
            
            <button 
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-4xl">🎟️</span>
              <h3 className="text-xl font-bold uppercase mt-3 tracking-wide">Reserva de Boletos Directos</h3>
              <p className="text-xs text-slate-400 mt-1">Consigue tu entrada de honor para la Frutinovela</p>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40">Función:</span>
                  <span className="font-bold text-white">{selectedDrama.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Asiento:</span>
                  <select 
                    value={ticketSeat} 
                    onChange={(e) => setTicketSeat(e.target.value)}
                    className="bg-[#08070b] border border-white/10 rounded px-1.5 py-0.5 text-white focus:outline-none"
                  >
                    <option value="Palco de Honor - Fila 1">Palco de Honor - Fila 1</option>
                    <option value="Platea Principal - Fila 4">Platea Principal - Fila 4</option>
                    <option value="Anfiteatro - Fila A">Anfiteatro - Fila A</option>
                    <option value="Galería General - Fila 10">Galería General - Fila 10</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Precio:</span>
                  <span className="text-red-400 font-bold">1 Fresa Dulce (Gratuito)</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert(`¡Boleto Confirmado! Tu asiento: "${ticketSeat}" para "${selectedDrama.title}" ha sido reservado. ¡Disfruta de la función!`);
                  setShowTicketModal(false);
                }}
                className="w-full py-3 bg-white text-black font-extrabold uppercase rounded-xl hover:bg-red-600 hover:text-white transition-colors tracking-widest text-center"
              >
                Confirmar Boleto Gratis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Acceso Premium / Canje de Códigos Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f0d14] border-2 border-amber-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_30px_70px_rgba(245,158,11,0.15)] relative">
            
            {/* Top golden flare */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold uppercase tracking-wide text-white">Canje de Acceso Premium</h3>
                  <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Puntos de Película para Veo 3.1</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPremiumModal(false);
                  setActivationError(null);
                  setActivationSuccess(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Info text */}
              <div className="bg-amber-500/5 rounded-xl border border-amber-500/15 p-4 text-xs text-slate-300 leading-relaxed">
                <span className="font-extrabold text-amber-400 uppercase block mb-1">💡 Información del Servicio</span>
                Para garantizar un acceso justo sin límites frustrantes, hemos establecido este sistema de <strong>Puntos Premium</strong>. Cada renderizado de video de alta gama consume <strong>3 Puntos</strong>. 
                Introduce uno de los <strong>1000 códigos de un solo uso</strong> generados a continuación para recargar <strong className="text-white">+15 puntos de inmediato</strong>.
              </div>

              {/* Point Indicator & Form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                {/* Current Balance */}
                <div className="md:col-span-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block mb-1">Tu Balance</span>
                  <span className="text-3xl font-black text-amber-400">{premiumPoints}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mt-1">PUNTOS</span>
                </div>

                {/* Redeem Form */}
                <div className="md:col-span-8 space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                    Código de Activación (FRUT-XXXX-XXXX)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={activationCodeInput}
                      onChange={(e) => setActivationCodeInput(e.target.value)}
                      placeholder="Ej: FRUT-A12B-34CD"
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white uppercase tracking-wider font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60"
                    />
                    <button
                      onClick={() => handleRedeemCode(activationCodeInput)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>

              {/* Error and Success Alert Messages */}
              {activationError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  ⚠️ {activationError}
                </div>
              )}
              {activationSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                  ✨ {activationSuccess}
                </div>
              )}

              {/* Generated codes viewer (list of 1000 codes for copy paste!) */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" /> Lista Oficial de 1000 Códigos Premium
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    Canjeados: {redeemedCodes.length} / 1000
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-snug">
                  Haz clic en cualquier código a continuación para copiarlo automáticamente. ¡Úsalos todos los que necesites para recargar tus puntos gratis!
                </p>

                {/* Grid container with some sample codes */}
                <div className="bg-black/40 rounded-xl border border-white/5 p-4 max-h-48 overflow-y-auto scrollbar-thin">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACTIVATION_CODES_LIST.slice(0, 150).map((code, index) => {
                      const isUsed = redeemedCodes.includes(code);
                      return (
                        <div 
                          key={code}
                          onClick={() => {
                            if (isUsed) return;
                            navigator.clipboard.writeText(code);
                            setCopiedCodeIndex(index);
                            setActivationCodeInput(code);
                            setTimeout(() => setCopiedCodeIndex(null), 1500);
                          }}
                          className={`p-2 rounded-lg text-[10px] font-mono text-center cursor-pointer transition-all border flex items-center justify-between ${
                            isUsed 
                              ? 'bg-red-500/5 border-red-500/10 text-red-500/40 line-through cursor-not-allowed'
                              : copiedCodeIndex === index
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-white/[0.02] border-white/5 hover:border-amber-500/30 text-amber-300/80 hover:text-amber-300'
                          }`}
                          title={isUsed ? "Código ya canjeado" : "Haz clic para copiar y rellenar automáticamente"}
                        >
                          <span className="truncate">{code}</span>
                          {isUsed ? (
                            <Lock className="w-2.5 h-2.5 text-red-500/40" />
                          ) : copiedCodeIndex === index ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-amber-500/40" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center pt-3 text-[9px] font-mono text-slate-600">
                    Mostrando los primeros 150 códigos. Todos los 1000 códigos válidos están cargados en el archivo "codes.json" de tu proyecto.
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Toast Notification for Unlocking Achievements */}
      <AnimatePresence>
        {showAchievementToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#14111c]/95 border-2 border-amber-500/40 rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.25)] p-5 backdrop-blur-md overflow-hidden text-left"
          >
            {/* Glowing gold back-glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[30px] pointer-events-none"></div>
            
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center text-2xl font-bold shadow-lg shadow-amber-500/20 shrink-0 animate-bounce">
                🏆
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-amber-400 block mb-1">
                  ¡Logro Desbloqueado!
                </span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wide">
                  {showAchievementToast.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {showAchievementToast.description}
                </p>
              </div>

              <button 
                onClick={() => setShowAchievementToast(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Elegant timer bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
