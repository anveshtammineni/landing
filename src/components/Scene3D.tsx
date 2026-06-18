import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Shared scroll state updated in window events for high performance (prevents React re-renders)
const scrollData = {
  progress: 0,
  velocity: 0,
  lastY: 0,
  targetVelocity: 0,
};

// Camera Rig to move camera based on scroll progress and cursor pointer, with startup fly-in
function CameraRig() {
  const { camera } = useThree();
  const target = new THREE.Vector3();
  
  const booting = useRef(true);
  const bootAmount = useRef(0);

  useFrame((state, delta) => {
    // 1. Startup Fly-In Animation
    if (booting.current) {
      bootAmount.current += delta * 0.45; // Swoops in over ~2.2 seconds
      if (bootAmount.current >= 1) {
        bootAmount.current = 1;
        booting.current = false;
      }
    }

    // 2. Momentum-based scroll velocity decay
    scrollData.velocity = THREE.MathUtils.lerp(scrollData.velocity, scrollData.targetVelocity, 0.1);
    scrollData.targetVelocity = THREE.MathUtils.lerp(scrollData.targetVelocity, 0, 0.05);

    // Eased boot progression
    const easeT = 1 - Math.pow(1 - bootAmount.current, 3); // cubic ease-out

    // Camera descends from Y = 0 down to Y = -21 as page is scrolled
    const targetY = -scrollData.progress * 21.5;
    
    // Zoom camera out slightly when scrolling fast, and swoop during boot
    const startZ = 13;
    const endZ = 5.5 + scrollData.velocity * 0.5;
    const currentZ = THREE.MathUtils.lerp(startZ, endZ, easeT);

    // Initial pitch offset, then transitions into pointer influence
    const startY = 3.5;
    const currentY = THREE.MathUtils.lerp(startY, targetY, easeT);

    const pointerX = state.pointer.x * 2.2 * easeT;
    const pointerY = state.pointer.y * 1.2 * easeT;

    target.set(pointerX, currentY + pointerY, currentZ);
    camera.position.lerp(target, 0.05);

    // Camera always points slightly ahead
    const lookTarget = new THREE.Vector3(0, currentY, -2);
    camera.lookAt(lookTarget);
  });

  return null;
}

// Dynamic lighting linked to scrolling progress (interpolates color palettes across sections)
function DynamicLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = scrollData.progress;
    
    if (light1Ref.current && light2Ref.current) {
      const color1 = new THREE.Color();
      const color2 = new THREE.Color();
      
      if (p < 0.35) {
        // Hero to Skills: Cyan (#00f2fe) & Purple (#7f00ff) -> Pink (#ff007f) & Cyan (#00f2fe)
        const t = p / 0.35;
        color1.lerpColors(new THREE.Color("#00f2fe"), new THREE.Color("#ff007f"), t);
        color2.lerpColors(new THREE.Color("#7f00ff"), new THREE.Color("#00f2fe"), t);
      } else if (p < 0.7) {
        // Skills to Projects/Timeline: Pink & Cyan -> Violet (#8c52ff) & Dark Indigo (#2e0854)
        const t = (p - 0.35) / 0.35;
        color1.lerpColors(new THREE.Color("#ff007f"), new THREE.Color("#8c52ff"), t);
        color2.lerpColors(new THREE.Color("#00f2fe"), new THREE.Color("#2e0854"), t);
      } else {
        // Projects to Contact: Violet & Indigo -> Deep Amber (#ffa200) & Soft Teal (#00fad6)
        const t = (p - 0.7) / 0.3;
        color1.lerpColors(new THREE.Color("#8c52ff"), new THREE.Color("#ffa200"), t);
        color2.lerpColors(new THREE.Color("#2e0854"), new THREE.Color("#004fac"), t);
      }

      light1Ref.current.color.copy(color1);
      light2Ref.current.color.copy(color2);

      // Lights move vertically with camera to conserve light performance
      const targetY = -p * 21.5;
      light1Ref.current.position.y = targetY + 6;
      light2Ref.current.position.y = targetY - 6;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[6, 5, 2]} intensity={2.2} />
      <pointLight ref={light2Ref} position={[-6, -5, 2]} intensity={1.8} />
    </>
  );
}

