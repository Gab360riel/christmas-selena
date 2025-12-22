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
    
    const yPos = 15 + (pseudoRandom1 * 70);
    const progressY = (yPos - 15) / 70;
    const maxWidth = 8 + (progressY * 72);
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
    <div className="relative flex flex-col items-center justify-center min-h-[750px] w-full max-w-3xl mx-auto py-12">
      
      {/* Star Topper */}
      <motion.button
        onClick={(e) => loveMessage && handleOrnamentClick(loveMessage, e as any)}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 8, -8, 0],
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-[-50px] text-yellow-300 drop-shadow-[0_0_30px_rgba(250,204,21,1)] hover:scale-120 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        <svg className="w-28 h-28" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,8 61,38 93,38 67,58 78,88 50,68 22,88 33,58 7,38 39,38" />
          <polygon points="50,8 61,38 93,38 67,58 78,88 50,68 22,88 33,58 7,38 39,38" fill="rgba(255,255,255,0.3)" />
        </svg>
      </motion.button>

      {/* CSS-Based Realistic Tree */}
      <div className="relative w-full max-w-xl aspect-[3/4] flex justify-center perspective">
        <svg viewBox="0 0 500 750" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 30px 40px rgba(0, 0, 0, 0.4))' }}>
          <defs>
            {/* Multiple gradients for realistic depth */}
            <linearGradient id="treeTopLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d3b0d" />
              <stop offset="50%" stopColor="#1a5f1a" />
              <stop offset="100%" stopColor="#0d3b0d" />
            </linearGradient>
            
            <linearGradient id="treeTopDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#062b06" />
              <stop offset="50%" stopColor="#0f4d0f" />
              <stop offset="100%" stopColor="#062b06" />
            </linearGradient>

            <linearGradient id="treeBottomLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a4d1a" />
              <stop offset="50%" stopColor="#2d7a2d" />
              <stop offset="100%" stopColor="#1a4d1a" />
            </linearGradient>

            <linearGradient id="treeBottomDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d3b0d" />
              <stop offset="50%" stopColor="#1a5f1a" />
              <stop offset="100%" stopColor="#0d3b0d" />
            </linearGradient>

            {/* Noise filter for organic texture */}
            <filter id="treeNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="5" seed="3" />
              <feDisplacementMap in="SourceGraphic" in2="treeNoise" scale="4" />
            </filter>

            {/* Light glow */}
            <filter id="glowLight">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated background shadow */}
          <ellipse cx="250" cy="700" rx="180" ry="30" fill="rgba(0, 0, 0, 0.15)" />

          {/* TOP SECTION - Smallest tier */}
          <motion.path 
            d="M 250,50 L 320,160 L 180,160 Z" 
            fill="url(#treeTopLight)"
            stroke="#0a2d0a"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 100 }}
            filter="url(#treeNoise)"
          />
          <motion.path 
            d="M 250,50 L 320,160 L 180,160 Z" 
            fill="rgba(0, 50, 0, 0.3)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08 }}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* SECOND SECTION */}
          <motion.path 
            d="M 250,130 L 350,280 L 150,280 Z" 
            fill="url(#treeTopDark)"
            stroke="#062b06"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, type: "spring" }}
            filter="url(#treeNoise)"
          />
          <motion.path 
            d="M 250,130 L 350,280 L 150,280 Z" 
            fill="rgba(0, 40, 0, 0.4)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* THIRD SECTION */}
          <motion.path 
            d="M 250,240 L 400,420 L 100,420 Z" 
            fill="url(#treeBottomLight)"
            stroke="#0f4d0f"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.18, type: "spring" }}
            filter="url(#treeNoise)"
          />
          <motion.path 
            d="M 250,240 L 400,420 L 100,420 Z" 
            fill="rgba(0, 35, 0, 0.35)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.21 }}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* BOTTOM SECTION - Largest */}
          <motion.path 
            d="M 250,380 L 450,620 L 50,620 Z" 
            fill="url(#treeBottomDark)"
            stroke="#0d3b0d"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.24, type: "spring" }}
            filter="url(#treeNoise)"
          />
          <motion.path 
            d="M 250,380 L 450,620 L 50,620 Z" 
            fill="rgba(0, 30, 0, 0.4)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.27 }}
            style={{ mixBlendMode: 'multiply' }}
          />

          {/* TRUNK */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <rect x="220" y="620" width="60" height="100" fill="#6d4c41" />
            <rect x="220" y="620" width="60" height="100" fill="rgba(0, 0, 0, 0.2)" opacity="0.5" />
            <rect x="225" y="620" width="25" height="100" fill="#7d5c51" />
            <ellipse cx="250" cy="720" rx="40" ry="12" fill="#5d3c31" />
          </motion.g>

          {/* DECORATIVE LIGHTS - Animated */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 100 + Math.sin(i * 0.5) * 50;
            const x = 250 + Math.cos(angle) * radius;
            const y = 300 + Math.sin(angle) * radius + 50;
            const lightColor = ['#FFD700', '#FF69B4', '#00BFFF', '#FF4500'][i % 4];
            
            return (
              <motion.circle
                key={`light-${i}`}
                cx={x}
                cy={y}
                r="5"
                fill={lightColor}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  r: [4, 6, 4]
                }}
                transition={{ 
                  duration: 2.5 + Math.random() * 1.5, 
                  repeat: Infinity, 
                  delay: Math.random() * 3 
                }}
                filter="url(#glowLight)"
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
                    absolute w-9 h-9 rounded-full pointer-events-auto
                    ${pos.color} ornament-shadow
                    hover:scale-130 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0
                    transition-transform duration-300 cursor-pointer
                    flex items-center justify-center shadow-lg border border-white/20
                  `}
                  style={{ 
                    top: `${pos.y}%`, 
                    left: `${pos.x}%`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), transparent)`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: [0, 3, 0]
                  }}
                  transition={{ 
                    delay: 0.35 + (idx * 0.08),
                    y: {
                      duration: 2.5 + Math.random() * 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-white/70 rounded-full blur-sm" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md border-4 border-double border-yellow-400 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-red-600 dark:text-red-400">
              {selectedMessage?.content.toLowerCase().includes("love") ? "My Special Message" : "A Christmas Wish"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
             <div className="text-6xl mb-4 animate-bounce">
               {selectedMessage?.content.toLowerCase().includes("love") ? "💝" : "🎉"}
             </div>
             <DialogDescription className="text-center text-2xl font-handwriting leading-relaxed text-slate-800 dark:text-slate-100 px-4">
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
