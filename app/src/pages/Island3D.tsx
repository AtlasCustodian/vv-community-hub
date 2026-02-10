import { useRef, useMemo, useState, useLayoutEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './Island3D.css'

// Deterministic pseudo-random for layout
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[35, 64]} />
      <meshStandardMaterial
        color="#0d2137"
        roughness={0.8}
        metalness={0.2}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

const CUT_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
const CUT_PLANES = [CUT_PLANE]

function Island() {
  const group = useRef<THREE.Group>(null)
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Island base / land mass - wider lower section, smooth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5.5, 7, 0.8, 64]} />
        <meshStandardMaterial
          color="#2d4a3e"
          roughness={0.9}
          metalness={0.1}
          clippingPlanes={CUT_PLANES}
          clipShadows
        />
      </mesh>
      {/* Lower slopes - wider to match base */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 5.5, 0.9, 64]} />
        <meshStandardMaterial
          color="#3d5a4a"
          roughness={0.85}
          metalness={0.1}
          clippingPlanes={CUT_PLANES}
          clipShadows
        />
      </mesh>
      {/* Central volcano / spire */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 2.2, 2.2, 64]} />
        <meshStandardMaterial
          color="#4a4035"
          roughness={0.9}
          metalness={0.15}
          clippingPlanes={CUT_PLANES}
          clipShadows
        />
      </mesh>
      {/* Peak */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[0.6, 0.9, 48]} />
        <meshStandardMaterial
          color="#5c5042"
          roughness={0.85}
          metalness={0.1}
          clippingPlanes={CUT_PLANES}
          clipShadows
        />
      </mesh>
    </group>
  )
}

// Interior "The Roots" — dense tiered city in the cut-away (z < 0)
const INTERIOR_Z = -0.5 // depth into the cavity so buildings are visible
const DEEPS_Z = INTERIOR_Z - 0.55

// Steam generator colors: silver, gray, bronze
const GENERATOR_COLORS = ['#c4c8cc', '#8a8e92', '#b87333'] as const

function SteamGenerator({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number]
  color: string
  scale?: number
}) {
  const s = scale
  return (
    <group position={position}>
      {/* Main tank / drum */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35 * s, 0.4 * s, 0.5 * s, 16]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.75} />
      </mesh>
      {/* Dome top */}
      <mesh position={[0, 0.28 * s, 0]} castShadow>
        <sphereGeometry args={[0.3 * s, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Steam vent pipes */}
      <mesh position={[0.15 * s, 0.5 * s, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.06 * s, 0.06 * s, 0.25 * s, 8]} />
        <meshStandardMaterial color="#9a9ea2" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[-0.12 * s, 0.48 * s, 0.08 * s]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <cylinderGeometry args={[0.05 * s, 0.05 * s, 0.2 * s, 8]} />
        <meshStandardMaterial color="#9a9ea2" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  )
}

