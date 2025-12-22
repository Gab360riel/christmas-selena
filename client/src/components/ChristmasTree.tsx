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

  // Generate random positions constrained within the tree shape
  const getOrnamentPosition = (index: number, total: number) => {
    const seed = index * 9301 + 49297;
    const pseudoRandom1 = ((seed) % 233280) / 233280;
    const pseudoRandom2 = ((seed * 73) % 233280) / 233280;
    
    // Y position: 15% to 85% of tree height
    const yPos = 15 + (pseudoRandom1 * 70);
    
    // X position constrained by cone shape
    const progressY = (yPos - 15) / 70;
    const maxWidth = 5 + (progressY * 75);
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
    <div className="relative flex flex-col items-center justify-center min-h-[700px] w-full max-w-3xl mx-auto py-12">
      
      {/* The Star Topper */}
      <motion.button
        onClick={(e) => loveMessage && handleOrnamentClick(loveMessage, e as any)}
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0],
          filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-[-35px] text-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.9)] hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 61,40 93,40 67,60 78,90 50,70 22,90 33,60 7,40 39,40" />
        </svg>
      </motion.button>

      {/* The CSS Tree */}
      <div className="relative w-full max-w-lg aspect-[2/3] flex justify-center">
        {/* Tree SVG with gradient and realistic appearance */}
        <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.3))' }}>
          <defs>
            {/* Gradients for 3D effect */}
            <linearGradient id="treeBright" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1f4d2f" />
              <stop offset="50%" stopColor="#2d6a47" />
              <stop offset="100%" stopColor="#1f4d2f" />
            </linearGradient>
            
            <linearGradient id="treeDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d2b1a" />
              <stop offset="50%" stopColor="#1a452d" />
              <stop offset="100%" stopColor="#0d2b1a" />
            </linearGradient>

            <filter id="treeFuzzy">
              <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>

            <radialGradient id="lights" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 215, 0, 0.1)" />
            </radialGradient>
          </defs>

          {/* Tree Layer 1 - Top */}
          <motion.path 
            d="M 200,40 L 260,150 L 140,150 Z" 
            fill="url(#treeBright)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
            filter="url(#treeFuzzy)"
            style={{ opacity: 0.95 }}
          />

          {/* Tree Layer 2 */}
          <motion.path 
            d="M 200,120 L 300,240 L 100,240 Z" 
            fill="url(#treeDark)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            filter="url(#treeFuzzy)"
            style={{ opacity: 0.92 }}
          />

          {/* Tree Layer 3 */}
          <motion.path 
            d="M 200,190 L 340,340 L 60,340 Z" 
            fill="url(#treeBright)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            filter="url(#treeFuzzy)"
            style={{ opacity: 0.94 }}
          />

          {/* Tree Layer 4 - Bottom */}
          <motion.path 
            d="M 200,280 L 380,460 L 20,460 Z" 
            fill="url(#treeDark)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            filter="url(#treeFuzzy)"
            style={{ opacity: 0.93 }}
          />

          {/* Trunk */}
          <motion.rect
            x="175" y="460" width="50" height="80"
            fill="#5d4037"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.25 }}
            style={{ 
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
              transformOrigin: '200px 460px'
            }}
          />

          {/* Tree shadows/depth */}
          <ellipse cx="200" cy="465" rx="120" ry="15" fill="rgba(0, 0, 0, 0.1)" />

          {/* Decorative lights */}
          {[...Array(15)].map((_, i) => {
            const angle = (i / 15) * Math.PI * 2;
            const radius = 80 + Math.sin(i * 0.7) * 40;
            const x = 200 + Math.cos(angle) * radius;
            const y = 180 + Math.sin(angle) * radius;
            return (
              <motion.circle
                key={`light-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="rgba(255, 215, 0, 0.6)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2 + Math.random() * 1, repeat: Infinity, delay: Math.random() * 2 }}
                filter="url(#lights)"
              />
            );
          })}
        </svg>

        {/* Ornaments Layer - Positioned over the tree */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {ornamentMessages.map((msg, idx) => {
              const pos = getOrnamentPosition(idx, ornamentMessages.length);

              return (
                <motion.button
                  key={msg.id}
                  onClick={(e) => handleOrnamentClick(msg, e)}
                  className={`
                    absolute w-8 h-8 rounded-full pointer-events-auto
                    ${pos.color} ornament-shadow
                    hover:scale-125 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-white
                    transition-transform duration-300 cursor-pointer
                    flex items-center justify-center shadow-xl
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
                    delay: 0.3 + (idx * 0.08),
                    y: {
                      duration: 2.5 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Glossy reflection dot */}
                  <div className="absolute top-1.5 left-2 w-2 h-2 bg-white/60 rounded-full blur-sm" />
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
