import { useState, useRef, useEffect } from "react";
import { ChristmasTree } from "@/components/ChristmasTree";
import { Snowfall } from "@/components/Snowfall";
import { Message } from "@shared/schema";

// YouTube Player type
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
}

const STATIC_MESSAGES: Message[] = [
  { id: 1, content: "I love you, Selena" },
  { id: 2, content: "You make everything better just by being you" },
  { id: 3, content: "I think about you really often" },
  { id: 4, content: "You're really special to me" },
  {
    id: 5,
    content: "Merry Christmas! 🎄🎅🏻 🎁 \n I wish i could be there with you",
  },
  { id: 6, content: "I hope we can meet soon and have a lot of fun together" },
  { id: 7, content: "I'm grateful to have you in my life" },
  {
    id: 8,
    content:
      "I like you the way you are, curly or straight, you're gorgeous either way",
  },
  { id: 9, content: "You're an amazing person" },
  { id: 10, content: "Your laugh always makes me smile" },
  { id: 11, content: "You bring so much light wherever you go 🌟 like a star" },
  { id: 12, content: "I admire how passionate you are" },
  {
    id: 13,
    content:
      "You have a beautiful heart and thats smth that i really like about you",
  },
  {
    id: 14,
    content:
      "I enjoy every moment we spend together even if its just a text or thru screens",
  },
  { id: 15, content: "I wish you all the happiness this Christmas" },
  { id: 16, content: "You're very important to me" },
  {
    id: 17,
    content: "I love our conversations, even tho we're not talking too much",
  },
  {
    id: 18,
    content: "I hope all your wishes come true and you have a great Christmas",
  },
  { id: 19, content: "Thank you for being you and for being my friend" },
  { id: 20, content: "Life is better with you around 🥰" },
  { id: 21, content: "You're truly one of a kind 💖" },
  { id: 22, content: "You mean a lot to me in case you forgot 🥺" },
  { id: 23, content: "You deserve all the good things in life 💖" },
  { id: 24, content: "I hope this Christmas brings you joy 🎄" },
  {
    id: 25,
    content:
      "You're wonderful, a bit crazy but in a good way, beyond perfection",
  },
];

export default function Home() {
  const messages = STATIC_MESSAGES;
  const [isMuted, setIsMuted] = useState(true); // Começa mutado por causa da política do navegador
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Create player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: "Hd1EeS7wryw",
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: "Hd1EeS7wryw",
        },
        events: {
          onReady: (event: any) => {
            // Navegadores bloqueiam autoplay com som, então começamos mutado
            event.target.mute();
            event.target.playVideo();
            setIsReady(true);
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
        playerRef.current.playVideo(); // Garante que está tocando
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen relative overflow-hidden bg-gradient-to-b from-red-700 via-red-600 to-red-800 transition-colors duration-1000 flex flex-col">
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className={`fixed bottom-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 shadow-lg border border-white/30 ${
          isMuted && isReady ? "animate-pulse ring-2 ring-white/50" : ""
        }`}
        aria-label={isMuted ? "Click to play music" : "Mute music"}
        title={isMuted ? "🎵 Clique para tocar música" : "Silenciar"}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>

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
                  fontSize: `${8 + rand * 12}px`,
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
                  fontSize: `${12 + rand * 16}px`,
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
                  fontSize: `${8 + rand * 12}px`,
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
                  fontSize: `${12 + rand * 16}px`,
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
