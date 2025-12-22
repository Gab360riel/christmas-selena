import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Message } from "@shared/schema";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";

interface ChristmasTreeProps {
  messages: Message[];
}

export function ChristmasTree({ messages }: ChristmasTreeProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleOrnamentClick = (message: Message, e: React.MouseEvent) => {
    setSelectedMessage(message);
    
    // Festive confetti burst
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      origin: { x, y },
      colors: ['#ef4444', '#eab308', '#22c55e', '#ffffff'],
      particleCount: 40,
      spread: 60,
      scalar: 0.8,
    });
  };

  // Generate deterministic but random-looking positions for ornaments
  const getOrnamentPosition = (index: number, total: number) => {
    // We want a triangular distribution for the tree shape
    // Simple approximation: map index to "layers"
    const layer = Math.floor(Math.sqrt(index * 2)); 
    const layerWidth = 40 + (layer * 30); // Width increases as we go down
    const y = 15 + (layer * 12); // Vertical spacing
    
    // Spread items horizontally within the layer
    // Use modulo and sine to scatter them naturally
    const scatterX = Math.sin(index * 132.4) * (layerWidth / 2);
    
    // Colors for ornaments
    const colors = [
      "bg-red-500", "bg-yellow-400", "bg-blue-400", "bg-purple-400", 
      "bg-pink-400", "bg-orange-400", "bg-teal-400"
    ];
    const color = colors[index % colors.length];

    return { x: scatterX, y, color };
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto py-12">
      
      {/* The Star Topper */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-[-20px] text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
      >
        <Star size={64} fill="currentColor" className="stroke-yellow-600" />
      </motion.div>

      {/* The Tree */}
      <div className="relative w-full max-w-md aspect-[3/4] flex justify-center">
        
        {/* Tree Body - SVG for nice organic shape */}
        <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl filter">
          <defs>
            <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a472a" />
              <stop offset="50%" stopColor="#2d6a4f" />
              <stop offset="100%" stopColor="#1a472a" />
            </linearGradient>
            <filter id="fuzzy">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>
          
          {/* Tree Layers */}
          <motion.path 
            d="M100,20 L130,80 H70 Z" 
            fill="url(#treeGradient)" 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
          />
          <motion.path 
            d="M100,50 L150,140 H50 Z" 
            fill="url(#treeGradient)" 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
          />
          <motion.path 
            d="M100,100 L170,220 H30 Z" 
            fill="url(#treeGradient)" 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
          />
          <motion.path 
            d="M100,160 L190,300 H10 Z" 
            fill="url(#treeGradient)" 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
          />
          
          {/* Trunk */}
          <path d="M90,300 L90,320 L110,320 L110,300 Z" fill="#5D4037" />
        </svg>

        {/* Ornaments Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* We use an overlay div to position absolute elements relative to the SVG container */}
          <div className="relative w-full h-full">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const pos = getOrnamentPosition(idx, messages.length);
                // Adjust position to center (100 is roughly SVG center x)
                // We use percentages for responsiveness
                
                // Manual overrides for better distribution if needed, but algorithmic is fine for now
                // Mapping the SVG coords roughly to %: 
                // Top: ~10%, Bottom: ~85%
                
                // Let's create a simpler mapped position based on index to ensure coverage
                // Zig-zag pattern down the tree
                const row = Math.floor(idx / 3);
                const col = idx % 3;
                const totalRows = Math.ceil(messages.length / 3);
                
                // Cone shape math: Width available at height h
                const progressY = (idx + 1) / (messages.length + 2);
                const yPos = 15 + (progressY * 70); // 15% to 85%
                
                // Spread increases with Y (cone)
                const spread = 10 + (progressY * 60); 
                
                // Randomish x-offset within the spread
                // Use a pseudo-random based on index to be stable
                const pseudoRandom = ((idx * 9301 + 49297) % 233280) / 233280;
                const xOffset = (pseudoRandom - 0.5) * spread; 
                
                const xPos = 50 + xOffset;

                return (
                  <motion.button
                    key={msg.id}
                    onClick={(e) => handleOrnamentClick(msg, e)}
                    className={`
                      absolute w-8 h-8 rounded-full pointer-events-auto
                      ${pos.color} ornament-shadow
                      hover:scale-125 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-white
                      transition-transform duration-300 cursor-pointer
                      flex items-center justify-center
                    `}
                    style={{ 
                      top: `${yPos}%`, 
                      left: `${xPos}%`,
                      transform: 'translate(-50%, -50%)' 
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: [0, 2, 0] // Gentle bobbing
                    }}
                    transition={{ 
                      delay: 0.5 + (idx * 0.1),
                      y: {
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Glossy reflection dot */}
                    <div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Trunk Base / Pot */}
      <div className="relative mt-[-20px] z-10">
        <div className="w-24 h-20 bg-amber-900 rounded-b-lg shadow-inner border-t-4 border-amber-950/30 flex items-center justify-center">
          <span className="text-amber-950/40 text-xs font-bold font-display tracking-widest uppercase">North Pole</span>
        </div>
      </div>

      {/* Decorative Floor/Rug */}
      <div className="w-64 h-12 bg-red-700/20 rounded-[100%] blur-xl mt-[-10px] z-0" />

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md border-4 border-double border-yellow-500/50 bg-[#fffcf0] dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-red-600 dark:text-red-400">
              Um Desejo de Natal
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
             <div className="text-4xl mb-4 animate-bounce">🎁</div>
             <DialogDescription className="text-center text-xl font-handwriting leading-loose text-slate-800 dark:text-slate-100 px-4">
               "{selectedMessage?.content}"
             </DialogDescription>
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-red-500 to-green-500" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
