import { ChristmasTree } from "@/components/ChristmasTree";
import { Snowfall } from "@/components/Snowfall";
import { Message } from "@shared/schema";

const STATIC_MESSAGES: Message[] = [
  { id: 1, content: "I love you" },
  { id: 2, content: "Merry Christmas and Happy New Year!" },
  { id: 3, content: "May the magic of Christmas shine in your heart." },
  { id: 4, content: "Health, love, and success!" },
  { id: 5, content: "Happy holidays and may all your wishes come true!" },
  { id: 6, content: "A new year full of hope and dreams!" },
  { id: 7, content: "Gratitude for all the beautiful moments." },
  { id: 8, content: "Believe in your dreams!" },
  { id: 9, content: "The best gift is love." },
  { id: 10, content: "Smile, it's Christmas!" },
  { id: 11, content: "Spread light wherever you go." },
  { id: 12, content: "Live each moment with joy and passion." }
];

export default function Home() {
  const messages = STATIC_MESSAGES;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-red-700 via-red-600 to-red-800 transition-colors duration-1000">
      <Snowfall />
      
      {/* Top Snow Arc Decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-40 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            <filter id="snowGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          {/* Main arc curve */}
          <path
            d="M 0,150 Q 300,20 600,0 T 1200,150"
            fill="none"
            stroke="white"
            strokeWidth="80"
            opacity="0.4"
            filter="url(#snowGlow)"
          />
          {/* Additional curves for depth */}
          <path
            d="M 100,180 Q 400,80 600,60 T 1100,180"
            fill="none"
            stroke="white"
            strokeWidth="40"
            opacity="0.25"
            filter="url(#snowGlow)"
          />
        </svg>
      </div>

      {/* Left Garland */}
      <div className="absolute top-16 left-0 w-48 h-48 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <path
            d="M 0,50 Q 50,20 100,30 T 200,50"
            fill="none"
            stroke="white"
            strokeWidth="12"
            opacity="0.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.6" />
          <circle cx="100" cy="30" r="8" fill="white" opacity="0.6" />
          <circle cx="150" cy="50" r="8" fill="white" opacity="0.6" />
        </svg>
      </div>

      {/* Right Garland */}
      <div className="absolute top-16 right-0 w-48 h-48 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <path
            d="M 0,50 Q 50,20 100,30 T 200,50"
            fill="none"
            stroke="white"
            strokeWidth="12"
            opacity="0.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.6" />
          <circle cx="100" cy="30" r="8" fill="white" opacity="0.6" />
          <circle cx="150" cy="50" r="8" fill="white" opacity="0.6" />
        </svg>
      </div>

      {/* Floating Snow Specs Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-40 animate-pulse"
            style={{
              width: Math.random() * 3 + 2 + 'px',
              height: Math.random() * 3 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `drift ${6 + Math.random() * 10}s linear infinite`,
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes drift {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(100vh) translateX(50px);
            opacity: 0;
          }
        }
      `}</style>

      <main className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center min-h-screen">
        
        {/* Header Section */}
        <header className="text-center mt-8 mb-4 space-y-2">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-lg tracking-wide">
            My Christmas gift to you my Selsell
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-body max-w-lg mx-auto drop-shadow">
            Click on an ornament to reveal a special Christmas message.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex items-center justify-center">
          <ChristmasTree messages={messages} />
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-sm text-white/80 font-body drop-shadow">
          <p>© {new Date().getFullYear()} Made with ❤️ and Christmas spirit</p>
        </footer>
      </main>
    </div>
  );
}
