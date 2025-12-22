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
  { id: 12, content: "Live each moment with joy and passion." },
  { id: 13, content: "You make my heart shine brighter." },
  { id: 14, content: "Every moment with you is a gift." },
  { id: 15, content: "Wishing you warmth and joy." },
  { id: 16, content: "You are my greatest blessing." },
  { id: 17, content: "Together we create magic." },
  { id: 18, content: "May your wishes come true." },
  { id: 19, content: "Thank you for being you." },
  { id: 20, content: "Life is better with you." }
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
            My Christmas gift to you my Selsell
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-body drop-shadow">
            Click on an ornament to reveal a special Christmas message.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex items-center justify-center max-w-2xl mx-auto">
          <ChristmasTree messages={messages} />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-white/80 font-body drop-shadow pb-2">
          <p>© {new Date().getFullYear()} Made with ❤️ and Christmas spirit</p>
        </footer>
      </main>
    </div>
  );
}
