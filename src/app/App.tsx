import { HUD } from "./HUD";
import { Scene } from "./Scene";

export default function App() {
    return (
        <div style={{ height: "100dvh", width: "100vw" }}>
            <HUD />
            <Scene />
        </div>
    );
}
