import { ChristmasTree } from "@/components/ChristmasTree";
import { Snowfall } from "@/components/Snowfall";
import { Message } from "@shared/schema";

const STATIC_MESSAGES: Message[] = [
  { id: 1, content: "Muita paz e alegria!" },
  { id: 2, content: "Feliz Natal e próspero Ano Novo!" },
  { id: 3, content: "Que a magia do Natal ilumine sua vida." },
  { id: 4, content: "Saúde, amor e sucesso!" },
  { id: 5, content: "Boas festas e muitas realizações!" },
  { id: 6, content: "Um ano novo cheio de esperança!" },
  { id: 7, content: "Gratidão por tudo que passou." },
  { id: 8, content: "Acredite nos seus sonhos!" },
  { id: 9, content: "O melhor presente é o amor." },
  { id: 10, content: "Sorria, é Natal!" },
  { id: 11, content: "Espalhe luz por onde for." },
  { id: 12, content: "Viva cada momento com intensidade." }
];

export default function Home() {
  const messages = STATIC_MESSAGES;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-1000">
      <Snowfall />
      
      {/* Decorative Corner Ribbons (CSS-only triangles) */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-600 to-transparent opacity-20 -rotate-45 transform -translate-x-16 -translate-y-16 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-600 to-transparent opacity-20 rotate-45 transform translate-x-16 -translate-y-16 pointer-events-none" />

      <main className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center min-h-screen">
        
        {/* Header Section */}
        <header className="text-center mt-8 mb-4 space-y-2">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary dark:text-green-400 text-shadow-glow tracking-wide">
            Árvore dos Desejos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-lg mx-auto">
            Clique em um ornamento para revelar uma mensagem especial de Natal.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex items-center justify-center">
          <ChristmasTree messages={messages} />
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-sm text-muted-foreground font-body">
          <p>© {new Date().getFullYear()} Feito com ❤️ e espírito natalino</p>
        </footer>
      </main>
    </div>
  );
}
