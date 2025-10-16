import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import type { BufferGeometry } from "three";

import type { Tile } from "../../store";

type HouseVariation = {
    key: string;
};

const VARIANTS: HouseVariation[] = [
    {
        key: "building_A",
    },
    {
        key: "building_B",
    },
    {
        key: "building_C",
    },
    {
        key: "building_D",
    },
    {
        key: "building_E",
    },
    {
        key: "building_F",
    },
    {
        key: "building_G",
    },
    {
        key: "building_H",
    },
];

export function HouseObject({ tile }: { tile: Tile }) {
    const groupRef = useRef<HTMLElement>(null);
    const variant = VARIANTS[(tile.variant ?? 0) % VARIANTS.length]!;
    const path = `/citybuilderbits/${variant.key}.gltf`;
    const { nodes, materials } = useGLTF(path);

    return (
        <group ref={groupRef} scale={0.5} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (nodes as any)[variant.key]["geometry"] as BufferGeometry
                }
                material={materials["citybits_texture"]}
            />
        </group>
    );
}
