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
      
      {/* Decorative Corner Ribbons */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-30 -rotate-45 transform -translate-x-16 -translate-y-16 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent opacity-30 rotate-45 transform translate-x-16 -translate-y-16 pointer-events-none" />

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
