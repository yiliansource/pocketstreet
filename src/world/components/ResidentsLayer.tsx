import { useWorld } from "../store";

export function ResidentsLayer() {
    const residents = useWorld((s) => s.residents);
    return (
        <group>
            {Object.values(residents).map((r) => (
                <group key={r.id} position={r.position.toArray()}>
                    <mesh castShadow position={[0, 0.15, 0]}>
                        <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
                        <meshStandardMaterial color="#3b82f6" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
