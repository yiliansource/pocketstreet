import { type TileType, useWorld } from "../world/store";

export function HUD() {
    const placing = useWorld((s) => s.placing);
    const setPlacing = useWorld((s) => s.setPlacing);
    const btn = (t: TileType, label: string) => (
        <button
            key={t}
            onClick={() => setPlacing(t)}
            className={`px-3 py-2 rounded-xl border ${placing === t ? "bg-black text-white" : "bg-white"}`}
            title={`Place ${t.toLowerCase()}`}
        >
            {label}
        </button>
    );
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                left: 16,
                display: "flex",
                zIndex: 999,
                gap: 8,
            }}
        >
            {btn("ROAD", "Road")}
            {btn("HOUSE", "House")}
            {btn("PARK", "Park")}
        </div>
    );
}
