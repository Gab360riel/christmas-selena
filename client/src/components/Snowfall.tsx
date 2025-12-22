import { useEffect, useState } from "react";

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Create 40 snowflakes for more impact on red background
    setSnowflakes(Array.from({ length: 40 }, (_, i) => i));
  }, []);

  return (
    <div className="snow-container" aria-hidden="true">
      {snowflakes.map((i) => {
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 12;
        const delay = Math.random() * 5;
        const size = 0.6 + Math.random() * 1.2;
        
        return (
          <div
            key={i}
            className="snowflake text-white"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `scale(${size})`,
              opacity: 0.9,
            }}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
}
