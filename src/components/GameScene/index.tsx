import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Car } from '../Car';
import { Scene } from '../Scene';

export function GameScene() {
    return (
        <Canvas style={{ height: 700, width: 1050 }}>
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
            <Suspense fallback={null}>
                <Car />
            </Suspense>
        </Canvas>
    );
}
