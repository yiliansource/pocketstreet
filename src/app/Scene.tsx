import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";

import { Placer } from "../input/Placer";
import { CarsLayer } from "../world/components/CarsLayer";
import { GroundGrid } from "../world/components/GroundGrid";
import { ResidentsLayer } from "../world/components/ResidentsLayer";
import { TilesLayer } from "../world/components/TilesLayer";
import { useWorld } from "../world/store";

export function Scene() {
    return (
        <Canvas shadows camera={{ position: [8, 10, 8], fov: 50 }}>
            <color attach="background" args={["#e8eef6"]} />
            <Lights />
            <Suspense fallback={null}>
                <GroundGrid />

                <TilesLayer />
                <ResidentsLayer />
                <CarsLayer />

                <Placer />

                <SimulationTicker />

                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport
                        axisColors={["#ef4444", "#22c55e", "#3b82f6"]}
                        labelColor="#111"
                    />
                </GizmoHelper>

                <OrbitControls
                    makeDefault
                    target={[0, 0, 0]}
                    maxPolarAngle={Math.PI / 2.1}
                />
            </Suspense>
        </Canvas>
    );
}

function Lights() {
    return (
        <group>
            <hemisphereLight args={["#ffffff", "#c5e1ff", 0.5]} />
            <directionalLight
                castShadow
                position={[6, 8, 6]}
                intensity={1}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
        </group>
    );
}

function SimulationTicker() {
    const step = useWorld((s) => s.stepSimulation);
    const last = useRef(0);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const dt = Math.min(0.05, t - last.current);
        if (dt > 0) step(dt);
        last.current = t;
    });

    return null;
}
