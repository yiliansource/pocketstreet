import { useWorld } from "../store";
import { TileObject } from "../tiles/components/TileObject";

export function TilesLayer() {
    const tiles = useWorld((s) => s.tiles);
    return (
        <group>
            {Object.values(tiles).map((t) => (
                <TileObject key={t.id} tile={t} />
            ))}
        </group>
    );
}
