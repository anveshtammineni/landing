import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  className?: string;
}

export default function Magnetic({ children, range = 60, strength = 0.35, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate center of element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance from mouse to center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // If mouse is within range, translate
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < range) {
      setPosition({ x: distanceX * strength, y: distanceY * strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`magnetic-wrap ${className}`}
    >
      {children}
    </motion.div>
  );
}
