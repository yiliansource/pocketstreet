import { TILE_WORLD_SIZE, type Tile } from "../../store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RoadObject({ tile }: { tile: Tile }) {
    const color = "#6b7280";

    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[TILE_WORLD_SIZE, 0.05, TILE_WORLD_SIZE]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
