import { TILE_WORLD_SIZE, type Tile } from "../../store";

export function ParkObject({ tile }: { tile: Tile }) {
    const color = "#86efac";

    return (
        <group>
            <mesh receiveShadow>
                <boxGeometry args={[TILE_WORLD_SIZE, 0.03, TILE_WORLD_SIZE]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* simple trees (variation picks count/offset) */}
            {Array.from({ length: 2 + ((tile.variant ?? 0) % 3) }).map(
                (_, i) => (
                    <group
                        key={i}
                        position={[
                            Math.cos(i) * 0.25,
                            0.2,
                            Math.sin(i * 1.3) * 0.25,
                        ]}
                    >
                        <mesh castShadow position={[0, -0.1, 0]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.2]} />
                            <meshStandardMaterial color="#7c3e0b" />
                        </mesh>
                        <mesh castShadow>
                            <sphereGeometry args={[0.18, 12, 12]} />
                            <meshStandardMaterial color="#22c55e" />
                        </mesh>
                    </group>
                ),
            )}
        </group>
    );
}
