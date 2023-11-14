import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import elderRelaxed from './assets/elder-relaxed.png';
import elderUncomfortable from './assets/elder-uncomfortable.png';
import elderAngry from './assets/elder-angry.png';

interface Props {
    karma: number;
}

export function Elderly({ karma }: Props) {
    const elderlyUnhappy = karma > -2 ? elderAngry : elderUncomfortable;
    const elderly = karma > 0 ? elderRelaxed : elderlyUnhappy;
    const texture = useLoader(TextureLoader, elderly);

    return (
        <mesh>
            <planeGeometry attach="geometry" args={[12, 8]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}
