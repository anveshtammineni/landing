import { useEffect, useRef } from "react";

interface Node {
  index: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  depth: 0 | 1 | 2; // 0 = Far, 1 = Mid, 2 = Near
  baseAlpha: number;
  speedMult: number;
  maxDist: number;
}

interface Pulse {
  from: Node;
  to: Node;
  progress: number;
  speed: number;
  color: string;
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<Node[]>([]);
  const pulses = useRef<Pulse[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });
  
  const scroll = useRef({
    progress: 0,
    velocity: 0,
    lastY: 0,
    targetVelocity: 0,
  });

  const lastMilestone = useRef(0);
  const burstActivity = useRef(0); // Boosted activity that decays

  const colors = ["#00f2fe", "#7f00ff", "#ff007f"]; // Cyan, Purple, Pink

  // Helper to calculate distance
  const getDistance = (n1: { x: number; y: number }, n2: { x: number; y: number }) => {
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Spawns a batch of high-speed pulses (used on mount & section entry milestones)
    const triggerSectionBurst = (pulseCount: number) => {
      burstActivity.current = 1.0; // max activity spike
      const currentNodes = nodes.current;
      if (currentNodes.length === 0) return;

      for (let k = 0; k < pulseCount; k++) {
        const fromNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
        const neighbors = currentNodes.filter(
          (n) => n !== fromNode && n.depth === fromNode.depth && getDistance(fromNode, n) < fromNode.maxDist
        );
        if (neighbors.length > 0) {
          const toNode = neighbors[Math.floor(Math.random() * neighbors.length)];
          pulses.current.push({
            from: fromNode,
            to: toNode,
            progress: 0,
            speed: 0.035 + Math.random() * 0.03, // faster speed for bursts
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    };

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      // Adjust node density: cover 35-50% of viewport with active connections
      // Capped between 180 and 250 nodes as requested
      const count = Math.min(Math.max(Math.floor((w * h) / 6000), 180), 250);
      
      const newNodes: Node[] = [];
      for (let i = 0; i < count; i++) {
        const randColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Distribute layers: 60% Far, 30% Mid, 10% Near
        const randVal = Math.random();
        let depth: 0 | 1 | 2 = 0;
        let radius = 0.8 + Math.random() * 0.7; // Far: 0.8px - 1.5px
        let baseAlpha = 0.35;
        let speedMult = 0.4;
        let maxDist = 80;

        if (randVal > 0.6 && randVal <= 0.9) {
          depth = 1; // Mid: 1.5px - 2.8px
          radius = 1.5 + Math.random() * 1.3;
          baseAlpha = 0.65;
          speedMult = 1.0;
          maxDist = 115;
        } else if (randVal > 0.9) {
          depth = 2; // Near: 2.8px - 4.5px
          radius = 2.8 + Math.random() * 1.7;
          baseAlpha = 0.95;
          speedMult = 1.8;
          maxDist = 155;
        }

        newNodes.push({
          index: i,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius,
          color: randColor,
          depth,
          baseAlpha,
          speedMult,
          maxDist,
        });
      }
      nodes.current = newNodes;
      pulses.current = [];
      triggerSectionBurst(15); // initial trigger
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track scroll velocity and detect section crossovers
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current.progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      const diff = Math.abs(scrollY - scroll.current.lastY);
      scroll.current.targetVelocity = Math.min(diff * 0.05, 4.0); // capped speed boost
      scroll.current.lastY = scrollY;

      // Section entry burst: trigger every 80% of window height scrolled
      const currentMilestone = Math.floor(scrollY / (window.innerHeight * 0.8));
      if (currentMilestone !== lastMilestone.current) {
        triggerSectionBurst(18); // Trigger 18-pulse burst
        lastMilestone.current = currentMilestone;
      }
    };

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Core Animation Frame Loop
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Center Exclusion Zone Ellipse Math (keeps area behind text clean)
      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.24; // clean width
      const ry = h * 0.20; // clean height

      const getCenterFade = (x: number, y: number) => {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const distSq = dx * dx + dy * dy;
        if (distSq < 0.55) return 0.05; // almost fully hidden inside core
        if (distSq < 1.0) {
          const t = (distSq - 0.55) / 0.45;
          return 0.05 + t * 0.95; // smooth step up
        }
        return 1.0;
      };

      // Clear with dark alpha overlay for slight signal trail
      ctx.fillStyle = "rgba(3, 0, 20, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // Decay scroll velocity and burst activity
      scroll.current.velocity = lerp(scroll.current.velocity, scroll.current.targetVelocity, 0.1);
      scroll.current.targetVelocity = lerp(scroll.current.targetVelocity, 0, 0.05);
      burstActivity.current = lerp(burstActivity.current, 0, 0.015); // decays slowly

      const netSpeed = 1 + scroll.current.velocity * 3.5 + burstActivity.current * 2.0;
      const currentNodes = nodes.current;
      const currentPulses = pulses.current;

      // 1. Draw Mouse Ambient Glow Halo
      if (mouse.current.active) {
        const grad = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 10,
          mouse.current.x, mouse.current.y, 180
        );
        grad.addColorStop(0, "rgba(0, 242, 254, 0.12)");
        grad.addColorStop(0.5, "rgba(127, 0, 255, 0.04)");
        grad.addColorStop(1, "rgba(3, 0, 20, 0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Map connection pulses in O(1) Set to highlight active paths
      const activeKeys = new Set<string>();
      currentPulses.forEach((p) => {
        activeKeys.add(`${p.from.index}-${p.to.index}`);
      });

      // 2. Update and Draw Nodes
      currentNodes.forEach((node) => {
        // Apply velocity with speed boost multiplier
        node.x += node.vx * netSpeed * node.speedMult;
        node.y += node.vy * netSpeed * node.speedMult;

        // Bounce on screen bounds
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        // Mouse pointer gravity / deflection field
        if (mouse.current.active) {
          const dx = mouse.current.x - node.x;
          const dy = mouse.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            // Deflect nodes slightly outward from cursor
            const force = (160 - dist) * 0.02 * (node.depth === 2 ? 1.5 : 0.8);
            node.x -= (dx / dist) * force;
            node.y -= (dy / dist) * force;
          }
        }

        // Apply text exclusion zone fade
        const fade = getCenterFade(node.x, node.y);
        const radius = node.radius * fade;
        const opacity = node.baseAlpha * fade * (1 + scroll.current.velocity * 0.15);

        // Draw outer concentric glowing halo (For mid and near layers)
        if (node.depth >= 1 && fade > 0.1) {
          ctx.fillStyle = hexToRgb(node.color, opacity * 0.25);
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * (node.depth === 2 ? 3.5 : 2.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw solid node dot
        ctx.fillStyle = hexToRgb(node.color, opacity);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Connection Lines
      for (let i = 0; i < currentNodes.length; i++) {
        const n1 = currentNodes[i];
        const fade1 = getCenterFade(n1.x, n1.y);
        if (fade1 < 0.1) continue; // Skip lines in clean center zone

        for (let j = i + 1; j < currentNodes.length; j++) {
          const n2 = currentNodes[j];
          
          // Connect only within the same depth layer to preserve 3D parallax layers
          if (n1.depth !== n2.depth) continue;

          const dist = getDistance(n1, n2);
          if (dist < n1.maxDist) {
            const fade2 = getCenterFade(n2.x, n2.y);
            const combinedFade = fade1 * fade2;
            if (combinedFade < 0.1) continue;

            const baseAlpha = (1 - dist / n1.maxDist) * (n1.depth === 2 ? 0.48 : n1.depth === 1 ? 0.32 : 0.18);
            const scrollAlphaMultiplier = 1 + scroll.current.velocity * 0.9 + burstActivity.current * 0.5;
            const finalAlpha = baseAlpha * combinedFade * scrollAlphaMultiplier;

            // Check if connection is actively carrying a pulse
            const isActive = activeKeys.has(`${n1.index}-${n2.index}`) || activeKeys.has(`${n2.index}-${n1.index}`);

            if (isActive) {
              // Highlight active pathways carrying computations
              ctx.strokeStyle = hexToRgb(n1.color, 0.85 * combinedFade);
              ctx.lineWidth = n1.depth === 2 ? 2.0 : 1.4;
            } else {
              // Standard passive line
              ctx.strokeStyle = `rgba(100, 80, 240, ${finalAlpha})`;
              ctx.lineWidth = n1.depth === 2 ? 1.05 : n1.depth === 1 ? 0.75 : 0.45;
            }

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Mouse Links
      if (mouse.current.active) {
        currentNodes.forEach((node) => {
          const dist = getDistance(mouse.current, node);
          const fade = getCenterFade(node.x, node.y);
          if (dist < 170 && fade > 0.1) {
            const alpha = (1 - dist / 170) * 0.42 * fade;
            ctx.strokeStyle = hexToRgb("#00f2fe", alpha);
            ctx.lineWidth = node.depth === 2 ? 1.4 : 0.8;
            ctx.beginPath();
            ctx.moveTo(mouse.current.x, mouse.current.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        });
      }

      // 5. Ambient Active Pulse Loop Spawning
      // Maintain a base level of computing activity in the background
      const minPulses = 12 + Math.floor(burstActivity.current * 15);
      if (currentPulses.length < minPulses) {
        const fromNode = currentNodes[Math.floor(Math.random() * currentNodes.length)];
        const neighbors = currentNodes.filter(
          (n) => n !== fromNode && n.depth === fromNode.depth && getDistance(fromNode, n) < fromNode.maxDist
        );
        if (neighbors.length > 0) {
          const toNode = neighbors[Math.floor(Math.random() * neighbors.length)];
          currentPulses.push({
            from: fromNode,
            to: toNode,
            progress: 0,
            speed: 0.012 + Math.random() * 0.015,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      // 6. Update and Draw Traveling Pulses
      for (let i = currentPulses.length - 1; i >= 0; i--) {
        const pulse = currentPulses[i];
        
        // Speed up pulses when scrolling
        pulse.progress += pulse.speed * (1 + scroll.current.velocity * 3.5 + burstActivity.current * 1.5);

        if (pulse.progress >= 1) {
          const nextNode = pulse.to;
          currentPulses.splice(i, 1);

          // Signal propagation flow (55% chance to trigger neighbor pulse)
          if (Math.random() < 0.55 && currentPulses.length < 45) {
            const nextNeighbors = currentNodes.filter(
              (n) => n !== nextNode && n.depth === nextNode.depth && getDistance(nextNode, n) < nextNode.maxDist
            );
            if (nextNeighbors.length > 0) {
              const nextTarget = nextNeighbors[Math.floor(Math.random() * nextNeighbors.length)];
              currentPulses.push({
                from: nextNode,
                to: nextTarget,
                progress: 0,
                speed: 0.012 + Math.random() * 0.015,
                color: colors[Math.floor(Math.random() * colors.length)],
              });
            }
          }
          continue;
        }

        const fade = getCenterFade(
          pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress,
          pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress
        );
        if (fade < 0.1) continue; // Hide inside exclusion zone

        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;
        
        const pulseRadius = (pulse.from.depth === 2 ? 6.5 : pulse.from.depth === 1 ? 4.5 : 3.0) * fade;

        // Concentric outer halo (For Mid and Near layers)
        if (pulse.from.depth >= 1) {
          ctx.fillStyle = hexToRgb(pulse.color, 0.42 * fade);
          ctx.beginPath();
          ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner solid pulse core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, (pulse.from.depth === 2 ? 2.5 : pulse.from.depth === 1 ? 1.8 : 1.1) * fade, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Linear interpolation
  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  // Hex to RGB parser with alpha transparency
  const hexToRgb = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full bg-[#030014] pointer-events-none"
    />
  );
}
