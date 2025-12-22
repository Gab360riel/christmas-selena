import { useEffect, useState } from "react";

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Create 30 snowflakes
    setSnowflakes(Array.from({ length: 30 }, (_, i) => i));
  }, []);

  return (
    <div className="snow-container" aria-hidden="true">
      {snowflakes.map((i) => {
        const left = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const size = 0.5 + Math.random() * 1;
        
        return (
          <div
            key={i}
            className="snowflake text-slate-200 dark:text-slate-700"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `scale(${size})`,
            }}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
}
