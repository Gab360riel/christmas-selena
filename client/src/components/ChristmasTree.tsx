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
    // Better random distribution using multiple seed values
    const seed1 = (index * 73856093) ^ 19349663;
    const seed2 = (index * 83492791) ^ 21987123;
    
    // Generate two independent random values
    const rand1 = Math.abs(Math.sin(seed1) * 10000) % 1;
    const rand2 = Math.abs(Math.sin(seed2) * 10000) % 1;
    
    // Y position: spread evenly from 20% to 82% (stays within tree)
    const yPercent = 20 + (rand1 * 62);
    
    // X position: constrained within triangular pine shape
    // The tree is narrowest at top (20%) and widest at bottom (82%)
    const progressY = (yPercent - 20) / 62; // 0 to 1
    // At top: width is ~8% each side of center, at bottom: ~35% each side
    const maxOffset = 8 + (progressY * 27);
    const xOffset = (rand2 - 0.5) * maxOffset;
    const xPos = 50 + xOffset;

    const colors = [
      "bg-red-600", "bg-yellow-400", "bg-blue-500", "bg-purple-500", 
      "bg-pink-500", "bg-orange-500", "bg-cyan-400", "bg-lime-400",
      "bg-rose-600", "bg-amber-500", "bg-indigo-500", "bg-fuchsia-500"
    ];
    const color = colors[index % colors.length];

    return { x: xPos, y: yPercent, color };
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

      {/* Realistic Pine Tree */}
      <div className="relative w-full max-w-sm flex justify-center perspective flex-1">
        <svg viewBox="0 0 420 580" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.35))' }}>
          <defs>
            {/* Advanced texture */}
            <filter id="pineTexture">
              <feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="7" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* Shadow for depth */}
            <filter id="shadowEffect">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="offsetblur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradients */}
            <linearGradient id="g1" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#0a2a0a" />
              <stop offset="50%" stopColor="#1d5a1d" />
              <stop offset="100%" stopColor="#0a2a0a" />
            </linearGradient>

            <linearGradient id="g2" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#0d3a0d" />
              <stop offset="50%" stopColor="#2a6f2a" />
              <stop offset="100%" stopColor="#0d3a0d" />
            </linearGradient>

            <linearGradient id="g3" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#082f08" />
              <stop offset="50%" stopColor="#1f5b1f" />
              <stop offset="100%" stopColor="#082f08" />
            </linearGradient>

            <linearGradient id="g4" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#0c3c0c" />
              <stop offset="50%" stopColor="#307030" />
              <stop offset="100%" stopColor="#0c3c0c" />
            </linearGradient>

            <filter id="lightGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* MAIN TREE SECTIONS - Overlapping triangles */}
          
          {/* Tier 1 - Top point */}
          <motion.path 
            d="M 210,35 L 250,95 L 170,95 Z" 
            fill="url(#g1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Tier 2 - overlapping */}
          <motion.path 
            d="M 210,75 L 290,150 L 130,150 Z" 
            fill="url(#g2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Tier 3 */}
          <motion.path 
            d="M 210,130 L 330,220 L 90,220 Z" 
            fill="url(#g1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.11, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Tier 4 */}
          <motion.path 
            d="M 210,190 L 360,295 L 60,295 Z" 
            fill="url(#g3)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.14, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Tier 5 */}
          <motion.path 
            d="M 210,260 L 390,380 L 30,380 Z" 
            fill="url(#g2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.17, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Tier 6 - Bottom widest */}
          <motion.path 
            d="M 210,340 L 410,470 L 10,470 Z" 
            fill="url(#g4)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            filter="url(#pineTexture)"
          />

          {/* Shadow layers for depth and realism */}
          <motion.path 
            d="M 210,75 L 290,150 L 130,150 Z" 
            fill="rgba(0, 0, 0, 0.08)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          />

          <motion.path 
            d="M 210,190 L 360,295 L 60,295 Z" 
            fill="rgba(0, 0, 0, 0.06)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.27 }}
          />

          <motion.path 
            d="M 210,340 L 410,470 L 10,470 Z" 
            fill="rgba(0, 0, 0, 0.05)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.29 }}
          />

          {/* Trunk */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32 }}
          >
            <rect x="185" y="470" width="50" height="70" fill="#7d5c4a" />
            <rect x="185" y="470" width="50" height="70" fill="rgba(0, 0, 0, 0.15)" />
            <rect x="190" y="470" width="20" height="70" fill="#8d6c5a" opacity="0.6" />
            <ellipse cx="210" cy="540" rx="28" ry="10" fill="#6d4c3a" />
          </motion.g>

          {/* Decorative lights - scattered throughout tree */}
          {[...Array(28)].map((_, i) => {
            // Better random distribution for lights
            const seed1 = (i * 73856093) ^ 19349663;
            const seed2 = (i * 83492791) ^ 21987123;
            const seed3 = (i * 45564233) ^ 12534567;
            
            const rand1 = Math.abs(Math.sin(seed1) * 10000) % 1;
            const rand2 = Math.abs(Math.sin(seed2) * 10000) % 1;
            const rand3 = Math.abs(Math.sin(seed3) * 10000) % 1;
            
            // Spread lights across tree height (20% to 85%)
            const y = 130 + (rand1 * 320);
            
            // Spread lights horizontally with cone shape
            const progressY = (y - 130) / 320;
            const maxWidth = 120 + (progressY * 200);
            const x = 210 + ((rand2 - 0.5) * maxWidth);
            
            const lightColors = ['#FFD700', '#FF69B4', '#00BFFF', '#00FF00', '#FFB6C1', '#FF6347', '#FFA500'];
            const color = lightColors[i % lightColors.length];
            
            return (
              <motion.circle
                key={`light-${i}`}
                cx={x}
                cy={y}
                r="2.5"
                fill={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ 
                  duration: 2.2 + (rand3 * 1.8), 
                  repeat: Infinity, 
                  delay: rand3 * 2.5 
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
                    delay: 0.4 + (idx * 0.04),
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
