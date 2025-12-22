import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Message } from "@shared/schema";
import confetti from "canvas-confetti";
import treeImage from "@assets/stock_images/beautiful_full_chris_3f75a730.jpg";

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

  // Generate random positions constrained within the tree image bounds
  const getOrnamentPosition = (index: number, total: number) => {
    // Tree image is roughly cone-shaped, we constrain ornaments to tree area
    // Using a seed for deterministic randomness
    const seed = index * 9301 + 49297;
    const pseudoRandom1 = ((seed) % 233280) / 233280;
    const pseudoRandom2 = ((seed * 73) % 233280) / 233280;
    
    // Y position: 20% to 85% of tree height (avoiding top and bottom edges)
    const yPos = 20 + (pseudoRandom1 * 65);
    
    // X position constrained by cone shape (wider at bottom, narrower at top)
    // Progress down the tree
    const progressY = (yPos - 20) / 65; // 0 to 1
    // Maximum width at each level (cone shape)
    const maxWidth = 10 + (progressY * 70); // 10% at top, 80% at bottom
    
    // Spread within the available width, centered at 50%
    const xOffset = (pseudoRandom2 - 0.5) * maxWidth;
    const xPos = 50 + xOffset;

    // Colors for ornaments
    const colors = [
      "bg-red-600", "bg-yellow-400", "bg-blue-400", "bg-purple-400", 
      "bg-pink-400", "bg-orange-400", "bg-teal-400", "bg-emerald-400",
      "bg-rose-500", "bg-amber-400"
    ];
    const color = colors[index % colors.length];

    return { x: xPos, y: yPos, color };
  };

  // Find the "I love you" message
  const loveMessage = messages.find(m => m.content.toLowerCase().includes("i love you"));
  const ornamentMessages = messages.filter(m => !m.content.toLowerCase().includes("i love you"));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[700px] w-full max-w-2xl mx-auto py-12">
      
      {/* The Star Topper - Shows "I love you" message */}
      <motion.button
        onClick={(e) => loveMessage && handleOrnamentClick(loveMessage, e as any)}
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0],
          filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-20 mb-[-40px] text-yellow-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 61,40 93,40 67,60 78,90 50,70 22,90 33,60 7,40 39,40" />
        </svg>
      </motion.button>

      {/* The Tree Image */}
      <div className="relative w-full max-w-md aspect-[3/4] flex justify-center drop-shadow-2xl overflow-hidden rounded-lg">
        <img 
          src={treeImage} 
          alt="Christmas Tree" 
          className="w-full h-full object-cover"
        />

        {/* Ornaments Layer - Positioned over the tree image */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {ornamentMessages.map((msg, idx) => {
              const pos = getOrnamentPosition(idx, ornamentMessages.length);

              return (
                <motion.button
                  key={msg.id}
                  onClick={(e) => handleOrnamentClick(msg, e)}
                  className={`
                    absolute w-7 h-7 rounded-full pointer-events-auto
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
                    y: [0, 2, 0] // Gentle bobbing
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
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Glossy reflection dot */}
                  <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/50 rounded-full blur-sm" />
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
