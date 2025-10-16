import { Suspense, useMemo } from "react";

import type { Tile } from "../../store";
import { gridToWorld } from "../../utils";
import { HouseObject } from "./HouseObject";
import { ParkObject } from "./ParkObject";
import { RoadObject } from "./RoadObject";

export function TileObject({ tile }: { tile: Tile }) {
    const pos = useMemo(() => gridToWorld(tile.x, tile.y), [tile.x, tile.y]);

    return (
        <group position={pos}>
            <Suspense>
                <TileVisual tile={tile} />
            </Suspense>
        </group>
    );
}

function TileVisual({ tile }: { tile: Tile }) {
    switch (tile.type) {
        default:
            return null;
        case "HOUSE":
            return <HouseObject tile={tile} />;
        case "PARK":
            return <ParkObject tile={tile} />;
        case "ROAD":
            return <RoadObject tile={tile} />;
    }
}
