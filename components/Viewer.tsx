import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ModelDef } from '../types';

// Add type definitions for R3F elements to satisfy TypeScript since they are missing in the environment
// Augment both global and React module JSX namespaces to ensure compatibility with different TS setups
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      torusKnotGeometry: any;
      cylinderGeometry: any;
      lineLoop: any;
      lineBasicMaterial: any;
      extrudeGeometry: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      color: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      torusKnotGeometry: any;
      cylinderGeometry: any;
      lineLoop: any;
      lineBasicMaterial: any;
      extrudeGeometry: any;
      boxGeometry: any;
      meshBasicMaterial: any;
      color: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface ViewerProps {
  model: ModelDef;
}

// --- Shape Generators ---

const HeartShape: React.FC<{ params: any }> = ({ params }) => {
  const count = Number(params.particles) || 1500;
  const scale = Number(params.scale) || 1;
  const color = params.color || '#ff5f9f';

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      // Distribute points somewhat inside the volume
      const r = Math.pow(Math.random(), 0.3); // Bias towards surface
      
      // Heart equations
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.random() - 0.5) * 4; // Thickness

      pos[i * 3] = x * scale * r * 0.1;
      pos[i * 3 + 1] = y * scale * r * 0.1;
      pos[i * 3 + 2] = z * scale * r * 0.1;
    }
    return pos;
  }, [count, scale]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const SaturnShape: React.FC<{ params: any }> = ({ params }) => {
  const pScale = Number(params.planetScale) || 4;
  const rDist = Number(params.ringDist) || 8;
  const rWidth = Number(params.ringWidth) || 2;
  const color = params.color || '#f2c94c';

  return (
    <group>
      {/* Planet */}
      <mesh>
        <sphereGeometry args={[pScale * 0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {/* Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[rDist * 0.5, rWidth * 0.1, 2, 64]} />
        <meshStandardMaterial color="#8bc5ff" emissive="#8bc5ff" emissiveIntensity={0.8} wireframe />
      </mesh>
      <Sparkles count={50} scale={pScale * 3} size={2} speed={0.2} opacity={0.5} color={color} />
    </group>
  );
};

const TorusKnotShape: React.FC<{ params: any }> = ({ params }) => {
  const p = Number(params.p) || 2;
  const q = Number(params.q) || 3;
  const radius = Number(params.radius) || 5;
  const tube = Number(params.tubeRadius) || 1.5;
  const color = params.color || '#9b7bff';

  return (
    <mesh>
      <torusKnotGeometry args={[radius * 0.5, tube * 0.2, 128, 16, p, q]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} wireframe />
    </mesh>
  );
};

const FlowerShape: React.FC<{ params: any }> = ({ params }) => {
  const k = Number(params.k) || 4;
  const rBase = Number(params.radius) || 8;
  const color = params.color || '#ff6bd6';
  
  // Rose curve: r = cos(k * theta)
  const points = useMemo(() => {
    const pts = [];
    const steps = 500;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const r = Math.cos(k * theta) * rBase;
      const x = r * Math.cos(theta) * 0.5;
      const y = r * Math.sin(theta) * 0.5;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [k, rBase]);

  return (
    <group>
      <Line points={points} color={color} lineWidth={3} />
       <mesh rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
         <meshStandardMaterial color="white" />
       </mesh>
       {/* Petals as particles */}
       <Sparkles count={200} scale={rBase} size={3} color={color} speed={0.4} />
    </group>
  );
};

// Helper for lines
const Line = ({ points, color, lineWidth }: { points: THREE.Vector3[], color: string, lineWidth: number }) => {
    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
    
    return (
        <lineLoop geometry={geometry}>
            <lineBasicMaterial color={color} linewidth={lineWidth} />
        </lineLoop>
    )
}

const SphereShape: React.FC<{ params: any }> = ({ params }) => {
    const radius = Number(params.radius) || 5;
    const color = params.color || '#5edfff';
    
    return (
        <points>
            <sphereGeometry args={[radius * 0.5, 48, 48]} />
            <pointsMaterial size={0.1} color={color} />
        </points>
    )
}

const StarShape: React.FC<{ params: any }> = ({ params }) => {
    const outer = Number(params.outerRadius) || 8;
    const inner = Number(params.innerRadius) || 4;
    const pointsCount = Number(params.points) || 5;
    const depth = Number(params.depth) || 2;
    const color = params.color || '#ffd166';

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const step = Math.PI / pointsCount;
        for(let i=0; i<2*pointsCount; i++) {
            const r = (i % 2 === 0) ? outer * 0.5 : inner * 0.5;
            const a = i * step;
            s.lineTo(r * Math.cos(a), r * Math.sin(a));
        }
        s.closePath();
        return s;
    }, [outer, inner, pointsCount]);

    return (
        <mesh>
            <extrudeGeometry args={[shape, { depth: depth * 0.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
    )
}

const CubeCloudShape: React.FC<{ params: any }> = ({ params }) => {
    const size = Number(params.size) || 10;
    const count = Number(params.count) || 100;
    const color = params.color || '#7de1ff';

    const instances = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * size;
            const y = (Math.random() - 0.5) * size;
            const z = (Math.random() - 0.5) * size;
            temp.push({ position: [x, y, z], rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] });
        }
        return temp;
    }, [size, count]);

    return (
        <group>
            {instances.map((data, i) => (
                <mesh key={i} position={data.position as any} rotation={data.rotation as any}>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                    <meshBasicMaterial color={color} wireframe />
                </mesh>
            ))}
             <Sparkles count={count} scale={size} size={2} color={color} />
        </group>
    )
}

