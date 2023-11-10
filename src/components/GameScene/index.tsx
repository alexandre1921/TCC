import { Stage } from '@pixi/react';
import { Car } from '../Car';
import { Scene } from '../Scene';

export function GameScene() {
    return (
        <Stage height={700} width={1050} options={{ background: 0xffffff }}>
            <Scene />
            <Car />
        </Stage>
    );
}
