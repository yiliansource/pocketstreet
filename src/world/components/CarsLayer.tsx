import { useWorld } from "../store";

export function CarsLayer() {
    const cars = useWorld((s) => s.cars);
    return (
        <group>
            {Object.values(cars).map((c) => (
                <group
                    key={c.id}
                    position={c.position.toArray()}
                    rotation={[0, c.heading, 0]}
                >
                    <mesh castShadow>
                        <boxGeometry args={[0.35, 0.15, 0.6]} />
                        <meshStandardMaterial color="#efb810" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
