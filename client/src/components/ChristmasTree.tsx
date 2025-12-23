import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
      colors: ["#ef4444", "#eab308", "#22c55e", "#ffffff"],
      particleCount: 40,
      spread: 60,
      scalar: 0.8,
    });
  };

  // SVG tree tiers: center at x=210, each tier is a triangle
  const treeTiers = [
    { yTop: 35, yBot: 95, xLeft: 170, xRight: 250 }, // Tier 1
    { yTop: 75, yBot: 150, xLeft: 130, xRight: 290 }, // Tier 2
    { yTop: 130, yBot: 220, xLeft: 90, xRight: 330 }, // Tier 3
    { yTop: 190, yBot: 295, xLeft: 60, xRight: 360 }, // Tier 4
    { yTop: 260, yBot: 380, xLeft: 30, xRight: 390 }, // Tier 5
    { yTop: 340, yBot: 470, xLeft: 10, xRight: 410 }, // Tier 6
  ];

  // Get the left and right bounds of tree at a given SVG y coordinate
  const getTreeBoundsAtY = (svgY: number) => {
    const centerX = 210;
    let overallMinX = Infinity;
    let overallMaxX = -Infinity;
    let foundAny = false;

    // Check all tiers that contain this y coordinate (tiers overlap)
    for (const tier of treeTiers) {
      if (svgY >= tier.yTop && svgY <= tier.yBot) {
        foundAny = true;
        // Calculate progress through this tier (0 at top, 1 at bottom)
        const progress = (svgY - tier.yTop) / (tier.yBot - tier.yTop);

        // Each tier is a triangle with:
        // - Top vertex: (centerX, yTop) - a point
        // - Bottom left: (xLeft, yBot)
        // - Bottom right: (xRight, yBot)
        // Interpolate linearly from top point to bottom edges
        const tierMinX = centerX + (tier.xLeft - centerX) * progress;
        const tierMaxX = centerX + (tier.xRight - centerX) * progress;

        // Take the widest bounds from all overlapping tiers
        overallMinX = Math.min(overallMinX, tierMinX);
        overallMaxX = Math.max(overallMaxX, tierMaxX);
      }
    }

    // If no tier found, return center point
    if (!foundAny || overallMinX === Infinity) {
      return { minX: centerX, maxX: centerX };
    }

    return { minX: overallMinX, maxX: overallMaxX };
  };

  // Pre-calculate all ornament positions with minimum spacing
  const calculateOrnamentPositions = () => {
    const positions: { x: number; y: number; color: string }[] = [];
    const minSpacing = 35; // Minimum spacing between ornaments in SVG units

    // SVG hex colors for ornaments
    const colors = [
      "#dc2626", // red-600
      "#facc15", // yellow-400
      "#3b82f6", // blue-500
      "#a855f7", // purple-500
      "#ec4899", // pink-500
      "#f97316", // orange-500
      "#22d3ee", // cyan-400
      "#a3e635", // lime-400
      "#e11d48", // rose-600
      "#f59e0b", // amber-500
      "#6366f1", // indigo-500
      "#d946ef", // fuchsia-500
    ];

    // Define rows with Y positions and how many ornaments per row
    const rows = [
      { y: 85, count: 1 }, // Top area
      { y: 130, count: 2 },
      { y: 175, count: 3 },
      { y: 220, count: 3 },
      { y: 265, count: 4 },
      { y: 310, count: 4 },
      { y: 355, count: 4 },
      { y: 400, count: 3 },
      { y: 445, count: 2 },
    ];

    let colorIndex = 0;

    for (const row of rows) {
      const { minX, maxX } = getTreeBoundsAtY(row.y);
      const width = maxX - minX;

      // Margin from edges
      const margin = 25;
      const adjustedMinX = minX + margin;
      const adjustedMaxX = maxX - margin;
      const adjustedWidth = adjustedMaxX - adjustedMinX;

      if (adjustedWidth <= 0) continue;

      // Distribute ornaments evenly across this row
      for (let i = 0; i < row.count; i++) {
        let x;
        if (row.count === 1) {
          x = (adjustedMinX + adjustedMaxX) / 2;
        } else {
          // Spread evenly with some randomness
          const spacing = adjustedWidth / (row.count - 1);
          const baseX = adjustedMinX + i * spacing;
          // Add small random offset (±10px)
          const seed = (positions.length * 12345) ^ 67890;
          const rand = (Math.abs(Math.sin(seed) * 10000) % 1) - 0.5;
          x = baseX + rand * 15;
          // Keep within bounds
          x = Math.max(adjustedMinX, Math.min(adjustedMaxX, x));
        }

        // Small Y variation for natural look
        const ySeed = (positions.length * 54321) ^ 98765;
        const yRand = (Math.abs(Math.sin(ySeed) * 10000) % 1) - 0.5;
        const y = row.y + yRand * 12;

        positions.push({
          x,
          y,
          color: colors[colorIndex % colors.length],
        });
        colorIndex++;
      }
    }

    return positions;
  };

  // Memoize positions
  const ornamentPositions = calculateOrnamentPositions();

  const getOrnamentPosition = (index: number) => {
    if (index < ornamentPositions.length) {
      return ornamentPositions[index];
    }
    // Fallback for any extra ornaments
    return ornamentPositions[index % ornamentPositions.length];
  };

  const loveMessage = messages.find(
    (m) =>
      m.content.toLowerCase().includes("i love you") ||
      m.content.toLowerCase().includes("amo você")
  );
  const ornamentMessages = messages.filter(
    (m) =>
      !m.content.toLowerCase().includes("i love you") &&
      !m.content.toLowerCase().includes("amo você")
  );

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full max-w-2xl mx-auto">
      {/* Realistic Pine Tree */}
      <div className="relative w-full max-w-sm flex justify-center perspective flex-1">
        <svg
          viewBox="0 0 420 580"
          className="w-full h-full drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.35))" }}
        >
          <defs>
            {/* Advanced texture for realistic pine needles */}
            <filter id="pineTexture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="4.2"
                numOctaves="9"
                seed="5"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Filter for natural lighting effect */}
            <filter id="naturalLight">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
              <feComponentTransfer in="offsetBlur">
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Enhanced shadow for depth */}
            <filter id="shadowEffect">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              <feOffset dx="1.5" dy="2.5" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="offsetblur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Ultra-realistic gradients with natural pine tree colors */}
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d3a0d" />
              <stop offset="20%" stopColor="#1a5a1a" />
              <stop offset="40%" stopColor="#2d7a2d" />
              <stop offset="50%" stopColor="#3a9a3a" />
              <stop offset="60%" stopColor="#2d7a2d" />
              <stop offset="80%" stopColor="#1a5a1a" />
              <stop offset="100%" stopColor="#0d3a0d" />
            </linearGradient>

            <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f4a0f" />
              <stop offset="20%" stopColor="#2a6f2a" />
              <stop offset="40%" stopColor="#3a8f3a" />
              <stop offset="50%" stopColor="#4aaf4a" />
              <stop offset="60%" stopColor="#3a8f3a" />
              <stop offset="80%" stopColor="#2a6f2a" />
              <stop offset="100%" stopColor="#0f4a0f" />
            </linearGradient>

            <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a3a0a" />
              <stop offset="20%" stopColor="#1f5f1f" />
              <stop offset="40%" stopColor="#2f7f2f" />
              <stop offset="50%" stopColor="#3f9f3f" />
              <stop offset="60%" stopColor="#2f7f2f" />
              <stop offset="80%" stopColor="#1f5f1f" />
              <stop offset="100%" stopColor="#0a3a0a" />
            </linearGradient>

            <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c4c0c" />
              <stop offset="20%" stopColor="#307030" />
              <stop offset="40%" stopColor="#409040" />
              <stop offset="50%" stopColor="#50b050" />
              <stop offset="60%" stopColor="#409040" />
              <stop offset="80%" stopColor="#307030" />
              <stop offset="100%" stopColor="#0c4c0c" />
            </linearGradient>

            {/* Additional gradient for depth variation */}
            <radialGradient id="treeHighlight" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#4aaf4a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a2a0a" stopOpacity="0" />
            </radialGradient>

            {/* Light glow effect */}
            <filter id="lightGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Enhanced pattern for realistic pine needle texture */}
            <pattern
              id="needlePattern"
              x="0"
              y="0"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              {/* Pine needle clusters */}
              <circle cx="12" cy="12" r="0.6" fill="#1a4a1a" opacity="0.4" />
              <circle cx="6" cy="8" r="0.5" fill="#1a4a1a" opacity="0.3" />
              <circle cx="18" cy="10" r="0.5" fill="#1a4a1a" opacity="0.3" />
              <circle cx="8" cy="16" r="0.4" fill="#1a4a1a" opacity="0.25" />
              <circle cx="16" cy="18" r="0.4" fill="#1a4a1a" opacity="0.25" />
              <circle cx="12" cy="20" r="0.5" fill="#1a4a1a" opacity="0.3" />
              {/* Small branches */}
              <line
                x1="5"
                y1="5"
                x2="8"
                y2="8"
                stroke="#1a4a1a"
                strokeWidth="0.3"
                opacity="0.2"
              />
              <line
                x1="17"
                y1="7"
                x2="20"
                y2="10"
                stroke="#1a4a1a"
                strokeWidth="0.3"
                opacity="0.2"
              />
            </pattern>

            {/* Pattern for branch texture */}
            <pattern
              id="branchPattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="20"
                x2="40"
                y2="20"
                stroke="#2a5a2a"
                strokeWidth="0.8"
                opacity="0.15"
              />
              <line
                x1="10"
                y1="10"
                x2="30"
                y2="30"
                stroke="#2a5a2a"
                strokeWidth="0.6"
                opacity="0.1"
              />
              <line
                x1="30"
                y1="10"
                x2="10"
                y2="30"
                stroke="#2a5a2a"
                strokeWidth="0.6"
                opacity="0.1"
              />
            </pattern>

            {/* Trunk gradient */}
            <linearGradient
              id="trunkGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8d6c5a" />
              <stop offset="50%" stopColor="#7d5c4a" />
              <stop offset="100%" stopColor="#6d4c3a" />
            </linearGradient>

            {/* Star glow filter */}
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Star glow gradient for pulsing effect */}
            <radialGradient id="starGlowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FFA500" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* MAIN TREE SECTIONS - Overlapping triangles with realistic details */}

          {/* Tier 1 - Top point */}
          <motion.path
            d="M 210,35 L 250,95 L 170,95 Z"
            fill="url(#g1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="0.95"
          />
          <motion.path
            d="M 210,35 L 250,95 L 170,95 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            opacity="0.18"
          />
          <motion.path
            d="M 210,35 L 250,95 L 170,95 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.27 }}
          />

          {/* Tier 2 - overlapping */}
          <motion.path
            d="M 210,75 L 290,150 L 130,150 Z"
            fill="url(#g2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="0.97"
          />
          <motion.path
            d="M 210,75 L 290,150 L 130,150 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.27 }}
            opacity="0.15"
          />
          <motion.path
            d="M 210,75 L 290,150 L 130,150 Z"
            fill="url(#branchPattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.29 }}
            opacity="0.1"
          />
          <motion.path
            d="M 210,75 L 290,150 L 130,150 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.31 }}
          />

          {/* Tier 3 */}
          <motion.path
            d="M 210,130 L 330,220 L 90,220 Z"
            fill="url(#g1)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.11, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="0.98"
          />
          <motion.path
            d="M 210,130 L 330,220 L 90,220 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.29 }}
            opacity="0.13"
          />
          <motion.path
            d="M 210,130 L 330,220 L 90,220 Z"
            fill="url(#branchPattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.31 }}
            opacity="0.12"
          />
          <motion.path
            d="M 210,130 L 330,220 L 90,220 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.33 }}
          />

          {/* Tier 4 */}
          <motion.path
            d="M 210,190 L 360,295 L 60,295 Z"
            fill="url(#g3)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.14, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="0.99"
          />
          <motion.path
            d="M 210,190 L 360,295 L 60,295 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.31 }}
            opacity="0.11"
          />
          <motion.path
            d="M 210,190 L 360,295 L 60,295 Z"
            fill="url(#branchPattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.33 }}
            opacity="0.13"
          />
          <motion.path
            d="M 210,190 L 360,295 L 60,295 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          />

          {/* Tier 5 */}
          <motion.path
            d="M 210,260 L 390,380 L 30,380 Z"
            fill="url(#g2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.17, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="1"
          />
          <motion.path
            d="M 210,260 L 390,380 L 30,380 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.33 }}
            opacity="0.09"
          />
          <motion.path
            d="M 210,260 L 390,380 L 30,380 Z"
            fill="url(#branchPattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            opacity="0.14"
          />
          <motion.path
            d="M 210,260 L 390,380 L 30,380 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.37 }}
          />

          {/* Tier 6 - Bottom widest */}
          <motion.path
            d="M 210,340 L 410,470 L 10,470 Z"
            fill="url(#g4)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            filter="url(#pineTexture)"
            opacity="1"
          />
          <motion.path
            d="M 210,340 L 410,470 L 10,470 Z"
            fill="url(#needlePattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            opacity="0.08"
          />
          <motion.path
            d="M 210,340 L 410,470 L 10,470 Z"
            fill="url(#branchPattern)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.37 }}
            opacity="0.15"
          />
          <motion.path
            d="M 210,340 L 410,470 L 10,470 Z"
            fill="url(#treeHighlight)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.39 }}
          />

          {/* Enhanced shadow layers for depth and realism */}
          <motion.path
            d="M 210,75 L 290,150 L 130,150 Z"
            fill="rgba(0, 0, 0, 0.12)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          />

          <motion.path
            d="M 210,130 L 330,220 L 90,220 Z"
            fill="rgba(0, 0, 0, 0.08)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.27 }}
          />

          <motion.path
            d="M 210,190 L 360,295 L 60,295 Z"
            fill="rgba(0, 0, 0, 0.1)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.29 }}
          />

          <motion.path
            d="M 210,260 L 390,380 L 30,380 Z"
            fill="rgba(0, 0, 0, 0.07)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.31 }}
          />

          <motion.path
            d="M 210,340 L 410,470 L 10,470 Z"
            fill="rgba(0, 0, 0, 0.06)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.33 }}
          />

          {/* Realistic Trunk */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32 }}
          >
            {/* Main trunk with gradient */}
            <rect
              x="185"
              y="470"
              width="50"
              height="70"
              fill="url(#trunkGradient)"
              rx="2"
            />
            {/* Trunk texture lines */}
            <line
              x1="195"
              y1="470"
              x2="195"
              y2="540"
              stroke="#6d4c3a"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="205"
              y1="470"
              x2="205"
              y2="540"
              stroke="#6d4c3a"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="215"
              y1="470"
              x2="215"
              y2="540"
              stroke="#6d4c3a"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="225"
              y1="470"
              x2="225"
              y2="540"
              stroke="#6d4c3a"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Shadow on trunk */}
            <rect
              x="185"
              y="470"
              width="50"
              height="70"
              fill="rgba(0, 0, 0, 0.2)"
              rx="2"
            />
            {/* Highlight */}
            <rect
              x="190"
              y="470"
              width="20"
              height="70"
              fill="#9d7c6a"
              opacity="0.4"
              rx="1"
            />
            {/* Base shadow */}
            <ellipse
              cx="210"
              cy="540"
              rx="30"
              ry="12"
              fill="#5d4c3a"
              opacity="0.6"
            />
            <ellipse cx="210" cy="540" rx="28" ry="10" fill="#6d4c3a" />
          </motion.g>

          {/* Decorative lights - scattered throughout tree, inside green area */}
          {[...Array(28)].map((_, i) => {
            // Better random distribution for lights
            const seed1 = (i * 73856093) ^ 19349663;
            const seed2 = (i * 83492791) ^ 21987123;
            const seed3 = (i * 45564233) ^ 12534567;
            const seed4 = (i * 67890123) ^ 34567890;

            const rand1 = Math.abs(Math.sin(seed1) * 10000) % 1;
            const rand2 = Math.abs(Math.sin(seed2) * 10000) % 1;
            const rand3 = Math.abs(Math.sin(seed3) * 10000) % 1;
            const rand4 = Math.abs(Math.sin(seed4) * 10000) % 1;

            // Y: Pick random y in SVG space (35 to 470, which is the tree bounds)
            // Use a more even distribution across tiers
            const tierHeight = 435 / 6; // Divide tree into 6 sections
            const tierIndex = Math.floor(rand1 * 6);
            const tierProgress = (rand1 * 6) % 1;
            const svgY =
              35 + tierIndex * tierHeight + tierProgress * tierHeight;

            // Get tree bounds at this y position (same logic as ornaments)
            const { minX, maxX } = getTreeBoundsAtY(svgY);

            // Add margin to ensure lights stay well inside the green area
            const margin = 15; // pixels margin from edges in SVG space
            const width = maxX - minX;

            // Only apply margin if the tree is wide enough
            let adjustedMinX, adjustedMaxX;
            if (width > margin * 2) {
              adjustedMinX = minX + margin;
              adjustedMaxX = maxX - margin;
            } else {
              // If tree is too narrow, use smaller margin or center it
              const smallerMargin = width * 0.15; // 15% margin
              adjustedMinX = minX + smallerMargin;
              adjustedMaxX = maxX - smallerMargin;
            }

            // Ensure we have valid bounds
            if (adjustedMaxX <= adjustedMinX) {
              // Fallback to center if bounds are too narrow
              const centerX = (minX + maxX) / 2;
              const lightColors = [
                "#FFD700",
                "#FF69B4",
                "#00BFFF",
                "#00FF00",
                "#FFB6C1",
                "#FF6347",
                "#FFA500",
              ];
              return (
                <motion.circle
                  key={`light-${i}`}
                  cx={centerX}
                  cy={svgY}
                  r="2.5"
                  fill={lightColors[i % lightColors.length]}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.1, 1, 0.1, 1, 0.1],
                    scale: [1, 1.3, 1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5 + rand3 * 1.0,
                    repeat: Infinity,
                    delay: rand3 * 2.0,
                    times: [0, 0.3, 0.5, 0.8, 1],
                    ease: "easeInOut",
                  }}
                  filter="url(#lightGlow)"
                  style={{ mixBlendMode: "screen" }}
                />
              );
            }

            // X: Pick random x within adjusted tree bounds at this y
            // Use a slight bias towards center for more natural distribution
            const centerBias = 0.25; // 25% chance to be closer to center
            let svgX;
            if (rand4 < centerBias) {
              // Closer to center
              const centerX = (adjustedMinX + adjustedMaxX) / 2;
              const range = (adjustedMaxX - adjustedMinX) * 0.5;
              svgX = centerX + (rand2 - 0.5) * range;
            } else {
              // Full range
              svgX = adjustedMinX + rand2 * (adjustedMaxX - adjustedMinX);
            }

            // Ensure we're still within bounds
            svgX = Math.max(adjustedMinX, Math.min(adjustedMaxX, svgX));

            const lightColors = [
              "#FFD700",
              "#FF69B4",
              "#00BFFF",
              "#00FF00",
              "#FFB6C1",
              "#FF6347",
              "#FFA500",
            ];
            const color = lightColors[i % lightColors.length];

            return (
              <motion.circle
                key={`light-${i}`}
                cx={svgX}
                cy={svgY}
                r="2.5"
                fill={color}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.1, 1, 0.1, 1, 0.1],
                  scale: [1, 1.3, 1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5 + rand3 * 1.0,
                  repeat: Infinity,
                  delay: rand3 * 2.0,
                  times: [0, 0.3, 0.5, 0.8, 1],
                  ease: "easeInOut",
                }}
                filter="url(#lightGlow)"
                style={{ mixBlendMode: "screen" }}
              />
            );
          })}

          {/* Star Topper - at the top of the tree (y=35), rendered last to be in front */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.02, type: "spring" }}
            onClick={(e) =>
              loveMessage && handleOrnamentClick(loveMessage, e as any)
            }
            style={{ cursor: "pointer" }}
          >
            <motion.g
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Glow layer 3 - outermost */}
              <motion.polygon
                points="210,5 220,30 245,30 228,42 236,65 210,52 184,65 192,42 175,30 200,30"
                fill="none"
                stroke="#FFFF80"
                strokeWidth="12"
                animate={{
                  opacity: [0, 0.6, 0],
                  strokeWidth: [8, 16, 8],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ filter: "blur(8px)" }}
              />
              {/* Glow layer 2 */}
              <motion.polygon
                points="210,5 220,30 245,30 228,42 236,65 210,52 184,65 192,42 175,30 200,30"
                fill="none"
                stroke="#FFD700"
                strokeWidth="6"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  strokeWidth: [4, 10, 4],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ filter: "blur(4px)" }}
              />
              {/* Glow layer 1 - closest */}
              <motion.polygon
                points="210,5 220,30 245,30 228,42 236,65 210,52 184,65 192,42 175,30 200,30"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ filter: "blur(2px)" }}
              />
              {/* Main star body */}
              <polygon
                points="210,5 220,30 245,30 228,42 236,65 210,52 184,65 192,42 175,30 200,30"
                fill="#FFD700"
              />
              {/* Inner highlight */}
              <polygon
                points="210,5 220,30 245,30 228,42 236,65 210,52 184,65 192,42 175,30 200,30"
                fill="#FFA500"
                opacity="0.5"
              />
            </motion.g>
          </motion.g>

          {/* Ornaments - inside SVG for correct positioning */}
          {ornamentMessages.map((msg, idx) => {
            const pos = getOrnamentPosition(idx);
            const radius = 12; // Ornament radius in SVG units

            return (
              <motion.g
                key={msg.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.04 }}
                style={{ cursor: "pointer" }}
                onClick={(e) => handleOrnamentClick(msg, e as any)}
              >
                {/* Shadow */}
                <ellipse
                  cx={pos.x + 2}
                  cy={pos.y + 3}
                  rx={radius}
                  ry={radius * 0.8}
                  fill="rgba(0,0,0,0.3)"
                />
                {/* Main ornament */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={pos.color}
                  animate={{
                    cy: [pos.y, pos.y + 2, pos.y],
                  }}
                  transition={{
                    duration: 2.5 + (idx % 3) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (idx % 5) * 0.3,
                  }}
                />
                {/* Highlight/shine */}
                <circle
                  cx={pos.x - 4}
                  cy={pos.y - 4}
                  r={4}
                  fill="rgba(255,255,255,0.5)"
                />
                {/* Hook */}
                <rect
                  x={pos.x - 2}
                  y={pos.y - radius - 4}
                  width={4}
                  height={6}
                  fill="#C0C0C0"
                  rx={1}
                />
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Message Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-md border-4 border-double border-yellow-400 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-3xl text-red-600 dark:text-red-400">
              {selectedMessage?.content.toLowerCase().includes("love")
                ? "My Special Message"
                : "A Christmas Wish"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl mb-4">
              {selectedMessage?.content.toLowerCase().includes("love")
                ? "💝"
                : "🎄"}
            </div>
            <DialogDescription className="text-center text-2xl font-handwriting leading-loose text-slate-800 dark:text-slate-100 px-4">
              {selectedMessage?.content}
            </DialogDescription>
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-red-600 to-green-600" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
