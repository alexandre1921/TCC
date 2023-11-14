import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useGameHistoryStore } from '../../stores/gameHistory';

const driverImages = {
    calm: '/assets/calm-driver.png',
    angry: '/assets/angry-driver.png',
    hurried: '/assets/hurried-driver.png',
    serious: '/assets/serious-driver.png',
};

export function Car() {
    const driverMood = useGameHistoryStore(state => state.driverMood);
    const texture = useLoader(TextureLoader, driverImages[driverMood]);

    return (
        <mesh>
            <planeGeometry attach="geometry" args={[12, 8]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}
