import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  RotateCcw,
  Sparkles,
  Wind,
  AlertTriangle,
  Leaf,
  Layers,
  Eye,
  Activity,
  Globe2,
} from "lucide-react";

/**
 * Procedural Earth GLSL Shaders:
 * Dynamically blends between:
 * - High Carbon / Polluted: Burnt smoggy continents, acidic murky oceans, dense sulfur cloud blankets.
 * - Low Carbon / Healthy: Vibrant emerald-forest continents, azure crystal oceans, crisp white clouds, and clear glowing atmospheric aura.
 */
const EarthShader = {
  uniforms: {
    uTime: { value: 0 },
    uPollution: { value: 0.5 }, // 0.0 = Pristine & Lush, 1.0 = Severe Smog & Acidification
    uSunDirection: { value: new THREE.Vector3(1.2, 0.6, 1.0).normalize() },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uPollution;
    uniform vec3 uSunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Simplex noise helper
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Fractal Brownian Motion for continents
    float fbm(vec3 p) {
      float total = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 5; i++) {
        total += snoise(p * frequency) * amplitude;
        frequency *= 2.05;
        amplitude *= 0.5;
      }
      return total;
    }

    void main() {
      // Map UV to spherical 3D coordinates
      float theta = vUv.x * 2.0 * 3.14159265;
      float phi = (vUv.y - 0.5) * 3.14159265;
      vec3 spherePos = vec3(cos(phi) * sin(theta), sin(phi), cos(phi) * cos(theta));

      // Land vs Ocean mask
      float continentShape = fbm(spherePos * 2.2);
      bool isLand = continentShape > 0.04;

      // Color Palettes
      // Healthy Planet (Pollution = 0.0)
      vec3 healthyOceanDeep = vec3(0.04, 0.18, 0.38); // Deep azure
      vec3 healthyOceanShallow = vec3(0.08, 0.38, 0.58); // Aqua coastal
      vec3 healthyLandLush = vec3(0.12, 0.48, 0.22); // Vibrant forest green
      vec3 healthyLandHigh = vec3(0.24, 0.56, 0.28); // Highland canopy
      vec3 healthyLandPeak = vec3(0.85, 0.88, 0.90); // Snowy peaks

      // Polluted Planet (Pollution = 1.0)
      vec3 pollutedOceanDeep = vec3(0.12, 0.15, 0.16); // Acidic dark slate
      vec3 pollutedOceanShallow = vec3(0.22, 0.23, 0.18); // Murky algae brown
      vec3 pollutedLandParched = vec3(0.42, 0.28, 0.15); // Arid rust / parched earth
      vec3 pollutedLandSmoggy = vec3(0.32, 0.22, 0.12); // Soot and charcoal dust
      vec3 pollutedLandPeak = vec3(0.55, 0.42, 0.30); // Smog-dusted rock

      // Base terrain color computation
      vec3 baseColor;
      if (isLand) {
        float height = smoothstep(0.04, 0.45, continentShape);
        vec3 healthyLand = mix(healthyLandLush, healthyLandHigh, height);
        if (height > 0.85) healthyLand = mix(healthyLand, healthyLandPeak, (height - 0.85) * 6.6);

        vec3 pollutedLand = mix(pollutedLandParched, pollutedLandSmoggy, height);
        if (height > 0.85) pollutedLand = mix(pollutedLand, pollutedLandPeak, (height - 0.85) * 6.6);

        baseColor = mix(healthyLand, pollutedLand, uPollution);
      } else {
        float depth = smoothstep(-0.4, 0.04, continentShape);
        vec3 healthyOcean = mix(healthyOceanDeep, healthyOceanShallow, depth);
        vec3 pollutedOcean = mix(pollutedOceanDeep, pollutedOceanShallow, depth);
        baseColor = mix(healthyOcean, pollutedOcean, uPollution);
      }

      // Dynamic Cloud / Smog Layer
      vec3 cloudPos = spherePos * 2.8 + vec3(uTime * 0.03, uTime * 0.015, 0.0);
      float clouds = fbm(cloudPos);
      float cloudMask = smoothstep(0.12, 0.48, clouds);

      vec3 healthyCloudColor = vec3(0.95, 0.98, 1.0); // Pure white moisture clouds
      vec3 pollutedSmogColor = vec3(0.72, 0.54, 0.32); // Heavy sulfur-brown smog blanket
      vec3 cloudColor = mix(healthyCloudColor, pollutedSmogColor, uPollution);

      // Blend surface with atmospheric clouds
      vec3 surfaceWithClouds = mix(baseColor, cloudColor, cloudMask * 0.75);

      // Diffuse Sun lighting
      float light = max(dot(vNormal, uSunDirection), 0.0);
      float ambient = 0.28;
      vec3 litColor = surfaceWithClouds * (light * 0.85 + ambient);

      // Fresnel Rim Glow
      vec3 viewDir = normalize(-vPosition);
      float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
      fresnel = pow(fresnel, 2.8);

      vec3 healthyGlow = vec3(0.20, 0.75, 0.98); // Cyan-emerald clean atmosphere
      vec3 pollutedGlow = vec3(0.88, 0.45, 0.12); // Smoggy burnt orange
      vec3 glowColor = mix(healthyGlow, pollutedGlow, uPollution);

      vec3 finalColor = litColor + glowColor * fresnel * 0.75;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

/**
 * Atmospheric Outer Glow Shell (Fresnel Halo)
 */
const AtmosphereShader = {
  uniforms: {
    uPollution: { value: 0.5 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uPollution;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float intensity = pow(0.72 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);

      vec3 cleanAtmosphere = vec3(0.22, 0.65, 0.95); // Pristine blue/cyan
      vec3 smogAtmosphere = vec3(0.92, 0.48, 0.15); // Toxic amber smog
      vec3 haloColor = mix(cleanAtmosphere, smogAtmosphere, uPollution);

      gl_FragColor = vec4(haloColor, intensity * (1.0 - uPollution * 0.3));
    }
  `,
};

/**
 * Smog Particle Aerosols:
 * Swirling particles that intensify when simulated future footprint is high.
 */
function SmogAerosols({ pollutionFactor }) {
  const pointsRef = useRef();
  const count = 360;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position on outer sphere shell (radius ~1.45 to 1.85)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.35 + Math.random() * 0.45;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Warm soot color
      col[i * 3] = 0.85;
      col[i * 3 + 1] = 0.52;
      col[i * 3 + 2] = 0.22;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08 * (pollutionFactor + 0.2);
      pointsRef.current.rotation.x += delta * 0.03 * (pollutionFactor + 0.1);
    }
  });

  if (pollutionFactor < 0.08) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={Math.min(0.85, pollutionFactor * 0.95)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * 3D Earth Globe Inner Mesh
 */
function EarthGlobe({ pollutionFactor, autoRotate }) {
  const earthMeshRef = useRef();
  const atmosphereRef = useRef();
  const earthMatRef = useRef();
  const atmoMatRef = useRef();

  // Create memoized shader materials
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(EarthShader.uniforms),
      vertexShader: EarthShader.vertexShader,
      fragmentShader: EarthShader.fragmentShader,
    });
  }, []);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AtmosphereShader.uniforms),
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
  }, []);

  useFrame((_, delta) => {
    if (earthMeshRef.current && autoRotate) {
      earthMeshRef.current.rotation.y += delta * 0.12;
    }

    if (earthMatRef.current) {
      earthMatRef.current.uniforms.uTime.value += delta;
      // Smoothly interpolate uniform toward target pollution factor
      earthMatRef.current.uniforms.uPollution.value = THREE.MathUtils.lerp(
        earthMatRef.current.uniforms.uPollution.value,
        pollutionFactor,
        0.05,
      );
    }

    if (atmoMatRef.current) {
      atmoMatRef.current.uniforms.uPollution.value = THREE.MathUtils.lerp(
        atmoMatRef.current.uniforms.uPollution.value,
        pollutionFactor,
        0.05,
      );
    }
  });

  return (
    <group>
      {/* Planetary Body */}
      <mesh ref={earthMeshRef}>
        <sphereGeometry args={[1.25, 64, 64]} />
        <primitive object={earthMaterial} ref={earthMatRef} attach="material" />
      </mesh>

      {/* Atmospheric Glowing Halo */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.42, 64, 64]} />
        <primitive
          object={atmosphereMaterial}
          ref={atmoMatRef}
          attach="material"
        />
      </mesh>

      {/* Smog & Particulate Aerosols */}
      <SmogAerosols pollutionFactor={pollutionFactor} />
    </group>
  );
}

/**
 * EarthSimulation Component
 *
 * @param {number} currentFootprint - Baseline footprint in kg CO2e/week (e.g. 58.5)
 * @param {number} simulatedFuture - Simulated footprint from user's habit modifications (e.g. 43.8)
 * @param {string} className - Optional Tailwind container classes
 */
export function EarthSimulation({
  currentFootprint = 58.5,
  simulatedFuture = 43.8,
  className = "",
}) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showAerosols, setShowAerosols] = useState(true);
  const controlsRef = useRef();

  /**
   * Calculate normalized pollution factor (0.0 to 1.0):
   * 0.0 = Vibrant, lush green biosphere (< 22 kg CO2e/wk)
   * 0.5 = Moderate transition (~42 kg CO2e/wk)
   * 1.0 = Severe smog & planetary distress (> 65 kg CO2e/wk)
   */
  const pollutionFactor = useMemo(() => {
    const minThreshold = 20.0;
    const maxThreshold = 65.0;
    const clamped = Math.max(
      minThreshold,
      Math.min(maxThreshold, simulatedFuture),
    );
    return Number(
      ((clamped - minThreshold) / (maxThreshold - minThreshold)).toFixed(3),
    );
  }, [simulatedFuture]);

  // Sustainability health percentage
  const biosphereHealth = Math.round((1 - pollutionFactor) * 100);

  // Environmental diagnostic description
  const statusConfig = useMemo(() => {
    if (pollutionFactor <= 0.25) {
      return {
        label: "Pristine Biosphere",
        sub: "Clear skies, low aerosol concentration, thriving forestry",
        color: "text-emerald-500",
        badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        aura: "from-emerald-500/20",
        icon: Leaf,
      };
    } else if (pollutionFactor <= 0.6) {
      return {
        label: "Balanced Transition",
        sub: "Moderate grid emission load, mild cloud particulates",
        color: "text-sky-400",
        badge: "bg-sky-500/10 border-sky-500/30 text-sky-400",
        aura: "from-sky-500/20",
        icon: Sparkles,
      };
    } else {
      return {
        label: "Elevated Smog & Acidification",
        sub: "High sulfur/carbon aerosols, degraded canopy coverage",
        color: "text-amber-400",
        badge: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        aura: "from-amber-500/20",
        icon: AlertTriangle,
      };
    }
  }, [pollutionFactor]);

  const StatusIcon = statusConfig.icon;

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[460px] rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl select-none ${className}`}
    >
      {/* Background Radial Ambient Glow based on Planet Health */}
      <div
        className={`absolute inset-0 bg-radial ${statusConfig.aura} to-transparent pointer-events-none transition-all duration-1000 opacity-60`}
      />

      {/* Top Left: Interactive Telemetry HUD */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-700/80 backdrop-blur-md text-neutral-300">
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-display text-white tracking-tight flex items-center gap-1.5">
              3D Planetary Simulation
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusConfig.badge}`}
              >
                {biosphereHealth}% Biosphere Vitality
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">{statusConfig.sub}</p>
          </div>
        </div>

        {/* Dynamic Metric Gauges */}
        <div className="flex items-center gap-3 pt-1">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-md">
            <span className="text-[9px] uppercase font-mono text-neutral-400 block">
              Simulated Future
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-base font-extrabold font-mono ${pollutionFactor > 0.6 ? "text-amber-400" : "text-emerald-400"}`}
              >
                {simulatedFuture}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                kg/wk
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-md">
            <span className="text-[9px] uppercase font-mono text-neutral-400 block">
              Atmospheric State
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: 3D Control Action Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-md p-1 rounded-xl shadow-lg">
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            autoRotate
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <RotateCcw
            className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`}
            style={{ animationDuration: "8s" }}
          />
          <span className="text-[10px] hidden sm:inline font-mono">Spin</span>
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="sr-only">Reset View</span>
        </button>
      </div>

      {/* Bottom Center: Gesture Instructions & Interaction Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-md text-[10px] text-neutral-400 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Click & drag to rotate • Scroll to zoom • Adjust sliders to change
            climate state
          </span>
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[4, 2, 3]}
          intensity={1.8}
          color="#ffffff"
        />
        <directionalLight
          position={[-4, -2, -2]}
          intensity={0.3}
          color="#10b981"
        />

        {/* Dynamic Starfield */}
        <Stars
          radius={80}
          depth={40}
          count={2200}
          factor={3}
          saturation={0.5}
          fade
          speed={1.2}
        />

        {/* 3D Earth Globe and Atmosphere */}
        <EarthGlobe pollutionFactor={pollutionFactor} autoRotate={autoRotate} />

        {/* Orbit Controls with Zoom Clamping */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.1}
          maxDistance={6.0}
          rotateSpeed={0.65}
          zoomSpeed={0.8}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

export default EarthSimulation;
