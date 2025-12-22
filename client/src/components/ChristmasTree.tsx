import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Message } from "@shared/schema";
import confetti from "canvas-confetti";

interface ChristmasTreeProps {
  messages: Message[];
}

export function ChristmasTree({ messages }: ChristmasTreeProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleOrnamentClick = (message: Message, e: React.MouseEvent) => {
    setSelectedMessage(message);
    
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

  const getOrnamentPosition = (index: number) => {
    const seed = index * 9301 + 49297;
    const pseudoRandom1 = ((seed) % 233280) / 233280;
    const pseudoRandom2 = ((seed * 73) % 233280) / 233280;
    
    const yPos = 18 + (pseudoRandom1 * 65);
    const progressY = (yPos - 18) / 65;
    const maxWidth = 6 + (progressY * 70);
    const xOffset = (pseudoRandom2 - 0.5) * maxWidth;
    const xPos = 50 + xOffset;

    const colors = [
      "bg-red-600", "bg-yellow-400", "bg-blue-500", "bg-purple-500", 
      "bg-pink-500", "bg-orange-500", "bg-cyan-400", "bg-lime-400",
      "bg-rose-600", "bg-amber-500", "bg-indigo-500", "bg-fuchsia-500"
    ];
    const color = colors[index % colors.length];

    return { x: xPos, y: yPos, color };
  };

  const loveMessage = messages.find(m => m.content.toLowerCase().includes("i love you"));
  const ornamentMessages = messages.filter(m => !m.content.toLowerCase().includes("i love you"));

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full max-w-2xl mx-auto">
      
      {/* Star Topper */}
      <motion.button
        onClick={(e) => loveMessage && handleOrnamentClick(loveMessage, e as any)}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 8, -8, 0],
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-0 text-yellow-300 drop-shadow-[0_0_30px_rgba(250,204,21,1)] hover:scale-120 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        <svg className="w-16 h-16" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 61,40 93,40 67,60 78,90 50,70 22,90 33,60 7,40 39,40" />
        </svg>
      </motion.button>

      {/* Realistic Fluffy Pine Tree */}
      <div className="relative w-full max-w-sm flex justify-center perspective flex-1">
        <svg viewBox="0 0 400 550" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3))' }}>
          <defs>
            {/* Fluffy texture filters */}
            <filter id="fluffyTexture">
              <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="6" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.8" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* Color gradients for pine effect */}
            <linearGradient id="pineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d3b0d" />
              <stop offset="50%" stopColor="#1f6331" />
              <stop offset="100%" stopColor="#0d3b0d" />
            </linearGradient>

            <linearGradient id="pineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0a2d0a" />
              <stop offset="50%" stopColor="#1a5321" />
              <stop offset="100%" stopColor="#0a2d0a" />
            </linearGradient>

            <linearGradient id="pineGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f3d0f" />
              <stop offset="50%" stopColor="#226d2a" />
              <stop offset="100%" stopColor="#0f3d0f" />
            </linearGradient>

            <filter id="lightGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* PINE TREE - Triangle sections stacked */}
          
          {/* Top tier - tiny point */}
          <motion.path 
            d="M 200,40 L 240,110 L 160,110 Z" 
            fill="url(#pineGradient1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
            filter="url(#fluffyTexture)"
          />

          {/* Second tier */}
          <motion.path 
            d="M 200,95 L 280,190 L 120,190 Z" 
            fill="url(#pineGradient2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            filter="url(#fluffyTexture)"
          />

          {/* Third tier */}
          <motion.path 
            d="M 200,165 L 320,280 L 80,280 Z" 
            fill="url(#pineGradient1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            filter="url(#fluffyTexture)"
          />

          {/* Fourth tier */}
          <motion.path 
            d="M 200,260 L 360,390 L 40,390 Z" 
            fill="url(#pineGradient3)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            filter="url(#fluffyTexture)"
          />

          {/* Bottom tier - widest */}
          <motion.path 
            d="M 200,360 L 390,480 L 10,480 Z" 
            fill="url(#pineGradient2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring" }}
            filter="url(#fluffyTexture)"
          />

          {/* Trunk */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <rect x="180" y="480" width="40" height="60" fill="#6d4c41" />
            <rect x="180" y="480" width="40" height="60" fill="rgba(0, 0, 0, 0.1)" />
            <ellipse cx="200" cy="540" rx="25" ry="8" fill="#5d3c31" />
          </motion.g>

          {/* Decorative lights */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 110 + Math.sin(i * 0.6) * 60;
            const x = 200 + Math.cos(angle) * radius;
            const y = 260 + Math.sin(angle) * radius;
            const lightColors = ['#FFD700', '#FF69B4', '#00BFFF', '#FFB6C1', '#7FFF00'];
            const color = lightColors[i % lightColors.length];
            
            return (
              <motion.circle
                key={`light-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  repeat: Infinity, 
                  delay: Math.random() * 2 
                }}
                filter="url(#lightGlow)"
                style={{ mixBlendMode: 'screen' }}
              />
            );
          })}
        </svg>

        {/* Ornaments Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {ornamentMessages.map((msg, idx) => {
              const pos = getOrnamentPosition(idx);

              return (
                <motion.button
                  key={msg.id}
                  onClick={(e) => handleOrnamentClick(msg, e)}
                  className={`
                    absolute w-8 h-8 rounded-full pointer-events-auto
                    ${pos.color} ornament-shadow
                    hover:scale-125 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-white
                    transition-transform duration-300 cursor-pointer
                    flex items-center justify-center shadow-lg
                  `}
                  style={{ 
                    top: `${pos.y}%`, 
                    left: `${pos.x}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: [0, 2, 0]
                  }}
                  transition={{ 
                    delay: 0.35 + (idx * 0.05),
                    y: {
                      duration: 2.5 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white/50 rounded-full blur-sm" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md border-4 border-double border-yellow-400 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-red-600 dark:text-red-400">
              {selectedMessage?.content.toLowerCase().includes("love") ? "My Special Message" : "A Christmas Wish"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
             <div className="text-5xl mb-4">
               {selectedMessage?.content.toLowerCase().includes("love") ? "💝" : "🎄"}
             </div>
             <DialogDescription className="text-center text-2xl font-handwriting leading-loose text-slate-800 dark:text-slate-100 px-4">
               "{selectedMessage?.content}"
             </DialogDescription>
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-red-600 to-green-600" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