// Particle field
function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points on a sphere
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 8 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((_, delta) => {
    if (ref.current) {
      // Starfield rotation speed increases with scroll velocity
      const rotationSpeed = delta * (0.015 + scrollData.velocity * 0.15);
      ref.current.rotation.y += rotationSpeed;
      ref.current.rotation.x += rotationSpeed * 0.3;
      
      // Star tunnel zoom based on velocity
      const targetZ = scrollData.velocity * 0.7;
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.1);

      // Follow camera Y axis
      const targetY = -scrollData.progress * 21.5;
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.1);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f2fe"
          size={0.045}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// Interactive Skills Neural Network (Y = -8)
function NeuralNetwork() {
  const lineRef = useRef<THREE.LineSegments>(null);

  const nodeCount = 8;
  const initialNodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2;
    return {
      x: Math.cos(angle) * 2.2 + (Math.random() - 0.5) * 0.6,
      y: -8 + Math.sin(angle) * 1.5 + (Math.random() - 0.5) * 0.6,
      z: (Math.random() - 0.5) * 1.0,
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      vz: (Math.random() - 0.5) * 0.012,
    };
  });

  const nodesRef = useRef(initialNodes);
  const sphereRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const nodes = nodesRef.current;
    const pointer = state.pointer;
    
    // Project mouse cursor to node coordinate space (Y = -8 plane)
    const px = pointer.x * 4.2;
    const py = pointer.y * 3.2 - 8;

    nodes.forEach((node, idx) => {
      // Float animation
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      // Outer boundary limits
      if (Math.abs(node.x) > 3.8) node.vx *= -1;
      if (Math.abs(node.y + 8) > 2.2) node.vy *= -1;
      if (Math.abs(node.z) > 1.8) node.vz *= -1;

      // Mouse magnetic repulsion
      const dx = px - node.x;
      const dy = py - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.8) {
        const force = (1.8 - dist) * 0.018;
        node.x -= (dx / dist) * force;
        node.y -= (dy / dist) * force;
      }

      // Map positions to actual meshes
      const mesh = sphereRefs.current[idx];
      if (mesh) {
        mesh.position.set(node.x, node.y, node.z);
      }
    });

    // Update connection line coordinates
    if (lineRef.current) {
      const positions: number[] = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < 2.2) {
            positions.push(n1.x, n1.y, n1.z);
            positions.push(n2.x, n2.y, n2.z);
          }
        }
      }
      
      const geo = lineRef.current.geometry;
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {initialNodes.map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) sphereRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshPhysicalMaterial
            color="#ff007f"
            emissive="#ff007f"
            emissiveIntensity={1.2}
            roughness={0.1}
            transmission={0.8}
          />
        </mesh>
      ))}
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#00f2fe" transparent opacity={0.35} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// 3D Glass Geometries Timeline
function StorytellingGeometries() {
  const torusRef = useRef<THREE.Mesh>(null);
  const cube1Ref = useRef<THREE.Mesh>(null);
  const cube2Ref = useRef<THREE.Mesh>(null);
  
  const aboutCubeRef1 = useRef<THREE.Mesh>(null);
  const aboutCubeRef2 = useRef<THREE.Mesh>(null);
  
  const projectSphereRef = useRef<THREE.Mesh>(null);
  const projectMeshRef = useRef<THREE.Mesh>(null);
  
  const expRef1 = useRef<THREE.Mesh>(null);
  const expRef2 = useRef<THREE.Mesh>(null);
  const expRef3 = useRef<THREE.Mesh>(null);

  const contactCoreRef = useRef<THREE.Points>(null);

  // Core contact particle coordinates initialization
  const pCount = 350;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 0.85;
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const spinSpeed = delta * (1.2 + scrollData.velocity * 3.5);

    // 1. Hero Ring & Glass Cubes (Y = 0)
    if (torusRef.current) {
      torusRef.current.rotation.x += spinSpeed * 0.15;
      torusRef.current.rotation.y += spinSpeed * 0.22;
      torusRef.current.position.y = Math.sin(time * 1.5) * 0.15;
    }
    if (cube1Ref.current) {
      cube1Ref.current.rotation.y += spinSpeed * 0.4;
      cube1Ref.current.position.y = 0.8 + Math.sin(time * 2.0) * 0.1;
    }
    if (cube2Ref.current) {
      cube2Ref.current.rotation.x += spinSpeed * 0.3;
      cube2Ref.current.position.y = -0.8 + Math.sin(time * 1.8) * 0.1;
    }

    // 2. About Glass Cubes (Y = -4)
    if (aboutCubeRef1.current) {
      aboutCubeRef1.current.rotation.x += spinSpeed * 0.25;
      aboutCubeRef1.current.rotation.y += spinSpeed * 0.2;
      aboutCubeRef1.current.position.y = -4 + Math.sin(time * 1.4) * 0.2;
    }
    if (aboutCubeRef2.current) {
      aboutCubeRef2.current.rotation.y += spinSpeed * 0.3;
      aboutCubeRef2.current.rotation.z += spinSpeed * 0.25;
      aboutCubeRef2.current.position.y = -4.2 + Math.sin(time * 1.1) * 0.15;
    }

    // 3. Projects Glass Dodecahedron inside Sphere (Y = -12)
    if (projectSphereRef.current) {
      projectSphereRef.current.rotation.y += spinSpeed * 0.1;
      projectSphereRef.current.position.y = -12 + Math.sin(time * 1.2) * 0.15;
    }
    if (projectMeshRef.current) {
      projectMeshRef.current.rotation.x += spinSpeed * 0.35;
      projectMeshRef.current.rotation.y += spinSpeed * 0.25;
      projectMeshRef.current.position.y = -12 + Math.sin(time * 1.2) * 0.15;
    }

    // 4. Experience Glow Nodes (Y = -16)
    if (expRef1.current) {
      expRef1.current.rotation.y += spinSpeed * 0.4;
      expRef1.current.position.y = -15.5 + Math.sin(time * 1.6) * 0.12;
    }
    if (expRef2.current) {
      expRef2.current.rotation.x += spinSpeed * 0.35;
      expRef2.current.position.y = -16.5 + Math.sin(time * 1.3) * 0.1;
    }
    if (expRef3.current) {
      expRef3.current.rotation.z += spinSpeed * 0.45;
      expRef3.current.position.y = -17.5 + Math.sin(time * 1.5) * 0.12;
    }

    // 5. Contact Core Particle Convergence (Y = -21.5)
    if (contactCoreRef.current) {
      contactCoreRef.current.rotation.y += delta * (0.25 + scrollData.velocity * 0.8);
      contactCoreRef.current.rotation.x += delta * 0.1;
      // Pulse animation: converges (shrinks) when static, expands slightly on scroll
      const pulse = 0.8 + Math.sin(time * 1.6) * 0.04 + scrollData.velocity * 0.22;
      contactCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* SECTION 1: HERO (Y = 0) */}
      <mesh ref={torusRef} position={[1.4, 0, -1]}>
        <torusGeometry args={[0.9, 0.15, 16, 64]} />
        <meshPhysicalMaterial
          color="#00f2fe"
          roughness={0.1}
          metalness={0.8}
          transmission={0.85}
          thickness={1.5}
          ior={1.6}
          clearcoat={1.0}
        />
      </mesh>
      <mesh ref={cube1Ref} position={[2.2, 0.8, -2.5]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshPhysicalMaterial
          color="#8c52ff"
          roughness={0.05}
          transmission={0.9}
          thickness={1}
        />
      </mesh>
      <mesh ref={cube2Ref} position={[0.6, -0.8, -2]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshPhysicalMaterial
          color="#ff007f"
          roughness={0.1}
          transmission={0.9}
          thickness={0.8}
        />
      </mesh>

      {/* SECTION 2: ABOUT (Y = -4) */}
      <mesh ref={aboutCubeRef1} position={[-2.4, -4, -3]}>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshPhysicalMaterial
          color="#8c52ff"
          roughness={0.08}
          transmission={0.85}
          thickness={1.2}
          ior={1.5}
          clearcoat={1}
        />
      </mesh>
      <mesh ref={aboutCubeRef2} position={[-1.2, -4.2, -4]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color="#00f2fe"
          roughness={0.05}
          transmission={0.9}
          thickness={1}
        />
      </mesh>

      {/* SECTION 3: SKILLS (Y = -8) -> Controlled in NeuralNetwork component */}

      {/* SECTION 4: PROJECTS (Y = -12) */}
      <mesh ref={projectSphereRef} position={[2.5, -12, -3.2]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.02}
          transmission={0.98}
          thickness={1.8}
          ior={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh ref={projectMeshRef} position={[2.5, -12, -3.2]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshPhysicalMaterial
          color="#ff007f"
          roughness={0.1}
          metalness={0.8}
          emissive="#ff007f"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* SECTION 5: EXPERIENCE (Y = -16) */}
      <mesh ref={expRef1} position={[-2.4, -15.5, -2.8]}>
        <octahedronGeometry args={[0.35]} />
        <meshPhysicalMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={1.0}
        />
      </mesh>
      <mesh ref={expRef2} position={[-2.4, -16.5, -2.8]}>
        <octahedronGeometry args={[0.35]} />
        <meshPhysicalMaterial
          color="#8c52ff"
          emissive="#8c52ff"
          emissiveIntensity={1.0}
        />
      </mesh>
      <mesh ref={expRef3} position={[-2.4, -17.5, -2.8]}>
        <octahedronGeometry args={[0.35]} />
        <meshPhysicalMaterial
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* SECTION 6: CONTACT & CORE (Y = -21.5) */}
      <points ref={contactCoreRef} position={[0, -21.5, -1]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00f2fe"
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function Scene3D() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollData.progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      const diff = Math.abs(scrollY - scrollData.lastY);
      scrollData.targetVelocity = Math.min(diff * 0.05, 3.8); // Scale scroll velocity
      scrollData.lastY = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full bg-[#030014]">
      {/* Background radial gradient overlay for ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,8,40,0.4),rgba(3,0,20,1))]" />
      
      {/* Floating Aurora backgrounds */}
      <div className="aurora-bg aurora-cyan" />
      <div className="aurora-bg aurora-purple" />
      <div className="aurora-bg aurora-pink" />
      
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={1.0} color="#ffffff" />
        
        <Suspense fallback={null}>
          <StarField />
          <NeuralNetwork />
          <StorytellingGeometries />
          <DynamicLights />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
