import * as THREE from "three";
import { create } from "zustand";

export type TileType = "EMPTY" | "ROAD" | "HOUSE" | "PARK";

export type Tile = {
    id: string;
    type: TileType;
    x: number;
    y: number;
    variant?: number; // random variation key (e.g., house style, tree layout)
};

export type Resident = {
    id: string;
    position: THREE.Vector3;
    state: "idle" | "walking" | "resting";
    target?: THREE.Vector3;
};

export type Car = {
    id: string;
    position: THREE.Vector3;
    heading: number; // radians
    speed: number;
    target?: THREE.Vector3;
};

export const GRID_SIZE = 24; // tiles per side
export const TILE_WORLD_SIZE = 1; // meters per tile
export const HALF_WORLD = (GRID_SIZE * TILE_WORLD_SIZE) / 2;

export type WorldState = {
    tiles: Record<string, Tile>;
    residents: Record<string, Resident>;
    cars: Record<string, Car>;
    placing: TileType;
    setPlacing: (t: TileType) => void;
    placeTile: (x: number, y: number, type?: TileType) => void;
    stepSimulation: (dt: number) => void;
};

const keyFor = (x: number, y: number) => `${x},${y}`;

export const useWorld = create<WorldState>((set, get) => ({
    tiles: {},
    residents: {},
    cars: {},
    placing: "ROAD",
    setPlacing: (t) => set({ placing: t }),
    placeTile: (x, y, type) => {
        const t = type ?? get().placing;
        if (t === "EMPTY") return;
        const k = keyFor(x, y);
        const variant = Math.floor(Math.random() * 16);
        set((s) => {
            const nextTiles = {
                ...s.tiles,
                [k]: { id: k, type: t, x, y, variant },
            };

            // When placing a HOUSE, spawn a couple of residents at nearby sidewalks later
            const nextResidents = { ...s.residents };
            // if (t === "HOUSE") {
            //     for (let i = 0; i < 2; i++) {
            //         const id = nanoid();
            //         nextResidents[id] = {
            //             id,
            //             position: new THREE.Vector3(
            //                 x * TILE_WORLD_SIZE + (Math.random() * 0.6 - 0.3),
            //                 0,
            //                 y * TILE_WORLD_SIZE + (Math.random() * 0.6 - 0.3),
            //             ),
            //             state: "idle",
            //         };
            //     }
            // }

            // Every ~6th ROAD placed, spawn a car
            // const roadCount = Object.values(nextTiles).filter(
            //     (t) => t.type === "ROAD",
            // ).length;
            const nextCars = { ...s.cars };
            // if (t === "ROAD" && roadCount % 6 === 0) {
            //     const id = nanoid();
            //     nextCars[id] = {
            //         id,
            //         position: new THREE.Vector3(
            //             x * TILE_WORLD_SIZE,
            //             0,
            //             y * TILE_WORLD_SIZE,
            //         ),
            //         heading: 0,
            //         speed: 0,
            //     };
            // }

            return {
                tiles: nextTiles,
                residents: nextResidents,
                cars: nextCars,
            };
        });
    },
    stepSimulation: (dt) => {
        // Super-simplified stepping to show the loop is wired up.
        // Real logic will be in Systems below.
        const s = get();

        // Residents: if idle, randomly pick a target near a PARK or HOUSE tile
        const nextResidents: Record<string, Resident> = {};
        for (const r of Object.values(s.residents)) {
            const copy: Resident = { ...r, position: r.position.clone() };
            if (!copy.target || copy.position.distanceTo(copy.target) < 0.1) {
                // find a random nearby tile center (placeholder for pathfinding)
                const candidates = Object.values(s.tiles).filter(
                    (t) => t.type !== "EMPTY",
                );
                if (candidates.length) {
                    const t =
                        candidates[
                            Math.floor(Math.random() * candidates.length)
                        ];
                    copy.target = new THREE.Vector3(
                        t.x * TILE_WORLD_SIZE,
                        0,
                        t.y * TILE_WORLD_SIZE,
                    );
                    copy.state = t.type === "PARK" ? "resting" : "walking";
                }
            } else {
                // move straight towards target (placeholder: no sidewalks/traffic lights yet)
                const dir = copy.target.clone().sub(copy.position);
                const d = dir.length();
                if (d > 0.0001) dir.multiplyScalar(1 / d);
                const speed = copy.state === "walking" ? 0.8 : 0.2;
                copy.position.addScaledVector(dir, Math.min(d, speed * dt));
            }
            nextResidents[copy.id] = copy;
        }

        // Cars: aim for a random ROAD tile and move towards it
        const roadTiles = Object.values(s.tiles).filter(
            (t) => t.type === "ROAD",
        );
        const nextCars: Record<string, Car> = {};
        for (const c of Object.values(s.cars)) {
            const copy: Car = { ...c, position: c.position.clone() };
            if (!copy.target && roadTiles.length) {
                const dest =
                    roadTiles[Math.floor(Math.random() * roadTiles.length)];
                copy.target = new THREE.Vector3(
                    dest.x * TILE_WORLD_SIZE,
                    0,
                    dest.y * TILE_WORLD_SIZE,
                );
            }
            if (copy.target) {
                const dir = copy.target.clone().sub(copy.position);
                const d = dir.length();
                if (d > 0.0001) dir.multiplyScalar(1 / d);
                const maxSpeed = 2.5;
                copy.speed = Math.min(maxSpeed, copy.speed + dt * 1.0); // accelerate
                const step = Math.min(d, copy.speed * dt);
                copy.position.addScaledVector(dir, step);
                copy.heading = Math.atan2(dir.x, dir.z);
                if (d < 0.1) copy.target = undefined;
            }
            nextCars[copy.id] = copy;
        }

        set({ residents: nextResidents, cars: nextCars });
    },
}));
