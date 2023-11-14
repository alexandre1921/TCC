import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Elderly } from './Elderly';

interface Props {
    karma: number;
}

export function ElderlyScene({ karma }: Props) {
    return (
        <Canvas style={{ height: 700, width: 1050 }}>
            <Suspense>
                <Elderly karma={karma} />
            </Suspense>
        </Canvas>
    );
}
