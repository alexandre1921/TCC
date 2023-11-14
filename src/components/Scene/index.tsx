import { useEffect, useState } from 'react';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import foward from './assets/foward.png';
import fowardLeft from './assets/foward-left.png';
import left from './assets/left.png';

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export function Scene() {
    const [image, setImage] = useState(foward);
    const texture = useLoader(TextureLoader, image);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            while (isMounted) {
                await new Promise(r => {
                    setTimeout(r, randomNumber(500, 1000));
                });
                setImage(foward);

                await new Promise(r => {
                    setTimeout(r, randomNumber(1500, 2000));
                });
                setImage(fowardLeft);

                await new Promise(r => {
                    setTimeout(r, randomNumber(1000, 1500));
                });

                setImage(left);
            }
        }
        load();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <mesh>
            <planeGeometry attach="geometry" args={[12, 8]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
    );
}
