import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {Robot} from "@/components/models/contact/Robot.jsx";

export const ContactExperience = () => {
    return (
        <Canvas shadows camera={{position: [0, 3,10], fov: 20}}>
            <ambientLight intensity={0.5} color="#fff4e6"/>
            <directionalLight position={[5, 5, 3]} intensity={2.5} color="#ffd9b3" />
            <OrbitControls
                enableZoom={false}
                enableRotate={true}
                enablePan={true}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2}
            />
            <group scale={1} position={[0, -1.5, -2]}>
                <Robot />
            </group>

        </Canvas>
    )
}
