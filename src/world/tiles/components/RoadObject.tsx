import { TILE_WORLD_SIZE, type Tile } from "../../store";

export function RoadObject({ tile }: { tile: Tile }) {
    const color = "#6b7280";

    console.log(tile);

    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[TILE_WORLD_SIZE, 0.05, TILE_WORLD_SIZE]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
