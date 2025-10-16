import * as THREE from "three";

import { GRID_SIZE, TILE_WORLD_SIZE } from "./store";

export function worldToGrid(pos: THREE.Vector3) {
    const gx = Math.round(
        THREE.MathUtils.clamp(
            pos.x / TILE_WORLD_SIZE,
            -GRID_SIZE / 2,
            GRID_SIZE / 2,
        ),
    );
    const gy = Math.round(
        THREE.MathUtils.clamp(
            pos.z / TILE_WORLD_SIZE,
            -GRID_SIZE / 2,
            GRID_SIZE / 2,
        ),
    );
    return { x: gx, y: gy };
}

export function gridToWorld(x: number, y: number) {
    return new THREE.Vector3(x * TILE_WORLD_SIZE, 0, y * TILE_WORLD_SIZE);
}