function IslandInterior() {
  const { buildings, windows, lavaPools, generators, deepsPipes, deepsTanks } = useMemo(() => {
    const rnd = mulberry32(42)
    const buildings: Array<{
      position: [number, number, number]
      scale: [number, number, number]
      isCylinder: boolean
      windows: number
    }> = []
    const windowPositions: Array<{ position: [number, number, number]; color: string }> = []

    // Tiers: base, lower-mid, mid, upper — more structures throughout
    const tiers = [
      { yMin: 0.25, yMax: 0.85, rMax: 4.2, count: 58 },
      { yMin: 0.7, yMax: 1.35, rMax: 3.8, count: 52 },
      { yMin: 1.1, yMax: 1.85, rMax: 3.2, count: 48 },
      { yMin: 1.75, yMax: 2.65, rMax: 1.8, count: 42 },
    ]

    for (const tier of tiers) {
      for (let i = 0; i < tier.count; i++) {
        const angle = Math.PI * (0.15 + 0.7 * rnd()) // back half of circle
        const r = tier.rMax * (0.15 + 0.82 * rnd())
        const x = Math.cos(angle) * r
        const z = INTERIOR_Z - 0.4 * rnd()
        const y = tier.yMin + (tier.yMax - tier.yMin) * rnd()
        const w = 0.12 + 0.22 * rnd()
        const h = 0.15 + 0.35 * rnd()
        const d = 0.1 + 0.18 * rnd()
        const isCylinder = rnd() < 0.2
        const windowCount = 1 + Math.floor(rnd() * 4)
        buildings.push({
          position: [x, y, z],
          scale: [w, h, d],
          isCylinder,
          windows: windowCount,
        })
        for (let wi = 0; wi < windowCount; wi++) {
          const wx = x + (rnd() - 0.5) * w * 0.8
          const wy = y + (rnd() - 0.5) * h * 0.8
          const wz = z + (rnd() < 0.5 ? 1 : -1) * (d * 0.5 + 0.02)
          windowPositions.push({
            position: [wx, wy, wz],
            color: rnd() < 0.7 ? '#ffaa44' : '#ff6622',
          })
        }
      }
    }

    // The Deeps: lava pools, steam generators, pipes and tanks
    const rndDeeps = mulberry32(99)
    const lavaPools: Array<{ position: [number, number, number]; radius: number }> = []
    const generators: Array<{ position: [number, number, number]; color: (typeof GENERATOR_COLORS)[number]; scale: number }> = []
    const deepsPipes: Array<{ position: [number, number, number]; rotation: [number, number, number]; length: number }> = []
    const deepsTanks: Array<{ position: [number, number, number]; color: string }> = []
    for (let i = 0; i < 7; i++) {
      const angle = Math.PI * (0.2 + 0.6 * rndDeeps())
      const r = 0.8 + 2.2 * rndDeeps()
      const x = Math.cos(angle) * r
      const poolY = 0.02
      const poolZ = DEEPS_Z - 0.15 * rndDeeps()
      lavaPools.push({
        position: [x, poolY, poolZ],
        radius: 0.25 + 0.35 * rndDeeps(),
      })
      const hoverHeight = 0.12 + 0.18 * rndDeeps()
      generators.push({
        position: [x, poolY + hoverHeight, poolZ],
        color: GENERATOR_COLORS[i % GENERATOR_COLORS.length],
        scale: 0.7 + 0.5 * rndDeeps(),
      })
    }
    for (let i = 0; i < 12; i++) {
      const angle = Math.PI * (0.15 + 0.7 * rndDeeps())
      const r = 1.2 + 2.5 * rndDeeps()
      deepsPipes.push({
        position: [Math.cos(angle) * r, 0.06 + 0.04 * rndDeeps(), DEEPS_Z - 0.2 * rndDeeps()],
        rotation: [Math.PI / 2, 0, -angle + (rndDeeps() - 0.5) * 0.4],
        length: 0.3 + 0.5 * rndDeeps(),
      })
    }
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI * (0.2 + 0.6 * rndDeeps())
      const r = 1.5 + 1.8 * rndDeeps()
      deepsTanks.push({
        position: [Math.cos(angle) * r, 0.15 + 0.08 * rndDeeps(), DEEPS_Z - 0.1 * rndDeeps()],
        color: GENERATOR_COLORS[i % GENERATOR_COLORS.length],
      })
    }

    return { buildings, windows: windowPositions, lavaPools, generators, deepsPipes, deepsTanks }
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Central pillar through the interior (chimney from The Deeps) */}
      <mesh position={[0, 1.5, INTERIOR_Z - 0.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 2.8, 16]} />
        <meshStandardMaterial
          color="#2a2520"
          roughness={0.85}
          metalness={0.4}
        />
      </mesh>
      {/* Glow from The Deeps at base of interior */}
      <pointLight position={[0, 0.15, INTERIOR_Z - 0.4]} intensity={0.5} color="#ff4400" distance={6} />
      <mesh position={[0, 0.12, INTERIOR_Z - 0.5]}>
        <circleGeometry args={[1.2, 16]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* The Deeps: lava pools with steam generators hovering above */}
      {lavaPools.map((pool, i) => (
        <group key={`pool-${i}`} position={pool.position}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[pool.radius, 24]} />
            <meshBasicMaterial color="#ff2200" toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <circleGeometry args={[pool.radius * 0.98, 24]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {generators.map((g, i) => (
        <SteamGenerator key={i} position={g.position} color={g.color} scale={g.scale} />
      ))}
      {deepsPipes.map((p, i) => (
        <mesh key={i} position={p.position} rotation={p.rotation} castShadow>
          <cylinderGeometry args={[0.04, 0.04, p.length, 8]} />
          <meshStandardMaterial color="#6a6e72" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {deepsTanks.map((t, i) => (
        <group key={i} position={t.position}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.25, 12]} />
            <meshStandardMaterial color={t.color} roughness={0.35} metalness={0.75} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.08, DEEPS_Z]} intensity={0.4} color="#ff4400" distance={8} />
      {/* Interior structures — no clipping so they appear in the cavity */}
      {buildings.map((b, i) => (
        <group key={i} position={b.position}>
          <mesh castShadow>
            {b.isCylinder ? (
              <cylinderGeometry args={[b.scale[0], b.scale[0] * 1.1, b.scale[1], 6]} />
            ) : (
              <boxGeometry args={b.scale} />
            )}
            <meshStandardMaterial
              color={i % 4 === 0 ? '#3d3630' : i % 4 === 1 ? '#2c2824' : '#352e28'}
              roughness={0.8}
              metalness={0.35}
            />
          </mesh>
        </group>
      ))}
      {/* Glowing windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={w.position}>
          <planeGeometry args={[0.06, 0.08]} />
          <meshBasicMaterial
            color={w.color}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function Veil() {
  return (
    <group position={[0, 2, 0]}>
      {/* Outer storm ring - purple lightning veil */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[14, 2.5, 16, 64]} />
        <meshBasicMaterial
          color="#6b21a8"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[14, 1.2, 8, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.24}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-5, 8, 5]} intensity={0.5} color="#a78bfa" />
      <Ocean />
      <Island />
      <IslandInterior />
      <pointLight position={[0, 1, -2]} intensity={0.6} color="#ffaa44" distance={12} />
      <pointLight position={[-1.5, 2, -1.5]} intensity={0.35} color="#ff8844" distance={8} />
      <Veil />
      <OrbitControls
        enablePan
        minDistance={8}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </>
  )
}

export function Island3D() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setCanvasSize({ width: rect.width, height: rect.height })
      }
    }
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 0, height: 0 }
      if (width > 0 && height > 0) {
        setCanvasSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
      }
    })
    ro.observe(el)
    measure()
    const id = requestAnimationFrame(measure)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(id)
    }
  }, [])

  const ready = canvasSize.width > 0 && canvasSize.height > 0

  return (
    <div className="island-3d-page">
      <header className="island-3d-header">
        <Link to="/" className="island-3d-back">
          ← Back to Codex
        </Link>
        <h1 className="island-3d-title">The Island — 3D</h1>
        <p className="island-3d-tagline">
          Volcanic island with an interior city (The Roots). Drag to rotate and see inside the cut; scroll to zoom.
        </p>
      </header>
      <div ref={contentRef} className="island-3d-content">
        <div className="island-3d-canvas-wrap" style={ready ? { width: canvasSize.width, height: canvasSize.height } : undefined}>
          {ready && (
          <Canvas
            style={{ width: '100%', height: '100%', display: 'block' }}
            shadows
            camera={{ position: [0, 5, 18], fov: 50 }}
            gl={{
              antialias: true,
              alpha: false,
              localClippingEnabled: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor('#0c0b0f', 1)
              const canvas = gl.domElement
              canvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault()
                console.error('[Island3D] WebGL context lost')
              })
              canvas.addEventListener('webglcontextrestored', () => {
                console.warn('[Island3D] WebGL context restored')
              })
            }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
          )}
        </div>
      </div>
    </div>
  )
}