const DoubleHelixShape: React.FC<{ params: any }> = ({ params }) => {
    const radius = Number(params.radius) || 4;
    const height = Number(params.height) || 10;
    const turns = Number(params.turns) || 3;
    const color = params.color || '#ff9f6e';

    const points1 = useMemo(() => {
        const pts = [];
        const count = 100;
        for(let i=0; i<=count; i++) {
            const t = i/count;
            const angle = t * Math.PI * 2 * turns;
            const y = (t - 0.5) * height;
            pts.push(new THREE.Vector3(Math.cos(angle) * radius * 0.5, y, Math.sin(angle) * radius * 0.5));
        }
        return pts;
    }, [radius, height, turns]);

    const points2 = useMemo(() => {
         return points1.map(p => new THREE.Vector3(-p.x, p.y, -p.z));
    }, [points1]);

    return (
        <group>
            <Line points={points1} color={color} lineWidth={2} />
            <Line points={points2} color="#5edfff" lineWidth={2} />
            {points1.map((p, i) => i % 5 === 0 && (
                <mesh key={i} position={[0, p.y, 0]} rotation={[0, (i/100) * Math.PI * 2 * turns, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, radius, 4]} />
                    <meshStandardMaterial color="white" transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    )
}

const WaveShape: React.FC<{ params: any }> = ({ params }) => {
    const width = Number(params.width) || 10;
    const depth = Number(params.depth) || 10;
    const amp = Number(params.amplitude) || 2;
    const freq = Number(params.frequency) || 1;
    const color = params.color || '#00ffff';

    const positions = useMemo(() => {
        const segs = 30;
        const pts = new Float32Array(segs * segs * 3);
        let idx = 0;
        for(let i=0; i<segs; i++) {
            for(let j=0; j<segs; j++) {
                const x = (i / segs - 0.5) * width;
                const z = (j / segs - 0.5) * depth;
                const y = Math.sin(x * freq + z * freq) * amp;
                pts[idx++] = x;
                pts[idx++] = y;
                pts[idx++] = z;
            }
        }
        return pts;
    }, [width, depth, amp, freq]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.15} color={color} />
        </points>
    )
}

const TextShape: React.FC<{ params: any }> = ({ params }) => {
    const text = String(params.text || "HELLO");
    const size = Number(params.size) || 3;
    const color = params.color || '#ffffff';

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                fontSize={size}
                color={color}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {text}
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Text>
        </Float>
    );
};

// --- Scene Content (New Component to host R3F Hooks) ---

const SceneContent: React.FC<{ model: ModelDef }> = ({ model }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const renderShape = () => {
    switch (model.type) {
      case 'heart': return <HeartShape params={model.params} />;
      case 'saturn': return <SaturnShape params={model.params} />;
      case 'torusKnot': return <TorusKnotShape params={model.params} />;
      case 'flower': return <FlowerShape params={model.params} />;
      case 'sphere': return <SphereShape params={model.params} />;
      case 'star': return <StarShape params={model.params} />;
      case 'cubeCloud': return <CubeCloudShape params={model.params} />;
      case 'doubleHelix': return <DoubleHelixShape params={model.params} />;
      case 'wave': return <WaveShape params={model.params} />;
      case 'text': return <TextShape params={model.params} />;
      default: return <SphereShape params={{...model.params, radius: 4}} />;
    }
  };

  return (
    <group ref={groupRef}>
       {renderShape()}
    </group>
  );
};

// --- Main Viewer ---

export default function Viewer({ model }: ViewerProps) {
  return (
    <div className="w-full h-full bg-slate-900 relative">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#050505']} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00ffff" />
        
        <SceneContent model={model} />

        {/* Post Processing */}
        <EffectComposer enableNormalPass={false}>
            <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} radius={0.6} />
        </EffectComposer>

        <OrbitControls enablePan={false} enableZoom={true} minDistance={5} maxDistance={50} />
      </Canvas>
    </div>
  );
}