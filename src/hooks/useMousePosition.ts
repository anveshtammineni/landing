import { useState, useEffect } from "react";

export interface MousePosition {
  x: number;
  y: number;
  xPct: number;
  yPct: number;
}

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    xPct: 0,
    yPct: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // Calculate position relative to center: from -0.5 to 0.5
      const xPct = (clientX / innerWidth) - 0.5;
      const yPct = (clientY / innerHeight) - 0.5;

      setMousePosition({
        x: clientX,
        y: clientY,
        xPct,
        yPct,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
};
