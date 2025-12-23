import { ChristmasTree } from "@/components/ChristmasTree";
import { Snowfall } from "@/components/Snowfall";
import { Message } from "@shared/schema";

const STATIC_MESSAGES: Message[] = [
  { id: 1, content: "I love you, Selena" },
  { id: 2, content: "You make everything better just by being you" },
  { id: 3, content: "I think about you often" },
  { id: 4, content: "You're really special to me" },
  { id: 5, content: "Merry Christmas, Selena" },
  { id: 6, content: "Meeting you was wonderful" },
  { id: 7, content: "I'm grateful to have you in my life" },
  { id: 8, content: "I believe in you and your dreams" },
  { id: 9, content: "You're an amazing person" },
  { id: 10, content: "Your laugh always makes me smile" },
  { id: 11, content: "You bring so much light wherever you go" },
  { id: 12, content: "I admire how passionate you are" },
  { id: 13, content: "You have a beautiful heart" },
  { id: 14, content: "I enjoy every moment we spend together" },
  { id: 15, content: "I wish you all the happiness this Christmas" },
  { id: 16, content: "You're important to me" },
  { id: 17, content: "I love our conversations" },
  { id: 18, content: "I hope all your wishes come true" },
  { id: 19, content: "Thank you for being you" },
  { id: 20, content: "Life is better with you around" },
  { id: 21, content: "You're truly one of a kind" },
  { id: 22, content: "You mean a lot to me" },
  { id: 23, content: "You deserve all the good things in life" },
  { id: 24, content: "I hope this Christmas brings you joy" },
  { id: 25, content: "You're wonderful, Selena" }
];

export default function Home() {
  const messages = STATIC_MESSAGES;

  return (
    <div className="fixed inset-0 w-screen h-screen relative overflow-hidden bg-gradient-to-b from-red-700 via-red-600 to-red-800 transition-colors duration-1000 flex flex-col">
      <Snowfall />

      <main className="flex-1 flex flex-col items-center justify-between px-4 relative z-10">
        
        {/* Header Section */}
        <header className="text-center py-4 space-y-1">
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-white drop-shadow-lg">
            My Christmas gift to you, Selena
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-body drop-shadow">
            Click on an ornament to reveal a special Christmas message.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex items-center justify-center max-w-2xl mx-auto">
          <ChristmasTree messages={messages} />
        </div>
      </main>

      {/* Side Decorations */}
      <div className="absolute left-0 top-0 w-32 h-full pointer-events-none z-0">
        <div className="relative w-full h-full">
          {/* Snowflakes */}
          {[...Array(15)].map((_, i) => {
            const seed = (i * 12345) ^ 67890;
            const rand = Math.abs(Math.sin(seed) * 10000) % 1;
            return (
              <div
                key={`left-snowflake-${i}`}
                className="absolute text-white/30"
                style={{
                  left: `${rand * 100}%`,
                  top: `${(i * 7) % 100}%`,
                  fontSize: `${8 + (rand * 12)}px`,
                  animation: `float ${3 + rand * 2}s ease-in-out infinite`,
                  animationDelay: `${rand * 2}s`,
                }}
              >
                ❄
              </div>
            );
          })}
          {/* Stars */}
          {[...Array(8)].map((_, i) => {
            const seed = (i * 54321) ^ 98765;
            const rand = Math.abs(Math.sin(seed) * 10000) % 1;
            return (
              <div
                key={`left-star-${i}`}
                className="absolute text-white/40"
                style={{
                  left: `${rand * 100}%`,
                  top: `${(i * 12) % 100}%`,
                  fontSize: `${12 + (rand * 16)}px`,
                  animation: `twinkle ${2 + rand * 1.5}s ease-in-out infinite`,
                  animationDelay: `${rand * 1.5}s`,
                }}
              >
                ✨
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute right-0 top-0 w-32 h-full pointer-events-none z-0">
        <div className="relative w-full h-full">
          {/* Snowflakes */}
          {[...Array(15)].map((_, i) => {
            const seed = (i * 23456) ^ 78901;
            const rand = Math.abs(Math.sin(seed) * 10000) % 1;
            return (
              <div
                key={`right-snowflake-${i}`}
                className="absolute text-white/30"
                style={{
                  right: `${rand * 100}%`,
                  top: `${(i * 7) % 100}%`,
                  fontSize: `${8 + (rand * 12)}px`,
                  animation: `float ${3 + rand * 2}s ease-in-out infinite`,
                  animationDelay: `${rand * 2}s`,
                }}
              >
                ❄
              </div>
            );
          })}
          {/* Stars */}
          {[...Array(8)].map((_, i) => {
            const seed = (i * 65432) ^ 10987;
            const rand = Math.abs(Math.sin(seed) * 10000) % 1;
            return (
              <div
                key={`right-star-${i}`}
                className="absolute text-white/40"
                style={{
                  right: `${rand * 100}%`,
                  top: `${(i * 12) % 100}%`,
                  fontSize: `${12 + (rand * 16)}px`,
                  animation: `twinkle ${2 + rand * 1.5}s ease-in-out infinite`,
                  animationDelay: `${rand * 1.5}s`,
                }}
              >
                ✨
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
