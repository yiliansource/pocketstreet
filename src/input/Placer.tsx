import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

import { HALF_WORLD, TILE_WORLD_SIZE, useWorld } from "../world/store";
import { worldToGrid } from "../world/utils";

export function Placer() {
    const setTile = useWorld((s) => s.placeTile);
    const { camera, gl } = useThree();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

    const [isPressing, setIsPressing] = useState(false);
    const [hasMovedSinceMousedown, setHasMovedSinceMousedown] = useState(false);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            const ndc = new THREE.Vector2(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -(((e.clientY - rect.top) / rect.height) * 2 - 1),
            );
            raycaster.setFromCamera(ndc, camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const point = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, point);
            if (
                Math.abs(point.x) > HALF_WORLD ||
                Math.abs(point.z) > HALF_WORLD
            )
                return setHover(null);
            const { x, y } = worldToGrid(point);

            setHover({ x, y });
            setHasMovedSinceMousedown(true);
        };
        const onMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            setIsPressing(true);

            setHasMovedSinceMousedown(false);
        };
        const onMouseUp = (e: MouseEvent) => {
            if (e.button !== 0) return;
            setIsPressing(false);

            if (hasMovedSinceMousedown) return;
            if (!hover) return;

            setTile(hover.x, hover.y);
        };

        gl.domElement.addEventListener("mousemove", onMove);
        gl.domElement.addEventListener("mousedown", onMouseDown);
        gl.domElement.addEventListener("mouseup", onMouseUp);

        return () => {
            gl.domElement.removeEventListener("mousemove", onMove);
            gl.domElement.removeEventListener("mousedown", onMouseDown);
            gl.domElement.removeEventListener("mouseup", onMouseUp);
        };
    }, [camera, gl, raycaster, setTile, hover, hasMovedSinceMousedown]);

    useEffect(() => {
        const cursor = isPressing
            ? hasMovedSinceMousedown
                ? "grabbing"
                : "grab"
            : "inherit";

        console.log(cursor);
        document.body.style.cursor = cursor;
    }, [isPressing, hasMovedSinceMousedown]);

    return hover ? (
        <mesh
            position={[
                hover.x * TILE_WORLD_SIZE,
                0.01,
                hover.y * TILE_WORLD_SIZE,
            ]}
        >
            <boxGeometry args={[1, 0.02, 1]} />
            <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
    ) : null;
}
