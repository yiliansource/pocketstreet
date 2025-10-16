import { useRef } from "react";
import * as THREE from "three";

import { GRID_SIZE } from "../store";

export function GroundGrid() {
    const gridRef = useRef<THREE.GridHelper>(null);

    return (
        <group>
            {/* Light gray plane to catch shadows */}
            <mesh
                rotation-x={-Math.PI / 2}
                position={[0, -0.001, 0]}
                receiveShadow
            >
                <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
                <meshStandardMaterial color="#f4f4f4" />
            </mesh>
            <gridHelper
                ref={gridRef}
                args={[GRID_SIZE, GRID_SIZE, "#888", "#ccc"]}
                position={[0, 0, 0]}
            />
            {/* Boundary */}
            <mesh rotation-x={-Math.PI / 2} position={[0, -0.002, 0]}>
                <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
                <meshBasicMaterial
                    color="#000"
                    wireframe
                    transparent
                    opacity={0.08}
                />
            </mesh>
        </group>
    );
}
